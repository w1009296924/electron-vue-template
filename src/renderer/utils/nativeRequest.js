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

export function addMission(name, missionArray) {
  return instance({
    data: {
      Trans: "ADD_MISSION",
      name: name,
      missionArray: missionArray,
    },
  });
}

export function addPending(name, missionId, pendingObj) {
  return instance({
    data: {
      Trans: "ADD_PENDING",
      name: name,
      missionId: missionId,
      pendingObj: pendingObj,
    },
  });
}

export function deleteMission(missionId) {
  return instance({
    data: {
      Trans: "DELETE_MISSION",
      missionId: missionId,
    },
  });
}

export function deletePending(pendingId) {
  return instance({
    data: {
      Trans: "DELETE_PENDING",
      pendingId: pendingId,
    },
  });
}

export function modifyMission(missionId, missionObj) {
  return instance({
    data: {
      Trans: "MODIFY_MISSION",
      missionId: missionId,
      missionObj: missionObj,
    },
  });
}

export function modifyPendingStatus(pendingId, totalStatus, status) {
  return instance({
    data: {
      Trans: "MODIFY_PENDING_STATUS",
      pendingId: pendingId,
      totalStatus: totalStatus,
      status: status,
    },
  });
}

export function modifyPendingInfo(pendingId, pendingObj) {
  return instance({
    data: {
      Trans: "MODIFY_PENDING_INFO",
      pendingId: pendingId,
      pendingObj: pendingObj,
    },
  });
}

export function queryGrantUserList(name) {
  return instance({
    data: {
      Trans: "QUERY_GRANT_USERLIST",
      name: name,
    },
  });
}

export function modifyGrantUserList(name, grantList) {
  return instance({
    data: {
      Trans: "MODIFY_GRANT_USERLIST",
      name: name,
      grantList: grantList,
    },
  });
}

export function queryGrantedUserList(name) {
  return instance({
    data: {
      Trans: "QUERY_GRANTED_USERLIST",
      name: name,
    },
  });
}

export function getGrantedPending(name) {
  return instance({
    data: {
      Trans: "GET_GRANTED_PENDING",
      name: name,
    },
  });
}

export default {
  post,
  FdevLogin,
  FdevQueryTask,
  FdevQueryTaskDetail,
};
