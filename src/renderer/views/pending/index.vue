<template>
<div class="app-container">
  <div class="pending-container">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label" class="title">我的待办</span>
        <div class="titleCenter">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" class="searchInput" v-model="searchInput" />
          <i class="el-icon-circle-plus-outline" @click="dialogVisible = true " />
        </div>
        <div class="maxHeight">
          <PendingList v-for="(item,key) of tableData" :key="key" :detail="item" />
        </div>
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label" class="title">授权的待办</span>
        <div class="titleCenter">
          <el-select v-model="queryInvestor" style="width:130px" placeholder="请选择">
            <el-option v-for="item in investorList" :key="item.investorNo" :label="item.investorName" :value="item.investorNo"></el-option>
          </el-select>
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" class="searchInput" v-model="searchInput" />
          <i class="el-icon-circle-plus-outline" @click="dialogVisible = true " />
        </div>
        <div class="maxHeight">
          <PendingList v-for="(item,key) of tableData2" :key="key" :detail="item" />
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog title="新增待办 " :visible.sync="dialogVisible" width="30%">
      <div class="dialogContent">
        <div class="dialogLine" style="margin-bottom: 8px">
          <div class="dialogText">待办时间</div>
          <el-date-picker v-model="pendingTime" style="margin: 0 8px;width:224px;" type="datetime" placeholder="选择日期时间" />
        </div>
        <div class="dialogLine" style="margin-bottom: 8px">
          <div class="dialogText">待办事项</div>
          <el-input v-model="pengingSth" style="margin: 0 8px;width:224px;" placeholder="请输入" @change='test' />
        </div>
        <!-- <div class="dialogLine" style="margin-bottom: 8px">
          <div class="dialogText">需求编号</div>
          <el-select v-model="missionNo" style="margin: 0 8px;width:224px" placeholder="请选择（可为空）">
            <el-option v-for="item in missionList" :key="item.missionNo" :label="item.missionName" :value="item.missionNo" ></el-option>
          </el-select>
        </div> -->
        <div class="dialogLine" style="margin-bottom: 8px">
          <div class="dialogText">待办人</div>
          <el-select v-model="investor" style="margin: 0 8px;width:224px" placeholder="请选择">
            <el-option v-for="item in investorList" :key="item.investorNo" :label="item.investorName" :value="item.investorNo"></el-option>
          </el-select>
        </div>
        <div class="dialogLine">
          <div class="dialogText">提 醒</div>
          <el-switch v-model="remindSwitch" style="margin:0 32px 0 8px" />
          <div class="smallText">开始前
            <el-input-number v-model="inputMin" controls-position="right" size="" style="width:96px;margin:0 8px;" :min="1" :max="120" />分钟提醒我</div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addPending">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</div>
</template>

