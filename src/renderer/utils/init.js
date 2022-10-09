import { initMission } from "@/utils/missionTool.js";
import { getTaskTree } from "@/utils/taskTool.js";
import fs from "fs";
import { CONFIG_DIR, DOC_DIR, DEFAULT_VAL } from "@/utils/constans.js";
import fileTool from "@/utils/fileTool.js";
import store from "@/store";
//登录成功后执行该函数
export function initData() {
  console.log("init函数执行---");
  getTaskTree().then((res) => {});
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
  });
  // getTaskTree().then((res) => { initMission(); });
}
