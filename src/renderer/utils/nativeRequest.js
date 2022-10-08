import axios from "axios";
import store from "@/store";

const instance = axios.create({
  baseURL: "http://10.134.13.24:8080/learnlab/proxy/paygate",
  timeout: 3000,
  method: "post",
  headers: {
    "Content-type": "application/json",
  },
});

export function post(params) {
  return instance({
    data: {
      Trans: "MODE_FDEV_QUERYTASK",
      userName: "liuyz14",
    },
  });
}
export function FdevLogin(name, pwd) {
  if (name == "admin")
    return new Promise((resolve) => {
      resolve();
    });
  return instance({
    data: {
      Trans: "MODE_FDEV_LOGIN",
      userName: name,
      password: pwd,
    },
  });
}

export function FdevQueryTask() {
  const userName =
    store.state.user.name == "Super Admin" ? "liuyz14" : store.state.user.name;
  return instance({
    data: {
      Trans: "MODE_FDEV_QUERYTASK",
      userName: userName,
    },
  });
}

export function FdevQueryTaskDetail(taskId) {
  const userName =
    store.state.user.name == "Super Admin" ? "liuyz14" : store.state.user.name;
  return instance({
    data: {
      Trans: "MODE_FDEV_QUERYTASKDETAIL",
      userName: userName,
      taskId: taskId,
    },
  });
}

export default {
  post,
  FdevLogin,
  FdevQueryTask,
  FdevQueryTaskDetail,
};
