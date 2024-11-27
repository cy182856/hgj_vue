<template>
  <div class="app-container">
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
      <el-table-column label="编号" prop="id" align="center" width="150px">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="开始时间"
        prop="startTime"
        align="center"
        width="130"
      >
        <template slot-scope="{ row }">
          <span>{{ row.startTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="结束时间"
        prop="endTime"
        align="center"
        width="150"
      >
        <template slot-scope="{ row }">
          <span>{{ row.endTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="描述" prop="desc" align="center" width="300">
        <template slot-scope="{ row }">
          <span>{{ row.desc }}</span>
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
      <el-table-column
        label="操作"
        align="center"
        width="100"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">
          <el-button
            type="primary"
            size="mini"
            @click="workTimeCreateModel(row, $index)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 编辑 -->
    <el-dialog
      :title="textMap[workTimeDialogStatus]"
      :visible.sync="workTimeDialogShow"
    >
      <el-form
        ref="workTimeDataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; height: 100%; margin-left: 60px"
      >
        <el-form-item label="id" prop="id" style="display: none">
          <el-input
            v-model="temp.id"
            placeholder="id"
            clearable
            style="width: 300px"
            class="filter-item"
          ></el-input>
        </el-form-item>
        
        <!-- <el-form-item label="开始时间" prop="startTime">
          <el-date-picker
            value-format="HH:mm:ss"
            style="width: 300px"
            class="filter-item"
            v-model="temp.startTime"
            type="datetime"
            placeholder="开始日期"
          >
          </el-date-picker>
        </el-form-item>
        <el-form-item label="结束时间" prop="endTime">
          <el-date-picker
            value-format="HH:mm:ss"
            style="width: 300px"
            class="filter-item"
            v-model="temp.endTime"
            type="datetime"
            placeholder="结束日期"
          >
          </el-date-picker>
        </el-form-item> -->

       
        <el-form-item label="开始时间" prop="startTime">
          <el-time-picker
            value-format="HH:mm:ss"
            :teleported="false"
            style="width: 300px"
            v-model="startTime"
            :picker-options="pickerOptions"
            ref="timePicker"
          ></el-time-picker>
        </el-form-item>

        <el-form-item label="结束时间" prop="endTime">
          <el-time-picker
            value-format="HH:mm:ss"
            :teleported="false"
            style="width: 300px"
            v-model="endTime"
            :picker-options="pickerOptions"
            ref="timePicker"
          ></el-time-picker>
        </el-form-item>
      </el-form>
     
      <div slot="footer" class="dialog-footer">
        <el-button @click="workTimeDialogShow = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="
            workTimeDialogStatus === 'create' ? workTimeUpdate() : workTimeUpdate()
          "
        >
          提交
        </el-button>
      </div>

      <div style="color: red; margin-left: 60px;margin-top: 40px;font-size: 16px;">注意：时间与业务系统关联，请正确填写！</div>
       
    </el-dialog>
  </div>
</template>
  
  <script>
import { workTimeList, workTimeUpdate } from "@/api/worktime/workTime";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination
const pickerOptions = { selectableRange: "00:00:00 - 23:59:59"};

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
      startTime:'',
      endTime:'',
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
  },
  methods: {
    getList() {
      this.listLoading = false;
      workTimeList(this.listQuery).then((response) => {
        this.list = response.data.pageInfo.list;
        this.total = response.data.pageInfo.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },

    workTimeCreateModel(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.workTimeDialogStatus = "create";
      this.workTimeDialogShow = true;
      this.$nextTick(() => {
        this.$refs["workTimeDataForm"].clearValidate();
      });
      this.startTime = row.startTime;
      this.endTime = row.endTime;
    },

    workTimeUpdate() {
      if (
        this.startTime == null ||
        this.startTime == "" ||
        this.startTime == "undefined"
      ) {
        this.$notify({
          message: "开始时间不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }

      if (
        this.endTime == null ||
        this.endTime == "" ||
        this.endTime == "undefined"
      ) {
        this.$notify({
          message: "结束时间不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }

      this.$refs["workTimeDataForm"].validate((valid) => {
        if (valid) {
          this.temp.startTime = this.startTime;
          this.temp.endTime = this.endTime;
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp);
          workTimeUpdate(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.workTimeDialogShow = false;
            this.getList();
            this.$notify({
              title: "Success",
              message: "Successfully",
              type: "success",
              duration: 2000,
            });
          });
        }
      });
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


  
 
  
  