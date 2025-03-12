<template>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listQuery.carCode" placeholder="车牌号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.orderStatus" placeholder="支付状态" clearable style="width: 140px;" class="filter-item">
            <el-option label="待支付" :value="0" />
            <el-option label="支付中" :value="1" />
            <el-option label="支付成功" :value="2" />
            <el-option label="支付失败" :value="3" />
        </el-select>
        <el-select v-model="listQuery.proNum" placeholder="项目" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
     
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
        <el-button v-waves class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">
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

        <el-table-column label="车牌号" prop="carCode" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.carCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="订单号" prop="id" align="center" width="160px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="续费月数" prop="monthNum" align="center" width="80px">
          <template slot-scope="{row}">
            <span>{{ row.monthNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="缴费金额" prop="payAmount" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.payAmount }}</span>
          </template>
        </el-table-column>
        <el-table-column label="支付状态" prop="orderStatus" align="center" width="80">
          <template slot-scope="{row}">
            <span v-if="row.orderStatus == 0">待支付</span>
            <span v-if="row.orderStatus == 1">支付中</span>
            <span v-if="row.orderStatus == 2">支付成功</span>
            <span v-if="row.orderStatus == 3">支付失败</span>
          </template>
        </el-table-column>
        <el-table-column label="支付回调" prop="tradeStateDesc" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.tradeStateDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="充值结果" prop="callBackMsg" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.callBackMsg }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效开始时间" prop="beginTime" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.beginTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效结束时间" prop="endTime" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="续费后有效结束时间" prop="renewEndTime" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.renewEndTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="车辆类型" prop="ruleType" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.ruleType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="proName" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.proName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户编号" prop="cstCode" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.cstCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="电话" prop="userTel" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.userTel }}</span>
          </template>
        </el-table-column>
        <el-table-column label="地址" prop="userAddress" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.userAddress }}</span>
          </template>
        </el-table-column>
        <el-table-column label="规则" prop="ruleName" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.ruleName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
      
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </template>
  
  <script>
  import { monCarRenList } from '@/api/moncarren/moncarren-list'
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
        projectOptions:null,
        roleOptions:null,
        serchRoleOptions:null,
        identityOptions:null,
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
        monCarRenList(this.listQuery).then(response => {
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

      // 获取下拉菜单数据
      getSelectList(){
        // 项目
        projectSelect().then(response => {
          this.projectOptions = response.data.list
        }) 
      },
   
    }
  }
  </script>
  
 
  
  