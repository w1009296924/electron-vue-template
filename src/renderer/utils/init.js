import { getTaskTree } from "@/utils/taskTool.js";

//登录成功后执行该函数
export function initData() {
  getTaskTree().then((res) => {});
}
