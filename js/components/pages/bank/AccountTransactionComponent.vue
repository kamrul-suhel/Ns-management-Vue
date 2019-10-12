<template>
    <section class="setting-page">
        <v-container grid-list-xl>
            <v-layout row wrap>
                <v-flex xs7>
                    <v-card>
                        <v-card-title class="justify-space-between">
                            <h2>All Transactions</h2>
                            <div>
                                <span><strong>Balance:</strong> {{ balance }}</span>
                                <span><strong>Withdraw:</strong> {{ withdraw }}</span>
                            </div>

                        </v-card-title>

                        <v-card-text>
                            <v-data-table
                                    dark
                                    :headers="headers"
                                    :items="transactions"
                                    :search="search"
                                    :rows-per-page-items=row_per_page
                            >
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.index + 1 }}</td>
                                    <td class="text-xs-left">{{ props.item.payment_type }}</td>
                                    <td class="text-xs-left">{{ props.item.amount }}</td>
                                    <td class="text-xs-left">{{ props.item.reference }}</td>
                                    <td class="justify-start layout px-0">
                                        <v-btn icon class="mx-0" @click="editItem(props.item)">
                                            <v-icon color="dark">edit</v-icon>
                                        </v-btn>
                                        <v-btn icon class="mx-0"
                                               @click="openDeleteDialog(props.item)">
                                            <v-icon color="dark">delete</v-icon>
                                        </v-btn>
                                    </td>
                                </template>

                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ search }}" found no results.
                                </v-alert>

                                <template slot="no-data">

                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs5>
                    <v-form
                            ref="transactionForm"
                            v-model="valid"
                            lazy-validation
                    >
                        <v-card>
                            <v-card-title>
                                <h2>{{ editedIndex <= 0 ? 'Create Transaction' : 'Update Transaction'}}</h2>
                                <v-spacer></v-spacer>
                            </v-card-title>

                            <v-card-text>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-select
                                                color="white"
                                                v-model="editedItem.payment_type"
                                                :items="paymentType"
                                                label="Payment Type"
                                                @change="getDataByPaymentType()"
                                                prepend-icon="map"
                                                :rules="[v => !!v || 'Payment type is required']"
                                                required
                                        ></v-select>
                                    </v-flex>

                                    <v-flex xs12 v-if="editedItem.payment_type === 'Company'">
                                        <v-autocomplete
                                                v-model="editedItem.company_id"
                                                :items="companies"
                                                item-text="name"
                                                item-value="id"
                                                color="white"
                                                label="Select Company"
                                                :rules="[v => !!v || 'Payment type is required']"
                                                required
                                                persistent-hint>
                                        </v-autocomplete>
                                    </v-flex>

                                    <v-flex xs12 v-if="editedItem.payment_type === 'Transaction'">
                                        <v-autocomplete
                                                v-model="editedItem.transaction_id"
                                                :items="productTransaction"
                                                item-text="invoice_number"
                                                item-value="id"
                                                color="white"
                                                :rules="[v => !!v || 'Payment type is required']"
                                                required
                                                label="Select Transition"
                                                persistent-hint>
                                        </v-autocomplete>
                                    </v-flex>

                                    <v-flex xs12>
                                        <v-text-field
                                                color="white"
                                                label="Amount"
                                                type="number"
                                                :rules="[v => !!v || 'Amount is required']"
                                                required
                                                v-model="editedItem.amount">
                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs12>
                                        <v-text-field
                                                color="white"
                                                label="Reference"
                                                v-model="editedItem.reference">
                                        </v-text-field>
                                    </v-flex>
                                </v-layout>
                            </v-card-text>

                            <v-card-actions>
                                <v-spacer></v-spacer>
                                <v-btn dark
                                       raised
                                       color="dark"
                                       @click="onReset">Reset
                                </v-btn>
                                <v-btn
                                        dark
                                        raised
                                        color="dark"
                                        @click="onAddTransaction()">
                                    {{ editedIndex <= 0 ? 'Create Transaction' : 'Update Transaction'}}
                                </v-btn>
                            </v-card-actions>
                        </v-card>
                    </v-form>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- Delete Bank -->
        <v-dialog v-model="deleteDialog"
                  persistent
                  max-width="290">
            <v-card color="error">
                <v-card-text>
                    <div class="text-xs-center">
                        <v-icon color="white" size="50">warning</v-icon>
                    </div>
                    <p class="text-xs-center">Are you sure you want to delete {{deleteTransaction.reference}}</p>
                    <p class="text-xs-center">If you delete bank you will lost all transaction in this account.</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1"
                           flat
                           @click.native="deleteDialog = false"
                    >Cancel
                    </v-btn>

                    <v-btn color="dark darken-1"
                           flat
                           @click.native="confirmDeleteBank()"
                    >Delete Account
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
                :timeout="4000"
                top
                right
                color="success"
                multi-line
                v-model="snackbar">
            {{ snackbar_message }}
        </v-snackbar>
    </section>
