/**
 * 在这里则是state.文件名.状态名
 */
const getters = {
  sidebar: (state) => state.app.sidebar,
  device: (state) => state.app.device,
  token: (state) => state.user.token,
  avatar: (state) => state.user.avatar,
  name: (state) => state.user.name,
  roles: (state) => state.user.roles,
  permission_routes: (state) => state.permission.routers,
  taskArray: (state) => state.task.taskArray,
  nowTask: (state) => state.task.nowTask,
  missionArray: (state) => state.mission.missionArray,
  grantList: (state) => state.grant.grantList,
  grantedList: (state) => state.grant.grantedList,
  lastUpdateMission: (state) => state.mission.lastUpdateMission,
};

export default getters;
