<template>
  <div class="app-container">
    <div class="filter-container">
      <!-- <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery.orgId" placeholder="项目" clearable style="width: 160px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
      </el-select>
      <el-input v-model="listQuery.code" placeholder="客户编号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.cstTag" placeholder="客户标签" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-input v-model="listQuery.resName" placeholder="房间号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <!-- <el-input v-model="listQuery.cerNo" placeholder="证件号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <!-- <el-input v-model="listQuery.licNo" placeholder="执照号码" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" /> -->
      <el-select v-model="listQuery.intoStatus" placeholder="注册状态" clearable style="width: 160px;" class="filter-item">
          <el-option label="未注册" :value="99" />
          <el-option label="已注册" :value="1" />
      </el-select>
      <el-select v-model="listQuery.cardType" placeholder="卡类型" clearable style="width: 160px" class="filter-item">
          <el-option v-for="item in cardTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
      </el-select>
      <el-select v-model="listQuery.sendCardStatus" placeholder="是否发卡" clearable style="width: 160px;" class="filter-item">
          <el-option label="是" :value="1" />
          <el-option label="否" :value="0" />
      </el-select>
      <el-input v-model="listQuery.cardCode" placeholder="卡号" style="width: 160px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" style="margin-left: 5px;" @click="handleFilter">
        查询
      </el-button>

      <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="" @click="sendCardByCstCreateModel()">
        卡批量操作
      </el-button>

    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      @selection-change="handleSelectionChange"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >

      <el-table-column type="selection" width="55" align="center" />

      <el-table-column label="项目" prop="projectName" align="center" width="130">
        <template slot-scope="{row}">
          <span>{{ row.projectName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户编码" prop="code" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.code }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column label="客户类型" prop="cstType" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.cstType }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="客户名称" prop="cstName" align="center" width="150">
        <template slot-scope="{row}">
          <span>{{ row.cstName }}</span>
        </template>
      </el-table-column>  
      <el-table-column label="注册状态" prop="cstIntoStatus" align="center" width="80">
        <template slot-scope="{row}">
          <span v-if="row.intoStatus == 0 ">未注册</span>
          <span v-if="row.intoStatus == 1 ">已注册</span>
        </template>
      </el-table-column>  
      <!-- <el-table-column :show-overflow-tooltip='true' label="房间号" prop="resName" align="center" width="120">
          <template slot-scope="{row}">
            <span v-for=" (val, key) in row.houseList" :key="key">
                  <span>{{ val }}&nbsp;&nbsp;</span>
              </span>          
          </template>
      </el-table-column> -->
      <el-table-column :show-overflow-tooltip='true' label="房间号" prop="resName" align="center" width="120">
          <template slot-scope="{row}">
            <span>{{ row.resName }}</span>          
          </template>
      </el-table-column>
      <!-- <el-table-column label="证件号码" prop="cerNo" align="center" width="160">
        <template slot-scope="{row}">
          <span>{{ row.cerNo }}</span>
        </template>
      </el-table-column>
      <el-table-column label="执照号码" prop="licNo" align="center" width="180">
        <template slot-scope="{row}">
          <span>{{ row.licNo }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="客户级别" prop="cstLevel" align="center" width="70">
        <template slot-scope="{row}">
          <span>{{ row.cstLevel }}</span>
        </template>
      </el-table-column>
      <!-- <el-table-column :show-overflow-tooltip='true' label="客户标签" prop="tagName" align="center" width="70">
        <template slot-scope="{row}">
          <span v-for=" (val, key) in row.tagList" :key="key">
                 {{ val.name }}&nbsp;&nbsp;
          </span>
        </template>
      </el-table-column> -->
      <el-table-column :show-overflow-tooltip='true' label="客户标签" prop="cstTag" align="center" width="100">
        <template slot-scope="{row}">
          <span>{{ row.cstTag }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡数量" prop="cardTotalNum" align="center" width="60">
          <template slot-scope="{row}">
            <span>{{ row.cardTotalNum }}</span>
          </template>
      </el-table-column>
      <el-table-column :show-overflow-tooltip='true' label="卡号" prop="cardCode" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.cardCode }}</span>
          </template>
      </el-table-column>
      <!-- <el-table-column label="有效性" prop="isAffect" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.isAffect }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="合同性质" prop="contractCharacter" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.contractCharacter }}</span>
        </template>
      </el-table-column> -->
      <!-- <el-table-column label="证件类型" prop="cerType" align="center" width="80">
        <template slot-scope="{row}">
          <span>{{ row.cerType }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="创建时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作" align="center" width="350" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="createIntoQrcode(row,$index)">
            生成入住二维码
          </el-button>
          <!-- <el-button type="primary" size="mini" @click="createQrCode(row,$index)">
            生成二维码
          </el-button> -->
          <el-button type="primary" size="mini"  @click="menuTreeCreate(row)">
            权限设置
          </el-button>
          <!-- <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            删除
          </el-button> -->
          <el-button v-if="row.orgId == '10000'" type="primary" size="mini" @click="createIntoStaffQrCode(row)">
            员工入住二维码
        </el-button>
        </template>
      </el-table-column>
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
        <img :src = imgUrl style="height: 300px;width: 350px;"/>
      </div>
      <div style="margin-left: 34%; font-size: 15px; width: 300px; font-weight: bold;">{{this.temp.cstName}}</div> 
      <div style="margin-left: 34%; font-size: 12px; margin-top: 10px;"><span style="font-weight: bold;">入住身份：</span>{{intoRole}}</div>    
      <div style="margin-left: 34%; font-size: 12px; width: 300px; margin-top: 10px;"><span style="font-weight: bold;">房间号：</span>{{houseList}}</div>  
      <div style="margin-left: 34%; font-size: 12px; margin-top: 10px;"><span style="font-weight: bold;">生成时间：</span>{{qrCreateTime}}</div>  
      <div style="margin-left: 34%; font-size: 12px; margin-top: 10px;"><span style="font-weight: bold;">有效截止时间：</span>{{qrCutOffTime}}</div> 
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="menuTree">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
        <el-row :gutter="30">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <span>菜单权限</span>
              <el-tree
                :data="webTreeData"
                show-checkbox
                node-key="id"
                ref="webTreeForm"
                :default-expanded-keys=webExpandedKeys
                :default-checked-keys=webCheckedKeys
                :props="defaultProps"
                @check="getCheckedNodes">
              </el-tree>
          </div>
          </el-col>
          <!-- <el-col :span="12">
            <div class="grid-content bg-purple">
              <span>账单权限</span>
              <el-tree
                :data="weComTreeData"
                show-checkbox
                node-key="id"
                ref="weComTreeForm"
                :default-expanded-keys=weComExpandedKeys
                :default-checked-keys=weComCheckedKeys
                :props="defaultProps"
                @check="getCheckedNodes">
              </el-tree>
            </div>
          </el-col> -->
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="menuTree = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='权限菜单'?createWebMenuData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
    <!-- 生成入住二维码 -->
    <el-dialog :title="textMap[createIntoQrCodeStatus]" :visible.sync="createIntoQrCodeFormVisible">
      <el-form ref="createIntoQrCodedataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item class="is_show" label="code" prop="code">
          <el-input v-model="temp.code" />
        </el-form-item>
        <el-form-item class="is_show" label="orgId" prop="orgId">
          <el-input v-model="temp.orgId" />
        </el-form-item>
        <div style="font-size: 18px; width: 500px;">{{ temp.cstName }}</div>
        <!-- <el-form-item style="margin-top: 20px;" label="入住身份">
          <div>
            <div v-for="intoTypeOption in intoTypeOptions" :key="intoTypeOption.intoTypeId" @change="cleanHouseOption()">
              <input
                type="radio"
                :id="intoTypeOption.intoTypeId"
                :value="intoTypeOption.intoTypeValue"
                v-model="selectedIntoOption"
              />
              <label :for="intoTypeOption.intoTypeId">{{ intoTypeOption.text }}</label>
            </div>
            <p>选中的是：{{ selectedIntoOption }}</p>
          </div>
        </el-form-item> -->

        <el-form-item style="margin-top: 20px;" label="入住身份">
          <div>
            <div v-for="intoTypeOption in identityOptions" :key="intoTypeOption.id" @change="cleanHouseOption()">
              <input
                type="radio"
                :id="intoTypeOption.id"
                :value="intoTypeOption.code"
                v-model="selectedIntoOption"
              />
              <label :for="intoTypeOption.id">{{ intoTypeOption.webDesc }}</label>
            </div>
            <!-- <p>选中的是：{{ selectedIntoOption }}</p> -->
          </div>
        </el-form-item>

        <el-form-item v-if="selectedIntoOption == 1 || selectedIntoOption == 3 || selectedIntoOption == 4" label="选择房屋" prop="resId">
          <el-select v-model="resId" placeholder="房屋" clearable multiple style="width: 328px" class="filter-item">
            <el-option v-for="item in resOptions" :key="item.id" :label="item.resName" :value="item.id" ></el-option>
          </el-select>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button v-if="selectedIntoOption !=null" type="primary" size="mini" @click="createIntoCstQrCode()">
            生成入住二维码
        </el-button>
        <el-button @click="createIntoQrCodeFormVisible = false">
          取消
        </el-button>
        <!-- <el-button type="primary" @click="createIntoQrCodeStatus==='create'?createIntoCstQrCode():updateData()">
          提交
        </el-button> -->
      </div>
    </el-dialog>

    <!-- 批量操作 -->
    <el-dialog :title="textMap[cardBulkOperationDialogStatus]" :visible.sync="cardBulkOperationDialogShow">
        <el-form ref="cardBulkOperationDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
          <el-form-item label="选择卡" prop="cardId">
            <el-select v-model="temp.cardId" placeholder="选择卡" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in cardOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>  

          <el-form-item style="margin-top: 20px;" label="卡操作">
            <el-radio-group v-model="temp.cardOption" class="radio-group">
              <el-radio :label=1>发卡</el-radio>
              <!-- <el-radio :label=2>禁用</el-radio>
              <el-radio :label=3>恢复</el-radio> -->
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item label="卡类型" prop="cardType">
          <el-select v-model="temp.cardType" placeholder="卡类型" clearable style="width: 300px;" class="filter-item">
            <el-option label="年卡" :value="1" />
            <el-option label="月卡" :value="2" />
          </el-select>
          </el-form-item> -->

          <!-- <el-form-item v-if="temp.cardOption == 1" label="次数/小时" prop="totalNum">
            <el-input v-model="temp.totalNum" placeholder="次数/小时" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>      -->

          <el-form-item v-if="temp.cardId == 1 && temp.cardOption == 1" label="有效年份" prop="expDate">
            <el-date-picker
              value-format="yyyy"
              style="width: 300px"
              class="filter-item"
              v-model="temp.expDate"
              type="year"
              placeholder="有效年份"
              >
            </el-date-picker>
          </el-form-item>

          <el-form-item v-if="temp.cardId == 2 && temp.cardOption == 1" label="有效月份" prop="expDate">
            <el-date-picker
              value-format="yyyy-MM"
              style="width: 300px"
              class="filter-item"
              v-model="temp.expDate"
              type="month"
              placeholder="有效月份"
              >
            </el-date-picker>
          </el-form-item>

          <!-- <el-form-item label="开始日期" prop="startTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px"
              class="filter-item"
              v-model="temp.startTime"
              type="date"
              placeholder="开始日期"
              >
            </el-date-picker>
          </el-form-item>

          <el-form-item label="结束日期" prop="endTime">
            <el-date-picker
              value-format="yyyy-MM-dd"
              style="width: 300px"
              class="filter-item"
              v-model="temp.endTime"
              type="date"
              placeholder="结束日期"
              >
            </el-date-picker>
          </el-form-item> -->

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cardBulkOperationDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="cardBulkOperationDialogStatus==='create'?cardBulkOperation():cardBulkOperation()">
            提交
          </el-button>
        </div>
      </el-dialog>


  </div>
</template>

<script>
import { cstList, createQrCode, createIntoCstQrCode, createIntoStaffQrCode, saveCstMenu } from '@/api/cst/cst'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { selectMenuMini } from '@/api/user/user-menu'
import { project } from '@/api/config/config'
import { houseSelect} from '@/api/house/house'
import { identitySelect, identitySelectByProNum } from '@/api/identity/identity'
import { cardSelect} from '@/api/card/card'
import { cardBulkOperation } from '@/api/card/card-cst'
import { cardTypeSelect} from '@/api/card/card-type'

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
      selectedIntoOption: null,
      // intoTypeOptions: [
      //   { intoTypeId: '1', intoTypeValue: '0', text: '租户(办公楼)' },
      //   { intoTypeId: '2', intoTypeValue: '1', text: '租户员工(办公楼)' },
      //   { intoTypeId: '3', intoTypeValue: '2', text: '产权人(住宅)' },
      //   { intoTypeId: '4', intoTypeValue: '3', text: '租客(住宅)' },
      //   { intoTypeId: '5', intoTypeValue: '4', text: '同住人(住宅)' },     
      // ],

      // 选中数组
      cstCodeList: [],
      // 非单个禁用
      single: true,
      // 非多个禁用
      multiple: true,
      cardBulkOperationDialogShow:false,
      cardOptions:null,
      webExpandedKeys:[],
      webCheckedKeys:[],
      selectedWebCheckedKeys:[],
      weComExpandedKeys:[],
      weComCheckedKeys:[],
      selectedWeComCheckedKeys:[],
      cardTypeOptions:null,
      identityOptions:null,
      roleOptions:null,
      projectOptions:null,
      serchRoleOptions:null,
      serchDeptNameOptions:null,
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
        code:'',
        importance: 1,
        remark: '',
        timestamp: new Date(),
        title: '',
        type: '',
        status: 'published'
      },
      //weComTreeData:[],
      dialogFormVisible: false,
      createIntoQrCodeFormVisible: false,
      createIntoQrCodeStatus: '',
      resOptions:null,
      resId:null,
      imgUrl:'',
      qrCreateTime:'',
      qrCutOffTime:'',
      houseList:null,
      intoRole:'',
      webMenuTree: false,
      menuTree: false,
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
      cstList(this.listQuery).then(response => {
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
      row.tagList = null;
      createQrCode(row).then(response => {
        this.imgUrl = response.data.imgUrl
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
    // 获取下拉菜单数据
    getSelectList(){
      // 项目
      project().then(response => {
        this.projectOptions = response.data.list
      })
      // // 身份
      // identitySelect().then(response => {
      //   this.identityOptions = response.data.list
      // }) 
      // 卡 
      cardSelect().then(response => {
        this.cardOptions = response.data.list
      })  
      // 卡类型
      cardTypeSelect().then(response => {
          this.cardTypeOptions = response.data.list
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

    // 生成入住二维码
    createIntoQrcode(row) {
      // 清空已选择类型
      this.selectedIntoOption = null;
      // 清空已选择房屋
      this.resId = null;
      this.temp = Object.assign({}, row) // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.createIntoQrCodeStatus = 'create'
      this.createIntoQrCodeFormVisible = true
      this.$nextTick(() => {
        this.$refs['createIntoQrCodedataForm'].clearValidate()
      })
      // 获取客户房屋
      houseSelect(row.code).then(response => {
        this.resOptions = response.data.list;
      })
      // 获取身份
      identitySelectByProNum(row.orgId).then(response => {
        this.identityOptions = response.data.list
      }) 
    },
    // 生成客户入住二维码
    createIntoCstQrCode() {
      if(this.selectedIntoOption == 1 || this.selectedIntoOption == 3 || this.selectedIntoOption == 4){
        if(this.resId === null){
          this.$notify({
              message: '房屋不能为空！',
              type: 'error',
              duration: 2000
          })
          return
        }
      }        
      this.imgUrl = null;
      this.houseList = null;
      this.qrCreateTime = null;
      this.qrCutOffTime = null;
      this.intoRole = null;
      this.dialogFormVisible = true
      this.$refs['createIntoQrCodedataForm'].validate((valid) => {
        if (valid) {
          this.temp.resId = this.resId;
          this.temp.cstCode = this.temp.code;
          this.temp.orgId = this.temp.orgId;
          this.temp.intoType = this.selectedIntoOption;
          createIntoCstQrCode(this.temp).then(response => {
          this.imgUrl = response.data.imgUrl
          this.houseList = response.data.houseList
          this.qrCreateTime = response.data.qrCreateTime
          this.qrCutOffTime = response.data.qrCutOffTime
          this.intoRole = response.data.intoRole
          setTimeout(() => {
            this.listLoading = false
            }, 1.5 * 1000)
          })
        }
      })
    },

    // 生成员工入住二维码
    createIntoStaffQrCode(row) {
      this.imgUrl = null;
      this.houseList = null;
      this.qrCreateTime = null;
      this.qrCutOffTime = null;
      this.intoRole = null;
      this.dialogFormVisible = true
      this.temp.cstCode = row.code;
      this.temp.cstName = row.cstName;
      this.temp.orgId = row.orgId;
      createIntoStaffQrCode(this.temp).then(response => {
        this.imgUrl = response.data.imgUrl
        this.houseList = response.data.houseList
        this.qrCreateTime = response.data.qrCreateTime
        this.qrCutOffTime = response.data.qrCutOffTime
        this.intoRole = response.data.intoRole
        setTimeout(() => {
          this.listLoading = false
        }, 1.5 * 1000)
      })       
    },

    cleanHouseOption(){
      // 清空已选择房屋
      this.resId = null;
    },

    menuTreeCreate(row) {
      this.resetTemp()
      this.dialogStatus = '权限菜单'
      this.menuTree = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
      //this.webExpandedKeys=[1]
      //this.webCheckedKeys=[1]
      // 查询客户权限菜单
      this.temp.code = row.code
      selectMenuMini(this.temp).then((response) => {
        // 客户菜单赋值
        this.webTreeData = response.data.webTreeData
        this.webExpandedKeys = response.data.webExpandedKeys
        this.webCheckedKeys = response.data.webCheckedKeys
        // 客户账单权限赋值
        // this.weComTreeData = response.data.weComTreeData
      //   this.weComTreeData = [
      //     {
      //       id: 1,
      //       label: '缴费',
            
      //     }, {
      //       id: 2,
      //       label: '开票',
          
      //     }
      // ],

      this.weComExpandedKeys = response.data.weComExpandedKeys
      this.weComCheckedKeys = response.data.weComCheckedKeys

      })
    },

    createWebMenuData() {
      this.getCheckedNodes()
      this.temp.code = this.temp.code
      this.temp.webMenuIds = this.selectedWebCheckedKeys
      // this.temp.weComMenuIds = this.selectedWeComCheckedKeys
      saveCstMenu(this.temp).then(() => {
          this.menuTree = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000          
          })
      })
    },

    //获取用户勾选的权限id用于传参后台
    getCheckedNodes() {
      let selectedWebMenu = this.$refs.webTreeForm.getCheckedNodes(false, false); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      this.selectedWebCheckedKeys = selectedWebMenu.map(item => {
        return item.id;
      });   
      // let selectedWeComMenu = this.$refs.weComTreeForm.getCheckedNodes(false, false); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      // this.selectedWeComCheckedKeys = selectedWeComMenu.map(item => {
      //   return item.id;
      // });  
    },

    // 多选框选中数据
    handleSelectionChange(selection) {
      console.log("多选框选中数据");
      // 需要根据数据情况调整id名称
      this.cstCodeList = selection.map(item => item.code);
      this.single = selection.length != 1;
      this.multiple = !selection.length;
    },
    
    // 批量操作
    sendCardByCstCreateModel() {
      this.resetTemp()
        this.cardBulkOperationDialogStatus = 'create';
        this.cardBulkOperationDialogShow = true
        this.$nextTick(() => {
          this.$refs['cardBulkOperationDialogShow'].clearValidate()
        })
    }, 
    
    // 批量操作发卡、禁用、恢复
    cardBulkOperation() {
      if(this.cstCodeList == null || this.cstCodeList == "" || this.cstCodeList == "undefined"){
              this.$notify({
                message: '请先勾选客户！',
                type: 'error',
                duration: 2000          
              })
              return
        }

        if(this.temp.cardId == null || this.temp.cardId == "" || this.temp.cardId == "undefined"){
              this.$notify({
                message: '卡不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }

        if(this.temp.cardOption == null || this.temp.cardOption == "" || this.temp.cardOption == "undefined"){
              this.$notify({
                message: '卡操作不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        // 操作选择发卡，次数不能为空      
        // if(this.temp.cardOption == 1 && (this.temp.totalNum == null || this.temp.totalNum == "" || this.temp.totalNum == "undefined")){
        //       this.$notify({
        //         message: '次数/小时不能为空！',
        //         type: 'error',
        //         duration: 2000          
        //       })
        //       return
        // }
        // 正则表达式，匹配正整数
        // var pattern = /^[1-9]\d*$/;
        // if (!pattern.test(this.temp.totalNum) && this.temp.cardOption == 1 && this.temp.totalNum != null) {
        //   this.$notify({
        //         message: '次数/小时必须是正整数！',
        //         type: 'error',
        //         duration: 2000          
        //       })
        //       return
        // }

        if(this.temp.cardId == 1 && this.temp.cardOption == 1 && (this.temp.expDate == null || this.temp.expDate == "" || this.temp.expDate == "undefined")){
              this.$notify({
                message: '有效年份不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }

        if(this.temp.cardId == 2 && this.temp.cardOption == 1 && (this.temp.expDate == null || this.temp.expDate == "" || this.temp.expDate == "undefined")){
              this.$notify({
                message: '有效月份不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        
        
        this.$refs['cardBulkOperationDataForm'].validate((valid) => {
         if (valid) {
            this.temp.cstCodeList = this.cstCodeList;        
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            cardBulkOperation(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.cardBulkOperationDialogShow = false
              this.getList();
              this.$notify({
                title: 'Success',
                message: 'Successfully',
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
</style>

