<template>
    <div class="app-container">
      <div class="filter-container">
        <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <el-select v-model="listQuery.projectNum" placeholder="项目" clearable style="width: 160px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.repairNum" placeholder="报修单号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.repairStatus" placeholder="报修状态" clearable style="width: 140px" class="filter-item">
            <el-option label="已提交" value="WOSta_Sub" />
            <el-option label="处理中" value="WOSta_Proc" />
            <el-option label="已完工" value="WOSta_Finish" />
            <el-option label="已回访" value="WOSta_Visit" />
            <el-option label="已关闭" value="WOSta_Close" />
        </el-select>
        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.startTime"
          type="date"
          placeholder="开始日期"
          >
        </el-date-picker>

        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.endTime"
          type="date"
          placeholder="结束日期"
        >
        </el-date-picker>
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 5px;" @click="handleFilter">
          查询
        </el-button>
        <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
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

        <el-table-column label="项目名称" prop="projectName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修单号" prop="repairNum" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.repairNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户编号" prop="cstCode" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.cstCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="报修类型" prop="quesType" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.quesType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修位置" prop="workPos" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.workPos }}</span>
          </template>
        </el-table-column>
        <el-table-column label="报修描述" prop="repairDesc" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.repairDesc }}</span>        
          </template>
        </el-table-column>
        <!-- <el-table-column label="报修状态" prop="repairStatus" align="center" width="120">
          <template slot-scope="{row}">
            <span v-if="row.repairStatus == 'WOSta_Sub'">已提交</span>
            <span v-if="row.repairStatus == 'WOSta_Proc'">处理中</span>
            <span v-if="row.repairStatus == 'WOSta_Finish'">已完工</span>
            <span v-if="row.repairStatus == 'WOSta_Visit'">已回访</span>
            <span v-if="row.repairStatus == 'WOSta_Close'">已关闭</span>
          </template>
        </el-table-column> -->
        <el-table-column label="报修状态" prop="repairStatus" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.repairStatusName }}</span> 
          </template>
        </el-table-column>
       
        <el-table-column label="提交人" prop="userName" align="center" width="60">
          <template slot-scope="{row}">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="接单人" prop="orders" align="center" width="60">
          <template slot-scope="{row}">
            <span>{{ row.orders }}</span>
          </template>
        </el-table-column>
        
        <el-table-column label="接单时间" width="140px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.ordersTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="完工时间" width="140px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.completionTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评分" prop="repairScore" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.repairScore }}</span>
          </template>
        </el-table-column>
        <el-table-column label="评论" prop="repairMsg" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.repairMsg }}</span>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="mobile" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.mobile }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人工费" prop="labourCost" align="center" width="60">
          <template slot-scope="{row}">
            <span>{{ row.labourCost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="物料费" prop="materialCost" align="center" width="60">
          <template slot-scope="{row}">
            <span>{{ row.materialCost }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" width="140px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" width="140px" align="center">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </template>
  
  <script>
  import { repairList} from '@/api/repair/repair'
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
        repairList(this.listQuery).then(response => {
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


    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['项目名称','报修单号','客户编号','客户名称','手机号','报修类型','报修位置','报修描述','报修状态','评分', '评论', '提交人','接单人', '人工费','物料费','接单时间','完工时间','创建时间','更新时间']
        const filterVal = ['projectName','repairNum','cstCode','cstName','cstMobile','quesType','workPos', 'repairDesc','repairStatusName', 'repairScore','repairMsg','userName','orders','labourCost','materialCost','ordersTime','completionTime','createTime','updateTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '报修统计'
        })
        this.downloadLoading = false
      })
    },

    formatJson(filterVal) {
      console.log("this.list-------------"+this.list)
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
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
  
  