<script>
import {
  formatDateTime
} from '@/utils/validate.js'
import PendingList from './components/pendingList2.vue';
import {
  mapGetters
} from "vuex";
export default {
  name: "tools",
  components: {
    PendingList
  },
  data() {
    return {
      activeName: 'first',
      searchInput: '',
      dialogVisible: false,
      pendingTime: '',
      pengingSth: '',
      missionNo: '',
      missionList: [{
        missionNo: 'UT-WLJR-2022-0575',
        missionName: '测试4'
      }, {
        missionNo: 'UT-WLJR-2022-0525',
        missionName: '测试3'
      }, {
        missionNo: 'UT-WLJR-2022-0505',
        missionName: '测试2'
      }, {
        missionNo: 'KEJI-2022-0575',
        missionName: '测试1'
      }, ],
      investor: '12066391',//新增key
      queryInvestor: '12066391',//查询key
      investorList: [{
        investorNo: '12066391',
        investorName: '本人'
      }, {
        investorNo: '12066390',
        investorName: '李亚威'
      }, ],
      remindSwitch: false,
      inputMin: 15,
      tableData: [{
          id: 1,
          missionNo: 'UT-WLJR-2022-0575',
          missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
          status: false,
          children: [{
            pendingType: '提交内测',
            date: '2016-05-05',
            status: false
          }, {
            pendingType: '上传资料',
            date: '2016-05-06',
            status: false
          }, {
            pendingType: '提交业测',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: 'rel代码审核',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: '投产',
            date: '2016-05-10',
            status: false
          }]
        }, {
          id: 2,
          missionNo: '',
          missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
          status: false,
          children: [{
            pendingType: '提交内测',
            date: '2016-05-05',
            status: false
          }, {
            pendingType: '上传资料',
            date: '2016-05-06',
            status: false
          }, {
            pendingType: '提交业测',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: 'rel代码审核',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: '投产',
            date: '2016-05-10',
            status: false
          }]
        }, {
          id: 3,
          missionNo: '',
          missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
          status: false,
          children: [{
            pendingType: '提交内测',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: '上传资料',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: '提交业测',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: 'rel代码审核',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: '投产',
            date: '2022-09-14',
            status: false
          }]
        },
        {
          id: 2,
          missionNo: '',
          missionName: '会议室2801开会',
          status: false,
          children: [{
            pendingType: '其他',
            date: '2028-03-05 10:33:00',
            status: false
          }]
        }
      ],
      tableData2: [{
          id: 1,
          missionNo: 'UT-WLJR-2022-0575',
          missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
          status: false,
          children: [{
            pendingType: '提交内测',
            date: '2016-05-05',
            status: false
          }, {
            pendingType: '上传资料',
            date: '2016-05-06',
            status: false
          }, {
            pendingType: '提交业测',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: 'rel代码审核',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: '投产',
            date: '2016-05-10',
            status: false
          }]
        }, {
          id: 2,
          missionNo: '',
          missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
          status: false,
          children: [{
            pendingType: '提交内测',
            date: '2016-05-05',
            status: false
          }, {
            pendingType: '上传资料',
            date: '2016-05-06',
            status: false
          }, {
            pendingType: '提交业测',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: 'rel代码审核',
            date: '2016-05-07',
            status: false
          }, {
            pendingType: '投产',
            date: '2016-05-10',
            status: false
          }]
        }, {
          id: 3,
          missionNo: '',
          missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
          status: false,
          children: [{
            pendingType: '提交内测',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: '上传资料',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: '提交业测',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: 'rel代码审核',
            date: '2022-09-14',
            status: false
          }, {
            pendingType: '投产',
            date: '2022-09-14',
            status: false
          }]
        },
        {
          id: 2,
          missionNo: '',
          missionName: '会议室2801开会',
          status: false,
          children: [{
            pendingType: '其他',
            date: '2028-03-05 10:33:00',
            status: false
          }]
        }
      ]
    }
  },
  computed: {
    ...mapGetters(["name", "roles"]),
  },
  methods: {
    test() {},
    addPending() {
      if (!this.pendingTime) {
        this.$message({
          message: '请选择待办时间',
          type: 'warning'
        });
      } else if (!this.pengingSth) {
        this.$message({
          message: '请输入待办事项',
          type: 'warning'
        });
      } else {
        this.tableData.push({
          id: 5,
          missionName: this.pengingSth,
          status: false,
          children: [{
            pendingType: '其他',
            date: formatDateTime(this.pendingTime),
            status: false
          }]
        })
        this.dialogVisible = false;
      }
      // var index = this.tableData.findIndex(item => item.missionNo == this.missionNo);
      // index == -1 ? 
      // this.tableData[index].children.push({
      //     pendingType: this.pengingSth,
      //     date: this.pendingTime,
      //     status:false
      //   });
    }
  }
};
</script>

<style lang="scss" scoped>
.pending-container {
  height: 875px;
  border: 2px;
  background-color: #ffffff;
}

.titleCenter {
  display: flex;
  align-items: center;
  margin-bottom: 10px;
}

.title {
  position: relative;
  top: 10px;
  width: 120px;
  height: 55px;
  padding: 16px 20px;
  font-family: PingFangSC-Medium;
  font-size: 20px;
  text-align: center;
  line-height: 22px;
  font-weight: 600;
}

::v-deep .el-tabs__item {
  height: 55px;
}

.searchInput {
  width: 500px;
  padding: 0 10px;
}

::v-deep .titleCenter .el-input--prefix .el-input__inner {
  padding-left: 35px;
  border-radius: 20px;
}
::v-deep .titleCenter .el-select .el-input--suffix .el-input__inner {
  padding-left: 35px;
  border-radius: 20px;
}

::v-deep .titleCenter .el-input__prefix .el-input__icon {
  padding-left: 20px;
}

.el-icon-circle-plus-outline {
  cursor: pointer;
  color: #bbc5dd;
  font-weight: 100;
  font-size: 35px;
}

.el-icon-circle-plus-outline:hover {
  cursor: pointer;
  color: #409EFF;
  font-weight: 100;
  font-size: 35px;
}

.maxHeight {
  height: 700px;
  overflow: scroll;
}

.dialogLine {
  display: flex;
  align-items: center;
  line-height: 32px;
}

.dialogText {
  width: 56px;
  text-align: right;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.smallText {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
  font-weight: 400;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #E4E7ED;
}

::v-deep .el-dialog__title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  font-weight: 700;
}
::v-deep .el-dialog__footer{
  border-top: 1px solid #E4E7ED;
}
</style>
