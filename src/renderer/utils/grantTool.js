import {
  queryGrantUserList,
  queryGrantedUserList,
} from "@/utils/nativeRequest.js";
import store from "@/store";
//获取我授权的用户列表
export function getGrantUserList() {
  let grantList = [];
  return new Promise((resolve) => {
    queryGrantUserList(store.state.user.name)
      .then((res) => {
        grantList = res;
        if (grantList.length > 0) {
          store.commit("SET_GRANTLIST", grantList);
          store.commit("SET_HAVEGRANT", true);
        }
        resolve();
      })
      .catch(() => {
        // grantList = [
        //   {
        //     permission: "只读",
        //     isOK: false,
        //     grant: "wenty",
        //   },
        //   {
        //     permission: "只读",
        //     isOK: false,
        //     grant: "wangs2",
        //   },
        // ];
        if (grantList.length > 0) {
          store.commit("SET_GRANTLIST", grantList);
          store.commit("SET_HAVEGRANT", true);
        }
        resolve();
      });
  });
}

//获取授权我的用户列表
export function getGrantedUserList() {
  let grantedList = [];
  return new Promise((resolve) => {
    queryGrantedUserList(store.state.user.name)
      .then((res) => {
        grantedList = res;
        if (grantedList.length > 0) {
          store.commit("SET_GRANTEDLIST", grantedList);
        }
        resolve();
      })
      .catch(() => {
        grantedList = [
          {
            permission: "只读",
            investorNo: "liyw11",
            investorName: "李亚威",
          },
          {
            permission: "新增",
            investorNo: "wenty",
            investorName: "文天阳",
          },
          {
            permission: "新增",
            investorNo: "wangs64",
            investorName: "王双",
          },
        ];
        if (grantedList.length > 0) {
          store.commit("SET_GRANTEDLIST", grantedList);
        }
        resolve();
      });
  });
}
