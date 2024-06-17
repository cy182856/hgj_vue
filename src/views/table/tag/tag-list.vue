<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.name" placeholder="标签名" style="width: 180px;" class="filter-item" @keyup.enter.native="handleFilter" />&nbsp;
      <el-button v-waves class="filter-item" type="primary" icon="el-icon-search" @click="handleFilter">
        查询
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        新增
      </el-button>
    </div>

    
      <!-- <vue-markdown :html="true">{{htmlMD}}</vue-markdown> -->
      <!-- <vue-markdown>{{markdownContent}}</vue-markdown> -->
      <!-- <markdown-it-vue class="md-body" :content="htmlMD" /> -->


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
      <!-- <el-table-column label="编号" prop="id" align="center" width="180px">
        <template slot-scope="{row}">
          <span>{{ row.id }}</span>
        </template>
      </el-table-column> -->
      <el-table-column label="项目" prop="proName" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.proName }}</span>
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="id" align="center" width="180px">
        <template slot-scope="{row}">
          <span v-if="row.type==0">系统标签</span>
          <span v-if="row.type==1">自建标签</span>
        </template>
      </el-table-column>
      <el-table-column label="范围" prop="id" align="center" width="180px">
        <template slot-scope="{row}">
          <span v-if="row.range==1">客户</span>
          <span v-if="row.range==2">个人</span>
        </template>
      </el-table-column>
      <el-table-column label="标签名" prop="name" align="center" width="120">
        <template slot-scope="{row}">
          <span>{{ row.name }}</span>
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
          <el-button v-if="row.range == 1" type="primary" size="mini"  @click="menuTreeCreate(row)">
            选择客户
          </el-button>     
          <el-button v-if="row.range == 2" type="primary" size="mini"  @click="menuTreeCreatePerson(row)">
            选择个人
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
        <el-form-item label="名称" prop="name">
          <el-input v-model="temp.name" placeholder="名称" clearable style="width: 300px" class="filter-item"></el-input>
        </el-form-item>
        <el-form-item label="项目" prop="proNum">
          <el-select v-model="temp.proNum" placeholder="项目" clearable style="width: 300px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
          </el-select>
        </el-form-item>
        <el-form-item label="选择范围" prop="range">
          <el-select v-model="temp.range" placeholder="范围" clearable style="width: 300px" class="filter-item">
            <el-option label="客户" :value="1" />
            <el-option label="个人" :value="2" />
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

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="cstTree">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
        <el-row :gutter="30">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <span>客户选择</span>
              <el-tree
                :data="cstTreeData"
                show-checkbox
                node-key="id"
                ref="webTreeForm"
                :default-expanded-keys=tagExpandedKeys
                :default-checked-keys=tagCheckedKeys
                :props="defaultProps"
                @check="getCheckedNodes">
              </el-tree>
          </div>
          </el-col>    
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="cstTree = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='客户选择'?createCstData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

    <el-dialog :title="textMap[personDialogStatus]" :visible.sync="personTree">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
        <el-row :gutter="30">
          <el-col :span="24">
            <div class="grid-content bg-purple">
              <span>个人选择</span>
              <el-tree
                :data="personTreeData"
                show-checkbox
                node-key="id"
                ref="personWebTreeForm"
                :default-expanded-keys=personTagExpandedKeys
                :default-checked-keys=personTagCheckedKeys
                :props="defaultProps"
                @check="personGetCheckedNodes">
              </el-tree>
          </div>
          </el-col>    
        </el-row>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="personTree = false">
          取消
        </el-button>
        <el-button type="primary" @click="personDialogStatus==='个人选择'?personCreateCstData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>

  </div>
</template>

<script>
import { tagList, tagSave, tagUpdate, tagDelete , selectCstTree, selectCstTreePerson, saveTagCst} from '@/api/tag/tag'
import waves from '@/directive/waves' // waves directive
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { projectSelect } from '@/api/config/config'


// import VueMarkdown from 'vue-markdown'
// import axios from 'axios'

// import MarkdownItVue from "markdown-it-vue";
// import "markdown-it-vue/dist/markdown-it-vue.css";


