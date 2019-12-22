const state = {
    companies : [],
    totalCompany : 0,
    selectedCompany: {},
    transitions:[],
    totalTransitions: 0,
    previousBalance:0,
    products:[],
    productSerials:[]
}

const getters = {
    getProductSerials(state){
        return state.productSerials
    },

    getCompanyProducts(state){
        return state.products
    },

    getCompanyPreviousBalance(state){
        return state.previousBalance
    },

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
    setProductSerialsByCompany(state, serials){
        state.productSerials = [...serials];
    },

    setCompanyProducts(state, products){
        state.products = [...products]
    },

    setPreviousBalance(state, balance){
        state.previousBalance = balance
    },

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

    fetchCompanyProducts({commit}, payload){
        const URL = `/api/companies/${payload.companyId}/product`
        axios.get(URL).then((response)=>{
            commit('setCompanyProducts', response.data.products)
        })
    },

    fetchProductSerialForCompany({commit}, payload){
        const URL = `/api/companies/product/${payload.productId}`
        axios.get(URL).then((response)=> {
            commit('setProductSerialsByCompany', response.data.serials)
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
                commit('setPreviousBalance', response.data.balance)
            }else{
                commit('setCompanyTransitions', [])
                commit('setCompanyTotalTransition', 0)
                commit('setCompanyTransitions', [])
                commit('setPreviousBalance', 0)
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
