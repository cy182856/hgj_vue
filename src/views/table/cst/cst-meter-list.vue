<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.userId" placeholder="电表客户编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
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
    >
      
      <el-table-column label="客户编号" prop="cstCode" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.cstCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="cstName" align="center" width="280">
        <template slot-scope="{row}">
          <span>{{ row.cstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电表客户编号" prop="userId" align="center" width="120px">
        <template slot-scope="{row}">
          <span>{{ row.userId }}</span>
        </template>
      </el-table-column>
      <el-table-column label="电表开户日期" prop="accountDate" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.accountDate }}</span>
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
          <el-button type="primary" size="mini" @click="handleCreate(row)">
            新增
          </el-button>
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
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
        <el-form-item label="电表客户编号" prop="userId">
          <el-input v-model="temp.userId" placeholder="电表客户编号" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="电表开户日期" prop="startTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px"
              class="filter-item"
              v-model="temp.accountDate"
              type="date"
              placeholder="电表开户日期"
              >
            </el-date-picker>
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
import { cstMeterList, saveCstMeter, deleteCstMeter } from '@/api/cst/cst-meter'
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
      cstMeterList(this.listQuery).then(response => {
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
    handleCreate(row) {
      // this.resetTemp()
      // this.dialogStatus = 'create'
      // this.dialogFormVisible = true
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].clearValidate()
      // })

      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.temp.id = null;
      this.temp.userId = null;
      this.temp.accountDate = null;
      this.dialogStatus = 'update'
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
          if(this.temp.userId == null || this.temp.userId == "" || this.temp.userId == "undefined"){
            this.$notify({
              message: '电表客户编号不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.accountDate == null || this.temp.accountDate == "" || this.temp.accountDate == "undefined"){
            this.$notify({
              message: '电表开户日期不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.cstCode == null || this.temp.cstCode == "" || this.temp.cstCode == "undefined"){
            this.$notify({
              message: '客户不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          saveCstMeter(this.temp).then(() => {
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
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if(this.temp.userId == null || this.temp.userId == "" || this.temp.userId == "undefined"){
            this.$notify({
              message: '电表客户编号不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.accountDate == null || this.temp.accountDate == "" || this.temp.accountDate == "undefined"){
            this.$notify({
              message: '电表开户日期不能为空',
              type: 'error',
              duration: 2000          
            })
            return
          }
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          saveCstMeter(tempData).then(() => {
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

    handleDelete(row, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteCstMeter(row.id,).then((res) => {
          if (res.code == 20000) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
          })
           // this.list.splice(index, 1)
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
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },
 
  }
}
</script>

<style scoped>
.is_show{
    display: none;
  }
</style>


