/**
 * Created by jiachenpan on 16/11/18.
 */

export function isvalidUsername(str) {
  // const validMap = ['admin', 'editor']
  // return validMap.indexOf(str.trim()) >= 0
  return str.length > 0;
}

/* 合法uri */
export function validateURL(textval) {
  const urlregex =
    /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
  return urlregex.test(textval);
}

/* 小写字母 */
export function validateLowerCase(str) {
  const reg = /^[a-z]+$/;
  return reg.test(str);
}

/* 大写字母 */
export function validateUpperCase(str) {
  const reg = /^[A-Z]+$/;
  return reg.test(str);
}

/* 大小写字母 */
export function validatAlphabets(str) {
  const reg = /^[A-Za-z]+$/;
  return reg.test(str);
}

/* 时间格式化 */
export const formatDateTime = (date) => {
  var date = new Date(date);
  var timeStr = date.getFullYear() + "-";
  if (date.getMonth() < 9) {
    //月份从0开始的
    timeStr += "0";
  }
  timeStr += date.getMonth() + 1 + "-";
  timeStr += date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
  if (
    Number(date.getHours()) +
      Number(date.getMinutes()) +
      Number(date.getSeconds()) !=
    0
  ) {
    timeStr += " ";
    timeStr += date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
    timeStr += ":";
    timeStr +=
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    timeStr += ":";
    timeStr +=
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
  }
  return timeStr;
};
/* 计算提前x分钟后的时间*/
export const subTrackTime = (date, min) => {
  var dateTimeStamp = new Date(date).getTime() - min * 60 * 1000;
  let a = formatDateTime(dateTimeStamp);
  console.log(a);
  return a;
  // return formatDateTime(dateTimeStamp);
};
