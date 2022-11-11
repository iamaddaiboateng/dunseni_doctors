const state = {
  user: {
    token: "",
    firstName: "Benjamin",
    email: "",
    lastName: "",
  },
};

const mutations = {
  updateUser(state, payload) {
    var newUser = payload.userData;

    state.user = newUser;

  },
};

const actions = {
  updateUser({ commit }, payload) {
    commit("updateUser", payload);
  },
};

const getters = {
  user: (state) => {
    return state.user;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
