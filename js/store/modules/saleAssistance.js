const state = {
    products: [],
    saleAssistants: [],
    selectedSaleAssistant : {}
}


const getters = {
    getSaleAssistants(state) {
        return state.saleAssistants;
    },

    getSaleAssistantProducts(state){
        return state.products;
    },

    getSelectedSaleAssistant(state){
        return state.selectedSaleAssistant;
    },

    getSelectedSaleAssistantId(state){
        return state.selectedSaleAssistant.id;
    }

}

const mutations = {
    setSaleAssistants(state, saleAssistants) {
        state.saleAssistants = [...saleAssistants];
    },

    setProduct(state, product){
        state.products.push(product);
    },

    setProducts(state, products){
        console.log('products is: ', products);

        state.products = [...products];
    },

    removeSaleAssistantProduct(state, product){

        const products = state.products.filter((curProduct)=> {
            return curProduct.barcode != product.barcode
        });

        state.products = [...products]
    },

    setSaleAssistant(state, saleAssistant){
        state.selectedSaleAssistant = {...saleAssistant}
    },

    resetSaleAssistant(state){
        state.products = [];
        state.saleAssistants = [];
        state.selectedSaleAssistant = {};
    }
}

const actions = {
    async getSaleAssistant({commit}, payload) {
        // Get sale assistant
        axios.get('/api/users?type=sale-assistant')
            .then((response) => {
                commit('setSaleAssistants', response.data)
            });
    },

    async getSaleAssistantProducts({commit}, payload){
        const url = '/api/sale-assistant/products?date='+payload.date+'&userId='+payload.selectedUser.id
        axios.get(url)
            .then((response) => {
                commit('setSaleAssistant', payload.selectedUser)
                commit('setProducts', response.data)
            });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
