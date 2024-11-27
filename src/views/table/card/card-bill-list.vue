<template>
  <div class="app-container">

    <div class="filter-container">
        <el-select v-model="listQuery.proNum" placeholder="项目" clearable style="width: 160px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cardCode" placeholder="卡号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />

        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.startDate"
          type="date"
          placeholder="开始日期"
          >
        </el-date-picker>

        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.endDate"
          type="date"
          placeholder="结束日期"
        >
        </el-date-picker>

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
      style="width: 100%"
      @sort-change="sortChange"
    >
      <el-table-column label="卡号" prop="cardCode" align="center" width="180px">
        <template slot-scope="{ row }">
          <span>{{ row.cardCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="卡类型" prop="cardTypeName" align="center" width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.cardTypeName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="项目" prop="proName" align="center" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.proName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户编号" prop="cstCode" align="center" width="120px">
        <template slot-scope="{ row }">
          <span>{{ row.cstCode }}</span>
        </template>
      </el-table-column>
      <el-table-column label="客户名称" prop="cstName" align="center" width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.cstName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="数量" prop="billNum" align="center" width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.billNum }}</span>
        </template>
      </el-table-column>
      <el-table-column label="账单类型" prop="billType" align="center" width="100px">
        <template slot-scope="{ row }">
          <span v-if="row.billType == 1">充值</span>
          <span v-if="row.billType == 2">扣减</span>
        </template>
      </el-table-column>
      <el-table-column label="操作人" prop="userName" align="center" width="100px">
        <template slot-scope="{ row }">
          <span>{{ row.userName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="150">
        <template slot-scope="{ row }">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      
    </el-table>

  </div>
</template>
  
  <script>
import { cardBillList } from "@/api/card/card-cst-bill";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
import { projectSelect } from '@/api/config/config'

export default {
  name: "ComplexTable",
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: "success",
        draft: "info",
        deleted: "danger",
      };
      return statusMap[status];
    },
    typeFilter(type) {
      return calendarTypeKeyValue[type];
    },
  },
  data() {
    return {
      projectOptions:null,
      readonly: true,
      tableKey: 0,
      list: null,
      total: 0,
      listLoading: true,
      workTimeDialogShow: false,
      workTimeDialogStatus: "",
      listQuery: {
        page: 1,
        limit: 10,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: "+id",
      },
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      pvData: [],
      // rules: {
      //   type: [{ required: true, message: 'type is required', trigger: 'change' }],
      //   timestamp: [{ type: 'date', required: true, message: 'timestamp is required', trigger: 'change' }],
      //   title: [{ required: true, message: 'title is required', trigger: 'blur' }]
      // },
      downloadLoading: false,
      defaultProps: {
        children: "children",
        label: "label",
      },
    };
  },
  created() {
    this.getList();
    this.getSelectList();
  },
  methods: {
    getList() {
      this.listLoading = false;
      cardBillList(this.listQuery).then((response) => {
        this.list = response.data.pageInfo.list;
        this.total = response.data.pageInfo.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    // 获取下拉菜单数据
    getSelectList(){
      // 项目
      projectSelect().then(response => {
        this.projectOptions = response.data.list
      })  
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },

    sortChange(data) {
      const { prop, order } = data;
      if (prop === "id") {
        this.sortByID(order);
      }
    },
    sortByID(order) {
      if (order === "ascending") {
        this.listQuery.sort = "+id";
      } else {
        this.listQuery.sort = "-id";
      }
      this.handleFilter();
    },

    resetTemp() {
      this.temp = {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        status: "published",
        type: "",
      };
    },
  },
};
</script>


  
 
  
  