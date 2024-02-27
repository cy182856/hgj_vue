<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-input v-model="listQuery.companyCode" placeholder="公司代码" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
      <el-input v-model="listQuery.projectCode" placeholder="项目代码" style="width: 150px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.filesCode" placeholder="文件编号" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.fileName" placeholder="文件名称" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />

      <!-- <el-select v-model="listQuery.importance" placeholder="Imp" clearable style="width: 90px" class="filter-item">
        <el-option v-for="item in importanceOptions" :key="item" :label="item" :value="item" />
      </el-select> -->
      <!-- <el-select v-model="listQuery.type" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="item in calendarTypeOptions" :key="item.key" :label="item.display_name+'('+item.key+')'" :value="item.key" />
      </el-select>
      <el-select v-model="listQuery.sort" style="width: 140px" class="filter-item" @change="handleFilter">
        <el-option v-for="item in sortOptions" :key="item.key" :label="item.label" :value="item.key" />
      </el-select> -->
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
      <!-- <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="excelExport">
        Export
      </el-button> -->
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        导出
      </el-button>
      <!-- <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox> -->
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
      <el-table-column label="公司代码" prop="code" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.companyCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="入档日期" align="center" width="160px">
        <template slot-scope="{row}">
          <span>{{ row.fileDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目代码" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.projectCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="所属部门" prop="name" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.affDept }}</span>
        </template>
      </el-table-column>
      <el-table-column label="档案类型代码" prop="name" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.archiveTypeCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户楼层" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.tenantFloor }}</span>
        </template>
      </el-table-column>
      <el-table-column label="租户单元" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.tenantUnit }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放柜号" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.depositCabinetNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放层数" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.depositNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放盒号" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.depositBoxNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件编号" prop="name" align="center" width="200">
        <template slot-scope="{row}">
          <span>{{ row.filesCode }}</span>
          <!-- <span>{{ row.companyCode }}/{{ row.projectCode }}/{{ row.affDept }}/{{ row.archiveTypeCode }}/{{ row.tenantFloor }}/{{ row.tenantUnit }}</span> -->
        </template>
      </el-table-column>
      <el-table-column label="文件名称" prop="name" align="center" width="300">
        <template slot-scope="{row}">
          <span>{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放位置号" prop="name" align="center" width="140">
        <template slot-scope="{row}">
          <span>{{ row.positionNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件数量" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.fileNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原件份数" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.scriptNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="原件页数" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.scriptPage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复印件份数" prop="name" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.copyNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="复印件页数" prop="name" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.copyPage }}</span>
        </template>
      </el-table-column>
      <el-table-column label="文件密级" prop="name" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.fileSecLevel }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同开始日" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.contractStartDate }}</span>
        </template>
      </el-table-column>
      <el-table-column label="合同结束日" align="center" width="100px">
        <template slot-scope="{row}">
          <span>{{ row.contractEndDate }}</span>
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
          <el-button type="primary" size="mini" @click="handleUpload(row)">
            上传
          </el-button>
          <el-button type="primary" size="mini" @click="fileModeShow(row)">
            下载
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

        <el-form-item label="公司代码" prop="companyCode">
          <el-select v-model="temp.companyCode" placeholder="公司代码" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in companyOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="项目代码" prop="projectCode">
          <el-select v-model="temp.projectCode" placeholder="项目代码" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in projectInfoOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="所属部门" prop="affDept">
          <el-select v-model="temp.affDept" placeholder="所属部门" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in deptInfoOptions" :key="item.code" :label="item.name" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="档案类型代码" prop="archiveTypeCode">
          <el-select v-model="temp.archiveTypeCode" placeholder="档案类型代码" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in archiveTypeOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="租户楼层" prop="tenantFloor">
          <el-select v-model="temp.tenantFloor" placeholder="租户楼层" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in tenantFloorOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="租户单元" prop="tenantUnit">
          <el-select v-model="temp.tenantUnit" placeholder="租户单元" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in tenantUnitOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="存放柜号" prop="depositCabinetNum">
          <el-select v-model="temp.depositCabinetNum" placeholder="存放柜号" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in depositCabinetOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="存放层数" prop="depositNum">
          <el-select v-model="temp.depositNum" placeholder="存放层数" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in depositNumOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="存放盒号" prop="depositBoxNum">
          <el-select v-model="temp.depositBoxNum" placeholder="存放盒号" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in depositBoxNumOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="原件份数" prop="scriptNum">
          <el-input v-model="temp.scriptNum" placeholder="原件份数" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="原件页数" prop="scriptPage">
          <el-input v-model="temp.scriptPage" placeholder="原件页数" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="复印件份数" prop="copyNum">
          <el-input v-model="temp.copyNum" placeholder="复印件份数" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="复印件页数" prop="copyPage">
          <el-input v-model="temp.copyPage" placeholder="复印件页数" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>

        <el-form-item label="文件密级" prop="fileSecLevel">
          <el-select v-model="temp.fileSecLevel" placeholder="文件密级" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in depositFileSecLevelOptions" :key="item.code" :label="item.code" :value="item.code" />
          </el-select>
        </el-form-item>

        <el-form-item label="合同开始日" prop="contractStartDate">
          <el-date-picker value-format="yyyy-MM-dd" style="width: 300px" class="filter-item"
            v-model="temp.contractStartDate"
            type="date"
            placeholder="选择日期">
          </el-date-picker>
        </el-form-item>

        <el-form-item label="合同结束日" prop="contractEndDate">
          <el-date-picker value-format="yyyy-MM-dd" style="width: 300px" class="filter-item"
            v-model="temp.contractEndDate"
            type="date"
            placeholder="选择日期">
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

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table :data="pvData" border fit highlight-current-row style="width: 100%">
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false">Confirm</el-button>
      </span>
    </el-dialog>

    <!-- 文件上传框 -->
    <el-dialog :title="Upload" :visible.sync="uploadMode">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; height: 100%; margin-left:60px;">
      <el-upload
      :limit="1"
      class="upload-demo"
      ref="upload"
      action
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :file-list="fileList"
      :auto-upload="false"
      :http-request="UploadSubmit"
    >
      <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
      <el-button
        style="margin-left: 10px"
        size="small"
        type="success"
        @click="submitUpload"
        >上传到服务器</el-button
      >
      <el-input v-model="dirNum" style="width: 150px;margin-left: 20px; height:50px;" placeholder="请输入目录序号"></el-input>
      <div slot="tip" class="el-upload__tip">
        请上传10M以内的文件！
      </div>
    </el-upload>

    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button @click="uploadMode = false">
          取消
      </el-button>
    </div>
    </el-dialog>

<!-- 附件列表框 -->
<el-dialog :title="Down" :visible.sync="fileMode">
  <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="fileModeList"
      border
      fit
      highlight-current-row
      style="width: 100%;height: 100%;"
      @sort-change="sortChange">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px; height: 100%; margin-left:60px;">
      <el-table-column label="操作" align="center"  class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="fileDown(row)">
            下载
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="deleteFile(row,$index)">
            删除
          </el-button>
        </template>
      </el-table-column>
      <!-- <el-table-column label="编号" prop="fileId" align="center" width="0">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="文件名" prop="fileName" align="center" width="0">
        <template slot-scope="{row}">
          <span>{{ row.fileName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="目录序号" prop="fileName" align="center" width="0">
        <template slot-scope="{row}">
          <span>{{ row.dirNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="存放位置号" prop="fileName" align="center" width="0">
        <template slot-scope="{row}">
          <span>{{ row.positionNum }}</span>
        </template>
      </el-table-column>
    </el-form>
  </el-table>
</el-dialog>
  </div>
</template>

<script>
import { sumInfoList, fetchPv, saveSumInfo, updateSumInfo, deleteSumInfo } from '@/api/sum/sum-info'
import { companySelect } from '@/api/master/company'
import { projectInfoSelect } from '@/api/master/project-info'
import { deptInfoSelect } from '@/api/master/dept-info'
import { archiveTypeSelect } from '@/api/master/archive-type'
import { projectFloorSelect } from '@/api/master/project-floor'
import { projectUnitSelect } from '@/api/master/project-unit'
import { archiveCabinetSelect } from '@/api/master/archive-cabinet'
import { archiveStoreySelect } from '@/api/master/archive-storey'
import { archiveBoxSelect } from '@/api/master/archive-box'
import { sumFileSelect } from '@/api/sum/sum-file'
import { fileSecLevelSelect } from '@/api/master/file-sec-level'
import { getToken, setToken, removeToken } from '@/utils/auth'

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import axios from 'axios'
import { url } from '@/utils/url'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination

const calendarTypeOptions = [
  { key: 'CN', display_name: 'China' },
  { key: 'US', display_name: 'USA' },
  { key: 'JP', display_name: 'Japan' },
  { key: 'EU', display_name: 'Eurozone' }
]

// arr to obj, such as { CN : "China", US : "USA" }
const calendarTypeKeyValue = calendarTypeOptions.reduce((acc, cur) => {
  acc[cur.key] = cur.display_name
  return acc
}, {})

export default {
  name: 'sum-info-list',
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
      dirNum:'',
      tableKey: 0,
      list: null,
      fileModeList: null,
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
      pickerOptions: {
          disabledDate(time) {
            return time.getTime() > Date.now();
          }      
      },
      contractStartDate:'',
      contractEndDate:'',
      sumId: null,
      fileList: [],
      importanceOptions: [1, 2, 3],
      companyOptions : null,
      projectInfoOptions : null,
      deptInfoOptions : null,
      archiveTypeOptions : null,
      tenantFloorOptions : null,
      tenantUnitOptions : null,
      depositCabinetOptions : null,
      depositNumOptions : null,
      depositBoxNumOptions : null,
      depositFileSecLevelOptions : null,
      calendarTypeOptions,
      sortOptions: [{ label: 'ID Ascending', key: '+id' }, { label: 'ID Descending', key: '-id' }],
      statusOptions: ['published', 'draft', 'deleted'],
      showReviewer: false,
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
      uploadMode: false,
      fileMode: false,
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
      sumInfoList(this.listQuery).then(response => {
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
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
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
      // 公司信息
      companySelect().then(response => {
        this.companyOptions = response.data.list
      })
      // 项目信息
      projectInfoSelect().then(response => {
        this.projectInfoOptions = response.data.list
      })
      // 部门信息
      deptInfoSelect().then(response => {
        this.deptInfoOptions = response.data.list
      })
      // 档案类型
      archiveTypeSelect().then(response => {
        this.archiveTypeOptions = response.data.list
      })
       // 租户楼层
       projectFloorSelect().then(response => {
        this.tenantFloorOptions = response.data.list
      })
      // 租户楼层
      projectUnitSelect().then(response => {
        this.tenantUnitOptions = response.data.list
      })
      // 存放柜号
      archiveCabinetSelect().then(response => {
        this.depositCabinetOptions = response.data.list
      })
      // 存放层数
      archiveStoreySelect().then(response => {
        this.depositNumOptions = response.data.list
      })
       // 存放盒号
       archiveBoxSelect().then(response => {
        this.depositBoxNumOptions = response.data.list
      })  
       // 文件密级
       fileSecLevelSelect().then(response => {
        this.depositFileSecLevelOptions = response.data.list
      })  
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    handleUpload(row){
      this.uploadMode = true
      this.sumId = row.id
    },
    fileModeShow(row){
      this.fileMode = true
      sumFileSelect(row.id).then(response => {
        this.fileModeList = response.data.list
      })

    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          // this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
          saveSumInfo(this.temp).then(() => {
            this.list.unshift(this.temp)
            this.dialogFormVisible = false
            this.$notify({
              title: 'Success',
              message: 'Created Successfully',
              type: 'success',
              duration: 2000          
            })
          })
        }
        //this.$router.go(0)
        window.location.reload()
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
          updateSumInfo(tempData).then(() => {
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

    // handleDelete(row, index) {
    //   deleteSumInfo(row.id).then(() =>{
    //     this.dialogFormVisible = false
    //   })
    //   this.$notify({
    //     title: 'Success',
    //     message: 'Delete Successfully',
    //     type: 'success',
    //     duration: 2000
    //   })
    //   this.list.splice(index, 1)
    // },

    handleDelete(row, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        deleteSumInfo(row.id,).then((res) => {
          if (res.code == 20000) {
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
          })
            this.list.splice(index, 1)
            } else {
              alert(res.msg);
            }
          });
        })
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },

    handleFetchPv(pv) {
      fetchPv(pv).then(response => {
        this.pvData = response.data.pvData
        this.dialogPvVisible = true
      })
    },
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['公司代码', '入档日期', '项目代码', '所属部门', '档案类型代码', '租户楼层', '租户单元', '存放柜号', '存放层数', '存放盒号', '文件编号', '存放位置号', '文件名称', '文件数量', '原件份数', '原件页数', '复印件份数', '复印件页数', '文件密级', '合同开始日', '合同结束日', '创建时间', '更新时间']
        const filterVal = ['companyCode', 'fileDate', 'projectCode', 'affDept', 'archiveTypeCode', 'tenantFloor', 'tenantUnit', 'depositCabinetNum', 'depositNum', 'depositBoxNum', 'filesCode', 'positionNum', 'fileName', 'fileNum', 'scriptNum', 'scriptPage', 'copyNum', 'copyPage', 'fileSecLevel', 'contractStartDate', 'contractEndDate', 'createTime', 'updateTime']
        const data = this.formatJson(filterVal)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
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
    UploadSubmit(param) {
      var file = param.file;
      if(file.size > 10000000){
        this.$notify({
          title: 'error',
          message: '上传文件不能超过10M！',
          type: 'error',
          duration: 3000          
        });
        return;
      }
      // console.log(param.file);
      var file_form = new FormData(); //获取上传表单（文件）
      file_form.append("file", file);
      axios({
        url: url + "/sum/info/file/upload",
        method: "POST",
        params:{
          sumId:this.sumId,
          dirNum:this.dirNum
        },
        // timeout: 200000,
         headers: {
          'X-Token': getToken()
         },
        data: file_form,
      })
        .then((res) => {
          if(res.data.code == 20000){
            window.location.reload();
          }
          console.log(res);
        })
        .catch((err) => {
          console.log(err);
        });
       
    },
    fileDown(row){
      axios({
        url: url + "/sum/info/file/download",
        method: "POST",
        params:{fileId:row.id},
        responseType: 'blob' // 表明返回服务器返回的数据类型
      }).then((response) => {
          // 获取文件名
          // let dispositionArr = dispositionStr.split(";");
          // let fileName = decodeURIComponent(dispositionArr[1]);
          // fileName = fileName.split("=")[1];
          var blob = new Blob([response.data], {
            // type: "application/file",
            type: "application/vnd.ms-excel;charset=utf-8"
          });
          // const  a = document.createElement("a");
          // a.download = row.fileName;
          // a.style.display = 'none';
          // a.href = URL.createObjectURL(blob);
          // document.body.appendChild(a);
          // a.click();
          // URL.revokeObjectURL(a.href);
          // document.body.removeChild(a);
          let url = window.URL.createObjectURL(blob);
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          aLink.href = url;
          aLink.setAttribute("download", row.fileName); // 下载的文件
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
        })
    },
    excelExport(){
          let aLink = document.createElement("a");
          aLink.style.display = "none";
          let sedUrl = url + "/sum/info/excel/download";
          aLink.href = sedUrl
          document.body.appendChild(aLink);
          aLink.click();
          document.body.removeChild(aLink);
          window.URL.revokeObjectURL(url);
     // window.open(url + "/sum/info/excel/download", '11111')
    },

    deleteFile(row, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        axios({
        url: url + "/sum/file/delete",
        method: "GET",
        params:{id:row.id},
        headers: {
          'X-Token': getToken()
         },
      }).then((res) => {
          if (res.data.code == 20000) {
            this.fileModeList.splice(index, 1)
            this.$notify({
              title: 'Success',
              message: 'Delete Successfully',
              type: 'success',
              duration: 2000
          })} else {
              alert(res.msg);
            }
          });
        })
        //取消删除
        .catch(() => {
          //alert('取消')
        });
    },

    // deleteFile(row,index){
    //   axios({
    //     url: url + "/sum/file/delete",
    //     method: "GET",
    //     params:{id:row.id},
    //     headers: {
    //       'X-Token': getToken()
    //      },
    //   }).then((response) => {
    //     this.$notify({
    //       title: 'Success',
    //       message: 'delete Successfully',
    //       type: 'success',
    //       duration: 2000          
    //     });
    //     this.fileModeList.splice(index, 1)
    //     })
    // },

    submitUpload() {
      this.$refs.upload.submit();
      // this.$notify({
      //     title: 'Success',
      //     message: 'Upload Successfully',
      //     type: 'success',
      //     duration: 2000          
      //   });
      //   window.location.reload();  
    },
    handleRemove(file, fileList) {
      console.log(file, fileList);
    },
    handlePreview(file) {
      console.log(file);
    },
    getSortClass: function(key) {
      const sort = this.listQuery.sort
      return sort === `+${key}` ? 'ascending' : 'descending'
    }
  }
}
</script>

<style>
    .is_show{
        display: none;
    }
</style>
