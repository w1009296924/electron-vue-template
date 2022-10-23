import {
  queryGrantUserList,
  queryGrantedUserList,
} from "@/utils/nativeRequest.js";
import store from "@/store";
//获取我授权的用户列表
export function getGrantUserList() {
  let grantList = [];
  return new Promise((resolve) => {
    console.log("getGrantUserList");
    queryGrantUserList(store.state.user.name)
      .then((res) => {
        grantList = res;
        if (grantList.length > 0) {
          store.commit("SET_GRANTLIST", grantList);
          store.commit("SET_HAVEGRANT", true);
        }
        console.log("--交易查询grantList", grantList);
        resolve();
      })
      .catch(() => {
        // grantList = [
        //   {
        //     permission: "只读",
        //     grant: "wenty",
        //   },
        //   {
        //     permission: "只读",
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
  console.log("getGrantedUserList");
  return new Promise((resolve) => {
    queryGrantedUserList(
      store.state.user.name ? store.state.user.name : "liyw11"
    )
      .then((res) => {
        grantedList = res;
        if (grantedList.length > 0) {
          store.commit("SET_GRANTEDLIST", grantedList);
        }
        console.log("--交易查询grantedList", grantedList);
        resolve();
      })
      .catch(() => {
        grantedList = [
          {
            permission: "只读",
            name: "liyw11",
          },
          {
            permission: "新增",
            name: "wenty",
          },
          {
            permission: "新增",
            name: "wangs64",
          },
        ];
        if (grantedList.length > 0) {
          store.commit("SET_GRANTEDLIST", grantedList);
        }
        resolve();
      });
  });
}
