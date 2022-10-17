<template>
  <div class="app-container">
    <div class="pending-container">
      <el-tabs v-model="activeName" @tab-click="tabClick">
        <el-tab-pane name="first">
          <span slot="label" class="title">我的待办</span>
          <div class="titleCenter">
            <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              class="searchInput"
              v-model="searchInput"
              @change="search"
            />
            <i class="el-icon-circle-plus-outline" @click="showDialog" />
          </div>
          <div v-if="refreshFlag" class="maxHeight">
            <transition-group name="todo-trans" tag="div">
              <div v-for="item of missionList" :key="item.id">
                <PendingList style="width: 1000px" :todo="item" /></div
            ></transition-group>
          </div>
        </el-tab-pane>
        <el-tab-pane name="second">
          <span slot="label" class="title">授权的待办</span>
          <div class="titleCenter">
            <el-select
              v-model="queryInvestor"
              style="width: 130px; padding-left: 10px"
              placeholder="请选择"
              @change="selectChange"
            >
              <el-option
                v-for="item in investorList"
                :key="item.investorNo"
                :label="item.investorName"
                :value="item.investorNo"
              ></el-option>
            </el-select>
            <el-input
              placeholder="请输入内容"
              prefix-icon="el-icon-search"
              class="searchInput"
              v-model="searchInput"
              @change="searchGranted"
            />
            <i class="el-icon-circle-plus-outline" @click="showDialog" />
          </div>
          <div v-if="refreshFlag" class="maxHeight">
            <PendingList
              v-for="(item, key) of showGrantMissionList"
              style="width: 1000px"
              :key="key"
              :showCheck="false"
              :showRightClickMenu="false"
              :todo="item"
            />
          </div>
        </el-tab-pane>
      </el-tabs>
      <IncreaseDialog
        ref="increaseDialog"
        :activeFirstPage="activeFirstPage"
        @refresh="refresh"
      />
    </div>
  </div>
</template>

