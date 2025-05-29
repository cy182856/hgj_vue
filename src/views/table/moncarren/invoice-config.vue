<template>
    <div class="app-container">
      <div class="filter-container">
        <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <!-- <el-select v-model="listQuery.projectNum" placeholder="项目" clearable style="width: 160px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.configKey" placeholder="key" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.configValue" placeholder="value" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.appId" placeholder="appId" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.description" placeholder="description" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 5px;" @click="handleFilter">
          查询
        </el-button> -->
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
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        selection-type="checkbox"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->

        <el-table-column label="id" prop="id" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="proNum" prop="projectNum" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.projectNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="key" prop="configKey" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.configKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="configValue" prop="configValue" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.configValue }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="appId" prop="appId" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.appId }}</span>
          </template>
        </el-table-column> -->
        <!-- <el-table-column label="appSecret" prop="appSecret" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.appSecret }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="description" prop="description" align="center" width="300">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
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
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
          <el-form-item label="configValue" prop="configValue">
            <el-input v-model="temp.configValue" placeholder="configValue" clearable style="width: 400px" class="filter-item" maxlength="2"></el-input>
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

    </div>
  </template>
  
  <script>
  import { constantList, constantUpdate } from '@/api/config/constant'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { projectSelect } from '@/api/config/config'

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
        multipleSelection: [],
        webExpandedKeys:[],
        webCheckedKeys:[],
        selectedWebCheckedKeys:[],
        roleOptions:null,
        projectOptions:null,
        serchRoleOptions:null,
        serchDeptNameOptions:null,
        imgUrl:'',
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
      }
    },
    created() {
      this.getList()
      this.getSelectList()
    },
    methods: {
      getList() {
        this.listLoading = false
        this.listQuery.configKey = 'mon_car_ren_invoice_before_month';
        constantList(this.listQuery).then(response => {
          this.list = response.data.pageInfo.list
          this.total = response.data.pageInfo.total
  
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
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
          var configValue = tempData.configValue;
          if(configValue == null || configValue == "" || configValue == "undefined"){
            this.$notify({
              message: '开票月数不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }

          if(!/^-?\d+$/.test(configValue)){
            this.$notify({
              message: '开票月数必须为整数！',
              type: 'error',
              duration: 2000          
            })
            return
          }

          constantUpdate(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList();
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

    handleSelectionChange(val) {
      this.multipleSelection = val;
      // for(var i = 0; i<this.multipleSelection.length; i++){
      //   alert(this.multipleSelection[i].id)
      // }    
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
      // 项目
      projectSelect().then(response => {
        this.projectOptions = response.data.list
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
   
    }
  }
  </script>
  
  <style>
      .is_show{
          display: none;
      }
  </style>
  
  