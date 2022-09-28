import { DOC_DIR } from "./constans";
const path = require("path");

export function getTaskPath(task) {
  const strs = task.startTime.split("/");
  const time = strs[0] + "年" + strs[1] + "月";
  return path.join(DOC_DIR, time, task.taskName);
}

// export default {
//   getTaskPath,
// };
