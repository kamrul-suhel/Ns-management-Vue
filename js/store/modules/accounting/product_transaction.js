const state = {
    tPaymentDue: 0,
    tPaid: 0,
    tDiscount: 0,
    tTotal:0,
    tChartData: '',
    tTableData: '',
    chartTitle:'',
    totalTransactions:0,

    companyDue:0,
    companyDebit:0,
    companyTotalDue:0,
    companyTotalDebit:0,

    tCash: 0,
    pTotalStock:0,

    expense:'',
    profit:'',
    afterExpenseProfit:'',
    afterDueProfit: 0,

    balance: false,

    bkash:0,

    grossProfit: 0,

    currentBalance:0

}

const getters = {
    getTPaymentDue(state) {
        return state.tPaymentDue;
    },

    getTPaid(state) {
        return state.tPaid;
    },

    getTDiscount(state) {
        return state.tDiscount;
    },

    getTTotal(state) {
        return state.tTotal;
    },

    getTotalTransactions(state) {
        return state.totalTransactions;
    },

    getTChartData(state) {
        return state.tChartData;
    },

    getTTableData(state) {
        return state.tTableData;
    },
    getChartTitle(state){
        return state.chartTitle;
    },

    getExpense(state){
        return state.expense;
    },

    getProfit(state){
        return state.profit;
    },

    getAfterExpenseProfit(state){
        return state.afterExpenseProfit;
    },

    getAfterDueProfit(state){
        return state.afterDueProfit;
    },

    getCash(state){
        return state.tCash;
    },

    getProductTotalStock(state){
        return state.pTotalStock;
    },

    getBalance(state){
        return state.balance;
    },

    getGrossProfit(state){
        return state.grossProfit;
    },

    getCompanyDue(state){
        return state.companyDue;
    },

    getCompanyDebit(state){
        return state.companyDebit;
    },

    getCompanyTotalDue(state){
        return state.companyTotalDue;
    },

    getCompanyTotalDebit(state){
        return state.companyTotalDebit;
    },

    getCurrentBalance(state){
        return state.currentBalance;
    },

    getBkash(state){
        return state.bkash;
    }
}

const mutations = {
    setTPaymentDue(state, value){
        state.tPaymentDue = value;
    },

    setTPaid(state, value) {
        state.tPaid = value;
    },

    setTDiscount(state, value) {
        state.tDiscount = value;
    },

    setTTotal(state, value) {
        state.tTotal = value;
    },

    setTotalTransactions(state, value) {
        state.totalTransactions = value;
    },

    setTChartData(state, value) {
        state.tChartData = value;
    },

    setTTableData(state, value) {
        state.tTableData = value;
    },

    setResetTAll(state) {
        state.tPaymentDue = '';
        state.tPaid = '';
        state.tDiscount = '';
        state.tTotal = '';
        state.chartData = '';
        state.expense = '';
        state.profit = '';
        state.afterExpenseProfit = ''
    },

    setChartTitle(state, value){
        state.chartTitle = value;
    },

    setExpense(state, value){
        state.expense = value;
    },

    setProfit(state, value){
        state.profit = value;
    },

    setAfterExpenseProfit(state, value){
        state.afterExpenseProfit = value;
    },

    setAfterDueProfit(state, value){
        state.afterDueProfit = value;
    },

    setCash(state, value){
        state.tCash = value;
    },

    setProductTotalStock(state, value){
        state.pTotalStock = value;
    },

    setBalance(state, value){
        state.balance = value;
    },

    setGrossProfit(state, value){
        state.grossProfit = value;
    },

    setCompanyDue(state, value){
        state.companyDue = value;
    },

    setCompanyDebit(state, value){
        state.companyDebit = value;
    },

    setCompanyTotalDue(state, value){
        state.companyTotalDue = value;
    },

    setCompanyTotalDebit(state, value){
        state.companyTotalDebit = value;
    },

    setCurrentBalance(state, value){
        state.currentBalance = value;
    },

    setBkash(state, value){
        state.bkash = value;
    }
}

const actions = {
    fetchAllTransaction({commit}, payload) {
        if(payload.select.abbr === 'TDT'){
            commit('setChartTitle', 'Today')
        }

        if(payload.select.abbr === 'YDT'){
            commit('setChartTitle', 'Yesterday')
        }

        if(payload.select.abbr === 'TWT'){
            commit('setChartTitle', 'This Week')
        }

        if(payload.select.abbr === 'LWT'){
            commit('setChartTitle', 'Last Week')
        }

        if(payload.select.abbr === 'TMT'){
            commit('setChartTitle', 'This Month')
        }

        if(payload.select.abbr === 'LMT'){
            commit('setChartTitle', 'Last Month')
        }

        if(payload.select.abbr === 'TYT'){
            commit('setChartTitle', 'This Year')
        }
        if(payload.select.abbr === 'LYT'){
            commit('setChartTitle', 'Last Year')
        }

        if(payload.select.abbr === 'CRT' || payload.select.abbr === 'CDT'){
            commit('setChartTitle', 'Custom Day')
        }

        axios.post('/api/accounting/transaction', payload)
            .then((response) => {
                commit('setTPaymentDue', response.data.payment_due);
                commit('setTPaid',response.data.paid);
                commit('setTDiscount', response.data.discount);
                commit('setTTotal', response.data.total);
                commit('setTotalTransactions', response.data.total_transaction);
                commit('setTChartData', response.data.chart_data);
                commit('setTTableData', response.data.transactions);
                commit('setExpense', response.data.total_expense);
                commit('setProfit', response.data.total_profit);
                commit('setAfterExpenseProfit', response.data.profit_after);
                commit('setAfterDueProfit', response.data.total_profit_after_due);
                commit('setCash', response.data.cash);
                commit('setProductTotalStock', response.data.total_stock);
                commit('setGrossProfit', +response.data.payment_due + +response.data.cash + +response.data.total_stock);
                commit('setCompanyDue', response.data.company_due);
                commit('setCompanyDebit', response.data.company_debit);
                commit('setCompanyTotalDue', response.data.company_total_due);
                commit('setCompanyTotalDebit', response.data.company_total_debit);
                commit('setCurrentBalance', response.data.current_balance);
                commit('setBkash', response.data.bkash);
            });
    }
}

export default {
    state,
    getters,
    mutations,
    actions
}
