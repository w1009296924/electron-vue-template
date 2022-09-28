import os from "os";
import store from "@/store";

export const CONFIG_DIR = `${os.userInfo().homedir}\\electron-vue`;
export const DOC_DIR = `D:\\${store.state.user.name}归档目录\\`;
export const defaultVal = {
  settings: {
    fileDirectory: DOC_DIR,
    ruleList: [
      {
        pendingName: "提交代码审核",
        rule: "提内测前3天",
      },
      {
        pendingName: "上传说明书、需规",
        rule: "提内测前0天",
      },
    ],
    pengdingUser: "",
    auth: "readonly",
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
    autoCommitTime: "",
  },
  tools: {
    healthRemindSwitch: true, //健康提醒开关
    voiceSwitch: true, //提示音开关
    inputTime: 45, //提醒默认间隔
    inputWord: "您已经连续工作了%分钟了，休息一会吧~", //提醒默认话术
    dateRange: "", //工作量统计时间范围
  },
};
