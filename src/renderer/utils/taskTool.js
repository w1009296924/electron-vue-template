import { DOC_DIR } from "./constans";
import { FdevQueryTask, FdevQueryTaskDetail } from "@/utils/nativeRequest.js";
import store from "@/store";
const path = require("path");

export function getTaskPath(task) {
  const strs = task.startTime.split("/");
  const time = strs[0] + "年" + strs[1] + "月";
  return path.join(DOC_DIR, time, task.taskName);
}

export function getTaskTree() {
  return new Promise((resolve, reject) => {
    FdevQueryTask().then((res) => {
      let taskList = res.data;
      store.commit("SET_TASKARRAY", taskList);
      let promiseList = [];
      taskList.forEach((task, index) => {
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
    });
  });
}

// export default {
//   getTaskPath,
// };
