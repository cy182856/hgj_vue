<template>
  <div class="app-container">
    <div class="filter-container">
      <el-select v-model="listQuery.proNum" placeholder="项目" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
      </el-select>
      <el-input v-model="listQuery.name" placeholder="公众号名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
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
      <el-table-column label="编号" prop="id" align="center" width="50px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目号" prop="proNum" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.proNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目名称" prop="name" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.proName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="公众号名称" prop="name" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appId" prop="appId" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.appId }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="appSecret" prop="appId" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.appSecret }}</span>
        </template>
      </el-table-column> -->
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
      <el-table-column label="操作" align="center" width="200" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
        <el-form-item class="is_show" label="id" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        <el-form-item label="项目号" prop="proNum">
          <el-input v-model="temp.proNum" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="项目名称" prop="proName">
          <el-input v-model="temp.proName" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="公众号名称" prop="name">
          <el-input v-model="temp.name" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="appId" prop="appId">
          <el-input v-model="temp.appId" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="appSecret" prop="appSecret">
          <el-input v-model="temp.appSecret" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
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
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { wechatPubList, wechatPubSave } from '@/api/wechat/wechat-pub'
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
      roleOptions:null,
      serchRoleOptions:null,
      projectOptions:null,
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
        proNum: [{ required: true, message: 'proNum is required', trigger: 'change' }],
        proName: [{ required: true, message: 'proName is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        appId: [{ required: true, message: 'appId is required', trigger: 'change' }],
        appSecret: [{ required: true, message: 'appSecret is required', trigger: 'change' }],
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
      wechatPubList(this.listQuery).then(response => {
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
      // 项目
      projectSelect().then(response => {
        this.projectOptions = response.data.list
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
          if(this.temp.name == null || this.temp.name == "" || this.temp.name == "undefined"){
            this.$notify({
              message: '名称不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          wechatPubSave(this.temp).then(() => {
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
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          if(this.temp.name == null || this.temp.name == "" || this.temp.name == "undefined"){
            this.$notify({
              message: '名称不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          wechatPubSave(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList()
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
@/api/gonggao/gonggaoType