</template>

<script>
    import axios from 'axios'

    export default {
        data: () => ({
            search: '',
            row_per_page: [20, 30, 50, {'text': 'All', 'value': -1}],
            snackbar: false,
            snackbar_message: '',
            valid: true,

            deleteDialog: false,
            deleteTransaction: {},
            transactions: [],
            balance:0,
            withdraw:0,
            companies:[],
            productTransaction:[],

            defaultItem: {
                id: null,
                account_id: null,
                transaction_id: null,
                company_id: null,
                status: null,
                payment_type: null,
                amount: null,
                reference: null,
            },

            paymentType: [
                {
                    text: 'Company',
                    value: 'Company'
                },
                {
                    text: 'Invest',
                    value: 'Invest'
                },
                {
                    text: 'Cash In',
                    value: 'Cash In'
                },
                {
                    text: 'Withdraw',
                    value: 'Withdraw'
                },
                {
                    text: 'Transaction',
                    value: 'Transaction'
                }
            ],

            editedItem: {},
            editedIndex: -1,

            headers: [
                {
                    text: 'Id',
                    value: 'id',
                    sortable: true
                },
                {
                    text: 'Payment Type',
                    value: 'payment_type',
                    sortable: true
                },
                {
                    text: 'Amount',
                    value: 'amount',
                },
                {
                    text: 'Reference',
                    value: 'reference',
                },
                {
                    text: 'Action',
                    value: '',
                }
            ],
        }),

        computed: {},

        watch: {},

        created() {
            this.initialize();
        },

        methods: {
            async onAddTransaction() {
                if (this.$refs.transactionForm.validate()) {
                    let url = `/api/banks/${this.$route.params.bankId}/accounts/${this.$route.params.accountId}/accountTransactions`;
                    this.editedItem.account_id = this.$route.params.accountId;

                    if (this.editedIndex >= 0) {
                        url = `api/banks/${this.$route.params.bankId}/accounts/${this.$route.params.accountId}/accountTransactions/${this.editedItem.id}`
                    }
                    let method = this.editedIndex >= 0 ? 'patch' : 'post';
                    const response = await axios[method](url, this.editedItem);
                    let newTransaction = {...response.data};

                    //edit item. replace with existing item
                    if (this.editedIndex >= 0) {
                        let index = this.transactions.findIndex(transaction => {
                            return newTransaction.id === transaction.id;
                        })

                        let transactions = [...this.transactions];
                        transactions[index] = newTransaction;

                        this.transactions = [...transactions];
                        return
                    }

                    this.transactions.push(newTransaction);
                }
            },

            async initialize() {
                const response = await axios.get(`/api/banks/${this.$route.params.bankId}/accounts/${this.$route.params.accountId}/accountTransactions`);

                this.transactions = [...response.data.transactions]
                this.balance = response.data.balance
                this.withdraw = response.data.withdraw
            },

            editItem(item) {
                let editedItem = {...item}
                this.editedIndex = 1
                this.editedItem = editedItem
                console.log("edited item : ", this.editedItem)
            },

            onReset() {
                this.editedIndex = -1
                this.editedItem = this.defaultItem
            },

            openDeleteDialog(account) {
                this.deleteTransaction = {...account};
                this.deleteDialog = true;
            },

            async confirmDeleteBank() {
                const url = `/api/banks/${this.$route.params.bankId}/accounts/${this.deleteTransaction.account_id}/accountTransactions/${this.deleteTransaction.id}`
                const response = await axios.delete(url)

                const index = this.transactions.indexOf(this.deleteAccount)
                this.deleteDialog = false;
                this.transactions.splice(index, 1)
            },

            async getDataByPaymentType() {
                const paymentType = this.editedItem.payment_type;
                let url = `/api/banks/${this.$route.params.bankId}/accounts/${this.$route.params.accountId}/accountTransactions?page=account_transaction`
                let response = null;
                switch(paymentType){
                    case 'Company':
                        url += '&payment_type=company'
                        response = await axios.get(url);
                        this.companies = [...response.data];
                        // this.productTransaction = [];
                        break;

                    case 'Transaction':
                        url += `&payment_type=transaction`
                        response = await axios.get(url)
                        // this.companies = [];
                        this.productTransaction = [...response.data];
                }
            }
        }
    }
</script>
