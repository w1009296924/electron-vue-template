import { DOC_DIR } from "@/utils/constans.js";
import {
  writeFileFromObjDir,
  globalTodoAdd,
  globalTodoDelete,
  globalTodoUpdate,
} from "@/utils/fileTool.js";
const mission = {
  state: {
    missionArray: [],
    lastUpdateMission: "",
  },
  mutations: {
    SET_UPDATED(state) {
      state.lastUpdateMission = new Date();
    },

    UPDATE_MISSION(state, missionArray) {
      state.missionArray = missionArray;
    },

    //添加待办（整体维度）
    ADD_MISSION(state, missionObj) {
      missionObj.id = missionObj.id || generateId();
      for (let i = 0; i < missionObj.children?.length; i++) {
        const child = missionObj.children[i];
        child.id = child.id || generateId();
      }
      state.missionArray.push(missionObj);
    },

    DELETE_MISSION(state, missionId) {
      state.missionArray = state.missionArray.filter((item) => {
        return item.id != missionId;
      });
    },

    //添加子待办（子维度）
    ADD_PENDING(state, [missionId, pendingObj]) {
      //根据missionId找到parent
      let parent = state.missionArray.find((element) => {
        return element.id == missionId;
      });
      parent.children = parent.children || [];
      parent.children.push(pendingObj);
    },

    DELETE_PENDING(state, [missionId, pendingId]) {
      //根据missionId找到parent
      let parent = state.missionArray.find((element) => {
        return element.id == missionId;
      });
      //根据pendingId删除子元素
      parent.children = parent.children?.filter((item) => {
        return item.id != pendingId;
      });
    },

    //修改Mssion，将传入的changeObj覆盖到原对象上
    MODIFY_MISSION(state, [missionId, changeObj]) {
      state.missionArray.forEach((mission) => {
        if (mission.id == missionId) {
          mission = { ...mission, ...changeObj };
        }
      });
    },

    //修改Pending，直接传入修改后的Pending对象
    MODIFY_PENDING(state, [pendingId, pendingObj]) {
      for (let i = 0; i < state.missionArray.length; i++) {
        const mission = state.missionArray[i];
        for (let j = 0; j < mission.children?.length; j++) {
          if (mission.children[j].id == pendingId) {
            mission.children[j] = pendingObj;
            this.commit("SORT_MISSION_CHILDREN", mission.id);
            return;
          }
        }
      }
    },

    SORT_MISSION_ARRAY(state) {
      state.missionArray = state.missionArray.sort((a, b) => {
        if (a.status != b.status) {
          return a.status ? 1 : -1;
        }
        return new Date(a.children[0].date) - new Date(b.children[0].date);
      });
      console.log("SORT_MISSION_ARRAY后结果：");
      console.log(state.missionArray);
    },

    SORT_MISSION_CHILDREN: (state, missionId) => {
      let parent = state.missionArray.find((element) => {
        return element.id == missionId;
      });
      parent.children = parent.children.sort((a, b) => {
        if (a.status != b.status) {
          return a.status ? 1 : -1;
        }
        return new Date(a.date) - new Date(b.date);
      });
      parent.status = parent.children[0].status;
      console.log("SORT_MISSION_CHILDREN后结果：");
      console.log(parent);
    },
    //???
    INIT_MISSIONDATA: (state) => {
      state.missionArray = [];
    },
  },
  actions: {
    updateMission({ commit }, missionArray) {
      commit("UPDATE_MISSION", missionArray);
      for (let index = 0; index < missionArray.length; index++) {
        const element = missionArray[index];
        commit("SORT_MISSION_CHILDREN", element.id);
      }
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    addMission({ commit }, [missionObj, increaseFlag = false]) {
      commit("ADD_MISSION", missionObj);
      //向global/Todo.txt添加新增待办
      if (increaseFlag) globalTodoAdd(missionObj);
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    deleteMission({ commit }, missionId) {
      let mission = getMissionById(missionId);
      mission.children = [];
      // 文件中删除;
      if (mission.fileDir == DOC_DIR + "global\\Todo.txt") {
        globalTodoDelete(missionId);
      } else {
        writeFileFromObjDir(mission);
      }
      commit("DELETE_MISSION", missionId);
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    addPending({ commit }, [missionId, pendingObj]) {
      pendingObj.id = pendingObj.id || generateId();
      commit("ADD_PENDING", [missionId, pendingObj]);
      commit("SORT_MISSION_CHILDREN", missionId);
      writeFileFromObjDir(getMissionById(missionId));
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    deletePending({ commit }, [missionId, pendingId]) {
      commit("DELETE_PENDING", [missionId, pendingId]);
      commit("SORT_MISSION_CHILDREN", missionId);
      const mission = getMissionById(missionId);
      writeFileFromObjDir(mission);
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    modifyMission({ commit }, [missionId, changeObj]) {
      commit("MODIFY_MISSION", [missionId, changeObj]);
      const mission = getMissionById(missionId);
      globalTodoUpdate(mission);
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    modifyPending({ commit }, [pendingId, pendingObj, missionId]) {
      commit("MODIFY_PENDING", [pendingId, pendingObj]); //已在该方法中对children进行排序
      const mission = getMissionById(missionId);
      if (mission.isBindMission === false) {
        globalTodoUpdate(mission);
      } else {
        writeFileFromObjDir(mission);
      }
      commit("SORT_MISSION_ARRAY");
      commit("SET_UPDATED");
    },
    //???
    setMissionData({ commit }, [mission, change]) {
      // console.log("mission");
      // console.log(mission);
      commit("SET_MISSIONDATA", [mission, change]);
      // if (change.status != null || change.children) {
      // commit("SORT_MISSIONCHILDREN", mission);
      commit("SORT_MISSIONARRAY");
      commit("SET_UPDATED");
      // }
    },
    // addMissionData({ commit }, [mission, increaseFlag = false]) {
    //   commit("ADD_MISSIONDATA", [mission, increaseFlag]);
    //   commit("SORT_MISSIONARRAY");
    //   commit("SET_UPDATED");
    // },
    initMissionData({ commit }) {
      commit("INIT_MISSIONDATA");
      commit("SET_UPDATED");
    },
  },
};

//获取id在mission中的值
function getMissionById(missionId) {
  return mission.state.missionArray.find((item) => {
    return item.id == missionId;
  });
}

//生成13+16位ID
function generateId() {
  return `${new Date().getTime()}${("" + Math.random()).slice(2)}`;
}
export default mission;
