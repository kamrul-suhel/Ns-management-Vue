const state = {
    isDrawerOpen: true
}

const getters = {
    getIsDrawerOpen(state){
        return state.isDrawerOpen
    }
}

const mutations = {
    setIsDrawerOpen(state, status){
        state.isDrawerOpen = status
    }
}

const actions = {
}

export default {
    state,
    getters,
    mutations,
    actions
}
