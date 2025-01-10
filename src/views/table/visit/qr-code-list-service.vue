<template>
    <div class="app-container">
      <div class="filter-container">
        <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <el-select v-model="listQuery.proNum" placeholder="项目" clearable style="width: 160px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-select v-model="listQuery.type" placeholder="来源" clearable style="width: 140px" class="filter-item">
          <el-option label="普通二维码" :value="3" />
          <el-option label="通用二维码" :value="5" />
          <el-option label="临时二维码" :value="6" />
        </el-select>
        <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cardNo" placeholder="卡号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.phone" placeholder="创建人手机号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.personPhone" placeholder="使用人手机号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />

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
        <!-- <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
          导出
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

        <el-table-column label="项目名称" prop="proName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.proName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡号" prop="cardNo" align="center" width="140">
          <template slot-scope="{row}">
            <span>{{ row.cardNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="生效时间" prop="expDate" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.expDate }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户编号" prop="cstCode" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.cstCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小区号" prop="neighNo" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.neighNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单元" prop="unitNum" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.unitNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼层" prop="floors" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.floors }}</span>
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="resCode" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.resCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人" prop="serviceName" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.serviceName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建人手机号" prop="phone" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.phone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用人手机号" prop="personPhone" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.personPhone }}</span>
          </template>
        </el-table-column>
        <el-table-column label="人脸图片" prop="facePicPath" align="center" width="180">
          <template v-if="row.facePicPath != null" slot-scope="{ row }">
            <img :src="row.facePicPath" alt="Base64 Image" height="150" width="150" />
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
         
            <el-button type="primary" size="mini" @click="openDoorLog(row)">
              开门记录
            </el-button>
           
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />


        <el-dialog :title="textMap[openDoorLogStatus]" :visible.sync="openDoorLogFormVisible">
          <el-table
          :key="tableKey"
          v-loading="listOpenDoorLogLoading"
          :data="openDoorLogList"
          border
          fit
          highlight-current-row
          style="width: 99%;height: 100%;"
          @sort-change="sortChange"
        >
        
        <el-table-column label="小区号" prop="neighNo" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.neighNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="卡号" prop="cardNo" align="center" width="140">
            <template slot-scope="{row}">
              <span>{{ row.cardNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="设备号" prop="deviceNo" align="center" width="100">
            <template slot-scope="{row}">
              <span>{{ row.deviceNo }}</span>
            </template>
          </el-table-column>
          <el-table-column label="出入" prop="isUnlock" align="center" width="60">
            <template slot-scope="{row}">
              <span v-if="row.isUnlock == 2" >进门</span>
              <span v-if="row.isUnlock == 4" >出门</span>
            </template>
          </el-table-column>
          <el-table-column label="刷卡时间" prop="openDoorTime" align="center" width="150">
            <template slot-scope="{row}">
              <span>{{ row.openDoorTime }}</span>
            </template>
          </el-table-column>
            <el-table-column label="创建时间" align="center" width="150px">
              <template slot-scope="{row}">
                <span>{{ row.createTime }}</span>
              </template>
            </el-table-column>
            <!-- <el-table-column label="更新时间" align="center" width="140px">
              <template slot-scope="{row}">
                <span>{{ row.updateTime }}</span>
              </template>
            </el-table-column>   -->
          
          </el-table>

      </el-dialog>

    </div>
  </template>
  
  <script>
  import { qrCodeServiceList} from '@/api/visit/qr-code-service'
  import { openDoorLog} from '@/api/visit/open-door-log'
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
        openDoorLogList:null,
        openDoorLogFormVisible:false,
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
        qrCodeServiceList(this.listQuery).then(response => {
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

    openDoorLog(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.openDoorLogFormVisible = true
        openDoorLog(row.cardNo).then(response => {
          this.openDoorLogList = response.data.openDoorLogList
          setTimeout(() => {
            this.listOpenDoorLogLoading = false
          }, 1.5 * 1000)
        })
    },

    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['项目名称','通行码','客户编号','客户名称','访客姓名','车牌号' ,'创建时间','更新时间']
        const filterVal = ['proName','randNum','cstCode','cstName','visitName','carNum','createTime','updateTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: '访客记录'
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
  
  