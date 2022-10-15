import { DOC_DIR } from "./constans";
import { FdevQueryTask, FdevQueryTaskDetail } from "@/utils/nativeRequest.js";
import fileTool from "@/utils/fileTool.js";
import fs from "fs";
import store from "@/store";
const path = require("path");

export function getTaskPath(task) {
  const strs = task.startTime.split("/");
  const time = strs[0] + "年" + strs[1] + "月";
  return path.join(DOC_DIR, time, task.taskName);
}

export function getTaskTree() {
  return new Promise((resolve, reject) => {
    FdevQueryTask()
      .then((res) => {
        let taskList = res.data;
        store.commit("SET_TASKARRAY", taskList);
        let promiseList = [];
        taskList.forEach((task, index) => {
          //判断有无该任务文件夹,没有则创建文件夹
          fs.stat(fileTool.getDemandPath(task), (error) => {
            if (error) {
              //先生成年月的文件夹
              fileTool.createDir(fileTool.getDatePath(task));
              //再生成任务文件夹
              fileTool.createDir(fileTool.getDemandPath(task));
            }
          });
          const pms = new Promise((resolve1) => {
            FdevQueryTaskDetail(task.id).then((res2) => {
              taskList[index] = { ...taskList[index], ...res2.data };
              resolve1();
            });
          });
          promiseList.push(pms);
        });
        Promise.all(promiseList).then((result) => {
          store.commit("SET_TASKARRAY", taskList);
          resolve();
        });
      })
      .catch((e) => {
        reject();
      });
  });
}
export function loadTaskFile() {
  store.getters.taskArray.forEach((task, index) => {
    const fileDir = fileTool.getDemandPath(task) + "\\" + "mission.txt";
    //生成或写入mission.txt
    fs.stat(fileDir, (error) => {
      if (error) {
        fs.writeFile(
          fileDir,
          JSON.stringify({ ...task, fileDir: fileDir }, null, 2),
          function () {}
        );
      } else {
        //更新任务信息,保留工作量
        const workload = JSON.parse(fs.readFileSync(fileDir, "utf-8")).workload;
        fs.writeFile(
          fileDir,
          JSON.stringify({ ...task, workload: workload }, null, 2),
          function () {}
        );
      }
    });
  });
}
// export default {
//   getTaskPath,
// };
