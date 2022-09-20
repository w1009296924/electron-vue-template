const mission = {
  state: {
    missionArray: [
      {
        missionNo: "UT-WLJR-2022-0575",
        missionName:
          "UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-credit",
        status: false,
        children: [
          {
            pendingType: "提交内测",
            date: "2016-05-05",
            status: false,
            remind: 15,
          },
          {
            pendingType: "上传资料",
            date: "2016-05-06",
            status: false,
          },
          {
            pendingType: "提交业测",
            date: "2016-05-01",
            status: false,
          },
          {
            pendingType: "rel代码审核",
            date: "2016-05-07",
            status: false,
          },
          {
            pendingType: "投产",
            date: "2016-05-10",
            status: false,
          },
        ],
      },
      {
        missionNo: "UT-WLJR-2022-0575",
        missionName:
          "UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits",
        status: false,
        children: [
          {
            pendingType: "提交内测",
            date: "2016-04-04",
            status: false,
            remind: 15,
          },
          {
            pendingType: "上传资料",
            date: "2016-05-06",
            status: false,
          },
          {
            pendingType: "提交业测",
            date: "2016-05-07",
            status: false,
          },
          {
            pendingType: "rel代码审核",
            date: "2016-05-07",
            status: false,
          },
          {
            pendingType: "投产",
            date: "2016-05-10",
            status: false,
          },
        ],
      },
      {
        missionName: "会议室2801开会",
        status: false,
        children: [
          {
            pendingType: "",
            date: "2028-03-05 10:33:00",
            status: false,
          },
        ],
      },
    ],
  },
  mutations: {
    SET_MISSIONARRAY: (state, missionArray) => {
      state.missionArray = missionArray;
    },
    SET_MISSIONDATA: (state, [mission, change]) => {
      //   console.log("in");
      //   console.log(mission);
      //   console.log(change);
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
                console.log(element.children[index]);
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
            console.log(element.children);
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
          break;
        }
      }
      //   console.log(newArray);
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
  },
  actions: {
    setMissionData({ commit }, [mission, change]) {
      commit("SET_MISSIONDATA", [mission, change]);
      if (change.status != null || change.children) {
        commit("SORT_MISSIONARRAY");
      }
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
