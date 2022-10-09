const fs = require("fs");
import { DOC_DIR } from "@/utils/constans.js";
const mission = {
  state: {
    missionArray: [],
  },
  mutations: {
    INIT_MISSIONDATA: (state) => {
      state.missionArray = [];
    },
    ADD_MISSIONDATA: (state, [missionObj, increaseFlag]) => {
      let newArray;
      [...newArray] = state.missionArray;
      if (missionObj.isBindMission) {
        let missionIdx = newArray.findIndex((item) => {
          if (item.missionName == missionObj.missionName) {
            return true;
          }
        });
        newArray[missionIdx].children.push(missionObj.children[0]);
        newArray[missionIdx].children = newArray[missionIdx].children.sort(
          (a, b) => {
            if (a.status != b.status) {
              return a.status ? 1 : -1;
            }
            return new Date(Date.parse(a.date)) - new Date(Date.parse(b.date));
          }
        );
        fs.writeFile(
          newArray[missionIdx].todoDir,
          JSON.stringify(newArray[missionIdx], null, 2),
          function () {}
        );
      } else {
        newArray.push(missionObj);
        //新增全局待办时,向global/Todo.txt添加新增待办
        if (increaseFlag) {
          fs.readFile(DOC_DIR + "global\\Todo.txt", "utf-8", (err, data) => {
            let globalTodo = JSON.parse(data);
            globalTodo.globalTodoList.push(missionObj);
            fs.writeFile(
              DOC_DIR + "global\\Todo.txt",
              JSON.stringify(globalTodo, null, 2),
              function () {}
            );
          });
        }
      }
      //   console.log(newArray);
      state.missionArray = newArray;
    },
    SET_MISSIONARRAY: (state, missionArray) => {
      state.missionArray = missionArray;
    },
    SET_MISSIONDATA: (state, [mission, change]) => {
      // console.log("in");
      // console.log(mission);
      // console.log(change);
      let newArray;
      [...newArray] = state.missionArray;
      for (let index = 0; index < newArray.length; index++) {
        let element = newArray[index];
        if (element == mission) {
          if (change.children) {
            for (let j = 0; j < change.children.length; j++) {
              let changeItem = change.children[j];
              element.children.map((item, index) => {
                if (item.pendingType == changeItem.pendingType) {
                  element.children[index] = { ...item, ...changeItem };
                }
              });
            }
            element.children = element.children.sort((a, b) => {
              if (a.status != b.status) {
                return a.status ? 1 : -1;
              }
              return (
                new Date(Date.parse(a.date)) - new Date(Date.parse(b.date))
              );
            });
          }
          let flag = true;
          for (let i = 0; i < element.children.length; i++) {
            const el = element.children[i];
            if (!el.status) {
              flag = false;
              break;
            }
          }
          element.status = flag;
          newArray[index] = {
            ...element,
            ...change,
            children: element.children,
          };
          const submitObj = newArray[index]; //读文件异步导致值变化
          if (newArray[index].isBindMission === false) {
            fs.readFile(DOC_DIR + "global\\Todo.txt", "utf-8", (err, data) => {
              let globalTodo = JSON.parse(data);
              let globalTodoIdx = globalTodo.globalTodoList.findIndex(
                (item) => {
                  if (item.missionName == submitObj.missionName) {
                    return true;
                  }
                }
              );
              globalTodo.globalTodoList[globalTodoIdx] = submitObj;
              fs.writeFile(
                DOC_DIR + "global\\Todo.txt",
                JSON.stringify(globalTodo, null, 2),
                function () {}
              );
            });
          } else {
            fs.writeFile(
              newArray[index].todoDir,
              JSON.stringify(newArray[index], null, 2),
              function () {}
            );
          }
          break;
        }
      }
      state.missionArray = newArray;
    },
    SORT_MISSIONARRAY: (state) => {
      state.missionArray = state.missionArray.sort((a, b) => {
        if (a.status != b.status) {
          return a.status ? 1 : -1;
        }
        return (
          new Date(Date.parse(a.children[0].date)) -
          new Date(Date.parse(b.children[0].date))
        );
      });
      console.log("更新后结果：");
      console.log(state.missionArray);
    },
    SORT_MISSIONCHILDREN: (state, mission) => {
      mission.children = mission.children.sort((a, b) => {
        if (a.status != b.status) {
          return a.status ? 1 : -1;
        }
        return new Date(Date.parse(a.date)) - new Date(Date.parse(b.date));
      });
    },
    INIT_MISSIONARRAY: (state) => {
      state.missionArray.forEach((todo, index) => {
        if (todo.children.length > 1) {
          todo.children = todo.children.sort((a, b) => {
            if (a.status != b.status) {
              return a.status ? 1 : -1;
            }
            return new Date(Date.parse(a.date)) - new Date(Date.parse(b.date));
          });
        }
      });
      state.missionArray = state.missionArray.sort((a, b) => {
        if (a.status != b.status) {
          return a.status ? 1 : -1;
        }
        return (
          new Date(Date.parse(a.children[0].date)) -
          new Date(Date.parse(b.children[0].date))
        );
      });
    },
    DELETE_MISSION(state, mission) {
      state.missionArray = state.missionArray.filter((item) => {
        return item != mission;
      });
    },
    DELETE_MISSIONCHILD(state, [mission, pendingType]) {
      console.log(pendingType);
      let index = state.missionArray.findIndex((item) => {
        return item == mission;
      });
      state.missionArray[index].children = state.missionArray[
        index
      ].children.filter((child) => {
        return child.pendingType != pendingType;
      });
      console.log(state.missionArray[index].children);
    },
  },
  actions: {
    setMissionData({ commit }, [mission, change]) {
      // console.log("mission");
      // console.log(mission);
      commit("SET_MISSIONDATA", [mission, change]);
      // if (change.status != null || change.children) {
      commit("SORT_MISSIONCHILDREN", mission);
      commit("SORT_MISSIONARRAY");
      // }
    },
    addMissionData({ commit }, [mission, increaseFlag = false]) {
      commit("ADD_MISSIONDATA", [mission, increaseFlag]);
      commit("SORT_MISSIONARRAY");
    },
    initMissionData({ commit }) {
      commit("INIT_MISSIONDATA");
    },
    // updateMissionDate({ commit }){

    // }
    // GenerateRoutes({ commit }, data) {
    //     return new Promise(resolve => {
    //         const roles = data
    //         let accessedRouters = []
    //         // 在这里当是管理员权限时,就给予所有的路由表
    //         if (roles === 'admin') {
    //             accessedRouters = asyncRoutes || []
    //         } else {
    //             // 根据需通过得到的权限于路由表中对比得到该用户应有的边栏
    //             accessedRouters = filterAsyncRouter(asyncRoutes, roles)
    //             // 根据产品类型再次处理路由表
    //         }
    //         commit('SET_ROUTERS', accessedRouters)
    //         resolve(accessedRouters)
    //     })
    // },
    // ResetRoutes({ commit }, data) {
    //     commit('RESET_ROUTERS', [])
    // }
  },
};

export default mission;
