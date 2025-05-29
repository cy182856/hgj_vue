<template>
    <div class="app-container">
      <div class="filter-container">
       
        <el-input v-model="listQuery.cardNo" placeholder="卡号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.deviceNo" placeholder="设备号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.startDate"
          type="date"
          placeholder="开始日期"
          >
        </el-date-picker>

        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.endDate"
          type="date"
          placeholder="结束日期"
        >
        </el-date-picker>

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
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        selection-type="checkbox"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->

        <el-table-column label="小区号" prop="neighNo" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.neighNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡号" prop="cardNo" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.cardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="设备号" prop="deviceNo" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.deviceNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="isUnlock" align="center" width="80">
          <template slot-scope="{row}">
            <span v-if="row.isUnlock == 2">进门</span>
            <span v-if="row.isUnlock == 4">出门</span>
          </template>
        </el-table-column>
        <el-table-column label="刷卡时间" prop="openDoorTime" width="160px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.openDoorTime }}</span>
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

      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </template>
  
  <script>
  import { openDoorList} from '@/api/visit/open-door-log'
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
        openDoorLogFormVisible:false,
        multipleSelection: [],
        webExpandedKeys:[],
        webCheckedKeys:[],
        selectedWebCheckedKeys:[],
        roleOptions:null,
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
    },
    methods: {
      getList() {
        this.listLoading = false
        openDoorList(this.listQuery).then(response => {
          this.list = response.data.pageInfo.list
          this.total = response.data.pageInfo.total
  
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
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
  
  