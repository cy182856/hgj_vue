<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userId" placeholder="电表客户编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
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
      
      <el-table-column label="电表客户编号" prop="userId" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户编号" prop="cstCode" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.cstCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="cstName" align="center" width="220">
        <template slot-scope="{row}">
          <span>{{ row.cstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电表开户日期" prop="accountDate" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.accountDate }}</span>
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
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button type="primary" size="mini"  @click="menuTreeCreate(row)">
            权限设置
          </el-button> -->
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
        <el-form-item label="电表客户编号" prop="userId">
          <el-input v-model="temp.userId" placeholder="电表客户编号" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="电表开户日期" prop="startTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px"
              class="filter-item"
              v-model="temp.accountDate"
              type="date"
              placeholder="电表开户日期"
              >
            </el-date-picker>
        </el-form-item>

        <el-form-item label="选择客户" prop="cstCode">
          <el-button type="primary" size="mini"  @click="menuTreeCreate(temp.userId)">
            选择客户 
          </el-button>         
        </el-form-item>      

        <el-form-item label="已选客户" prop="cstCode" v-if="temp.cstCode != null">
          <el-span v-model="temp.cstCode" placeholder="已选客户" clearable style="width: 300px" class="filter-item"><span>&nbsp;{{ temp.cstName }}</span></el-span>
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

    <el-dialog :title="textMap[dialogStatusCst]" :visible.sync="cstTree">
      <!-- <el-input v-model="listQuery.cstName"  placeholder="客户名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
        <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="queryTree()">
          查询
        </el-button> -->
      <div style="margin-top: 20px;"></div>
      <el-form ref="dataFormCst" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
        <el-row :gutter="30">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <span>客户选择</span>           
              <el-tree 
                ref="tree"
                class="treeRadio" 
                :data="cstTreeData" 
                show-checkbox 
                check-strictly 
                node-key="id" 
                @check="handleClick" 
                @check-change="handleClickChange" 
              />
            </div>
          </el-col>    
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cstTree = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatusCst==='客户选择'?createCstData():updateData()">
          确定
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { roleSelect } from '@/api/role/role-info'
import { cstMeterList, saveCstMeter, selectCstTree, deleteCstMeter } from '@/api/cst/cst-meter'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

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
      dialogStatusCst: '',
      cstTree: false,
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
      cstMeterList(this.listQuery).then(response => {
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
     // 选择客户
     menuTreeCreate() {
      // if(userId == null || userId == "" || userId == "undefined"){
      //   this.$notify({
      //     message: '用户编号不能为空',
      //     type: 'error',
      //     duration: 2000          
      //   })
      //   return  
      // }
      //this.resetTemp()
      this.dialogStatusCst = '客户选择'
     
      // this.$nextTick(() => {
      //   this.$refs['dataFormCst'].clearValidate()
      // })

      //this.tagExpandedKeys=[1,2,3]
      //this.tagCheckedKeys=[1]

      selectCstTree(this.temp).then((response) => {
        // web菜单赋值
        this.cstTreeData = response.data.cstTreeData
        this.cstTree = true
       // this.tagExpandedKeys = response.data.tagExpandedKeys
       // this.tagCheckedKeys=response.data.tagCheckedKeys       
      })
    },

    queryTree(){
      alert(this.listQuery.cstName)
      selectCstTree(this.listQuery).then((response) => {
        // web菜单赋值
        this.cstTreeData = response.data.cstTreeData       
      })
    },

    handleClick(data, tree) {
        this.$refs.tree.setCheckedKeys([]); // 删除所有选中节点
        this.$refs.tree.setCheckedNodes([data]); // 选中已选中节点
        let selectedCstCode = this.$refs.tree.getCheckedNodes(true, true);
        this.selectedCstCheckedKeys = selectedCstCode[0]
        //alert(selectedCstCode[0].id + "||" +selectedCstCode[0].label)     
    },

    createCstData() {
      if(this.selectedCstCheckedKeys == null || this.selectedCstCheckedKeys == "" || this.selectedCstCheckedKeys == "undefined"){
        this.$notify({
          message: '请勾选一个客户',
          type: 'error',
          duration: 2000          
        })
          return
      }  
      this.temp.cstCode = this.selectedCstCheckedKeys.id
      this.temp.cstName = this.selectedCstCheckedKeys.label    
      this.cstTree = false;
    },

    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          if(this.temp.userId == null || this.temp.userId == "" || this.temp.userId == "undefined"){
            this.$notify({
              message: '电表客户编号不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.accountDate == null || this.temp.accountDate == "" || this.temp.accountDate == "undefined"){
            this.$notify({
              message: '电表开户日期不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.cstCode == null || this.temp.cstCode == "" || this.temp.cstCode == "undefined"){
            this.$notify({
              message: '客户不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          saveCstMeter(this.temp).then(() => {
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
          if(this.temp.userId == null || this.temp.userId == "" || this.temp.userId == "undefined"){
            this.$notify({
              message: '电表客户编号不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.accountDate == null || this.temp.accountDate == "" || this.temp.accountDate == "undefined"){
            this.$notify({
              message: '电表开户日期不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          saveCstMeter(tempData).then(() => {
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
        deleteCstMeter(row.id,).then((res) => {
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
  .treeRadio >>> .el-checkbox__inner{
      	border-radius: 50%;
    }

</style>

