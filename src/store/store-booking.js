const state = {
  currentBooking: {},
};

const mutations = {
    updateBooking(state, payload){
        state.currentBooking = payload.bookingData;
       
    }
};

const actions = {

    updateBooking({commit}, payload){
        commit('updateBooking', payload)
    }

};

const getters = {
  getCurrentBooking: (state) => {
    return state.currentBooking;
  },
};

export default {
  namespaced: true,
  state,
  mutations,
  actions,
  getters,
};
