const grant = {
  state: {
    haveGrant: false,
    grantList: [],
    grantedList: [],
  },
  mutations: {
    SET_GRANTLIST: (state, grantList) => {
      state.grantList = grantList;
    },
    SET_HAVEGRANT: (state, haveGrant) => {
      state.haveGrant = haveGrant;
    },
    SET_GRANTEDLIST: (state, grantedList) => {
      state.grantedList = grantedList;
    },
  },
  actions: {},
};

export default grant;
