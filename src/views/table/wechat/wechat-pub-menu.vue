<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="菜单名称" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
      <el-select v-model="listQuery.wechatPubId" placeholder="选择公众号" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in wechatPubOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">
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
      <el-table-column label="公众号" prop="wechatPubName" align="center" width="150px">
        <template slot-scope="{row}">
          <span>{{ row.wechatPubName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="type" prop="type" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.type }}</span>
        </template>
      </el-table-column>
      <el-table-column label="菜单名称" prop="name" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
        </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' label="url" prop="url" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.url }}</span>
        </template>
      </el-table-column>
      <el-table-column label="media_id" prop="media_id" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.media_id }}</span>
        </template>
      </el-table-column>
      <el-table-column label="appid" prop="appid" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.appid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="pagepath" prop="pagepath" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.pagepath }}</span>
        </template>
      </el-table-column>
      <el-table-column label="排序" prop="sort" align="center" width="50">
        <template slot-scope="{row}">
          <span>{{ row.sort }}</span>
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

        <el-form-item label="公众号" prop="wechatPubId">
          <el-select v-model="temp.wechatPubId" placeholder="选择公众号" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in wechatPubOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>
        </el-form-item>

        <el-form-item label="上级菜单" prop="parentId">
          <el-select v-model="temp.parentId" placeholder="选择上级菜单" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in wechatPubMenuOptions" :key="item.id" :label="item.name" :value="item.id" />
          </el-select>(如果是主菜单可不选)
        </el-form-item>

        <el-form-item label="类型" prop="type">
          <el-select v-model="temp.type" placeholder="类型" clearable style="width: 300px" class="filter-item">
            <el-option value="view" />
            <el-option value="miniprogram" />
          </el-select>
        </el-form-item>

        <el-form-item label="菜单名称" prop="name">
          <el-input v-model="temp.name" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="key" prop="key">
          <el-input v-model="temp.key" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="url" prop="url">
          <el-input v-model="temp.url" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="media_id" prop="media_id">
          <el-input v-model="temp.media_id" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="appid" prop="appid">
          <el-input v-model="temp.appid" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="pagepath" prop="pagepath">
          <el-input v-model="temp.pagepath" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="排序" prop="sort">
          <el-input v-model="temp.sort" placeholder="" clearable style="width: 300px" class="filter-item"></el-input>
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
import { wechatPubMenuList, wechatPubMenuSave , wechatPubSelect, wechatPubMenuSelect } from '@/api/wechat/wechat-pub'

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
      wechatPubOptions:null,
      wechatPubMenuOptions:null,
      serchRoleOptions:null,
      readonly: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 10,
        name: '',
        type: ''
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
        wechatPubId: [{ required: true, message: 'wechatPubId is required', trigger: 'change' }],             
        type: [{ required: true, message: 'type is required', trigger: 'change' }],
        name: [{ required: true, message: 'name is required', trigger: 'change' }],
        timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
        title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      },
      downloadLoading: false,
    }
  },
  created() {
    this.getList();
    this.getSelectList();
  },
 
  methods: {
    getList() {
      this.listLoading = false
      wechatPubMenuList(this.listQuery).then(response => {
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
      // 清空已选择公众号
      // this.wechatPubId = null;
      // 获取公众号
      wechatPubSelect().then(response => {
        this.wechatPubOptions = response.data.list;
      }) 
       // 获取公众号菜单
      wechatPubMenuSelect().then(response => {
        this.wechatPubMenuOptions = response.data.list;
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
          wechatPubMenuSave(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.getList();
            this.getSelectList();
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
          wechatPubMenuSave(tempData).then(() => {
            const index = this.list.findIndex(v => v.id === this.temp.id)
            this.list.splice(index, 1, this.temp)
            this.dialogFormVisible = false
            this.getList();
            this.getSelectList();
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
