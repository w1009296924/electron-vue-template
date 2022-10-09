import { initMission } from "@/utils/missionTool.js";
import { getTaskTree } from "@/utils/taskTool.js";
import fs from "fs";
import { CONFIG_DIR, DOC_DIR, DEFAULT_VAL } from "@/utils/constans.js";
import fileTool from "@/utils/fileTool.js";
import store from "@/store";
//登录成功后执行该函数
export function initData() {
  console.log("init函数执行---");
  // getTaskTree().then((res) => {});
  console.log("getTaskTree end---");
  new Promise((resolve, reject) => {
    //创建归档目录
    fileTool.createDir(DOC_DIR);
    //创建配置文件夹
    fileTool.createDir(CONFIG_DIR);
    //创建用户配置文件夹
    fileTool.createDir(`${CONFIG_DIR}\\${store.state.user.name}`);
    //创建配置文件
    fs.stat(
      `${CONFIG_DIR}\\${store.state.user.name}\\settings.ini`,
      (error) => {
        if (error) {
          fileTool.writeSettingFile(DEFAULT_VAL);
        }
      }
    );
    //创建非绑定任务的待办目录及文件
    fileTool.createDir(DOC_DIR + "global");
    fs.stat(`${DOC_DIR}global\\Todo.txt`, (error) => {
      if (error) {
        fs.writeFile(
          `${DOC_DIR}global\\Todo.txt`,
          JSON.stringify({ globalTodoList: [] }, null, 2),
          function () {
            resolve();
          }
        );
      } else {
        resolve();
      }
    });
  }).then(() => {
    initMission();
    setTimeout(() => {
      initNotice();
    }, 5000);
  });
  // getTaskTree().then((res) => { initMission(); });
}

function initNotice() {
  // const nn = require("node-notifier");
  // nn.notify({
  //   title: "待办提醒",
  //   message: `距还剩时间`,
  //   actions: ["OK"],
  // });
  let noticeArray = [];
  const missionArray = store.state.mission.missionArray;
  console.log(missionArray);
  missionArray.forEach((mission) => {
    mission.children.forEach((child) => {
      if (child.remindSwitch && !child.status) {
        noticeArray.push({
          info: mission.missionName + child.pendingType,
          remindDate: child.remindTime,
          realDate: child.date,
        });
      }
    });
  });
  noticeArray = noticeArray.sort((a, b) => {
    return Date.parse(a.remindDate) - Date.parse(b.remindDate);
  });
  console.log(noticeArray);
  const nn = require("node-notifier");
  noticeArray.forEach((notice) => {
    const timeout = Date.parse(notice.remindDate) - new Date();
    console.log(timeout);
    if (timeout > 0) {
      console.log(
        `距${notice.info}还剩${formatInterval(
          new Date(),
          Date.parse(notice.realDate)
        )}时间`
      );
      setTimeout(() => {
        nn.notify({
          title: "待办提醒",
          message: `距${notice.info}还剩${formatInterval(
            new Date(),
            Date.parse(notice.realDate)
          )}时间`,
          appID: " ",
          // actions: ["OK"],
        });
      }, timeout);
    }
  });
}

function formatInterval(startTime, endTime) {
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
}
