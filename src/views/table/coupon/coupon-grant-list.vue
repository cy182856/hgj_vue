<template>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="listQuery.range" placeholder="发送对象" clearable style="width: 150px" class="filter-item">
            <el-option label="客户" :value="1" />
            <el-option label="个人" :value="2" />
        </el-select>
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.title" placeholder="券名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-select v-model="listQuery.tagId" placeholder="选择标签" clearable style="width: 150px" class="filter-item">
            <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
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
        <el-table-column label="编号" prop="id" align="center" width="160px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="tagName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.tagName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="券名称" prop="title" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="发送对象" prop="range" align="center" width="100">
          <template slot-scope="{row}">
            <span v-if="row.range == 1">客户</span>
            <span v-if="row.range == 2">个人</span>
          </template>
        </el-table-column>
        <el-table-column label="分类" prop="typeName" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.typeName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总量" prop="couNum" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.couNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="可用数量" prop="expNum" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.expNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户编号" prop="cstCode" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.cstCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="150">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="微信号" prop="wxOpenId" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.wxOpenId }}</span>
          </template>
        </el-table-column>
        <el-table-column label="姓名" prop="userName" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.userName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="startTime" align="center" width="90">
          <template slot-scope="{row}">
            <span>{{ row.endTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="140px">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="140px">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    </div>
  </template>
  
  <script>
  import { couponGrantList, couponGrantSave, couponGrantUpdate, couponGrantDelete , couponGrantGrant} from '@/api/coupon/coupon-grant'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { tagSelect} from '@/api/tag/tag'

  
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
        tagOptions:null,
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
        grantFormVisible:false,
        menuTree: false,
        dialogStatus: '',
        grantStatus: '',
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
        downloadLoading: false

      }
    },
    created() {
      this.getList()
      this.getSelectList()
    },
    methods: {
      getList() {
        this.listLoading = false
        couponGrantList(this.listQuery).then(response => {
          this.list = response.data.pageInfo.list
          this.total = response.data.pageInfo.total
  
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      // 获取下拉菜单数据
      getSelectList(){    
        // 标签
        tagSelect().then(response => {
          this.tagOptions = response.data.list
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
  
      createData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
            this.temp.author = 'vue-element-admin'
            if(this.temp.title == null || this.temp.title == "" || this.temp.title == "undefined"){
              this.$notify({
                message: '标题不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
            }
            couponGrantSave(this.temp).then(() => {
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

      handleDelete(row, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          couponGrantDelete(row.id,).then((res) => {
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
  </style>
  @/api/gonggao/couponGrant
  