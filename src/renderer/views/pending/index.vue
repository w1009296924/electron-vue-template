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
              style="width: 140px; padding-left: 10px"
              placeholder="请选择"
              @change="selectChange"
            >
              <el-option
                v-for="item in grantedList"
                :key="item.name"
                :value="item.name"
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
            <div>{{ tempinfo }}</div>
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
import { getMissionByName } from "@/utils/nativeRequest.js";
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
      refreshFlag: true,
      missionList: [],
      allGrantMissionList: [],
      showGrantMissionList: [],
      tempinfo: "",
    };
  },
  computed: {
    ...mapGetters(["missionArray", "lastUpdateMission", "grantedList"]),
    activeFirstPage() {
      return this.activeName == "first";
    },
  },
  watch: {
    lastUpdateMission: {
      handler() {
        this.missionList = this.missionArray;
      },
      immediate: true,
    },
  },
  created() {
    this.missionList = this.missionArray;
    this.init();
  },
  methods: {
    init() {
      this.queryInvestor = this.grantedList?.[0]?.name;
    },
    showDialog() {
      this.$refs.increaseDialog.show();
    },
    tabClick(tab) {
      if (tab.index == 1) {
        this.getMissionByName(this.queryInvestor);
      } else {
        this.search();
      }
    },
    selectChange() {
      this.getMissionByName(this.queryInvestor);
    },
    //查询他人待办
    async getMissionByName(queryNo) {
      const response = await getMissionByName(queryNo);
      this.tempinfo = response;
      this.allGrantMissionList = JSON.parse(
        JSON.stringify(response.data)
          .replace(/detailId/g, "id")
          .replace(/totalStatus/g, "status")
      );
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
        if (
          this.missionArray[i].missionNo &&
          this.missionArray[i].missionNo.match(this.searchInput)
        ) {
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
