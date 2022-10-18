import { CONFIG_DIR, DOC_DIR } from "@/utils/constans.js";
import store from "@/store";
const fs = require("fs");
const pathT = require("path");
const remote = require("@electron/remote");

function getfiles(path) {
  //读取目录下所有目录文件  返回数组
  return fs.readdirSync(path, { encoding: "utf8", withFileTypes: true });
}

function isFile(filepath) {
  //判断是否是文件 Boolean
  let stat = fs.statSync(filepath);
  return stat.isFile();
}

function isDir(filepath) {
  //判断是否是文件夹 Boolean
  let stat = fs.statSync(filepath);
  return stat.isDirectory();
}

export function getIcon(filepath) {
  return remote.app.getFileIcon(filepath);
  //   remote.app.getFileIcon(filepath).then((fileIcon) => {
  //     // console.log(fileIcon.toDataURL());
  //     return fileIcon.toDataURL();
  //   });
  // const icon = await remote.app.getFileIcon(filepath);
  // return icon.toDataURL();
}

//递归遍历所有文件夹和文件
// param1:路径  param2:将结果存储到该数组中
let time = 0;
function getAllfiles0(path, arr, deep = true) {
  // 结果将存储到arr数组中
  console.log("该函数已递归", ++time, "次");
  let filesArr = getfiles(path); // 获取目录下所有文件
  filesArr.forEach((item) => {
    item = item.name;
    // 需要过滤掉的文件  item是文件名或文件夹名
    if (
      item == "$RECYCLE.BIN" ||
      item == "System Volume Information" ||
      item == "is" ||
      item == "http-timer" ||
      item == "abbrev" ||
      item == "node_modules" ||
      item == "Todo.txt" ||
      item == "study"
    ) {
      return;
    }
    // console.log('item:')
    // console.log(item)
    if (isDir(pathT.join(path, item))) {
      //如果是文件夹
      if (deep) {
        let itemFileArr = [];
        getAllfiles(pathT.join(path, item), itemFileArr, false);
        let dir = { name: item, type: "dir", item: itemFileArr };
        arr.push(dir);
      } else {
        let dir = { name: item, type: "dir" };
        arr.push(dir);
      }
    } else if (isFile(ppathT.join(path, item))) {
      // 如果是文件
      arr.push({ name: item, type: "file" });
    } else {
      return;
    }
  });
}
export function getAllfiles(path, arr) {
  // 结果将存储到arr数组中
  console.log("该函数已递归", ++time, "次");
  console.log(path);
  // if (fs.statSync(path, { throwIfNoEntry: false }) == undefined) {
  //   fs.mkdirSync(path, { recursive: true });
  // }

  let filesArr = getfiles(path); // 获取目录下所有文件
  filesArr.forEach((item) => {
    item = item.name;
    // 需要过滤掉的文件  item是文件名或文件夹名
    if (
      item == "$RECYCLE.BIN" ||
      item == "System Volume Information" ||
      item == "Todo.txt"
    ) {
      return;
    }
    if (isDir(pathT.join(path, item))) {
      //如果是文件夹
      if (item == "编程能手-任务列表") {
        getAllfiles(pathT.join(path, item), arr, false);
      } else {
        arr.push({ name: item, path: pathT.join(path, item), type: "dir" });
      }
    } else if (isFile(pathT.join(path, item))) {
      // 如果是文件
      arr.push({ name: item, path: pathT.join(path, item), type: "file" });
    }
  });
}
function readSettingFile() {
  const data = fs.readFileSync(
    `${CONFIG_DIR}\\${store.state.user.name}\\settings.ini`,
    "utf-8"
  );
  return JSON.parse(data);
}
function writeSettingFile(settingObj) {
  fs.writeFileSync(
    `${CONFIG_DIR}\\${store.state.user.name}\\settings.ini`,
    JSON.stringify(settingObj, null, 2)
  );
}
//创建文件夹
function createDir(directory) {
  try {
    fs.statSync(directory);
  } catch {
    fs.mkdirSync(directory);
  }
}
//写入文件
export function writeFileFromObjDir(fileObj) {
  fs.writeFile(
    fileObj.fileDir,
    JSON.stringify(fileObj, null, 2),
    function () {}
  );
}
//本地文件更新任务工作量
export function setWorkLoad(fileDir, workload) {
  let file = JSON.parse(fs.readFileSync(fileDir));
  file.workload = workload;
  fs.writeFile(fileDir, JSON.stringify(file, null, 2), function () {});
}
//更新global/Todo.txt
export function globalTodoUpdate(updateObj) {
  fs.readFile(DOC_DIR + "global\\Todo.txt", "utf-8", (err, data) => {
    let globalTodo = JSON.parse(data);
    let globalTodoIdx = globalTodo.globalTodoList.findIndex((item) => {
      if (item.id == updateObj.id) {
        return true;
      }
    });
    globalTodo.globalTodoList[globalTodoIdx] = updateObj;
    fs.writeFile(
      DOC_DIR + "global\\Todo.txt",
      JSON.stringify(globalTodo, null, 2),
      function () {}
    );
  });
}
//删除global/Todo.txt待办
export function globalTodoDelete(missionId) {
  fs.readFile(DOC_DIR + "global\\Todo.txt", "utf-8", (err, data) => {
    let globalTodo = JSON.parse(data);
    let globalTodoIdx = globalTodo.globalTodoList.findIndex((item) => {
      if (item.id == missionId) {
        return true;
      }
    });
    globalTodo.globalTodoList.splice(globalTodoIdx, 1);
    fs.writeFile(
      DOC_DIR + "global\\Todo.txt",
      JSON.stringify(globalTodo, null, 2),
      function () {}
    );
  });
}
//新增global/Todo.txt待办
export function globalTodoAdd(addObj) {
  fs.readFile(DOC_DIR + "global\\Todo.txt", "utf-8", (err, data) => {
    let globalTodo = JSON.parse(data);
    globalTodo.globalTodoList.push(addObj);
    fs.writeFile(
      DOC_DIR + "global\\Todo.txt",
      JSON.stringify(globalTodo, null, 2),
      function () {}
    );
  });
}
//获取归档目录上级的年月目录
function getDatePath(task) {
  const strs = task.startTimeReal.split("/");
  const time = strs[0] + "年" + strs[1] + "月";
  return pathT.join(DOC_DIR, time);
}
//获取任务目录
function getDemandPath(task) {
  const strs = task.startTime.split("/");
  const time = strs[0] + "年" + strs[1] + "月";
  return pathT.join(DOC_DIR, time, task.taskName);
}
export default {
  getAllfiles,
  getIcon,
  readSettingFile,
  writeSettingFile,
  createDir,
  getDatePath,
  getDemandPath,
  setWorkLoad,
};
