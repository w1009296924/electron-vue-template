const user = {
  state: {
    token: JSON.parse(localStorage.getItem("token")),
    name: JSON.parse(localStorage.getItem("name")),
    roles: JSON.parse(localStorage.getItem("roles")),
    password: JSON.parse(localStorage.getItem("password")),
  },

  mutations: {
    SET_TOKEN: (state, token) => {
      localStorage.setItem("token", JSON.stringify(token));
      state.token = token;
    },
    SET_NAME: (state, name) => {
      localStorage.setItem("name", JSON.stringify(name));
      state.name = name;
    },
    SET_ROLES: (state, roles) => {
      localStorage.setItem("roles", JSON.stringify(roles));
      state.roles = roles;
    },
    SET_PASSWORD: (state, password) => {
      localStorage.setItem("password", JSON.stringify(password));
      state.password = password;
    },
  },

  actions: {
    // 登录
    Login({ commit }, data) {
      return new Promise((resolve, reject) => {
        if (data.username.includes("admin")) {
          commit("SET_TOKEN", "admin");
          commit("SET_NAME", "Super Admin");
        } else {
          commit("SET_TOKEN", data.username);
          commit("SET_NAME", data.username);
          commit("SET_PASSWORD", data.password);
          console.log("SET_NAME");
        }
        location.reload();
        resolve();
      });
    },

    // 登出
    LogOut({ commit }) {
      return new Promise((resolve, reject) => {
        commit("SET_TOKEN", "");
        commit("SET_ROLES", []);
        resolve();
      });
    },

    // 前端 登出
    FedLogOut({ commit }) {
      return new Promise((resolve) => {
        commit("SET_TOKEN", "");
        resolve();
      });
    },
    GetUserInfo({ commit, state }) {
      return new Promise((resolve, reject) => {
        console.log(state.name);
        if (state.token.includes("admin")) {
          commit("SET_ROLES", ["admin"]);
        } else {
          commit("SET_ROLES", ["edit"]);
        }
        resolve(state);
      });
    },
  },
};

export default user;
