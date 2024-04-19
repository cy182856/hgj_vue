<template>
    <div class="app-container">
      <div class="filter-container">
        <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
        <el-select v-model="listQuery.projectNum" placeholder="项目" clearable style="width: 200px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.budName" placeholder="楼栋名称" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.unitNo" placeholder="单元" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.resName" placeholder="资源名称" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />  
        <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 5px;" @click="handleFilter">
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
        @selection-change="handleSelectionChange"
        ref="multipleTable"
        selection-type="checkbox"
      >
        <!-- <el-table-column type="selection" width="55" align="center" /> -->

        <el-table-column label="房屋编号" prop="id" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.id }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="项目号" prop="budCode" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.orgId }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="楼栋编码" prop="budCode" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.budCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户编号" prop="cstCode" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.cstCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="300">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼栋名称" prop="budName" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.budName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源编码" prop="resCode" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.resCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源名称" prop="resName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.resName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源号" prop="resNo" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.resNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="单元" prop="unitNo" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.unitNo }}</span>
          </template>
        </el-table-column>
        <el-table-column label="建筑面积" prop="budArea" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.budArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼层名称" prop="houseFloor" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.houseFloor }}</span>
          </template>
        </el-table-column>
        <el-table-column label="楼层" prop="floorNum" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.floorNum }}</span>
          </template>
        </el-table-column>
        <el-table-column label="出租面积" prop="rentalArea" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.rentalArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="收费面积" prop="feeArea" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.feeArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="使用面积" prop="useArea" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.useArea }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源类型" prop="resType" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.resType }}</span>
          </template>
        </el-table-column>
        <el-table-column label="产权归属" prop="porpUser" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.porpUser }}</span>
          </template>
        </el-table-column>
        <el-table-column label="租赁状态" prop="rentStatus" align="center" width="130">
          <template slot-scope="{row}">
            <span>{{ row.rentStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="资源状态" prop="resStatus" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.resStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="维修状态" prop="decoStatus" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.decoStatus }}</span>
          </template>
        </el-table-column>
        <el-table-column label="财务状态" prop="finStatus" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.finStatus }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="有效性" prop="isAffect" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.isAffect }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="入住状况" prop="status" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.status }}</span>
          </template>
        </el-table-column>
        <el-table-column label="服务状态" prop="serStatus" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.serStatus }}</span>
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
        <!-- <el-table-column label="操作" align="center" width="180" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="createQrCode(row,$index)">
            生成二维码
          </el-button>
        </template>
      </el-table-column> -->
        <!-- <el-table-column label="操作" align="center" width="80" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="handleUpdate(row)">
              编辑
            </el-button>
            <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

      <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
        <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
          <el-table-column prop="key" label="Channel" />
          <el-table-column prop="pv" label="Pv" />
        </el-table>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
        </span>
      </el-dialog>

      <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <div align="center">
        <img :src = imgUrl />
      </div>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    </div>
  </template>
  
  <script>
  import { houseList, createQrCode} from '@/api/house/house'
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
        houseList(this.listQuery).then(response => {
          this.list = response.data.pageInfo.list
          this.total = response.data.pageInfo.total
  
          // Just to simulate the time of the request
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },

      createQrCode(row) {
      this.imgUrl = null;
      this.dialogFormVisible = true
      createQrCode(row).then(response => {
        this.imgUrl = response.data.imgUrl
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
  
  