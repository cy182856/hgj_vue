<template>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listQuery.funName" placeholder="菜单名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
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
        <el-table-column label="编号" prop="id" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="菜单名称" prop="funName" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.funName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="显示位置" prop="index" align="center" width="180px">
          <template slot-scope="{row}">
            <span v-if="row.index == 1">首页</span>
            <span v-if="row.index == 2">我的</span>
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
        <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">          
            <el-button type="primary" size="mini" @click="menuTreeCreate(row)">
              选择客户
            </el-button>  
            <el-button type="primary" size="mini" @click="selectIdentity(row)">
              选择身份
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  
      <el-dialog :title="textMap[dialogStatus]" :visible.sync="cstTree">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
          <el-row :gutter="30">
            <el-col :span="24">
              <div class="grid-content bg-purple">
                <span>客户选择</span>
                <el-tree
                  :data="cstTreeData"
                  show-checkbox
                  node-key="id"
                  ref="webTreeForm"
                  :default-expanded-keys=miniMenuExpandedKeys
                  :default-checked-keys=miniMenuCheckedKeys
                  :props="defaultProps"
                  @check="getCheckedNodes">
                </el-tree>
            </div>
            </el-col>    
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cstTree = false">
            取消
          </el-button>
          <el-button type="primary" @click="dialogStatus==='客户选择'?createCstData():updateData()">
            提交
          </el-button>
        </div>
      </el-dialog>

      <el-dialog :title="textMap[identityDialogStatus]" :visible.sync="identityDialogShow">
        <el-form ref="identityDataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
          
          <el-form-item label="项目" prop="proNums">
            <el-select v-model="temp.proNums" placeholder="项目" clearable multiple style="width: 500px" class="filter-item">
              <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
            </el-select>
          </el-form-item>

          <el-form-item label="身份" prop="identityCodes">
            <el-select v-model="temp.identityCodes" placeholder="身份" clearable multiple style="width: 500px" class="filter-item">
              <el-option v-for="item in identityOptions" :key="item.code" :label="item.name" :value="item.code" />
            </el-select>
          </el-form-item>     
          
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="identityDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="identityDialogStatus==='身份选择'?saveIdentityMenu():saveIdentityMenu()">
            提交
          </el-button>
        </div>
      </el-dialog>
  
    </div>
  </template>
  
  <script>
  import { appletMenuList, selectCstTree, saveAppletCstMenu } from '@/api/menu/applet-menu'

  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { projectSelect } from '@/api/config/config'
  import { identitySelect } from '@/api/identity/identity'
  import { saveIdentityMenu } from '@/api/identity/identity-menu'
  
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
        projectOptions:null,
        identityOptions:null,
        roleOptions:null,
        serchRoleOptions:null,
        readonly: true,
        tableKey: 0,
        list: null,
        total: 0,
        listLoading: true,
        listQuery: {
          page: 1,
          limit: 10
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
        identityDialogShow: false,
        cstTree: false,
        dialogStatus: '',
        identityDialogStatus:'',
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
        cstTreeData: [{
  
        }]
      }
    },
    created() {
      this.getList()
      this.getSelectList()
    },
   
    methods: {
      getList() {
        this.listLoading = false
        appletMenuList(this.listQuery).then(response => {
          this.list = response.data.pageInfo.list
          this.total = response.data.pageInfo.total
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },  
  
       // 获取下拉菜单数据
      getSelectList(){  
        // 项目
        projectSelect().then(response => {
          this.projectOptions = response.data.list
        })       
        // 身份
        identitySelect().then(response => {
          this.identityOptions = response.data.list
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
  
      menuTreeCreate(row) {
        this.resetTemp()
        this.dialogStatus = '客户选择'
        this.cstTree = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
  
        //this.miniMenuExpandedKeys=[1,2,3]
        //this.miniMenuCheckedKeys=[1]
        // 查询员工权限菜单
        this.temp.menuId = row.id
        selectCstTree(this.temp).then((response) => {
          // web菜单赋值
          this.cstTreeData = response.data.cstTreeData
          this.miniMenuExpandedKeys = response.data.miniMenuExpandedKeys
          this.miniMenuCheckedKeys=response.data.miniMenuCheckedKeys       
        })
        
      }, 
      
      //获取用户勾选的客户编号用于传参后台
      getCheckedNodes() {
        let selectedCstCode = this.$refs.webTreeForm.getCheckedNodes(true, true); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
        this.selectedCstCheckedKeys = selectedCstCode.map(item => {
          return item.id;
        });   
      },
  
      createCstData() {
        this.getCheckedNodes()
        this.temp.id = this.temp.menuId
        this.temp.cstCodes = this.selectedCstCheckedKeys
        saveAppletCstMenu(this.temp).then(() => {
            this.cstTree = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000          
            })
        })
      },

      selectIdentity(row) {
        this.resetTemp()
        this.identityDialogStatus = '身份选择'
        this.identityDialogShow = true
        this.$nextTick(() => {
          this.$refs['identityDataForm'].clearValidate()
        })
        this.temp.menuId = row.id
      },

      saveIdentityMenu() {
        this.$refs['identityDataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)                          
            tempData.timestamp = +new Date(tempData.timestamp)
            saveIdentityMenu(tempData).then((response) => {
              this.identityDialogShow = false
              this.getList()
              this.$notify({
                title: 'Success',
                message: 'Successfully',
                type: 'success',
                duration: 2000
              })
            })
          }
        })
      }
   
    }
  }
  </script>
  
  <style>
      .is_show{
          display: none;
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
  @/api/tag/tag
  