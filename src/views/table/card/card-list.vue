<template>
    <div class="app-container">
      <div class="filter-container">
        <el-select v-model="proNum" placeholder="项目" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in projectOptions" :key="item.projectNum" :label="item.projectName" :value="item.projectNum" />
        </el-select>
        <el-select v-model="cardType" placeholder="类型" clearable style="width: 140px" class="filter-item">
            <el-option v-for="item in cardTypeOptions" :key="item.id" :label="item.name" :value="item.id" />
        </el-select>
        <el-input v-model="listQuery.cardCode" placeholder="编号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cstCode" placeholder="客户编号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.cstName" placeholder="客户名称" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <el-input v-model="listQuery.resName" placeholder="房间号" style="width: 140px;" class="filter-item" @keyup.enter.native="handleFilter" />
        <!-- <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 140px"
          class="filter-item"
          v-model="listQuery.startTime"
          type="date"
          placeholder="有效开始日期"
          >
        </el-date-picker>

        <el-date-picker
          value-format="yyyy-MM-dd"
          style="width: 140px"
          class="filter-item"
          v-model="listQuery.endTime"
          type="date"
          placeholder="有效结束日期"
        >
        </el-date-picker> -->
        <el-date-picker v-if="this.cardType == 1"
          value-format="yyyy"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.startExpDate"
          type="year"
          placeholder="有效期开始日期"
          >
        </el-date-picker>

        <el-date-picker v-if="this.cardType == 1"
          value-format="yyyy"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.endExpDate"
          type="year"
          placeholder="有效期结束日期"
        >
        </el-date-picker>

        <el-date-picker v-if="this.cardType == 2"
          value-format="yyyy-MM"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.startExpDate"
          type="month"
          placeholder="有效期开始日期"
          >
        </el-date-picker>

        <el-date-picker v-if="this.cardType == 2"
          value-format="yyyy-MM"
          style="width: 160px"
          class="filter-item"
          v-model="listQuery.endExpDate"
          type="month"
          placeholder="有效期结束日期"
        >
        </el-date-picker>

        <el-select v-model="listQuery.isExp" placeholder="状态" clearable style="width: 140px;" class="filter-item">
          <el-option label="有效" :value=1 />
          <el-option label="无效" :value=0 />
        </el-select>
        <el-select v-model="listQuery.expNum" placeholder="剩余" clearable style="width: 140px;" class="filter-item">
          <el-option label="有" :value=1 />
          <el-option label="无" :value=0 />
        </el-select>
        <el-button v-waves class="filter-item" style="margin-left: 5px;" type="primary" icon="el-icon-search" @click="handleFilter">
          查询
        </el-button>
        <!-- <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="" @click="sendCardByCstCreateModel()">
          按客户发卡
        </el-button>
        <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="" @click="sendCardByTagCreateModel()">
          按标签发卡
        </el-button>
        <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="" @click="rechargeByTagCreateModel()">
          批量充值
        </el-button>
        <el-button class="filter-item" style="margin-left: 5px;" type="primary" icon="" @click="renewalByTagCreateModel()">
          批量续期
        </el-button> -->
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

        <el-table-column label="编号" prop="cardCode" align="center" width="170px">
          <template slot-scope="{row}">
            <span>{{ row.cardCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="项目" prop="proName" align="center" width="100px">
          <template slot-scope="{row}">
            <span>{{ row.proName }}</span>
          </template>
        </el-table-column>
        <el-table-column label="类型" prop="cardTypeName" align="center" width="80px">
          <template slot-scope="{row}">
            <span>{{ row.cardTypeName }}</span>
          </template>
        </el-table-column>       
        <!-- <el-table-column label="名称" prop="cardName" align="center" width="100">
          <template slot-scope="{row}">
            <span>{{ row.cardName }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="客户编号" prop="cstCode" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.cstCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="客户名称" prop="cstName" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.cstName }}</span>
          </template>
        </el-table-column>   
        <el-table-column label="房间号" prop="resName" align="center" width="160">
          <template slot-scope="{row}">
            <span>{{ row.resName }}</span>
          </template>
        </el-table-column>  
        <el-table-column label="剩余" prop="expNum" align="center" width="50">
          <template slot-scope="{row}">
            <span>{{ row.expNum }}</span>
          </template>
        </el-table-column>   
        <!-- <el-table-column label="总次数" prop="totalNum" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.totalNum }}</span>
          </template>
        </el-table-column>   
        <el-table-column label="已用次数" prop="applyNum" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.applyNum }}</span>
          </template>
        </el-table-column>    
        <el-table-column label="剩余次数" prop="applyNum" align="center" width="80">
          <template slot-scope="{row}">
            <span>{{ row.totalNum - row.applyNum }}</span>
          </template>
        </el-table-column>    
        <el-table-column label="有效起始日期" prop="startTime" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.startTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="有效结束日期" prop="endTime" align="center" width="110">
          <template slot-scope="{row}">
            <span>{{ row.endTime }}</span>
          </template>
        </el-table-column> -->
        <el-table-column label="状态" prop="isExp" align="center" width="50">
          <template slot-scope="{row}">
            <span v-if="row.isExp == 1">有效</span>
            <span v-if="row.isExp == 0">无效</span>
          </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="140px">
          <template slot-scope="{row}">
            <span>{{ row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="更新时间" align="center" width="140px">
          <template slot-scope="{row}">
            <span>{{ row.updateTime }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="230" class-name="small-padding fixed-width">
          <template slot-scope="{row,$index}">
            <el-button type="primary" size="mini" @click="cardCstBatchSelect(row)">
              详细
            </el-button>
            <el-button v-if="row.isExp == 1" type="primary" size="mini" @click="rechargeCreateModel(row,$index)">
              充值
            </el-button>
            <!-- <el-button type="primary" size="mini" @click="renewalCreateModel(row,$index)">
              续期
            </el-button> -->
            <el-button v-if="row.isExp == 1" size="mini" type="danger" @click="cardDisable(row,$index)">
              禁用
            </el-button>
            <el-button v-if="row.isExp == 0" size="mini" type="primary" @click="cardSecure(row,$index)">
              恢复
            </el-button>
          </template>
        </el-table-column>
      </el-table>
  
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
  
      <!-- 按客户发卡 -->
      <el-dialog :title="textMap[sendCardByCstDialogStatus]" :visible.sync="sendCardByCstDialogShow">
        <el-form ref="sendCardByCstDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
          <el-form-item label="选择卡" prop="cardId">
            <el-select v-model="temp.cardId" placeholder="选择卡" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in cardOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>  

          <el-form-item label="选择客户" prop="">
            <el-button class="filter-item" style="width: 300px;" type="primary" icon="" @click="menuTreeCreate()">
              选择客户
            </el-button>
          </el-form-item>

          <div style="margin-left: 100px; margin-bottom: 20px; width: 500px;">{{cstCodeNameList}}</div>    

          <el-form-item label="次数" prop="totalNum">
            <el-input v-model="temp.totalNum" placeholder="次数" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>     

          <el-form-item label="开始日期" prop="startTime">
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
          </el-form-item>

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="sendCardByCstDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="sendCardByCstDialogStatus==='create'?sendCardByCst():sendCardByCst()">
            提交
          </el-button>
        </div>
      </el-dialog>

      <!-- 客户树 -->
      <el-dialog :title="textMap[cstDialogStatus]" :visible.sync="cstTree">
        <el-form ref="cstDataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 100%; height: 100%; margin-left:0px;">  
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
          <el-button type="primary" @click="cstDialogStatus==='客户选择'?saveCstCodeDataForm():saveCstCodeDataForm()">
            提交
          </el-button>
        </div>
      </el-dialog>

      <!-- 按标签发卡 -->
      <el-dialog :title="textMap[sendCardByTagDialogStatus]" :visible.sync="sendCardByTagDialogShow">
        <el-form ref="sendCardByTagDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">

          <el-form-item label="选择卡" prop="cardId">
            <el-select v-model="temp.cardId" placeholder="选择卡" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in cardOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>  

          <el-form-item label="选择标签" prop="tagId">
            <el-select v-model="temp.tagId" placeholder="选择标签" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>     

          <el-form-item label="次数" prop="totalNum">
            <el-input v-model="temp.totalNum" placeholder="次数" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>     

          <el-form-item label="开始日期" prop="startTime">
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
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cstPreview()">
            客户预览
          </el-button>
          <el-button @click="sendCardByTagDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="sendCardByTagDialogStatus==='create'?sendCardByTag():sendCardByTag()">
            提交
          </el-button>
        </div>
      </el-dialog>

      <!-- 批量充值，按标签 -->
      <el-dialog :title="textMap[rechargeByTagDialogStatus]" :visible.sync="rechargeByTagDialogShow">
        <el-form ref="rechargeByTagDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">

          <el-form-item label="选择卡" prop="cardId">
            <el-select v-model="temp.cardId" placeholder="选择卡" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in cardOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>  

          <el-form-item label="选择标签" prop="tagId">
            <el-select v-model="temp.tagId" placeholder="选择标签" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>     

          <el-form-item label="充值次数" prop="rechargeNum">
            <el-input v-model="temp.rechargeNum" placeholder="充值次数" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>     

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cstPreview()">
            客户预览
          </el-button>
          <el-button @click="rechargeByTagDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="rechargeByTagDialogStatus==='create'?rechargeByTag():rechargeByTag()">
            提交
          </el-button>
        </div>
      </el-dialog>

       <!-- 充值 -->
       <el-dialog :title="textMap[rechargeDialogStatus]" :visible.sync="rechargeDialogShow">
        <el-form ref="rechargeDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
          <el-form-item label="id" prop="id" class="is_show">
            <el-input v-model="temp.id" placeholder="id" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>   
          
          <el-form-item label="次数/小时" prop="rechargeNum">
            <el-input v-model="temp.rechargeNum" placeholder="次数/小时" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>     

          <el-form-item v-if="temp.cardType == 1" label="有效年份" prop="expDate">
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

          <el-form-item v-if="temp.cardType == 2" label="有效月份" prop="expDate">
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

        </el-form>  
        <div slot="footer" class="dialog-footer">
          <el-button @click="rechargeDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="rechargeDialogStatus==='create'?cardRecharge():cardRecharge()">
            提交
          </el-button>
        </div>    
      </el-dialog>

      <!-- 批量续期，按标签 -->
      <el-dialog :title="textMap[renewalByTagDialogStatus]" :visible.sync="renewalByTagDialogShow">
        <el-form ref="renewalByTagDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">

          <el-form-item label="选择卡" prop="cardId">
            <el-select v-model="temp.cardId" placeholder="选择卡" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in cardOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>  

          <el-form-item label="选择标签" prop="tagId">
            <el-select v-model="temp.tagId" placeholder="选择标签" clearable style="width: 300px" class="filter-item">
              <el-option v-for="item in tagOptions" :key="item.id" :label="item.name" :value="item.id" />
            </el-select>
          </el-form-item>     

          <el-form-item label="开始日期" prop="startTime">
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
          </el-form-item>    

        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="cstPreview()">
            客户预览
          </el-button>
          <el-button @click="renewalByTagDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="renewalByTagDialogStatus==='create'?renewalByTag():renewalByTag()">
            提交
          </el-button>
        </div>
      </el-dialog>

       <!-- 续期 -->
       <el-dialog :title="textMap[renewalDialogStatus]" :visible.sync="renewalDialogShow">
        <el-form ref="renewalDataForm" :rules="rules" :model="temp" label-position="left" label-width="100px" style="width: 600px;height: 100%; margin-left:60px;">
          <el-form-item label="id" prop="id" class="is_show">
            <el-input v-model="temp.id" placeholder="id" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>   
          <el-form-item label="开始日期" prop="startTime">
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
          </el-form-item>        
        </el-form>  
        <div slot="footer" class="dialog-footer">
          <el-button @click="renewalDialogShow = false">
            取消
          </el-button>
          <el-button type="primary" @click="renewalDialogStatus==='create'?cardRenewal():cardRenewal()">
            提交
          </el-button>
        </div>    
      </el-dialog>

      <!-- 客户预览 -->
      <el-dialog :title="textMap[cstPreviewStatus]" :visible.sync="cstPreviewFormShow">
        <el-table
        :key="tableKey"
        v-loading="listLoading"
        :data="cstList"
        border
        fit
        highlight-current-row
        style="width: 100%;"
        @sort-change="sortChange"
        >
          <el-table-column label="发送编号" prop="cstCode" align="center" width="150" >
            <template slot-scope="{row}">
              <span>{{row.cstCode}}</span>
            </template>
          </el-table-column>
          <el-table-column label="发送对象" prop="cstName" align="center" width="" >
            <template slot-scope="{row}">
              <span>{{row.cstName}}</span>
            </template>
          </el-table-column>
        </el-table>
        <div slot="footer" class="dialog-footer">        
          <el-button @click="cstPreviewFormShow = false">
            取消
          </el-button>
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
              <!-- <el-radio :label=1>发卡</el-radio> -->
              <el-radio :label=2>禁用</el-radio>
              <el-radio :label=3>恢复</el-radio>
              <el-radio :label=4>充值</el-radio>
            </el-radio-group>
          </el-form-item>

          <!-- <el-form-item label="卡类型" prop="cardType">
          <el-select v-model="temp.cardType" placeholder="卡类型" clearable style="width: 300px;" class="filter-item">
            <el-option label="年卡" :value="1" />
            <el-option label="月卡" :value="2" />
          </el-select>
          </el-form-item> -->

          <el-form-item v-if="temp.cardOption == 4" label="次数/小时" prop="totalNum">
            <el-input v-model="temp.totalNum" placeholder="次数/小时" clearable style="width: 300px" class="filter-item"></el-input> 
          </el-form-item>     

          <el-form-item v-if="temp.cardId == 1 && temp.cardOption == 4" label="有效年份" prop="expDate">
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

          <el-form-item v-if="temp.cardId == 2 && temp.cardOption == 4" label="有效月份" prop="expDate">
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

      <el-dialog :title="textMap[cardCstBatchStatus]" :visible.sync="cardCstBatchOperationDialogShow">
          <el-table
          :key="tableKey"
          v-loading="cardCstBatchLoading"
          :data="cardCstBatchList"
          border
          fit
          highlight-current-row
          style="width: 95%;height: 100%;"
          @sort-change="sortChange"
        >
        
        <el-table-column label="卡号" prop="cardCode" align="center" width="180">
          <template slot-scope="{row}">
            <span>{{ row.cardCode }}</span>
          </template>
        </el-table-column>
        <el-table-column label="总数" prop="totalNum" align="center" width="60">
            <template slot-scope="{row}">
              <span>{{ row.totalNum }}</span>
            </template>
        </el-table-column>    
        <el-table-column label="已用" prop="applyNum" align="center" width="60">
            <template slot-scope="{row}">
              <span>{{ row.applyNum }}</span>
            </template>
        </el-table-column>      
        <el-table-column label="有效期" prop="expDate" align="center" width="100">
            <template slot-scope="{row}">
              <span>{{ row.expDate }}</span>
            </template>
        </el-table-column>
        <el-table-column label="创建时间" align="center" width="150px">
            <template slot-scope="{row}">
              <span>{{ row.createTime }}</span>
            </template>
            </el-table-column>
        <el-table-column label="更新时间" align="center" width="140px">
            <template slot-scope="{row}">
              <span>{{ row.updateTime }}</span>
            </template>
        </el-table-column>      
          
        </el-table>

      </el-dialog>

    </div>
  </template>
  
  <script>
  import { selectCstTreeByCardId } from '@/api/tag/tag'
  import { sendCardByTag, sendCardByCst, rechargeByTag, cardRecharge, renewalByTag, cardRenewal, cardCstList, cardDisable, cardSecure, cardBulkOperation} from '@/api/card/card-cst'
  import waves from '@/directive/waves' // waves directive
  import Pagination from '@/components/Pagination' // secondary package based on el-pagination
  import { tagSelect, selectCstList} from '@/api/tag/tag'
  import { cardSelect} from '@/api/card/card'
  import { cardTypeSelect} from '@/api/card/card-type'
  import { projectSelect } from '@/api/config/config'
  import { cardCstBatch} from '@/api/card/card-cst-batch'

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
        proNum:'',
        cardType:'',
        // 选中数组
        cardCstCodes: [],
        // 非单个禁用
        single: true,
        // 非多个禁用
        multiple: true,
        cardBulkOperationDialogShow:false,
        cardOptions:null,
        projectOptions:null,
        cardTypeOptions:null,
        tagOptions:null,
        cardOptions:null,
        cstTree: false,
        readonly: true,
        tableKey: 0,
        cardCstBatchOperationDialogShow:false,
        list: null,
        grantBatchList:null,
        cstList:null,
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
        cstDialogStatus: '',
        menuTree: false,
        cstPreviewStatus: '',
        cstPreviewFormShow:false,
        sendCardByCstDialogStatus:'',
        sendCardByCstDialogShow:false,
        sendCardByTagDialogStatus: '',
        sendCardByTagDialogShow:false,
        rechargeByTagDialogStatus:'',
        rechargeByTagDialogShow:false,
        renewalByTagDialogStatus:'',
        renewalByTagDialogShow:false,
        rechargeDialogStatus:'',
        rechargeDialogShow:false,
        renewalDialogStatus:'',
        renewalDialogShow:false,
        textMap: {
          update: 'Update',
          create: 'Create'
        },
        pvData: [],
        cstTreeData: [{}],
        cstCodeNameList:'',
        rules: {
          // cardId: [{ required: true, message: '卡不能为空', trigger: 'change' }],
          // tagId: [{ required: true, message: '标签不能为空', trigger: 'change' }],
          // totalNum: [{ required: true, message: '次数不能为空', trigger: 'change' }],
          // startTime: [{ required: true, message: '开始日期不能为空', trigger: 'change' }],
          // endTime: [{ required: true, message: '结束日期不能为空', trigger: 'change' }]
        }

      }
    },
    created() {  
      this.getSelectList()
     // this.getList()
     // this.handleFilter()

    },
    methods: {
      getList() {
        this.listLoading = false
        this.listQuery.proNum = this.proNum;
        this.listQuery.cardType = this.cardType;
        cardCstList(this.listQuery).then(response => {
          this.list = response.data.pageInfo.list
          this.total = response.data.pageInfo.total  
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
          this.proNum = this.projectOptions[0].projectNum

          // 卡类型
          cardTypeSelect().then(response => {
            this.cardTypeOptions = response.data.list
            this.cardType = this.cardTypeOptions[0].id
            this.handleFilter()
          })  

        })  
        // 卡 
        cardSelect().then(response => {
          this.cardOptions = response.data.list
        })  
        
        // 标签
        tagSelect().then(response => {
          this.tagOptions = response.data.list
        })    
          
      },
      
      // 选择客户
      menuTreeCreate() {
        var cardId = this.temp.cardId;
          if(cardId == null || cardId == "" || cardId == "undefined"){
              this.$notify({
                message: '请选择卡！',
                type: 'error',
                duration: 2000          
              })
              return
          }
          //this.resetTemp()
          this.cstDialogStatus = '客户选择'
          this.cstTree = true
          this.$nextTick(() => {
            this.$refs['cstDataForm'].clearValidate()
          })

          //this.tagExpandedKeys=[1,2,3]
          //this.tagCheckedKeys=[1]
          // 查询员工权限菜单
          selectCstTreeByCardId(cardId).then((response) => {
            // web菜单赋值
            this.cstTreeData = response.data.cstTreeData
           // this.tagExpandedKeys = response.data.tagExpandedKeys
            //this.tagCheckedKeys = response.data.tagCheckedKeys  
          })        
      }, 

       //获取用户勾选的客户编号用于传参后台
      getCheckedNodes() {
        let selectedCstCode = this.$refs.webTreeForm.getCheckedNodes(true, true); //(leafOnly, includeHalfChecked) 接收两个 boolean 类型的参数，1. 是否只是叶子节点，默认值为 false 2. 是否包含半选节点，默认值为 false
        this.selectedCstCheckedKeys = selectedCstCode.map(item => {
          return item.id;
        });  
        this.selectedCstNameCheckedKeys = selectedCstCode.map(item => {
          return item.label;
        });    
      },

      saveCstCodeDataForm() {
        this.getCheckedNodes()
        this.temp.id = this.temp.tagId
        this.temp.cstCodeList = this.selectedCstCheckedKeys
        this.cstCodeNameList = this.selectedCstNameCheckedKeys
        this.cstTree = false;
        // saveCardCst(this.temp).then(() => {
        //     this.cstTree = false
        //     this.$notify({
        //       title: 'Success',
        //       message: 'Created Successfully',
        //       type: 'success',
        //       duration: 2000          
        //     })
        // })
      },

      sendCardByCstCreateModel() {
        this.resetTemp()
        this.cstCodeNameList = null;
        this.sendCardByCstDialogStatus = 'create';
        this.sendCardByCstDialogShow = true
        this.$nextTick(() => {
          this.$refs['sendCardByCstDialogShow'].clearValidate()
        })
      },
  
      sendCardByTagCreateModel() {
        this.resetTemp()
        this.sendCardByTagDialogStatus = 'create'
        this.sendCardByTagDialogShow = true
        this.$nextTick(() => {
          this.$refs['sendCardByTagDataForm'].clearValidate()
        })
      },

      rechargeByTagCreateModel() {
        this.resetTemp()
        this.rechargeByTagDialogStatus = 'create'
        this.rechargeByTagDialogShow = true
        this.$nextTick(() => {
          this.$refs['rechargeByTagDataForm'].clearValidate()
        })
      },

      rechargeCreateModel(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.rechargeDialogStatus = 'create'
        this.rechargeDialogShow = true
        this.$nextTick(() => {
          this.$refs['rechargeDataForm'].clearValidate()
        })
      },

      renewalCreateModel(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)
        this.renewalDialogStatus = 'create'
        this.renewalDialogShow = true
        this.$nextTick(() => {
          this.$refs['renewalDataForm'].clearValidate()
        })
      },

      renewalByTagCreateModel() {
        this.resetTemp()
        this.renewalByTagDialogStatus = 'create'
        this.renewalByTagDialogShow = true
        this.$nextTick(() => {
          this.$refs['renewalByTagDataForm'].clearValidate()
        })
      },

      renewalByTagCreateModel() {
        this.resetTemp()
        this.renewalByTagDialogStatus = 'create'
        this.renewalByTagDialogShow = true
        this.$nextTick(() => {
          this.$refs['renewalByTagDataForm'].clearValidate()
        })
      },

      // 客户预览
      cstPreview() { 
        var tagId = this.temp.tagId;
        if(this.temp.tagId == null || this.temp.tagId == "" || this.temp.tagId == "undefined"){
              this.$notify({
                message: '请先选择标签！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        this.cstPreviewStatus = 'update'
        this.cstPreviewFormShow = true   
        this.cstList = null;     
        selectCstList(tagId).then(response => {
          this.cstList = response.data.list
          setTimeout(() => {
            this.listLoading = false
          }, 1.5 * 1000)
        })
      },
      
      sendCardByTag() {
        if(this.temp.cardId == null || this.temp.cardId == "" || this.temp.cardId == "undefined"){
              this.$notify({
                message: '卡不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.tagId == null || this.temp.tagId == "" || this.temp.tagId == "undefined"){
              this.$notify({
                message: '标签不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.totalNum == null || this.temp.totalNum == "" || this.temp.totalNum == "undefined"){
              this.$notify({
                message: '次数不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.startTime == null || this.temp.startTime == "" || this.temp.startTime == "undefined"){
              this.$notify({
                message: '开始日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.endTime == null || this.temp.endTime == "" || this.temp.endTime == "undefined"){
              this.$notify({
                message: '结束日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        this.$refs['sendCardByTagDataForm'].validate((valid) => {      
         if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            sendCardByTag(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.sendCardByTagDialogShow = false
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

      sendCardByCst() {
        if(this.temp.cardId == null || this.temp.cardId == "" || this.temp.cardId == "undefined"){
              this.$notify({
                message: '卡不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.cstCodeList == null || this.temp.cstCodeList == "" || this.temp.cstCodeList == "undefined"){
              this.$notify({
                message: '客户不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.totalNum == null || this.temp.totalNum == "" || this.temp.totalNum == "undefined"){
              this.$notify({
                message: '次数不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.startTime == null || this.temp.startTime == "" || this.temp.startTime == "undefined"){
              this.$notify({
                message: '开始日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.endTime == null || this.temp.endTime == "" || this.temp.endTime == "undefined"){
              this.$notify({
                message: '结束日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        
        this.$refs['sendCardByCstDataForm'].validate((valid) => {
         if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            sendCardByCst(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.sendCardByCstDialogShow = false
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

      rechargeByTag() {
        if(this.temp.cardId == null || this.temp.cardId == "" || this.temp.cardId == "undefined"){
              this.$notify({
                message: '卡不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.tagId == null || this.temp.tagId == "" || this.temp.tagId == "undefined"){
              this.$notify({
                message: '标签不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.rechargeNum == null || this.temp.rechargeNum == "" || this.temp.rechargeNum == "undefined"){
              this.$notify({
                message: '充值次数不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        this.$refs['rechargeByTagDataForm'].validate((valid) => {      
         if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            rechargeByTag(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.rechargeByTagDialogShow = false
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

      cardRecharge() {
         // 充值，次数不能为空      
         if( this.temp.rechargeNum == null || this.temp.rechargeNum == "" || this.temp.rechargeNum == "undefined"){
              this.$notify({
                message: '次数/小时不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        // 正则表达式，匹配正整数
        var pattern = /^[1-9]\d*$/;
        if (!pattern.test(this.temp.rechargeNum) && this.temp.rechargeNum != null) {
          this.$notify({
                message: '次数/小时必须是正整数！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.cardType == 1 && (this.temp.expDate == null || this.temp.expDate == "" || this.temp.expDate == "undefined")){
              this.$notify({
                message: '有效年份不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.cardType == 2 && (this.temp.expDate == null || this.temp.expDate == "" || this.temp.expDate == "undefined")){
              this.$notify({
                message: '有效月份不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        this.$refs['rechargeDataForm'].validate((valid) => {      
         if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            cardRecharge(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.rechargeDialogShow = false
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

      // 批量续期
      renewalByTag() {
        if(this.temp.cardId == null || this.temp.cardId == "" || this.temp.cardId == "undefined"){
              this.$notify({
                message: '卡不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.tagId == null || this.temp.tagId == "" || this.temp.tagId == "undefined"){
              this.$notify({
                message: '标签不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.startTime == null || this.temp.startTime == "" || this.temp.startTime == "undefined"){
              this.$notify({
                message: '开始日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.endTime == null || this.temp.endTime == "" || this.temp.endTime == "undefined"){
              this.$notify({
                message: '结束日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        this.$refs['renewalByTagDataForm'].validate((valid) => {      
         if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            renewalByTag(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.renewalByTagDialogShow = false
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

      cardRenewal() {
        if(this.temp.startTime == null || this.temp.startTime == "" || this.temp.startTime == "undefined"){
              this.$notify({
                message: '开始日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.temp.endTime == null || this.temp.endTime == "" || this.temp.endTime == "undefined"){
              this.$notify({
                message: '结束日期不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        this.$refs['renewalDataForm'].validate((valid) => {      
         if (valid) {
            const tempData = Object.assign({}, this.temp)
            tempData.timestamp = +new Date(tempData.timestamp) 
            cardRenewal(tempData).then(() => {
              const index = this.list.findIndex(v => v.id === this.temp.id)
              this.list.splice(index, 1, this.temp)
              this.renewalDialogShow = false
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

      handleFilter() {
        if(this.proNum == null || this.proNum == "" || this.proNum == "undefined"){
              this.$notify({
                message: '请选择项目！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        if(this.cardType == null || this.cardType == "" || this.cardType == "undefined"){
              this.$notify({
                message: '请选择类型！',
                type: 'error',
                duration: 2000          
              })
              return
        }
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

      cardDisable(row, index) {
        this.$confirm('确认禁用?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          cardDisable(row.id,).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Successfully',
                type: 'success',
                duration: 2000
            })
              //this.list.splice(index, 1)
              this.getList();
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

      cardSecure(row, index) {
        this.$confirm('确认解除?', '提示', {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }).then(() => {
          cardSecure(row.id,).then((res) => {
            if (res.code == 20000) {
              this.$notify({
                title: 'Success',
                message: 'Successfully',
                type: 'success',
                duration: 2000
            })
              //this.list.splice(index, 1)
              this.getList();
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

      // 多选框选中数据
      handleSelectionChange(selection) {
        console.log("多选框选中数据");
        // 需要根据数据情况调整id名称
        this.cardCstCodes = selection.map(item => item.cstCode);
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
      if(this.cardCstCodes == null || this.cardCstCodes == "" || this.cardCstCodes == "undefined"){
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
        //操作选择充值，次数不能为空      
        if(this.temp.cardOption == 4 && (this.temp.totalNum == null || this.temp.totalNum == "" || this.temp.totalNum == "undefined")){
              this.$notify({
                message: '次数/小时不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
        // 正则表达式，匹配正整数
        var pattern = /^[1-9]\d*$/;
        if (!pattern.test(this.temp.totalNum) && this.temp.cardOption == 4 && this.temp.totalNum != null) {
          this.$notify({
                message: '次数/小时必须是正整数！',
                type: 'error',
                duration: 2000          
              })
              return
        }

        // if (this.temp.cardOption == 1 && this.temp.totalNum != null && this.temp.totalNum > 50) {
        //   this.$notify({
        //         message: '次数/小时不能超过50！',
        //         type: 'error',
        //         duration: 2000          
        //       })
        //       return
        // }

        if(this.temp.cardId == 1 && this.temp.cardOption == 4 && (this.temp.expDate == null || this.temp.expDate == "" || this.temp.expDate == "undefined")){
              this.$notify({
                message: '有效年份不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }

        if(this.temp.cardId == 2 && this.temp.cardOption == 4 && (this.temp.expDate == null || this.temp.expDate == "" || this.temp.expDate == "undefined")){
              this.$notify({
                message: '有效月份不能为空！',
                type: 'error',
                duration: 2000          
              })
              return
        }
         
        this.$refs['cardBulkOperationDataForm'].validate((valid) => {
         if (valid) {
            this.temp.cstCodeList = this.cardCstCodes;        
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

      cardCstBatchSelect(row) {
        this.temp = Object.assign({}, row) // copy obj
        this.temp.timestamp = new Date(this.temp.timestamp)  
        cardCstBatch(row.cardCode).then(response => {
          this.cardCstBatchList = response.data.cardCstBatchList
          this.cardCstBatchOperationDialogShow = true
          setTimeout(() => {
            this.cardCstBatchLoading = false
          }, 1.5 * 1000)
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
  @/api/gonggao/coupon
  