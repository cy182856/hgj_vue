<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select
        v-model="listQuery.proNum"
        placeholder="项目"
        clearable
        style="width: 200px"
        class="filter-item"
      >
        <el-option
          v-for="item in projectOptions"
          :key="item.projectNum"
          :label="item.projectName"
          :value="item.projectNum"
        />
      </el-select>
      <el-input
        v-model="listQuery.title"
        placeholder="标题"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />

      <el-date-picker
        value-format="yyyy-MM-dd"
        style="width: 300px"
        class="filter-item"
        v-model="listQuery.startTime"
        type="date"
        placeholder="开始日期"
      >
      </el-date-picker>

      <el-date-picker
        value-format="yyyy-MM-dd"
        style="width: 300px"
        class="filter-item"
        v-model="listQuery.endTime"
        type="date"
        placeholder="结束日期"
      >
      </el-date-picker>
      &nbsp;
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
        新增
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="项目" prop="proName" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.proName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="标题" prop="title" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.title }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="广告图片"
        prop="imgPath"
        align="center"
        width="180"
      >
        <template v-if="row.imgPath != null" slot-scope="{ row }">
          <img :src="row.imgPath" alt="Base64 Image" height="150" width="150" />
        </template>
      </el-table-column>
      <el-table-column label="广告链接" prop="url" align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="是否显示" prop="isShow" align="center" width="120">
        <template slot-scope="{ row }">
          <span v-if="row.isShow == 0">显示</span>
          <span v-if="row.isShow == 1">不显示</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="300"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button v-if="row.isShow == 1" type="primary" size="mini" @click="advertsIsShow(row)">
            发布
          </el-button>
          <el-button v-if="row.isShow == 0" type="danger" size="mini" @click="advertsNotIsShow(row)">
            撤回
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpload(row)">
            上传
          </el-button>
          <el-button
            v-if="row.status != 'deleted'"
            size="mini"
            type="danger"
            @click="handleDelete(row, $index)"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; height: 100%; margin-left: 60px"
      >
        <el-form-item class="is_show" label="id" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="项目" prop="proNum" style="margin-top: 20px">
          <el-select
            v-model="temp.proNum"
            placeholder="项目"
            clearable
            style="width: 300px"
            class="filter-item"
          >
            <el-option
              v-for="item in projectOptions"
              :key="item.projectNum"
              :label="item.projectName"
              :value="item.projectNum"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input
            v-model="temp.title"
            placeholder="标题"
            clearable
            style="width: 300px"
            class="filter-item"
          ></el-input>
        </el-form-item>

        <el-form-item label="广告链接" prop="url">
          <el-input
            v-model="temp.url"
            placeholder="广告链接"
            clearable
            style="width: 300px"
            class="filter-item"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>

    <!-- 文件上传框 -->
    <el-dialog :title="Upload" :visible.sync="uploadMode">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; height: 100%; margin-left: 60px"
      >
        <el-upload
          :limit="1"
          class="upload-demo"
          ref="upload"
          action
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :file-list="fileList"
          :auto-upload="false"
          :http-request="UploadSubmit"
          :before-upload="handleImagesUrlBefore"
        >
          <el-button slot="trigger" size="small" type="primary"
            >选取文件</el-button
          >
          <el-button
            style="margin-left: 10px"
            size="small"
            type="success"
            @click="submitUpload"
            >上传到服务器</el-button
          >
          <div slot="tip" class="el-upload__tip">请上传1M以内的文件！</div>
        </el-upload>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="uploadMode = false"> 取消 </el-button>
      </div>
    </el-dialog>

    <!-- 附件列表框 -->
    <el-dialog :title="Down" :visible.sync="fileMode">
      <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="fileModeList"
        border
        fit
        highlight-current-row
        style="width: 100%; height: 100%"
        @sort-change="sortChange"
      >
        <el-form
          ref="dataForm"
          :rules="rules"
          :model="temp"
          label-position="left"
          label-width="100px"
          style="width: 600px; height: 100%; margin-left: 60px"
        >
          <el-table-column
            label="操作"
            align="center"
            class-name="small-padding fixed-width"
          >
            <template slot-scope="{ row, $index }">
              <el-button type="primary" size="mini" @click="fileDown(row)">
                下载
              </el-button>
              <el-button
                v-if="row.status != 'deleted'"
                size="mini"
                type="danger"
                @click="deleteFile(row, $index)"
              >
                删除
              </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column label="编号" prop="fileId" align="center" width="0">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
          <el-table-column
            label="文件名"
            prop="fileName"
            align="center"
            width="0"
          >
            <template slot-scope="{ row }">
              <span>{{ row.fileName }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="目录序号"
            prop="fileName"
            align="center"
            width="0"
          >
            <template slot-scope="{ row }">
              <span>{{ row.dirNum }}</span>
            </template>
          </el-table-column>
          <el-table-column
            label="存放位置号"
            prop="fileName"
            align="center"
            width="0"
          >
            <template slot-scope="{ row }">
              <span>{{ row.positionNum }}</span>
            </template>
          </el-table-column>
        </el-form>
      </el-table>
    </el-dialog>
  </div>
</template>

<script>
import {advertsList,fetchPv,advertsSave,updateSumInfo,advertsDelete,advertsIsShow,advertsNotIsShow} from "@/api/adverts/adverts";
import { getToken } from "@/utils/auth";
import { projectSelect } from "@/api/config/config";
import waves from "@/directive/waves"; // waves directive
import { parseTime } from "@/utils";
import axios from "axios";
import { url } from "@/utils/url";
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "sum-info-list",
  components: { Pagination },
  directives: { waves },
  projectOptions: null,
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      dirNum: "",
      tableKey: 0,
      list: null,
      fileModeList: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      contractStartDate: "",
      contractEndDate: "",
      advertsId: null,
      fileList: [],
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogFormVisible: false,
      uploadMode: false,
      fileMode: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        proNum: [
          { required: true, message: "proNum is required", trigger: "change" },
        ],
        timestamp: [
          {
            type: "date",
            required: true,
            message: "timestamp is required",
            trigger: "change",
          },
        ],
        title: [
          { required: true, message: "title is required", trigger: "blur" },
        ],
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    this.getSelectList();
  },
  methods: {
    getList() {
      this.listLoading = false;
      advertsList(this.listQuery).then((response) => {
        this.list = response.data.pageInfo.list;
        this.total = response.data.pageInfo.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
    },
    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
    // 获取下拉菜单数据
    getSelectList() {
      // 项目
      projectSelect().then((response) => {
        this.projectOptions = response.data.list;
      });
    },
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpload(row) {
      this.uploadMode = true;
      this.advertsId = row.id;
    },
    createData() {
      if (
        this.temp.proNum == null ||
        this.temp.proNum == "" ||
        this.temp.proNum == "undefined"
      ) {
        this.$notify({
          message: "项目不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      if (
        this.temp.title == null ||
        this.temp.title == "" ||
        this.temp.title == "undefined"
      ) {
        this.$notify({
          message: "标题不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          advertsSave(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
        //this.$router.go(0)
        //window.location.reload()
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      if (
        this.temp.proNum == null ||
        this.temp.proNum == "" ||
        this.temp.proNum == "undefined"
      ) {
        this.$notify({
          message: "项目不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      if (
        this.temp.title == null ||
        this.temp.title == "" ||
        this.temp.title == "undefined"
      ) {
        this.$notify({
          message: "标题不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          advertsSave(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },

    handleDelete(row, index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          advertsDelete(row.id).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: "Success",
                message: "Delete Successfully",
                type: "success",
                duration: 2000,
              });
              this.list.splice(index, 1);
            } else {
              alert(res.msg);
            }
          });
        })
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },

    advertsIsShow(row, index) {
      this.$confirm('确认发布?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        advertsIsShow(row.id,).then((res) => {
          if (res.code == 20000) {
            this.$notify({
              title: 'Success',
              message: '发布成功',
              type: 'success',
              duration: 2000
          })
            this.getList()
            } else {
              this.$notify({
                message: res.data.message,
                type: 'error',
                duration: 2000          
              })
            }
          });
        })
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },

    advertsNotIsShow(row, index) {
      this.$confirm('确认撤回?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        advertsNotIsShow(row.id,).then((res) => {
          if (res.code == 20000) {
            this.$notify({
              title: 'Success',
              message: '撤回成功',
              type: 'success',
              duration: 2000
          })
          this.getList()
            } else {
              this.$notify({
                message: res.data.message,
                type: 'error',
                duration: 2000          
              })
            }
          });
        })
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },

    handleFetchPv(pv) {
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },

    formatJson(filterVal) {
      console.log("this.list-------------" + this.list);
      return this.list.map((v) =>
        filterVal.map((j) => {
          if (j === "timestamp") {
            return parseTime(v[j]);
          } else {
            return v[j];
          }
        })
      );
    },

    handleImagesUrlBefore: function (file) {
      var _this = this;
      return new Promise(function (resolve, reject) {
        var reader = new FileReader();
        reader.onload = function (event) {
          var image = new Image();
          image.onload = function () {
            var width = this.width;
            var height = this.height;
            if (width > 400 || width < 100) {
              _this.$alert("图片宽度必须在100~400之间！", "提示", {
                confirmButtonText: "确定",
              });
              reject();
            }
            if (height > 600 || height < 100) {
              _this.$alert("图片高度必须在100~600之间！", "提示", {
                confirmButtonText: "确定",
              });
              reject();
            }
            resolve();
          };
          image.src = event.target.result;
        };
        reader.readAsDataURL(file);
      });
    },

    UploadSubmit(param) {
      var file = param.file;
      if (file.size > 1000000) {
        this.$notify({
          title: "error",
          message: "上传文件不能超过1M！",
          type: "error",
          duration: 3000,
        });
        return;
      }

      const suffix =
        file.type === "image/jpg" ||
        file.type === "image/png" ||
        file.type === "image/jpeg";
      if (!suffix) {
        this.$message.error("只能上传图片！");
        return reject(false);
      }

      // console.log(param.file);
      var file_form = new FormData(); //获取上传表单（文件）
      file_form.append("file", file);
      axios({
        url: url + "/adverts/file/upload",
        method: "POST",
        params: {
          advertsId: this.advertsId,
          dirNum: this.dirNum,
        },
        // timeout: 200000,
        headers: {
          "X-Token": getToken(),
        },
        data: file_form,
      })
        .then((res) => {
          if (res.data.code == 20000) {
            window.location.reload();
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
    },
    fileDown(row) {
      axios({
        url: url + "/sum/info/file/download",
        method: "POST",
        params: { fileId: row.id },
        responseType: "blob", // 表明返回服务器返回的数据类型
      }).then((response) => {
        // 获取文件名
        var blob = new Blob([response.data], {
          type: "application/vnd.ms-excel;charset=utf-8",
        });
        let url = window.URL.createObjectURL(blob);
        let aLink = document.createElement("a");
        aLink.style.display = "none";
        aLink.href = url;
        aLink.setAttribute("download", row.fileName); // 下载的文件
        document.body.appendChild(aLink);
        aLink.click();
        document.body.removeChild(aLink);
        window.URL.revokeObjectURL(url);
      });
    },
    excelExport() {
      let aLink = document.createElement("a");
      aLink.style.display = "none";
      let sedUrl = url + "/sum/info/excel/download";
      aLink.href = sedUrl;
      document.body.appendChild(aLink);
      aLink.click();
      document.body.removeChild(aLink);
      window.URL.revokeObjectURL(url);
      // window.open(url + "/sum/info/excel/download", '11111')
    },

    deleteFile(row, index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          axios({
            url: url + "/sum/file/delete",
            method: "GET",
            params: { id: row.id },
            headers: {
              "X-Token": getToken(),
            },
          }).then((res) => {
            if (res.data.code == 20000) {
              this.fileModeList.splice(index, 1);
              this.$notify({
                title: "Success",
                message: "Delete Successfully",
                type: "success",
                duration: 2000,
              });
            } else {
              alert(res.msg);
            }
          });
        })
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },

    submitUpload() {
      this.$refs.upload.submit();
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    getSortClass: function (key) {
      const sort = this.listQuery.sort;
      return sort === `+${key}` ? "ascending" : "descending";
    },
  },
};
</script>

<style>
.is_show {
  display: none;
}
</style>
