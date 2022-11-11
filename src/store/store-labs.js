const state = {
    labs : []
}

const mutations = {
    updateLab(state, payload) {
        var newLab = payload.lab;
    
        state.lab.push(newLab);
    
      },
}

const actions = {

}

const getters = {

}