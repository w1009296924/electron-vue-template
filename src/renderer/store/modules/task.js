const task = {
    state: {
        taskArray: [
            { taskName: 'UT-WLJR-2022-0575',state:'dev' },
            { taskName: 'UT-WLJR-2022-0585',state:'dev' },
            { taskName: 'UT-WLJR-2022-0595',state:'dev' },
            { taskName: 'UT-WLJR-2022-0576',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0586',state:'sit' },
            { taskName: 'UT-WLJR-2022-0577',state:'uat' },
            { taskName: 'UT-WLJR-2022-0587',state:'uat' },
            { taskName: 'UT-WLJR-2022-0597',state:'uat' },
            { taskName: 'UT-WLJR-2022-0578',state:'rel' },
          ],
    },
    mutations: {
        SET_TASKARRAY: (state, taskArray) => {
            state.taskArray = taskArray
        },
        SET_NOWTASK:(state, nowTask) => {
            let [...newArray] = state.taskArray
            newArray.forEach(element => {
                    element.selected=element==nowTask;
            });
            state.taskArray = newArray
        }
    },
    actions: {
        SelectTask({ commit }, data){
            let [...newArray] = state.taskArray
            newArray.forEach(element => {
                    element.selected=element==data;
            });
            commit('SET_TASKARRAY', newArray)
        }
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
    }
}

export default task