<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery.projectNum" placeholder="所属项目" clearable style="width: 190px" class="filter-item">
          <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
      </el-select>
      <el-select v-model="listQuery.corpId" placeholder="所属企业" clearable style="width: 190px" class="filter-item">
          <el-option v-for="item in corpOptions" :key="item.corpId" :label="item.corpName" :value="item.corpId" />
      </el-select>  
      <el-input v-model="listQuery.userName" placeholder="用户名" style="width: 190px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.roleName" placeholder="角色" clearable style="width: 190px" class="filter-item">
          <el-option value="无角色" ></el-option>
          <el-option v-for="item in serchRoleOptions" :key="item.id" :label="item.roleName" :value="item.roleName" />
      </el-select>
      <el-select v-model="listQuery.deptName" placeholder="部门" clearable style="width: 190px" class="filter-item">
          <el-option v-for="item in serchDeptNameOptions" :key="item.deptName" :label="item.deptName" :value="item.deptName" />
      </el-select>
      <el-input v-model="listQuery.mobile" placeholder="电话" style="width: 190px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 5px;" @click="handleFilter">
        查询
      </el-button>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="项目编号" prop="projectNum" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.projectNum }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="所属项目" prop="projectName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属企业" prop="corpName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.corpName }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' label="所属楼栋" prop="budNameUnit" align="center" width="160">
        <template slot-scope="{row}">
          <span v-for=" (val, key) in row.buildList" :key="key">
                 {{ val.budNameUnit }},
          </span>
        </template>
      </el-table-column>
      <el-table-column label="用户编号" prop="userId" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="用户名" prop="userName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="部门" prop="deptName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.deptName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色" prop="roleName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="职务" prop="position" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.position }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电话" prop="mobile" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.mobile }}</span>
        </template>
      </el-table-column>
      <el-table-column label="值班电话" prop="phone" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.phone }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="企微二维码" prop="qrCode" align="center" width="180">
        <template v-if="row.qrCode != null" slot-scope="{ row }">
          <img :src="row.qrCode" alt="Base64 Image" height="250" width="200" />
        </template>     
      </el-table-column>       -->
      <el-table-column label="企微二维码" prop="qrCode" align="center" width="100">
        <template slot-scope="{row}">
          <span v-if="row.qrCode != null">已上传</span>
          <span v-if="row.qrCode == null">未上传</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="160px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
          <el-button type="primary" size="mini" @click="handleUpload(row)">
            上传二维码
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item class="is_show" label="staffId" prop="staffId">
          <el-input v-model="temp.staffId" />
        </el-form-item>
        <el-form-item label="用户名" prop="userName">
          <el-input v-model="temp.userName" readonly />
        </el-form-item>
        <!-- <el-form-item label="电话" prop="mobile">
          <el-input v-model="temp.mobile" readonly/>
        </el-form-item> -->
        <el-form-item label="电话" prop="mobile">
          <el-input v-model="temp.mobile"/>
        </el-form-item>
        <el-form-item label="值班电话" prop="phone">
          <el-input v-model="temp.phone"/>
        </el-form-item>
        <el-form-item label="角色" prop="roleId">
          <el-select v-model="temp.roleId" placeholder="角色" clearable style="width: 328px" class="filter-item">
            <el-option v-for="item in roleOptions" :key="item.id" :label="item.roleName" :value="item.id" />
          </el-select>
        </el-form-item>
        <el-form-item label="项目" prop="projectNum">
          <el-select v-model="temp.projectNum" placeholder="项目" clearable style="width: 328px" class="filter-item" @change="proNumChange($event,temp.staffId)">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
          </el-select>
        </el-form-item>
        <el-form-item label="楼栋" prop="budId">
          <el-select v-model="budId" placeholder="楼栋" clearable multiple style="width: 328px" class="filter-item">
            <el-option v-for="item in budOptions" :key="item.budId" :label="item.budNameUnit" :value="item.budId" ></el-option>
          </el-select>
        </el-form-item>
        <!-- 测试函数用 -->
        <!-- <el-button @click="mapBuild( temp.buildList )"></el-button> -->
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="webMenuTree">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; height: 100%; margin-left:50px;">

        <!-- 权限树 -->
        <el-tree
          :data="webTreeData"
          show-checkbox
          node-key="id"
          ref="webTreeForm"
          :default-expanded-keys=webExpandedKeys
          :default-checked-keys=webCheckedKeys
          :props="defaultProps"
          @check="getCheckedNodes">
        </el-tree>

      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="webMenuTree = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='权限菜单'?createWebMenuData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { userList, saveUser, updateUser, deptSelect } from '@/api/user/user-manage'
import { roleSelect } from '@/api/role/role-info'
import { projectSelect, corpSelect } from '@/api/config/config'
import { budSelect } from '@/api/build/build'
import { selectUserWebMenu } from '@/api/user/user-menu'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getToken } from "@/utils/auth";
import axios from "axios";
import { url } from "@/utils/url";

