<template>
<div class="app-container">
  <div class="pending-container">
    <el-tabs v-model="activeName">
      <el-tab-pane name="first">
        <span slot="label" class="title">我的待办</span>
        <div class="titleCenter">
          <el-input placeholder="请输入内容" prefix-icon="el-icon-search" class="searchInput" v-model="searchInput" />
          <i class="el-icon-circle-plus-outline" />
        </div>
        <PendingList v-for="(item,key) of tableData" :key="key" :detail="item" />
      </el-tab-pane>
      <el-tab-pane name="second">
        <span slot="label" class="title">授权的待办</span>
      </el-tab-pane>
    </el-tabs>
  </div>
</div>
</template>

<script>
import PendingList from './components/pendingList.vue';
import {
  mapGetters
} from "vuex";
export default {
  name: "tools",
  components: {PendingList},
  data() {
    return {
      activeName: 'first',
      searchInput: '',
      tableData: [{
        id: 1,
        date: '2016-05-04',
        missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
        pendingName: '提交内测',
        children: [{
          pendingName: '提交内测',
          date: '2016-05-04',
        }, {
          pendingName: '提交内测',
          date: '2016-05-04',
        }]
      },{
        id: 1,
        date: '2016-05-04',
        missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
        pendingName: '提交内测',
      }]
    }
  },
  computed: {
    ...mapGetters(["name", "roles"]),
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
  margin-bottom: 40px;
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

::v-deep .el-input__inner {
  padding-left: 35px;
  border-radius: 20px;
}

::v-deep .el-input__icon {
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

</style>
