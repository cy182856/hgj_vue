<template>
  <div class="div-container" style="margin-left: 20px;">
    <el-form ref="article" :model="article" label-width="auto" size="small">
      <el-form-item label="标题">
        <el-input
          v-model="article.title"
          autocomplete="off"
          placeholder="请输入文章标题"
        ></el-input>
      </el-form-item>

      <el-form-item label="内容">
        <div style="z-index: 1001; border: 1px solid #ccc">
          <Toolbar
            style="border-bottom: 1px solid #ccc"
            :editor="editor"
            :defaultConfig="toolbarConfig"
            :mode="mode"
          />
          <Editor
            style="height: 475px; overflow-y: hidden"
            v-model="article.content"
            :defaultConfig="editorConfig"
            :mode="mode"
            @onCreated="onCreated"
            @onChange="onChange"
          />
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer" style="margin-left: 40px; height: 100px;">
      <el-button @click="resetArticle" icon="el-icon-close" size="small"
        >重 置</el-button
      >
      <el-button
        type="success"
        @click="saveArticle"
        icon="el-icon-check"
        size="small"
      >
        确 定
      </el-button>
    </div>
  </div>
</template>
<script>
// import { getClassifyList } from "@/api/classify/index";
import { getArticle, addArticle, updateArticle } from "@/api/article";
import { addImage, deleteImage } from "@/api/Media/image";
//import { addVideo, deleteVideo } from "@/api/Media/video";
//import { fileConvertBase64 } from "@/utils/util";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";

