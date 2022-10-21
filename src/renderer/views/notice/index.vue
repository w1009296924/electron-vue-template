<template>
  <div class="notice">
    <div class="header">
      <div>{{ noticeTitle }}</div>
      <img src="@/assets/notice-close.png" class="close-btn" @click="close" />
    </div>
    <div class="content" :class="{ center: noticeType != 3 }">
      <div v-if="noticeType == 1" class="healthRemind">
        <div>长时间不动，可能增加血栓形成风险</div>
        <div>建议起身活动一下</div>
      </div>
      <div v-else-if="noticeType == 2" class="pendingRemind">
        <div :class="{ smallFont: pendingRemind.info.length > 40 }">
          距离{{ pendingRemind.info }}还剩{{
            formatInterval(new Date(), Date.parse(pendingRemind.realDate))
          }}哦~
        </div>
        <div class="buttonLine">
          <div class="button" @click="close">知道了</div>
          <div class="button" @click="pendingDone">已办结</div>
        </div>
      </div>
      <div v-else class="summary">
        <div class="summaryTitle">
          今日共完成待办{{ todayList.length }}条
          <div v-if="todayList.length > 0" style="display: inline-block">
            ,具体如下:
          </div>
        </div>
        <div v-for="(item, index) of todayList" :key="index">{{ item }}</div>
        <div v-if="tomorrowList.length > 0" style="margin-top: 16px">
          <div class="summaryTitle">
            明日有{{ tomorrowList.length }}条待办待完成
          </div>
          <div v-for="(item, index) of tomorrowList" :key="index">
            {{ item.date }}&nbsp;&nbsp;&nbsp;&nbsp;{{ item.mission }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import { ipcRenderer } from "electron";
import { mapGetters } from "vuex";
import { modifyPendingStatus } from "@/utils/nativeRequest.js";
export default {
  props: ["noticeType1", "pendingRemind1", "todayList1", "tomorrowList1"],
  data() {
    return {
      noticeType: 3,
      pendingRemind: {
        missionId: "aaaa",
        pendingObj: {},
        info: "KEJI-2022-1682-手机银行人像认证安全加固场景接入(纪念日)-mspmk-cli-memorialdeposit提交代码审核",
        info1: "2801会议室开会",
        realDate: "2022-10-26",
      },
      todayList: [
        "KEJI-2022-1682提交代码审核",
        "KEJI-2022-1682提交内测评估",
        "KEJI-2022-1682提交内测评估",
        "KEJI-2022-1682提交内测评估",
        "KEJI-2022-1682提交内测评估",
        "KEJI-2022-1682提交内测评估",
        "KEJI-2022-1682提交内测",
        "2801会议室开会",
      ],
      tomorrowList: [
        { mission: "KEJI-2022-1682提交业测", date: "10-20" },
        { mission: "KEJI-2022-1682提交业测", date: "10-20" },
        { mission: "KEJI-2022-1682提交业测", date: "10-20" },
        { mission: "KEJI-2022-1682提交业测", date: "10-20" },
        { mission: "KEJI-2022-1682提交业测", date: "10-20" },
        { mission: "2802会议室开会", date: "2022-10-20 14:33:00" },
      ],
    };
  },
  computed: {
    ...mapGetters(["missionArray"]),
    noticeTitle() {
      return this.noticeType == 1
        ? "健康提醒"
        : this.noticeType == 2
        ? "待办提醒"
        : "今日总结";
    },
  },
  methods: {
    close() {
      // ipcRenderer.invoke("open-notice", data);
      // ipcRenderer.send("notice-close");
      var ipc = require("electron").ipcRenderer;
      // console.log(type);
      ipc.invoke("window-close");
    },
    pendingDone() {
      let pendingObj = this.pendingRemind.pendingObj;
      pendingObj.status = true;
      this.$store.dispatch("modifyPending", [
        pendingObj.id,
        pendingObj,
        pendingRemind.missionId,
      ]);
      //modifyPendingStatus 修改待办状态
      if (this.$store.state.grant.haveGrant) {
        console.log("上传服务端modifyPendingStatus");
        const mission = this.missionArray.find((item) => {
          return item.id == pendingRemind.missionId;
        });
        modifyPendingStatus(pendingObj.id, mission.status, true);
      }
      this.close();
    },
    formatInterval(startTime, endTime) {
      let usedTime = endTime - startTime; // 相差的毫秒数
      let days = Math.floor(usedTime / (24 * 3600 * 1000)); // 计算出天数
      let leavel = usedTime % (24 * 3600 * 1000); // 计算天数后剩余的时间
      let hours = Math.floor(leavel / (3600 * 1000)); // 计算剩余的小时数
      let leavel2 = leavel % (3600 * 1000); // 计算剩余小时后剩余的毫秒数
      let minutes = Math.floor(leavel2 / (60 * 1000)); // 计算剩余的分钟数
      let res = "";
      if (days > 0) {
        res += days + "天";
      }
      if (hours > 0) {
        res += hours + "小时";
      }
      res += minutes + "分钟";
      return res;
    },
  },
};
</script>

<style lang="scss" scoped>
.notice {
  background: url("~@/assets/notice-back.png") no-repeat;
  background-size: 100%;
  width: 100%;
  height: 100%;
  position: fixed;
  background-size: 100% 100%;
  font-size: 20px;
  color: #ffffff;
  text-align: justify;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-family: PingFangSC-Medium;
    font-weight: bold;
    margin: 11px 0 0 8px;
    padding: 0 16px 3px 20px;
    width: 100%;
    height: 40px;
    background-image: linear-gradient(
      90deg,
      rgba(1, 73, 163, 0.59) 0%,
      rgba(167, 174, 255, 0) 99%
    );
    .close-btn {
      cursor: pointer;
      height: 24px;
      width: 24px;
      padding-top: 4px;
      padding-left: 4px;
      border-radius: 2px;
    }
  }
  .center {
    text-align: center;
  }
  .content {
    margin: 30px 24px 0 24px;
    font-family: PingFangSC-Regular;
    font-weight: 400;
  }
  .pendingRemind {
    .smallFont {
      font-size: 16px;
    }
    .buttonLine {
      display: flex;
      align-items: center;
      justify-content: center;
      .button {
        margin: 20px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 94px;
        height: 36px;
        border: 0.5px solid #5b8ff9;
        border-radius: 2px;
        font-family: PingFangSC-Regular;
        font-size: 18px;
        color: #5b8ff9;
        font-weight: 400;
      }
    }
  }
  .summary {
    margin-top: -30px;
    font-family: PingFangSC-Regular;
    font-size: 16px;
    overflow-y: scroll;
    height: 190px;
    color: #ffffff;
    text-align: left;
    line-height: 24px;
    font-weight: 400;
  }
  .summaryTitle {
    display: inline-block;
    font-size: 20px;
    line-height: 32px;
  }
}
</style>
