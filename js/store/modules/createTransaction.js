const state = {
    availableProducts: []
}

const mutations = {
    setAvailableProducts(state, products){
        state.availableProducts = [...products]
    }
}

const getters = {
    getAvailableProducts(state){
        return state.availableProducts
    }
}

const actions = {

}

export default {
    state,
    mutations,
    getters,
    actions
}
