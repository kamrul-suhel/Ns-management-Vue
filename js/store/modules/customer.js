const state = {
    allCustomers: [],
    totalTransaction: 0,
    allTransactions: [],
    customerTransactionTotal: 0,
    customerTransactionDue: 0,
    customerCredit: 0,
    customerDebit: 0,
    customerBalance: 0,
}

const getters = {
    getAllCustomers(state) {
        return state.allCustomers;
    },

    getTotalTransaction(state) {
        return state.totalTransaction;
    },

    getAllTransaction(state) {
        return state.allTransactions;
    },

    getCustomerTransactionTotal(state) {
        return state.customerTransactionTotal;
    },

    getCustomerTransactionDue(state) {
        return state.customerTransactionDue;
    },

    getCustomerCredit(state) {
        return state.customerCredit;
    },

    getCustomerDebit(state) {
        return state.customerDebit;
    },

    getCustomerBalance(state) {
        return state.customerBalance;
    }

}

const mutations = {
    setAllCustomers(state, customers) {
        state.allCustomers = [...customers];
    },

    setTotalTransaction(state, totalTransaction) {
        state.totalTransaction = totalTransaction;
    },

    setAllTransaction(state, transactions) {
        state.allTransactions = transactions;
    },

    setCustomerTransactionTotal(state, total) {
        state.customerTransactionTotal = total;
    },

    setCustomerTransactionDue(state, due) {
        state.customerTransactionDue = due;
    },

    setResetAllCustomerTransactionData(state) {
        state.allCustomers = [];
        state.totalTransaction = 0;
        state.allTransactions = [];
        state.customerTransactionTotal = 0;
        state.customerTransactionDue = 0;
        state.customerCredit = 0;
        state.customerDebit = 0;
        state.customerBalance = 0
    },

    setCustomerCredit(state, credit) {
        state.customerCredit = credit;
    },

    setCustomerDebit(state, debit) {
        state.customerDebit = debit;
    },

    setCustomerBalance(state, balance) {
        state.customerBalance = balance;
    }
}

const actions = {
    fetchAllCustomers({commit}) {
        let url = '/api/customers';

        axios.get(url).then((response) => {
            if (response.data) {
                commit('setAllCustomers', response.data);
            }
        })
            .catch(e => {
            })

    },

    fetchSelectedCustomerTransactions({commit}, customer) {
        let url = '/customers/' + customer.id + '/transactions';

        axios.get(url).then((response) => {
            commit('setTotalTransaction', response.data.total_transactions);
            commit('setAllTransaction', response.data.transactions);
            commit('setCustomerDebit', response.data.debit);
            commit('setCustomerCredit', response.data.credit);
            commit('setCustomerBalance', response.data.balance);
        });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
