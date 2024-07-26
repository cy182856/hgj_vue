<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input
        v-model="listQuery.pathName"
        placeholder="名称"
        style="width: 200px"
        class="filter-item"
        @keyup.enter.native="handleFilter"
      />
      &nbsp;
      <el-button
        v-waves
        class="filter-item"
        type="primary"
        icon="el-icon-search"
        @click="handleFilter"
      >
        查询
      </el-button>
      <el-button
        class="filter-item"
        style="margin-left: 10px"
        type="primary"
        icon="el-icon-edit"
        @click="handleCreate"
      >
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
      style="width: 100%"
      @sort-change="sortChange"
    >

      <el-table-column label="编号" prop="id" align="center" width="200">
        <template slot-scope="{ row }">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column>

      <el-table-column label="名称" prop="pathName" align="center" width="180">
        <template slot-scope="{ row }">
          <span>{{ row.pathName }}</span>
        </template>
      </el-table-column>
     
      <el-table-column label="广告路径" prop="advertsPath" align="center" width="220">
        <template slot-scope="{ row }">
          <span>{{ row.advertsPath }}</span>
        </template>
      </el-table-column>
     
      <el-table-column label="创建时间" align="center" width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.createTime }}</span>
        </template>
      </el-table-column>
      <el-table-column label="更新时间" align="center" width="160px">
        <template slot-scope="{ row }">
          <span>{{ row.updateTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        align="center"
        width="200"
        class-name="small-padding fixed-width"
      >
        <template slot-scope="{ row, $index }">     
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            编辑
          </el-button>   
          <el-button size="mini" type="danger" @click="handleDelete(row, $index)" >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination
      v-show="total > 0"
      :total="total"
      :page.sync="listQuery.page"
      :limit.sync="listQuery.limit"
      @pagination="getList"
    />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form
        ref="dataForm"
        :rules="rules"
        :model="temp"
        label-position="left"
        label-width="100px"
        style="width: 600px; height: 100%; margin-left: 60px"
      >
        <el-form-item class="is_show" label="id" prop="id">
          <el-input v-model="temp.id" />
        </el-form-item>
        
        <el-form-item label="名称" prop="title">
          <el-input
            v-model="temp.pathName"
            placeholder="名称"
            clearable
            style="width: 300px"
            class="filter-item"
          ></el-input>
        </el-form-item>

        <el-form-item label="广告路径" prop="advertsPath">
          <el-input
            v-model="temp.advertsPath"
            placeholder="广告路径"
            clearable
            style="width: 300px"
            class="filter-item"
          ></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false"> 取消 </el-button>
        <el-button
          type="primary"
          @click="dialogStatus === 'create' ? createData() : updateData()"
        >
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :visible.sync="dialogPvVisible" title="Reading statistics">
      <el-table
        :data="pvData"
        border
        fit
        highlight-current-row
        style="width: 100%"
      >
        <el-table-column prop="key" label="Channel" />
        <el-table-column prop="pv" label="Pv" />
      </el-table>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" @click="dialogPvVisible = false"
          >Confirm</el-button
        >
      </span>
    </el-dialog>

  </div>
</template>

<script>
import {advertsPathList,advertsPathSave,advertsPathDelete} from "@/api/adverts/advertsPath";
import waves from "@/directive/waves"; // waves directive
import Pagination from "@/components/Pagination"; // secondary package based on el-pagination

export default {
  name: "sum-info-list",
  components: { Pagination },
  directives: { waves },
  projectOptions: null,
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
      dirNum: "",
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
        sort: "+id",
      },
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
      },
      contractStartDate: "",
      contractEndDate: "",
      advertsId: null,
      fileList: [],
      importanceOptions: [1, 2, 3],
      sortOptions: [
        { label: "ID Ascending", key: "+id" },
        { label: "ID Descending", key: "-id" },
      ],
      statusOptions: ["published", "draft", "deleted"],
      showReviewer: false,
      temp: {
        id: undefined,
        importance: 1,
        remark: "",
        timestamp: new Date(),
        title: "",
        type: "",
        status: "published",
      },
      dialogFormVisible: false,
      uploadMode: false,
      fileMode: false,
      dialogStatus: "",
      textMap: {
        update: "Edit",
        create: "Create",
      },
      dialogPvVisible: false,
      pvData: [],
      rules: {
      
      },
      downloadLoading: false,
    };
  },
  created() {
    this.getList();
    this.getSelectList();
  },
  methods: {
    getList() {
      this.listLoading = false;
      advertsPathList(this.listQuery).then((response) => {
        this.list = response.data.pageInfo.list;
        this.total = response.data.pageInfo.total;

        // Just to simulate the time of the request
        setTimeout(() => {
          this.listLoading = false;
        }, 1.5 * 1000);
      });
    },
    handleFilter() {
      this.listQuery.page = 1;
      this.getList();
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: "操作Success",
        type: "success",
      });
      row.status = status;
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
 
    handleCreate() {
      this.resetTemp();
      this.dialogStatus = "create";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    handleUpload(row) {
      this.uploadMode = true;
      this.advertsId = row.id;
    },
    createData() {
      if ( this.temp.pathName == null || this.temp.pathName == "" || this.temp.pathName == "undefined") {
        this.$notify({
          message: "名称不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      if ( this.temp.advertsPath == null || this.temp.advertsPath == "" || this.temp.advertsPath == "undefined") {
        this.$notify({
          message: "广告路径不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          advertsPathSave(this.temp).then(() => {
            this.list.unshift(this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Created Successfully",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
        //this.$router.go(0)
        //window.location.reload()
      });
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row); // copy obj
      this.temp.timestamp = new Date(this.temp.timestamp);
      this.dialogStatus = "update";
      this.dialogFormVisible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].clearValidate();
      });
    },
    updateData() {
      if ( this.temp.pathName == null || this.temp.pathName == "" || this.temp.pathName == "undefined") {
        this.$notify({
          message: "名称不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      if ( this.temp.advertsPath == null || this.temp.advertsPath == "" || this.temp.advertsPath == "undefined") {
        this.$notify({
          message: "广告路径不能为空！",
          type: "error",
          duration: 2000,
        });
        return;
      }
      this.$refs["dataForm"].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp);
          tempData.timestamp = +new Date(tempData.timestamp); // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          advertsPathSave(tempData).then(() => {
            const index = this.list.findIndex((v) => v.id === this.temp.id);
            this.list.splice(index, 1, this.temp);
            this.dialogFormVisible = false;
            this.$notify({
              title: "Success",
              message: "Update Successfully",
              type: "success",
              duration: 2000,
            });
            this.getList();
          });
        }
      });
    },

    handleDelete(row, index) {
      this.$confirm("确认删除?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          advertsPathDelete(row.id).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: "Success",
                message: "Delete Successfully",
                type: "success",
                duration: 2000,
              });
              this.list.splice(index, 1);
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
      fetchPv(pv).then((response) => {
        this.pvData = response.data.pvData;
        this.dialogPvVisible = true;
      });
    },
  },
};
</script>

<style>
.is_show {
  display: none;
}
</style>
