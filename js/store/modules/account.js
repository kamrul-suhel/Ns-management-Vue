const state = {
    accounts:[]
}

const getters = {
    getAccounts(state){
        return state.accounts
    }
}

const mutations = {
    setAccounts(state, accounts){
        state.accounts = [...accounts]
    }
}

const actions = {

    fetchAllAccounts({commit}, payload){
        const URL = `/api/bankaccounts`
        axios.get(URL).then((response)=>{
            commit('setAccounts', response.data)
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
