import os from "os";
import store from "@/store";
import fs from "fs";
export const CONFIG_DIR = `${os.userInfo().homedir}\\electron-vue`;
export const DEFAULT_VAL = {
  settings: {
    fileDirectory: `D:\\${store.state.user.name}归档目录`,
    ruleList: [
      {
        pendingName: "提交代码审核",
        rule: "提交内测前3天",
        compareTo: "提交内测",
        beforeDays: 3,
        missionType: "全部",
      },
      {
        pendingName: "上传说明书、需规",
        rule: "提交内测前0天",
        compareTo: "提交内测",
        beforeDays: 0,
        missionType: "全部",
      },
    ],
    grantList: [],
    remindDaysSwitch: true,
    remindDaysTime: "",
  },
  hour: {
    hourType: "1",
    unit: "",
    smartChoose: false,
    type: "",
    category: "",
    jobContent: "",
    autoCommit: false,
    autoCommitTime: "17:30",
  },
  tools: {
    healthRemindSwitch: true, //健康提醒开关
    voiceSwitch: true, //提示音开关
    inputTime: 45, //提醒默认间隔
    inputWord: "您已经连续工作了%分钟了，休息一会吧~", //提醒默认话术
    dateRange: "", //工作量统计时间范围
  },
};
let DOC_DIR_TMP;
try {
  DOC_DIR_TMP =
    JSON.parse(
      fs.readFileSync(
        `${CONFIG_DIR}\\${store.state.user.name}\\settings.ini`,
        "utf-8"
      )
    ).settings.fileDirectory + "\\";
} catch (error) {
  DOC_DIR_TMP = DEFAULT_VAL.settings.fileDirectory + "\\";
}
export const DOC_DIR = DOC_DIR_TMP;
export const BASE_PENDINGRULE = [
  {
    pendingName: "提交内测评估",
    compareTo: "任务启动",
    beforeDays: -3,
    missionType: "全部",
  },
  {
    pendingName: "提交内测",
    compareTo: "提交内测",
    beforeDays: 0,
    missionType: "全部",
  },
  {
    pendingName: "提交业测评估",
    compareTo: "提交业测",
    beforeDays: 3,
    missionType: "KEJI",
  },
  {
    pendingName: "提交业测",
    compareTo: "提交业测",
    beforeDays: 0,
    missionType: "全部",
  },
  {
    pendingName: "投产信息登记",
    compareTo: "投产",
    beforeDays: 9,
    missionType: "全部",
  },
  {
    pendingName: "提交自测报告",
    compareTo: "投产",
    beforeDays: 9,
    missionType: "KEJI",
  },
  {
    pendingName: "上线确认书",
    compareTo: "投产",
    beforeDays: 7,
    missionType: "UT-W",
  },
  {
    pendingName: "登记rel代码审核",
    compareTo: "投产",
    beforeDays: 7,
    missionType: "全部",
  },
  {
    pendingName: "投产",
    compareTo: "投产",
    beforeDays: 0,
    missionType: "全部",
  },
];
