<template>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.projectNum" placeholder="项目" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 200px; margin-left: 5px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
        <el-input v-model="listQuery.userName" placeholder="姓名" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
        <el-select v-model="listQuery.intoRole" placeholder="身份" clearable style="width: 200px" class="filter-item">
            <el-option label="客户" :value="0" />
            <el-option label="委托人" :value="1" />
            <el-option label="产权人" :value="2" />
            <el-option label="住户" :value="3" />
        </el-select>
        <el-select v-model="listQuery.intoStatus" placeholder="状态" clearable style="width: 200px; margin-left: 5px;" class="filter-item">
            <el-option label="未入住" :value="0" />
            <el-option label="已入住" :value="1" />
            <el-option label="已解绑" :value="2" />
            <el-option label="待审核" :value="3" />
        </el-select>
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
        <el-table-column label="编号" prop="id" align="center" width="150px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目名称" prop="projectName" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.projectName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="身份" prop="intoRole" align="center" width="100">
          <template slot-scope="{row}">
            <span v-if = "row.intoRole == 0">客户</span>
            <span v-if = "row.intoRole == 1">委托人</span>
            <span v-if = "row.intoRole == 2">产权人</span>
            <span v-if = "row.intoRole == 3">住户</span>
          </template>
        </el-table-column>
        <el-table-column label="状态" prop="intoStatus" align="center" width="100">
          <template slot-scope="{row}">
            <span v-if="row.intoStatus == 0 && (row.intoRole == 0 || row.intoRole == 2)">未入住</span>
            <span v-if="row.intoStatus == 1 && (row.intoRole == 0 || row.intoRole == 2)">已入住</span>
            <span v-if="row.intoStatus == 2 && (row.intoRole == 0 || row.intoRole == 2)">已解绑</span>

            <span v-if="row.houseIntoStatus == 0 && (row.intoRole == 1 || row.intoRole == 3)">未入住</span>
            <span v-if="row.houseIntoStatus == 1 && (row.intoRole == 1 || row.intoRole == 3)">已入住</span>
            <span v-if="row.houseIntoStatus == 2 && (row.intoRole == 1 || row.intoRole == 3)">已解绑</span>   
            <span v-if="row.houseIntoStatus == 3 && (row.intoRole == 1 || row.intoRole == 3)">待审核</span>
        
          </template>
        </el-table-column>
        <el-table-column label="房间号" prop="resName" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.resName }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="入住状态" prop="resName" align="center" width="150">
          <template slot-scope="{row}">
            <span v-if = "row.intoStatus == 0">未入住</span>
            <span v-if = "row.intoStatus == 1">已入住</span>
            <span v-if = "row.intoStatus == 2">已解绑</span>
            <span v-if = "row.intoStatus == 3">待审核</span>
          </template>
        </el-table-column>
        <el-table-column label="房间状态" prop="resName" align="center" width="150">
          <template slot-scope="{row}">
            <span v-if = "row.houseIntoStatus == 0">未入住</span>
            <span v-if = "row.houseIntoStatus == 1">已入住</span>
            <span v-if = "row.houseIntoStatus == 2">已解绑</span>
            <span v-if = "row.houseIntoStatus == 3">待审核</span>
          </template>
        </el-table-column> -->
        <el-table-column label="创建时间" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.intoStatus == 1 && (row.houseIntoStatus == 1 || row.houseIntoStatus == 3 || row.houseIntoStatus == null) " size="mini" type="danger" @click="handleDelete(row,$index)">
              解除绑定
            </el-button>
            <el-button v-if="row.intoStatus == 1 && (row.houseIntoStatus == 1 || row.houseIntoStatus == null) && row.intoRole == 1" size="mini" type="primary" @click="handleOwner(row,$index)">
              设为客户
            </el-button>
            <el-button v-if="row.intoStatus == 1 && (row.houseIntoStatus == 1 || row.houseIntoStatus == null) && row.intoRole == 3" size="mini" type="primary" @click="handleOwner(row,$index)">
              设为业主
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </template>
  
  <script>
  import { cstIntoList, deleteCstInto, ownerCstInto } from '@/api/cstInto/cstInto'
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
        cstIntoList(this.listQuery).then(response => {
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
     
      handleDelete(row, index) {
        this.$confirm('确认解除绑定吗?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          deleteCstInto(row.id,row.cstIntoHouseId).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
              this.list.splice(index, 1)
              this.getList();
              } else {
                this.$notify({
                  message: res.data.message,
                  type: 'error',
                  duration: 2000          
                })
              }
            });
          })
          //取消
          .catch(() => {
            //alert('取消')
          });
      },

      handleOwner(row, index) {
        this.$confirm('确认设为业主吗?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          ownerCstInto(row.id).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
              this.list.splice(index, 1)
              this.getList();
              } else {
                this.$notify({
                  message: res.data.message,
                  type: 'error',
                  duration: 2000          
                })
              }
            });
          })
          //取消
          .catch(() => {
            //alert('取消')
          });
      },
   
    }
  }
  </script>
  
 
  
  