export default {
  name: "edit-article",
  components: { Editor, Toolbar },
  data() {
    return {
      id: {
        type: [Number, null],
      },
      isEdit: false,
      titleArr: [],
      hArr: "",
      article: {
        title: "",
        content: "",
        classifyId: Number,
        browseCount: 0,
        supportCount: 0,
        collectCount: 0,
        shareCount: 0,
       // createUserId: this.$config.getUserId(),
       // createUserName: this.$config.getUserName(),
        publishStatus: 0,
        coverImage: "", //base64码
        isDelete: false,
      },
      savedImages: [],
      currentImages: [],
      classifyArray: [], //分类数据
      editor: null, // 编辑器属性
      toolbarConfig: {}, // 编辑器工具栏配置
      // 编辑器配置
      editorConfig: {
        placeholder: "请输入内容...",

        MENU_CONF: {
          uploadImage: {
            maxFileSize: 10 * 1024 * 1024, // 单个文件的最大体积限制，默认为 2M
            allowedFileTypes: ["image/*"], // 选择文件时的类型限制，默认为 ['image/*']
            // base64LimitSize: 50 * 1024, // 小于该值就插入 base64 格式（而不上传），默认为 0
            timeout: 5 * 1000, // 超时时间，默认为 10 秒
            // 自定义上传
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append("Image", file);
              try {
                const response = await addImage(formData);
                alert(response)
                if (response.code === -1) {
                  this.$message.error("调用上传图片接口调用异常！");
                  return;
                }
                this.savedImages.push(this.$cosImageUrl + response.data.url);
                insertFn(
                  this.$cosImageUrl + response.data.url,
                  response.data.alt,
                  response.data.href
                );
              } catch (error) {
                this.$message.error("调用上传图片接口调用异常:" + error);
              }
            },
          },
          uploadVideo: {
            fieldName: "video",
            maxFileSize: 50 * 1024 * 1024, // 单个文件的最大体积限制，默认为 10M
            maxNumberOfFiles: 3, // 最多可上传几个文件，默认为 5
            allowedFileTypes: ["video/*"], // 选择文件时的类型限制，默认为 ['video/*'] 。如不想限制，则设置为 []
            metaWithUrl: false, // 将 meta 拼接到 url 参数中，默认 false
            withCredentials: true, // 跨域是否传递 cookie ，默认为 false
            timeout: 15 * 1000, // 超时时间，默认为 30 秒
            customUpload: async (file, insertFn) => {
              const formData = new FormData();
              formData.append("Vedio", file);
              // await addVideo(formData)
              //   .then((res) => {
              //     console.log("调用上传图片接口返回结果：", res);
              //     if (res.code === -1) {
              //       this.$message.error("调用上传图片接口调用异常！");
              //       return;
              //     }
              //     insertFn(
              //       process.env.VUE_APP_COS_Video_API + res.data.url,
              //       res.data.poster
              //     );
              //   })
              //   .catch((error) => {
              //     console.log("调用上传图片接口调用异常:" + error);
              //     this.$message.error("调用上传图片接口调用异常:" + error);
              //   });
            },
          },
        },
      },
      mode: "default", // or 'simple'
    };
  },
  created() {
    // 对参数进行处理
   // this.getClassifyList();
    // 在 articleManage 组件中
    if (this.$route.query.id) {
      this.id = this.$route.query.id;
      console.log("查看id" + this.id);
      this.isEdit = true;
      this.getArticle();
    }
  },
  methods: {
    // getClassifyList() {
    //   getClassifyList()
    //     .then((res) => {
    //       console.log("调用文章类别数据列表返回结果：", res);
    //       if (res.code == -1) {
    //         this.$message.error("获取文章类别数据列表接口调用异常！");
    //         return;
    //       }
    //       this.classifyArray = res.data; //数据
    //       // 如果有分类，默认第一个分类的值
    //       if (this.classifyArray.length > 0)
    //         this.article.classifyId = this.classifyArray[0].id;
    //       this.article.classifyName = this.classifyArray[0].name;
    //     })
    //     .catch((err) => {
    //       console.log(err);
    //     });
    // },
    getArticle() {
      getArticle(this.id)
        .then((result) => {
          if (result.code == 404) {
            this.$message.error(result.message);
          } else {
            this.article = result.data;
            // 图片显示路径，查出来的图片如果有值就赋值给图片显示路径
            if (result.data.coverImage)
              this.article.coverImage =
                this.$cosImageUrl + result.data.coverImage;
          }
        })
        .catch((err) => {
          this.$message.error(err);
        });
    },
    // 保存文章
    saveArticle() {
      alert(this.article.title + "-----------" + this.article.content)
      if (this.article.classifyId > 0) {
        this.article.classifyName = this.classifyArray.find(
          (f) => f.id == this.article.classifyId
        ).name;
       alert(this.article);
      }
      this.currentImages = this.editor.getElemsByType("image");
      alert(this.currentImages)
      for (const img of this.savedImages) {
        console.log("所有上传的图片：" + img);
      }
      console.log("");
      for (const img of this.currentImages) {
        console.log("当前使用的图片：" + img.src);
      }
      console.log("");
      // 创建一个新数组，用于存储不同的项
      const differentSrc = [];
      // 遍历images数组
      for (const image of this.savedImages) {
        // 检查image的src属性是否存在于savedImages数组中
        if (
          !this.currentImages.some((savedImage) => savedImage.src === image)
        ) {
          // 如果不存在，将该项添加到differentSrc数组中
          differentSrc.push(image);
        }
      }
      // differentSrc数组将包含src不同的项
      console.log();
      for (const img of differentSrc) {
        console.log("找出的区别：" + img);
        // 使用正则表达式匹配 GUID
        const regex =
          /images\/([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\./i;
        const match = img.match(regex);
        if (match) {
          const guid = match[1]; // 获取匹配的 GUID
          // deleteImage(guid)
          //   .then((result) => {
          //     if (result.code == 200) {
          //       if (result.data) {
          //         this.$message.success(result.message);
          //       }
          //     }
          //   })
          //   .catch((error) => {
          //     this.$message.error(error);
          //   });
        }
      }

      // let zhengwen = JSON.parse(JSON.stringify(this.article.content));
      // let links = ""; // 存储链接文本
      // if (this.hArr) {
      //   this.hArr.forEach((item, i) => {
      //     // 替换文章标签
      //     let itemArr = item.split("");
      //     itemArr.splice(3, 0, ` id="mao${i}"`);
      //     let xinItem = itemArr.join("");
      //     zhengwen = zhengwen.replace(item, xinItem);
      //     // 构建链接文本
      //     links += `<li><a href="#miao${i}">${item}</a></li>`;
      //   });
      // }
      // if (links != "") zhengwen = `<ul>${links}</ul>` + zhengwen; // 在开头添加链接文本

      // this.article.content = zhengwen;
      // console.log("save", zhengwen);

      this.article.isDelete = false;
      if (this.isEdit) {
        updateArticle(this.article)
          .then((result) => {
            if (result.code == 200) {
              if (result.data) {
                this.$message.success(result.message);
                this.cancel(); //关闭编辑文章弹窗
              }
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      } else {
        addArticle(this.article)
          .then((result) => {
            if (result.code == 200) {
              if (result.data) {
                this.$message.success(result.message);
                this.resetArticle();
                this.$router.push("/articleManage");
              } else {
                this.$message.error(result.message);
              }
            }
          })
          .catch((err) => {
            this.$message.error(err);
          });
      }
    },
    upload(params) {
      // fileConvertBase64(params.file, (base64) => {
      //   this.article.coverImage = base64;
      // });
    },
    // 调用父组件关闭弹窗方法
    cancel() {
      this.$emit("cancel", false);
    },
    //重置
    resetArticle() {
      this.article.title = "";
      if (this.classifyArray.length > 0)
        this.article.classifyId = this.classifyArray[0].id;
      this.article.supportCount = 0;
      this.article.browseCount = 0;
      this.article.content = ""; //清空文本编辑器内容
      // console.log(this.article);
    },
    onCreated(editor) {
      this.editor = Object.seal(editor); // 一定要用 Object.seal() ，否则会报错
    },
    // onChange(editor) {
    //   console.log("onChange", editor.getHtml()); // onChange 时获取编辑器最新内容
    // },
    onChange(editor) {
      console.log("onChange", editor.getHtml()); // onChange 时获取编辑器最新内容
      let reg = /<h[1-6][\s\S]*?h[1-6]>/g;
      this.hArr = this.article.content.match(reg); //所有的h标签
      this.titleArr = []; //添加锚链接的标题
      if (this.hArr) {
        this.hArr.forEach((item, i) => {
          // 标题
          let text = item.replace(/<[^>]+>/g, "");
          this.titleArr.push(`<a href="#miao${i}">${text}</a>`);
        });
      }
    },
    beforeDestroy() {
      const editor = this.editor;
      if (editor == null) return;
      editor.destroy(); // 组件销毁时，及时销毁编辑器
    },
  },
};
</script>
<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
/* #editDemo .w-e-text-container {
  height: 500px;
} */
.dialog-footer {
  padding-right: 20px;
}
</style>