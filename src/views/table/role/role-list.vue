<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.roleName" placeholder="角色名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
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
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <!-- <el-table-column label="项目编号" prop="projectNum" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.projectNum }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="角色编号" prop="id" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="角色名称" prop="roleName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.roleName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <el-button type="primary" size="mini"  @click="menuTreeCreate(row)">
            权限设置
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
        <el-form-item class="is_show" label="id" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="temp.roleName" placeholder="角色名称" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="menuTree">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
        <el-row :gutter="30">
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <span>web权限</span>
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
          </div>
          </el-col>
          <el-col :span="12">
            <div class="grid-content bg-purple">
              <span>企微权限</span>
              <el-tree
                :data="weComTreeData"
                show-checkbox
                node-key="id"
                ref="weComTreeForm"
                :default-expanded-keys=weComExpandedKeys
                :default-checked-keys=weComCheckedKeys
                :props="defaultProps"
                @check="getCheckedNodes">
              </el-tree>
            </div>
          </el-col>
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuTree = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='权限菜单'?createWebMenuData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleSelect } from '@/api/role/role-info'
import { roleList, saveRole, saveRoleMenu, updateRole, deleteRole } from '@/api/role/role-info'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { selectMenu } from '@/api/user/user-menu'

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
      weComExpandedKeys:[],
      weComCheckedKeys:[],
      selectedWeComCheckedKeys:[],
      roleOptions:null,
      serchRoleOptions:null,
      readonly: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
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
      menuTree: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      rules: {
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,

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
        weComTreeData:[{}],
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
      roleList(this.listQuery).then(response => {
        this.list = response.data.pageInfo.list
        this.total = response.data.pageInfo.total

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })
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
    // 获取下拉菜单数据
    getSelectList(){
      // 角色
      roleSelect().then(response => {
        this.serchRoleOptions = response.data.list
        this.roleOptions = response.data.list
      })
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
    menuTreeCreate(row) {
      this.resetTemp()
      this.dialogStatus = '权限菜单'
      this.menuTree = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      //this.webExpandedKeys=[1,2,3]
      //this.webCheckedKeys=[1]
      // 查询员工权限菜单
      this.temp.roleId = row.id
      selectMenu(this.temp).then((response) => {
        // web菜单赋值
        this.webTreeData = response.data.webTreeData
        this.webExpandedKeys = response.data.webExpandedKeys
        this.webCheckedKeys=response.data.webCheckedKeys
        // 企微菜单赋值
        this.weComTreeData = response.data.weComTreeData
        this.weComExpandedKeys = response.data.weComExpandedKeys
        this.weComCheckedKeys= response.data.weComCheckedKeys
           
        })
      
    },

    //获取用户勾选的权限id用于传参后台
    getCheckedNodes() {
      let selectedWebMenu = this.$refs.webTreeForm.getCheckedNodes(false, false); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      this.selectedWebCheckedKeys = selectedWebMenu.map(item => {
        return item.id;
      });   
      let selectedWeComMenu = this.$refs.weComTreeForm.getCheckedNodes(false, false); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      this.selectedWeComCheckedKeys = selectedWeComMenu.map(item => {
        return item.id;
      });  
    },
    createWebMenuData() {
      this.getCheckedNodes()
      this.temp.id = this.temp.roleId
      this.temp.webMenuIds = this.selectedWebCheckedKeys
      this.temp.weComMenuIds = this.selectedWeComCheckedKeys
      saveRoleMenu(this.temp).then(() => {
          this.menuTree = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000          
          })
      })
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          if(this.temp.roleName == null || this.temp.roleName == "" || this.temp.roleName == "undefined"){
            this.$notify({
              message: '角色名称不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          saveRole(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList()
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000          
            })
          })
        }
        //this.$router.go(0)
        //window.location.reload()
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
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          updateRole(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
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

    handleDelete(row, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteRole(row.id,).then((res) => {
          if (res.code == 20000) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
          })
            this.list.splice(index, 1)
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
 
  }
}
</script>

<style>
    .is_show{
        display: none;
    }

    .el-row {
    margin-bottom: 20px;
    &:last-child {
      margin-bottom: 0;
    }
  }
  .el-col {
    border-radius: 4px;
  }
  .bg-purple-dark {
    background: #99a9bf;
  }
  .bg-purple {
    background: #d3dce6;
  }
  .bg-purple-light {
    background: #e5e9f2;
  }
  .grid-content {
    border-radius: 4px;
    min-height: 36px;
  }
  .row-bg {
    padding: 10px 0;
    background-color: #f9fafc;
  }
</style>