export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type]
    }
  },
  data() {
    return {
      webExpandedKeys:[],
      webCheckedKeys:[],
      selectedWebCheckedKeys:[],
      roleOptions:null,
      projectOptions:null,
      corpOptions:null,
      budOptions:null,
      serchRoleOptions:null,
      serchDeptNameOptions:null,
      readonly: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      uploadMode: false,
      userKey: null,
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      dialogFormVisible: false,
      webMenuTree: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
      budId:null,
      // 权限树
      webTreeData: [{
        //   id: 1,
        //   label: '一级 1',
        //   children: [{
        //     id: 4,
        //     label: '二级 1-1',
        //   }]
        // }, {
        //   id: 2,
        //   label: '一级 2',
        //   children: [{
        //     id: 5,
        //     label: '二级 2-1'
        //   }, {
        //     id: 6,
        //     label: '二级 2-2'
        //   }]
        // }, {
        //   id: 3,
        //   label: '一级 3',
        //   children: [{
        //     id: 7,
        //     label: '二级 3-1'
        //   }, {
        //     id: 8,
        //     label: '二级 3-2'
        //   }]
        }],
        defaultProps: {
          children: 'children',
          label: 'label'
        }

    }
  },
  created() {
    this.getList()
    this.getSelectList()
  },

  methods: {
    getList() {
      this.listLoading = false
      userList(this.listQuery).then(response => {
        this.list = response.data.pageInfo.list
        this.total = response.data.pageInfo.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
    },

    handleUpload(row) {
      this.uploadMode = true;
      this.userKey = row.id;
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
            if (width > 600 || width < 100) {
              _this.$alert("图片宽度必须在100~1200之间！", "提示", {
                confirmButtonText: "确定",
              });
              reject();
            }
            if (height > 800 || height < 100) {
              _this.$alert("图片高度必须在100~3000之间！", "提示", {
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
        url: url + "/user/file/upload",
        method: "POST",
        params: {
          userKey: this.userKey,
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

    submitUpload() {
      this.$refs.upload.submit();
    },

    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },

    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    proNumChange(projectNum, mobile){
      console.log(projectNum+"----------"+mobile)
      // 清空已选择楼栋
      this.budId = null;
      // 获取楼栋
      budSelect(projectNum,null).then(response => {
        this.budOptions = response.data.list;
      }) 
      budSelect(projectNum,mobile).then(response => {
        this.budId = this.mapBuild(response.data.list);
      }) 
    },
    // 获取下拉菜单数据
    getSelectList(){
      // 角色
      roleSelect().then(response => {
        this.serchRoleOptions = response.data.list
        this.roleOptions = response.data.list
      })
      // 部门
      deptSelect().then(response => {
        this.serchDeptNameOptions = response.data.list
      })
      // 项目
      projectSelect().then(response => {
        this.projectOptions = response.data.list
      })  
      // 企业
      corpSelect().then(response => {
        this.corpOptions = response.data.list
      })  
    },
    mapBuild(list){
    let a =  list.map((option)=>option.budId);
    return a;
    },
    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        status: 'published',
        type: ''
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    webMenuTreeCreate() {
      this.resetTemp()
      this.dialogStatus = '权限菜单'
      this.webMenuTree = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      //this.webExpandedKeys=[1,2,3]
      //this.webCheckedKeys=[1]
      // 查询员工权限菜单
      selectUserWebMenu(this.temp).then((response) => {
        this.webTreeData = response.data.webTreeData
        this.webExpandedKeys=response.data.webExpandedKeys
        this.webCheckedKeys=response.data.webCheckedKeys
            // this.list.unshift(this.temp)
            // this.dialogFormVisible = false
            // this.$notify({
            //   title: 'Success',
            //   message: 'Created Successfully',
            //   type: 'success',
            //   duration: 2000
            // })
        })
      
    },

    //获取用户勾选的权限id用于传参后台
    getCheckedNodes() {
      this.selectedWebCheckedKeys = ""
      let selectedPermission = this.$refs.webTreeForm.getCheckedNodes(false, true); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      this.permissionIds = selectedPermission.map(item => {
      this.selectedWebCheckedKeys += item.id+","
        //return item.id;
        //alert(item.id)
      });
      
      
  },
    createWebMenuData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          // saveUser(this.temp).then(() => {
          //   this.list.unshift(this.temp)
          //   this.dialogFormVisible = false
          //   this.$notify({
          //     title: 'Success',
          //     message: 'Created Successfully',
          //     type: 'success',
          //     duration: 2000
          //   })
          // })
        }
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          saveUser(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      this.budId = this.mapBuild(this.temp.buildList);
      budSelect(this.temp.projectNum).then(response => {
        this.budOptions = response.data.list
      }) 
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.budId = this.budId;
          const tempData = Object.assign({}, this.temp)
          if(tempData.mobile == null || tempData.mobile == ""){
            this.$notify({
              message: '电话不能为空！',
              type: 'error',
              duration: 2000
            })
            return
          }
          // if(tempData.roleId == null || tempData.roleId == ""){
          //   this.$notify({
          //     message: '角色不能为空！',
          //     type: 'error',
          //     duration: 2000
          //   })
          //   return
          // }
          //alert(tempData.projectNum + "--------" + tempData.budId)
          if((tempData.projectNum == null || tempData.projectNum == "") && (tempData.budId != null && tempData.budId != "undefined" && tempData.budId != "")){
            this.$notify({
              message: '项目不能为空！',
              type: 'error',
              duration: 2000
            })
            return
          }
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateUser(tempData).then((response) => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Update Successfully',
              type: 'success',
              duration: 2000
            })
          })
        }
      })
    },
 
  }
}
</script>

<style>
    .is_show{
        display: none;
    }
</style>

