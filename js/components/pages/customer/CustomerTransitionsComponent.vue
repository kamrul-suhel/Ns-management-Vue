<template>
    <div class="products">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>Customers</h2>
                </v-flex>
            </v-layout>

            <v-divider class="mb-3 dark"></v-divider>

            <v-layout row wrap>
                <v-flex xs3>
                    <v-card flat class="cyan lighten-1 white--text">
                        <v-card-title>Total Transition</v-card-title>
                        <v-card-text class="pt-0">
                            <h2 class="display-2 white--text text-xs-center">
                                <strong>{{ totalTransition }}</strong>
                            </h2>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs3>
                    <v-card flat class="light-blue white--text">
                        <v-card-title>Total</v-card-title>
                        <v-card-text class="pt-0">
                            <h2 class="display-2 white--text text-xs-center">
                                <strong>{{ debit }}</strong>
                            </h2>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs3>
                    <v-card flat class="light-blue white--text">
                        <v-card-title>Paid</v-card-title>
                        <v-card-text class="pt-0">
                            <h2 class="display-2 white--text text-xs-center">
                                <strong>{{ credit }}</strong>
                            </h2>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs3>
                    <v-card flat class="light-green lighten-1 white--text">
                        <v-card-title>Due</v-card-title>
                        <v-card-text class="pt-0">
                            <h2 class="display-2 white--text text-xs-center">
                                <strong>{{ balance }}</strong>
                            </h2>
                        </v-card-text>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-title class="pb-0 pt-0">
                        <v-layout row wrap>
                            <v-flex xs10>
                                <v-autocomplete
                                        color="dark"
                                        v-model="selectedCustomer"
                                        :items="customers"
                                        item-text="name"
                                        return-object
                                        label="Select A customer"
                                        persistent-hint
                                ></v-autocomplete>
                            </v-flex>

                            <v-flex xs2 class="text-xs-right">
                                <v-btn dark small
                                       v-if="transitions.length > 0"
                                       @click="$router.push({
                                        name: 'customerLedgerPrint',
                                        params:{
                                            id: selectedCustomer.id,
                                            storeId: storeId
                                        }
                                        })"
                                >
                                    Print
                                </v-btn>
                            </v-flex>
                        </v-layout>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table
                                :headers="headers"
                                :items="transitions"
                                item-key="id"
                                :disable-initial-sort="true"
                        >
                            <template slot="items" slot-scope="props">
                                <td>{{ props.item.particular }}</td>
                                <td>{{ props.item.reference }}</td>
                                <td>{{ props.item.remark }}</td>
                                <td>TK. {{ props.item.debit }}</td>
                                <td>TK. {{ props.item.credit }}</td>
                                <td>TK. {{ props.item.balance }}</td>
                                <td>{{ props.item.created_at | convertDate }}</td>
                            </template>

                            <template slot="no-data">
                                No transition
                            </template>
                        </v-data-table>

                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dark
                               @click="$router.push({
                                            name: 'customer_ledger_all',
                                            params:{
                                                id: selectedCustomer.id,
                                                storeId: storeId
                                            }

                                        })"
                        >
                            Print all customer ledger
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-layout>
        </v-container>
    </div>
</template>
<script>

    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            search: '',

            selectedCustomer:{},

            headers: [
                {
                    text: 'Particular',
                    value: 'particular',
                    sortable: true
                },

                {
                    text: 'Reference',
                    value: 'reference',
                    sortable: false
                },

                {
                    text: 'Remarks',
                    value: 'remarks',
                    sortable: false
                },

                {
                    text: 'Debit',
                    value: 'debit',
                    sortable: false
                },

                {
                    text: 'Credit',
                    value: 'credit',
                    sortable: true
                },

                {
                    text: 'Balance',
                    value: 'balance',
                    sortable: true
                },

                {
                    text: 'Date',
                    value: 'date',
                    sortable: true
                }
            ],
            total_customer: '',
            items: [],


            active: [1,2],

            loading: false,
            pagination: {
                page: 1,
                rowsPerPage: 10, // -1 for All
                sortBy: 'name'
            },
            totalRows: null,
            row_per_page: [10, 20, 30, 40, 50, {'text': 'All', 'value': -1}],
        }),

        computed: {

            ...mapGetters({
                customers: 'getAllCustomers',
                transitions: 'getAllTransaction',
                totalTransition: 'getTotalTransaction',
                totalAmount: 'getCustomerTransactionTotal',
                customerDue: 'getCustomerTransactionDue',
                credit: 'getCustomerCredit',
                debit: 'getCustomerDebit',
                balance: 'getCustomerBalance',
                storeId: 'getSelectedShopId'
            }),

        },

        watch: {
            selectedCustomer(customer){
                this.$store.dispatch('fetchSelectedCustomerTransactions',  customer)
            }
        },

        created() {
            this.$store.commit('setResetAllCustomerTransactionData');
            this.initialize();
        },

        methods: {
            initialize() {
                this.$store.dispatch('fetchAllCustomers')
                // get all product
                axios.get('/customers')
                    .then((response) => {
                        this.items = response.data
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            },


            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            }
        }
    }
</script>
