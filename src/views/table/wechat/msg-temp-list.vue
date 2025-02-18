<template>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.proNum" placeholder="项目" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-select v-model="listQuery.status" placeholder="状态" clearable style="width: 140px;" class="filter-item">
            <el-option label="关闭" :value="1" />
            <el-option label="开启" :value="0" />
        </el-select>
        <el-input v-model="listQuery.description" placeholder="描述" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
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
      
        <el-table-column label="项目" prop="proName" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.proName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模版key" prop="templateKey" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.templateKey }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模版ID" prop="templateId" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.templateId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="模版DATA" prop="templateData" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.templateData }}</span>
          </template>
        </el-table-column>
       
        <el-table-column label="状态" prop="status" align="center" width="80">
          <template slot-scope="{row}">
            <span v-if="row.status == 0">开启</span>
            <span v-if="row.status == 1">关闭</span>
          </template>
        </el-table-column>
        <el-table-column label="描述" prop="description" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.description }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.status == 0" size="mini" type="danger" @click="closeMsg(row,$index)">
              关闭
            </el-button>
            <el-button v-if="row.status == 1" size="mini" type="primary" @click="openMsg(row,$index)">
              开启
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </template>
  
  <script>
  import { wechatPubMsgTempList, closeMsg, openMsg } from '@/api/wechat/wechat-pub'
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
        wechatPubMsgTempList(this.listQuery).then(response => {
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

      closeMsg(row, index) {
        this.$confirm('确认关闭吗?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
            closeMsg(row.id).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
              //this.list.splice(index, 1)
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
     
      openMsg(row, index) {
        this.$confirm('确认开启吗?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
            openMsg(row.id).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
              //this.list.splice(index, 1)
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
  
 
  
  