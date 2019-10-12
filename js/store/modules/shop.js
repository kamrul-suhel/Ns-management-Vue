const state = {
    shops: [],
    selectedShop:{}
}

const mutations = {
    setShops(state, shops){
        let newShops = [...shops]
        state.shops = newShops
    },

    setSelectedShop(state, shopId){
        let selectedShop = state.shops.find((shop)=> {
            if(shop.id === shopId){
                return shop;
            }
        })
        state.selectedShop = {...selectedShop}
    }
}

const getters = {
    getShops(state){
        return state.shops
    },

    getSelectedShop(state){
        return state.selectedShop;
    },

    getSelectedShopId(state){
        return state.selectedShop.id;
    }
}

const actions = {
    async fetchShop({commit}, payload){
        let url = '/shops';
        await axios.get(url).then((response) => {
            commit('setShops', response.data);
        }).catch((error) => {
            console.log(error)
        })
    }
}

export default {
    state,
    mutations,
    getters,
    actions
}