<script>
import PendingList from "@/components/PendingList";
import IncreaseDialog from "@/components/IncreaseDialog";
import { mapGetters } from "vuex";
export default {
  name: "tools",
  components: {
    PendingList,
    IncreaseDialog,
  },
  data() {
    return {
      activeName: "first",
      searchInput: "",
      queryInvestor: "",
      investorList: [],
      refreshFlag: true,
      missionList: [],
      allGrantMissionList: [],
      showGrantMissionList: [],
      tableData2: [
        {
          id: 1,
          missionNo: "UT-WLJR-2022-0575",
          missionName:
            "UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits",
          status: false,
          children: [
            {
              pendingType: "提交内测",
              date: "2016-05-05",
              status: false,
            },
            {
              pendingType: "上传资料",
              date: "2016-05-06",
              status: false,
            },
            {
              pendingType: "提交业测",
              date: "2016-05-07",
              status: false,
            },
            {
              pendingType: "rel代码审核",
              date: "2016-05-07",
              status: false,
            },
            {
              pendingType: "投产",
              date: "2016-05-10",
              status: false,
            },
          ],
        },
        {
          id: 2,
          missionNo: "",
          missionName:
            "UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits",
          status: false,
          children: [
            {
              pendingType: "提交内测",
              date: "2016-05-05",
              status: false,
            },
            {
              pendingType: "上传资料",
              date: "2016-05-06",
              status: false,
            },
            {
              pendingType: "提交业测",
              date: "2016-05-07",
              status: false,
            },
            {
              pendingType: "rel代码审核",
              date: "2016-05-07",
              status: false,
            },
            {
              pendingType: "投产",
              date: "2016-05-10",
              status: false,
            },
          ],
        },
        {
          id: 3,
          missionNo: "",
          missionName:
            "UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits",
          status: false,
          children: [
            {
              pendingType: "提交内测",
              date: "2022-09-14",
              status: false,
            },
            {
              pendingType: "上传资料",
              date: "2022-09-14",
              status: false,
            },
            {
              pendingType: "提交业测",
              date: "2022-09-14",
              status: false,
            },
            {
              pendingType: "rel代码审核",
              date: "2022-09-14",
              status: false,
            },
            {
              pendingType: "投产",
              date: "2022-09-14",
              status: false,
            },
          ],
        },
        {
          id: 2,
          missionNo: "",
          missionName: "会议室2801开会",
          status: false,
          children: [
            {
              pendingType: "其他",
              date: "2028-03-05 10:33:00",
              status: false,
            },
          ],
        },
      ],
      tableData3: [
        {
          id: 1,
          missionNo: "UT-WLJR-2022-0575",
          missionName:
            "UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits",
          status: false,
          children: [
            {
              pendingType: "提交内测",
              date: "2016-05-05",
              status: false,
            },
            {
              pendingType: "上传资料",
              date: "2016-05-06",
              status: false,
            },
            {
              pendingType: "提交业测",
              date: "2016-05-07",
              status: false,
            },
            {
              pendingType: "rel代码审核",
              date: "2016-05-07",
              status: false,
            },
            {
              pendingType: "投产",
              date: "2016-05-10",
              status: false,
            },
          ],
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["missionArray"]),
    activeFirstPage() {
      return this.activeName == "first";
    },
  },
  watch: {
    missionArray: {
      handler() {
        this.missionList = this.missionArray;
      },
      deep: true,
      immediate: true,
    },
  },
  created() {
    this.missionList = this.missionArray;
    this.init();
  },
  methods: {
    async init() {
      //从数据库获取授予了权限的人名单 queryGrantedUserList
      // this.investorList = await queryGrantedUserList(this.$store.state.user.userNo);
      this.investorList = [
        {
          granted: "liyw11",
          permission: "只读",
          investorNo: "12066390",
          investorName: "李亚威",
        },
        {
          granted: "wenty",
          permission: "新增",
          investorNo: "12066391",
          investorName: "文天阳",
        },
      ];
      this.queryInvestor = this.investorList?.[0]?.investorNo;
    },
    showDialog() {
      this.$refs.increaseDialog.show();
    },
    tabClick(tab) {
      if (tab.index == 1) {
        this.getGrantedPending(this.queryInvestor);
      } else {
        this.search();
      }
    },
    selectChange() {
      this.getGrantedPending(this.queryInvestor);
    },
    //查询他人待办
    async getGrantedPending(queryNo) {
      // this.allGrantMissionList = await getGrantedPending(queryNo);
      //测试用
      this.allGrantMissionList =
        this.queryInvestor == "12066391" ? this.tableData2 : this.tableData3;
      this.searchGranted();
    },
    refresh() {
      this.refreshFlag = false;
      this.$nextTick(() => {
        this.refreshFlag = true;
      }, 500);
    },
    search() {
      this.missionList = [];
      for (let i = 0; i < this.missionArray.length; i++) {
        //匹配需求编号
        if (this.missionArray[i].missionNo.match(this.searchInput)) {
          this.missionList.push(this.missionArray[i]);
          //匹配需求名称
        } else if (this.missionArray[i].missionName.match(this.searchInput)) {
          this.missionList.push(this.missionArray[i]);
        }
      }
    },
    searchGranted() {
      this.showGrantMissionList = [];
      for (let i = 0; i < this.allGrantMissionList.length; i++) {
        //匹配需求编号
        if (this.allGrantMissionList[i].missionNo.match(this.searchInput)) {
          this.showGrantMissionList.push(this.allGrantMissionList[i]);
          //匹配需求名称
        } else if (
          this.allGrantMissionList[i].missionName.match(this.searchInput)
        ) {
          this.showGrantMissionList.push(this.allGrantMissionList[i]);
        }
      }
    },
  },
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
  color: #409eff;
  font-weight: 100;
  font-size: 35px;
}

.maxHeight {
  height: 700px;
  overflow: scroll;
}

::v-deep .el-input__icon {
  line-height: 32px;
}
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}
.todo-trans-move {
  transition: transform 0.4s ease;
}
</style>
