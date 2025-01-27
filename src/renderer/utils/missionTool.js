import { DOC_DIR, CONFIG_DIR, BASE_PENDINGRULE } from "./constans";
import { subTrackTime } from "@/utils/validate.js";
import { addMission } from "@/utils/nativeRequest.js";
import fileTool from "@/utils/fileTool.js";
import fs from "fs";
import store from "@/store";

export function initMission() {
  store.dispatch("initMissionData");
  //读取本地配置文件
  let settings = JSON.parse(
    fs.readFileSync(
      `${CONFIG_DIR}\\${store.state.user.name}\\settings.ini`,
      "utf-8"
    )
  );
  let nowDateTime = new Date().getTime();
  //生成任务文件夹 加载进vuex
  store.getters.taskArray.forEach((item, index) => {
    //判断有无该任务文件夹,没有则创建文件夹,有则读取todo文件加入vuex
    fs.stat(fileTool.getDemandPath(item) + "\\" + "Todo.txt", (error) => {
      if (error) {
        //待办规则 基础待办规则BASE_PENDINGRULE 自定义待办规则settings.ruleList
        let pendingChildren = [];
        BASE_PENDINGRULE.forEach((rule) => {
          if (
            rule.missionType == "全部" ||
            rule.missionType == item.demandNo.substring(0, 4)
          ) {
            pendingChildren.push({
              id: generateId(),
              pendingType: rule.pendingName,
              date: getPendingDate(item, rule) + " 00:00:00",
              status: false,
            });
          }
        });
        settings.settings.ruleList.forEach((rule) => {
          if (
            rule.missionType == "全部" ||
            rule.missionType == item.demandNo.substring(0, 4)
          ) {
            pendingChildren.push({
              id: generateId(),
              pendingType: rule.pendingName,
              date: getPendingDate(item, rule) + " 00:00:00",
              status: false,
            });
          }
        });
        //生成本地待办文件
        let todoObj = {
          id: generateId(),
          missionNo: item.demandNo,
          missionName: item.taskName,
          fileDir: fileTool.getDemandPath(item) + "\\" + "Todo.txt",
          status: false,
          children: pendingChildren,
        };
        todoObj.children = todoObj.children.sort((a, b) => {
          if (a.status != b.status) {
            return a.status ? 1 : -1;
          }
          return new Date(a.date) - new Date(b.date);
        });
        fs.writeFile(
          fileTool.getDemandPath(item) + "\\" + "Todo.txt",
          JSON.stringify(todoObj, null, 2),
          function () {}
        );
        //待办加入vuex
        store.dispatch("addMission", [todoObj]);
      } else {
        //任务待办加入vuex
        fs.readFile(
          fileTool.getDemandPath(item) + "\\" + "Todo.txt",
          "utf-8",
          (err, data) => {
            const pushObj = JSON.parse(data);
            const length = pushObj.children.length;
            if (length > 0) {
              const intervalDays =
                (nowDateTime -
                  new Date(pushObj.children[length - 1].date).getTime()) /
                (60000 * 24 * 60);
              //删除后的数据以及全部完成三天后的数据不展示
              if (!pushObj.status || (pushObj.status && intervalDays < 3)) {
                store.dispatch("addMission", [JSON.parse(data)]);
              }
            }
          }
        );
      }
    });
  });
  //global里面的待办加入vuex
  fs.readFile(`${DOC_DIR}global\\Todo.txt`, "utf-8", (err, globalTodo) => {
    const globalTodoList = JSON.parse(globalTodo).globalTodoList;
    if (globalTodoList.length > 0) {
      globalTodoList.forEach((data) => {
        const intervalDays =
          (nowDateTime - new Date(data.children[0].date).getTime()) /
          (60000 * 24 * 60);
        //已完成三天后的数据不展示
        if (!data.status || (data.status && intervalDays < 3)) {
          store.dispatch("addMission", [data]);
        }
      });
    }
  });
  //待办数据上传服务端,每次启动上传当前的待办事项
  if (store.state.grant.haveGrant) {
    console.log("上传服务端addMission");
    setTimeout(() => {
      addMission(store.state.user.name, store.getters.missionArray);
    }, 5000);
  }
}

function getPendingDate(task, rule) {
  let time =
    rule.compareTo == "任务启动"
      ? task.startTimeReal
      : rule.compareTo == "提交内测"
      ? task.sitTime
      : rule.compareTo == "提交业测"
      ? task.uatTime
      : task.fireTime;
  return subTrackTime(time, rule.beforeDays * 60 * 24);
}

//生成13+16位ID
function generateId() {
  return `${new Date().getTime()}${("" + Math.random()).slice(2)}`;
}
