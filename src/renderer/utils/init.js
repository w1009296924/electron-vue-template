import { initMission } from "@/utils/missionTool.js";
import fs from 'fs';
import {
  CONFIG_DIR,
  DOC_DIR,
  DEFAULT_VAL
} from '@/utils/constans.js';
import fileTool from '@/utils/fileTool.js';
//登录成功后执行该函数
export function initData() {
  new Promise((resolve, reject) => {
    //创建配置文件夹
    fileTool.createDir(CONFIG_DIR);
    //创建配置文件
    fs.stat(`${CONFIG_DIR}\\settings.ini`, (error) => {
      if (error) {
        fileTool.writeSettingFile(DEFAULT_VAL);
      }
    });
    //创建归档目录
    fileTool.createDir(DOC_DIR);
    //创建非绑定任务的待办目录及文件
    fileTool.createDir(DOC_DIR + 'global');
    fs.stat(`${DOC_DIR}global\\Todo.txt`, (error) => {
      if (error) {
        fs.writeFile(
          `${DOC_DIR}global\\Todo.txt`,
          JSON.stringify({ globalTodoList: [] }, null, 2),
          function () { resolve(); }
        );
      }else {
        resolve();
      }
    });
  }).then(() => {
    initMission();
  });
  // getTaskTree().then((res) => { initMission(); });
}

