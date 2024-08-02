  <template> 
    <div class="app-container">
        <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="90px" style="width: 400px; margin-left:50px;">
          <el-form-item class="is_show" label="staffId" prop="staffId">
            <el-input v-model="temp.staffId" />
          </el-form-item>
          <el-form-item label="公众号选择" prop="id">
            <el-select v-model="id" placeholder="公众号选择" clearable multiple style="width: 870px" class="filter-item">
              <el-option v-for="item in budOptions" :key="item.id" :label="item.name" :value="item.id" ></el-option>
            </el-select>
          </el-form-item>        
        </el-form>
        <el-button v-waves class="filter-item" style="margin-left: 850px;" type="primary" icon="el-icon-search" @click="updateData()">
          获取用户
        </el-button>
    </div>
  </template>
  
  <script>
  import { wechatPubSelect, wechatPubAddMenu, wechatPubAddUser } from '@/api/wechat/wechat-pub'
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
        webExpandedKeys:[],
        webCheckedKeys:[],
        selectedWebCheckedKeys:[],
        roleOptions:null,
        projectOptions:null,
        budOptions:null,
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
        id:null,
        // 权限树
        webTreeData: [{
         
          }],
          defaultProps: {
            children: 'children',
            label: 'label'
          }
  
      }
    },
    created() {
      this.getSelectList()
    },
  
    methods: {
     
  
    
      // 获取下拉菜单数据
      getSelectList(){
        // 公众号
          // 清空已选择楼栋
          this.id = null;
        // 获取公众号
        wechatPubSelect().then(response => {
          this.budOptions = response.data.list;
        }) 
        // wechatPubSelect().then(response => {
        //   this.id = this.mapBuild(response.data.list);
        // }) 
      },
      mapBuild(list){
      let a=  list.map((option)=>option.id);
      return a;
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

      //获取用户勾选的权限id用于传参后台
      getCheckedNodes() {
        this.selectedWebCheckedKeys = ""
        let selectedPermission = this.$refs.webTreeForm.getCheckedNodes(false, true); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
        this.permissionIds = selectedPermission.map(item => {
        this.selectedWebCheckedKeys += item.id+","
          //return item.id;
          //alert(item.id)
        });    
        
    },

  
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = this.id;
          const tempData = Object.assign({}, this.temp)
          tempData.timestamp = +new Date(tempData.timestamp) // change Thu Nov 30 2017 16:41:05 GMT+0800 (CST) to 1512031311464
          wechatPubAddUser(tempData).then((response) => {
            // const index = this.list.findIndex(v => v.id === this.temp.id)
            // this.list.splice(index, 1, this.temp)
            const message = response.message;
            this.$notify({
              title: 'Success',
              message: message,
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
  
  