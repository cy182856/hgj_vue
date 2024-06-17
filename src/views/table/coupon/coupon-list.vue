<template>
    <div class="app-container">
      <div class="filter-container">
        <el-input v-model="listQuery.title" placeholder="标题" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
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
        <el-table-column label="编号" prop="id" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标题" prop="title" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="小时" prop="hour" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.hour }}</span>
          </template>
        </el-table-column>
        <el-table-column label="是否有效" prop="isExp" align="center" width="120">
          <template slot-scope="{row}">
            <span v-if="row.isExp == 0">是</span>
            <span v-if="row.isExp == 1">否</span>
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
        <el-table-column label="操作" align="center" width="300" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button type="primary" size="mini" @click="grantUpdate(row)">
              发放
            </el-button>
            <el-button type="primary" size="mini" @click="grantBatch(row)">
              批次
            </el-button>
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
          <el-form-item label="类型" prop="title">
            <el-input v-model="temp.title" placeholder="标题" clearable style="width: 300px" class="filter-item"></el-input>
          </el-form-item>
          <el-form-item label="小时" prop="hour">
            <el-input v-model="temp.hour" placeholder="小时" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>
          <!-- <el-date-picker
            v-model="temp.startTime"
            type="date"
            size="large"
            placeholder="选择日期">
        </el-date-picker> -->
          <el-form-item label="是否有效" prop="isExp">
          <el-select v-model="temp.isExp" placeholder="是否有效" clearable style="width: 300px" class="filter-item">
            <el-option label="是" :value="0" />
            <el-option label="否" :value="1" />
          </el-select>
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

      <el-dialog :title="textMap[grantStatus]" :visible.sync="grantFormVisible">
        <el-form ref="grantDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
          <el-form-item class="is_show" label="id" prop="id">
            <el-input v-model="temp.id" />
          </el-form-item>
          <el-form-item label="选择标签" prop="name">
          <el-select v-model="temp.tagId" placeholder="选择标签" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
          </el-form-item>          
        <el-form-item label="开始时间" prop="startTime">
          <el-input v-model="temp.startTime" placeholder="开始时间" clearable style="width: 300px" class="filter-item"></el-input><span>（格式：2024-01-01）</span>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-input v-model="temp.endTime" placeholder="结束时间" clearable style="width: 300px" class="filter-item"></el-input><span>（格式：2024-01-01）</span>
        </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="grantPreview(row)">
            预览
          </el-button>
          <el-button @click="grantFormVisible = false">
            取消
          </el-button>
          <el-button type="primary" @click="grantStatus==='create'?createData():couponGrant()">
            提交
          </el-button>
        </div>
      </el-dialog>

      <el-dialog :title="textMap[grantPreviewStatus]" :visible.sync="grantPreviewFormVisible">
        <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="cstList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        >
          <el-table-column label="编号" prop="cstCode" align="center" width="150" >
            <template slot-scope="{row}">
              <span>{{row.cstCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="名称" prop="cstName" align="center" width="" >
            <template slot-scope="{row}">
              <span>{{row.cstName}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">        
          <el-button @click="grantPreviewFormVisible = false">
            取消
          </el-button>
        </div>
      </el-dialog>

      <el-dialog :title="textMap[grantBatchStatus]" :visible.sync="grantBatchFormVisible">
        <el-table
        :key="tableKey"
        v-loading="listBatchLoading"
        :data="grantBatchList"
        border
        fit
        highlight-current-row
        style="width: 200%;"
        @sort-change="sortChange"
      >
        <el-table-column label="编号" prop="id" align="center" width="180px">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <el-table-column label="券名称" prop="title" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.title }}</span>
          </template>
        </el-table-column>
        <el-table-column label="标签" prop="name" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.name }}</span>
          </template>
        </el-table-column>
        <el-table-column label="开始时间" prop="startTime" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="结束时间" prop="endTime" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.endTime }}</span>
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
        <el-table-column label="操作" align="center" width="100" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="batchDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      </el-dialog>


    </div>
  </template>
  
  <script>
  import { couponList, couponSave, couponUpdate, couponDelete , couponGrant, couponBatchList, batchDelete} from '@/api/coupon/coupon'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { tagSelect, selectCstList} from '@/api/tag/tag'

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
        grantBatchList:null,
        cstList:null,
        total: 0,
        listLoading: true,
        listBatchLoading: false,
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
        grantPreviewFormVisible:false,
        grantBatchFormVisible:false,
        menuTree: false,
        dialogStatus: '',
        grantStatus: '',
        grantPreviewStatus: '',
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
        couponList(this.listQuery).then(response => {
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
            couponSave(this.temp).then(() => {
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
      grantUpdate(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.grantStatus = 'update'
        this.grantFormVisible = true
        this.$nextTick(() => {
          this.$refs['grantDataForm'].clearValidate()
        })
        this.getList()
      },
      grantBatch(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.grantBatchFormVisible = true
        couponBatchList(row.id).then(response => {
          this.grantBatchList = response.data.list
          setTimeout(() => {
            this.listBatchLoading = false
          }, 1.5 * 1000)
        })
      },
      grantPreview(row) { 
        var tagId = this.temp.tagId;
        this.grantPreviewStatus = 'update'
        this.grantPreviewFormVisible = true   
        this.cstList = null;     
        selectCstList(tagId).then(response => {
          this.cstList = response.data.list
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      updateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            couponUpdate(tempData).then(() => {
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
  
      grantUpdateData() {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
            couponUpdate(tempData).then(() => {
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

      couponGrant() {
        this.$refs['grantDataForm'].validate((valid) => {
          if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            couponGrant(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.grantFormVisible = false
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
          couponDelete(row.id,).then((res) => {
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

      batchDelete(row, index) {
        this.$confirm('确认删除?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          batchDelete(row.id,).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Delete Successfully',
                type: 'success',
                duration: 2000
            })
              this.grantBatchList.splice(index, 1)
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
  @/api/gonggao/coupon
  