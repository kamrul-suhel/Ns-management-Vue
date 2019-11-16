const state = {
    companies : [],
    totalCompany : 0,
    selectedCompany: {},
    transitions:[],
    totalTransitions: 0

}

const getters = {
    getCompanies(state) {
        return state.companies;
    },

    getTotalCompany(state){
        return state.totalCompany;
    },

    getSelectedCompanies(state){
        return state.selectedCompany;
    },

    getCompanyTransitions(state){
        return state.transitions;
    },

    getTotalTransition(state){
        return state.totalTransitions;
    }
}

const mutations = {
    setCompanies(state, companies){
        state.companies = [...companies];
    },

    setTotalCompany(state, totalCompany){
        state.totalCompany = totalCompany;
    },

    setSelectedCompany(state, company){
        state.selectedCompany = {...company};
    },

    setCompanyTransitions(state, transitions){
        state.transitions = [...transitions];
    },

    setCompanyTotalTransition(state, totalTransition){
        state.totalTransitions = totalTransition;
    }
}

const actions = {
    loadCompanies({commit}, payload){
        axios.get('/company')
            .then((response) => {
                // Check is company exists
                if(response.data.companies.length > 0){
                    commit('setCompanies', response.data.companies);
                    commit('setTotalCompany', response.data.totalCompany);
                    commit('setCompanyTransitions', response.data.allTransition);
                }else{
                    commit('setCompanies', []);
                    commit('setTotalCompany', 0);
                    commit('setCompanyTransitions', []);
                }
            })
            .catch((error) => {
                console.log(error)
            })
    },

    loadCompanyTransitions({ commit }, payload){
        const companyId = payload.companyId;
        const url = '/company?companyId='+companyId;
        axios.get(url).then((response)=>{
            if(response.data.companyTransaction.length > 0){
                commit('setCompanyTransitions', response.data.companyTransaction);
                commit('setCompanyTotalTransition', response.data.totalTransitions)
                commit('setCompanyTransitions', response.data.allTransition);
            }else{
                commit('setCompanyTransitions', []);
                commit('setCompanyTotalTransition', 0)
                commit('setCompanyTransitions', []);
            }
        })
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}