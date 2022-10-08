import { DOC_DIR, CONFIG_DIR, BASE_PENDINGRULE } from "./constans";
import { subTrackTime } from '@/utils/validate.js';
import fileTool from '@/utils/fileTool.js';
import fs from 'fs';
import store from "@/store";

export function initMission() {
  store.dispatch('initMissionData');
  //读取本地配置文件
  let settings = JSON.parse(fs.readFileSync(`${CONFIG_DIR}\\settings.ini`, 'utf-8'));
  //生成任务文件夹 加载进vuex
  store.getters.taskArray.forEach((item, index) => {
    //判断有无该任务文件夹,没有则创建文件夹,有则读取todo文件加入vuex
    fs.stat(getDemandPath(item), (error) => {
      if (error) {
        //先生成年月的文件夹
        fileTool.createDir(getSubDemandPath(item));
        //再生成任务文件夹
        fileTool.createDir(getDemandPath(item));
        //生成本地待办文件 基础待办规则BASE_PENDINGRULE 自定义待办规则settings.ruleList
        let pendingChildren = [];
        BASE_PENDINGRULE.forEach((rule) => {
          if (
            rule.missionType == '全部' ||
            rule.missionType == item.demandNo.substring(0, 4)
          ) {
            pendingChildren.push({
              id: '',
              pendingType: rule.pendingName,
              date: getPendingDate(item, rule),
              status: false,
            });
          }
        });
        settings.settings.ruleList.forEach((rule) => {
          if (
            rule.missionType == '全部' ||
            rule.missionType == item.demandNo.substring(0, 4)
          ) {
            pendingChildren.push({
              id: '',
              pendingType: rule.pendingName,
              date: getPendingDate(item, rule),
              status: false,
            });
          }
        });
        const todoObj = {
          missionNo: item.demandNo,
          missionName: item.taskName,
          todoDir: getDemandPath(item) + '\\' + 'Todo.txt',
          status: false,
          children: pendingChildren,
        };
        //待办加入vuex
        store.dispatch('addMissionData', [todoObj]);
        fs.stat(getDemandPath(item) + '\\' + 'Todo.txt', (error) => {
          if (error) {
            fs.writeFile(
              getDemandPath(item) + '\\' + 'Todo.txt',
              JSON.stringify(todoObj, null, 2),
              function () {}
            );
          }
        });
      } else {
        //任务待办加入vuex
        fs.readFile(
          getDemandPath(item) + '\\' + 'Todo.txt',
          'utf-8',
          (err, data) => {
            if (data) {
              store.dispatch('addMissionData', [JSON.parse(data)]);
            }
          }
        );
      }
    });
  });
  //global里面的待办加入vuex
  fs.readFile(
    `${DOC_DIR}global\\Todo.txt`,
    'utf-8',
    (err, globalTodo) => {
      const globalTodoList = JSON.parse(globalTodo).globalTodoList;
      if (globalTodoList.length > 0) {
        globalTodoList.forEach((data) => {
          store.dispatch('addMissionData', [data]);
        });
      }
    }
  );
  //根据设置的授权列表和待办事项id判断是否上传数据库
}

function getPendingDate(task, rule) {
  let time =
    rule.compareTo == '任务启动'
      ? task.startTimeReal
      : rule.compareTo == '提交内测'
      ? task.sitTime
      : rule.compareTo == '提交业测'
      ? task.uatTime
      : task.fireTime;
  return subTrackTime(time, rule.timeInterval * 60 * 24);
}
//获取归档目录上级的年月目录
function getSubDemandPath(task) {
  let strs = task.startTimeReal.split('/');
  return DOC_DIR + strs[0] + '年' + strs[1] + '月';
}
//获取任务归档目录
function getDemandPath(task) {
  return getSubDemandPath(task) + '\\' + task.taskName;
}