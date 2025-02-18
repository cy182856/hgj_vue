<template>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.proNum" placeholder="项目" clearable style="width: 200px" class="filter-item">
              <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.cstName" placeholder="客户" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
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
        <!-- <el-table-column label="编号" prop="id" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="项目号" prop="proNum" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.proNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名" prop="proName" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.proName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="feedbackDesc" align="center" width="200">
          <template slot-scope="{row}">
            <span>{{ row.feedbackDesc }}</span>
          </template>
        </el-table-column>
        <el-table-column label="图片" prop="fileList" align="center" width="520"> 
          <template v-if="row.fileList != null" slot-scope="{ row }">
            <img v-for="(image, index) in row.fileList" :key="index" :src="image" alt="Base64 Image" height="150" width="150"/>  
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
        <el-table-column label="电话" prop="cstPhone" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.cstPhone }}</span>
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
        <!-- <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="gonggaoView(row)">
              查看
            </el-button>          
          </template>
        </el-table-column> -->
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </div>
  </template>
  
  <script>
  import { feedbackList } from '@/api/feedback/feedback'
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
        gonggaoTypes:null,
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
      }
    },
    created() {
      this.getList()
      this.getSelectList()
    },
    methods: {
      getList() {
        this.listLoading = false
        feedbackList(this.listQuery).then(response => {
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
      handleCreate() {
        this.resetTemp()
        this.dialogStatus = 'create'
        this.dialogFormVisible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].clearValidate()
        })
      },
  
       // 获取下拉菜单数据
       getSelectList(){
        // 项目
        projectSelect().then(response => {
          this.projectOptions = response.data.list
        })  
      },
     
      gonggaoView(row, index){
        window.open(row.url, "_blank");
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
  </style>
  