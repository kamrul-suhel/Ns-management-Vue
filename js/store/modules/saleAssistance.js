const state = {
    products:[]
}


const getters = {

}

const mutations = {
    resetProductTransition(state){
        state.products = [];
    }
}

const actions = {
    setTransaction({state}, product){

        return new Promise((resolve, reject) => {
            if(state.products.length === 0){
                state.products.push(product);
                resolve();
            }else{
                if(state.products[product.index] === 'undefined'){
                    state.products.push(product);
                    console.log(state.products);
                    resolve();
                }else{
                    state.products[product.index] = product;
                    resolve();
                }
            }
        });
    },

    removeProduct({state}, removeProduct){
        return new Promise((resolve, reject) => {
            const totalProduct = state.products.filter((product, index) => {
                return product.id !== removeProduct.id;
            });

            state.products = [...totalProduct];
            resolve();
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
