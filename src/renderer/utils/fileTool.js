const fs = require("fs");
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

function getIcon(filepath) {
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
      item == "study"
    ) {
      return;
    }
    // console.log('item:')
    // console.log(item)
    if (isDir(path + item)) {
      //如果是文件夹
      if (deep) {
        let itemFileArr = [];
        getAllfiles(path + item + "/", itemFileArr, false);
        let dir = { name: item, type: "dir", item: itemFileArr };
        arr.push(dir);
      } else {
        let dir = { name: item, type: "dir" };
        arr.push(dir);
      }
    } else if (isFile(path + item)) {
      // 如果是文件
      arr.push({ name: item, type: "file" });
    } else {
      return;
    }
  });
}
function getAllfiles(path, arr) {
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
      item == "study"
    ) {
      return;
    }
    if (isDir(path + item)) {
      //如果是文件夹
      if (item == "编程能手-任务列表") {
        getAllfiles(path + item + "/", arr, false);
      } else {
        arr.push({ name: item, path: path + item, type: "dir" });
      }
    } else if (isFile(path + item)) {
      // 如果是文件
      arr.push({ name: item, path: path + item, type: "file" });
    }
  });
}

export default {
  getAllfiles,
  getIcon,
};