export default {
  name: 'ComplexTable',
  components: { Pagination },
  // components: { VueMarkdown },
  // components: { MarkdownItVue},
  
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
      // markdownContent: '',
      // htmlMD: "",
      projectOptions:null,
      roleOptions:null,
      serchRoleOptions:null,
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
      cstTree: false,
      personTree: false,
      dialogStatus: '',
      personDialogStatus: '',
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
      personTreeData: [{}],
      cstTreeData: [{

        //   id: 1,
        //   label: '一级 1',
        //   children: [{
        //     id: 4,
        //     label: '二级 1-1',
        //     children:[{
        //       id: 400,
        //       label: '房间号：a-101 ，客户名：达疆',
        //     }]
        //   }]
        // }, {
        //   id: 2,
        //   label: '一级 2',
        //   children: [{
        //     id: 5,
        //     label: '二级 2-1'
        //   }, {
        //     id: 6,
        //     label: '二级 2-2'
        //   }]
        // }, {
        //   id: 3,
        //   label: '一级 3',
        //   children: [{
        //     id: 7,
        //     label: '二级 3-1'
        //   }, {
        //     id: 8,
        //     label: '二级 3-2'
        //   }]

      }]
    }
  },
  created() {
    this.getList()
    // this.fetchMarkdown()
    // this.loadMarkdown()
    this.getSelectList()
  },
  methods: {
    getList() {
      this.listLoading = false
      tagList(this.listQuery).then(response => {
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
    // fetchMarkdown() {
    //   // 假设你的Markdown文件位于public目录下
    //   axios.get('./md.md').then(response => {
    //     this.markdownContent = response.data
    //   })
    // },

    // loadMarkdown() {
		//     // 假设您有一个本地markdown文件路径
		//     const markdownPath = './md.md'
    //         //通过fetch请求将.md文件转化为markdown-it-vue可以解析的字符串
		//     fetch(markdownPath)
		// 	    .then(response => response.text())
		// 	    .then(markdown => {
        
		// 		    this.htmlMD = markdown
		// 	    })
		// 	    .catch(error => {
		// 		    console.error('Error loading markdown:', error);
		// 	    });
	  //   },
    

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
          if(this.temp.proNum == null || this.temp.proNum == "" || this.temp.proNum == "undefined"){
            this.$notify({
              message: '项目不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.range == null || this.temp.range == "" || this.temp.range == "undefined"){
            this.$notify({
              message: '选择范围不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          tagSave(this.temp).then(() => {
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
          if(this.temp.proNum == null || this.temp.proNum == "" || this.temp.proNum == "undefined"){
            this.$notify({
              message: '项目不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          if(this.temp.range == null || this.temp.range == "" || this.temp.range == "undefined"){
            this.$notify({
              message: '选择范围不能为空！',
              type: 'error',
              duration: 2000          
            })
            return
          }
          tagUpdate(tempData).then(() => {
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

    handleDelete(row, index) {
      this.$confirm('确认删除?', '提示', {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }).then(() => {
        tagDelete(row.id,).then((res) => {
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

    // 选择客户
    menuTreeCreate(row) {
      this.resetTemp()
      this.dialogStatus = '客户选择'
      this.cstTree = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })

      //this.tagExpandedKeys=[1,2,3]
      //this.tagCheckedKeys=[1]
      // 查询员工权限菜单
      this.temp.tagId = row.id
      this.temp.proNum = row.proNum
      selectCstTree(this.temp).then((response) => {
        // web菜单赋值
        this.cstTreeData = response.data.cstTreeData
        this.tagExpandedKeys = response.data.tagExpandedKeys
        this.tagCheckedKeys=response.data.tagCheckedKeys       
      })
      
    },

    // 选择个人
    menuTreeCreatePerson(row) {
      this.resetTemp()
      this.personDialogStatus = '个人选择'
      this.personTree = true
      this.$nextTick(() => {
        this.$refs['personDataForm'].clearValidate()
      })
      this.temp.tagId = row.id
      this.temp.proNum = row.proNum
      selectCstTreePerson(this.temp).then((response) => {
        // web菜单赋值
        this.personTreeData = response.data.personTreeData
        this.personTagExpandedKeys = response.data.tagExpandedKeys
        this.personTagCheckedKeys=response.data.tagCheckedKeys       
      })
      
    },
  
    //获取用户勾选的客户编号用于传参后台
    getCheckedNodes() {
      let selectedCstCode = this.$refs.webTreeForm.getCheckedNodes(true, true); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      this.selectedCstCheckedKeys = selectedCstCode.map(item => {
        return item.id;
      });   
    },

    //获取用户勾选的个人微信号用于传参后台
    personGetCheckedNodes() {
      let selectedWxOpenId = this.$refs.personWebTreeForm.getCheckedNodes(true, true); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
      this.personSelectedCstCheckedKeys = selectedWxOpenId.map(item => {
        return item.id;
      });   
    },

    createCstData() {
      this.getCheckedNodes()
      this.temp.id = this.temp.tagId
      this.temp.cstCodes = this.selectedCstCheckedKeys
      saveTagCst(this.temp).then(() => {
          this.cstTree = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000          
          })
      })
    },

    personCreateCstData() {
      this.personGetCheckedNodes()
      this.temp.id = this.temp.tagId
      this.temp.wxOpenIds = this.personSelectedCstCheckedKeys
      saveTagCst(this.temp).then(() => {
          this.personTree = false
          this.$notify({
            title: 'Success',
            message: 'Created Successfully',
            type: 'success',
            duration: 2000          
          })
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
@/api/tag/tag
