<template>
    <div class="products">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>Create customers ledger</h2>
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
                            <v-flex xs12>
                                <v-autocomplete
                                        color="dark"
                                        item-text="name"
                                        item-value="id"
                                        :items="customers"
                                        v-model="selectedCustomer"
                                        label="Select A customer"
                                        persistent-hint
                                        @change="onChange"
                                ></v-autocomplete>
                            </v-flex>
                            <v-flex xs12 v-if="lastLedger.balance">
                                <div>
                                    <p>Customer current balance: {{ lastLedger.balance }}</p>
                                </div>
                            </v-flex>
                        </v-layout>

                    </v-card-title>

                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        color="white"
                                        label="Particular"
                                        v-model="ledger.particular"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        color="white"
                                        label="Reference"
                                        v-model="ledger.reference"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        color="white"
                                        label="Remark"
                                        v-model="ledger.remark"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-text-field
                                        color="dark"
                                        label="Debit"
                                        type="number"
                                        v-model="debit"
                                        @blur="onUpdate"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        color="dark"
                                        label="Credit"
                                        type="number"
                                        @blur="onUpdate"
                                        v-model="credit"
                                ></v-text-field>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-spacer></v-spacer>
                            <v-flex xs6>
                                <h2>New balance: {{balance}}</h2>
                            </v-flex>
                        </v-layout>
                    </v-card-text>

                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn dark
                               color="success"
                               @click="onCreateLedger"
                        >Create Ledger</v-btn>
                    </v-card-actions>
                </v-card>
            </v-layout>
        </v-container>

        <v-snackbar
                :timeout="4000"
                top
                right
                color="success"
                multi-line
                v-model="snackbar">
            {{ message }}
        </v-snackbar>
    </div>
</template>
<script>

    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            isEditing: false,
            selectedCustomer: null,
            ledger: {},
            balance: 0,
            credit: 0,
            debit: 0,
            snackbar: false,
            message:''
        }),

        computed: {

            ...mapGetters({
                customers: 'getAllCustomers',
                lastLedger: 'getCustomerLastLedger'
            }),

        },

        watch: {
            lastLedger(){
                this.onUpdate()
            },

            ledger(){
                this.onUpdate()
            },

            credit(){
                this.onUpdate()
            },

            debit(){
                this.onUpdate()
            }
        },

        created() {
            this.$store.commit('setResetAllCustomerTransactionData');
            this.initialize();
        },

        methods: {
            initialize() {
                this.$store.dispatch('fetchAllCustomers')
            },

            onUpdate(){
                let debit = 0
                let credit = 0
                let balance = 0
                if(this.debit){
                    debit = this.debit
                }else{
                    debit = 0
                }

                if(this.credit){
                    credit = this.credit
                }else{

                    credit = 0
                }

                if(this.lastLedger.balance){
                    balance = this.lastLedger.balance
                }else{
                    balance = 0
                }

                balance= (parseFloat(debit) + parseFloat(balance)) - parseFloat(credit)
                this.balance = balance
            },

            onChange() {
                this.$store.dispatch('fetchSelectedCustomerTransactions', {id: this.selectedCustomer})
                this.onUpdate()
            },

            onCreateLedger(){
                let customerLedger = new FormData()
                customerLedger.append('particular', this.ledger.particular)
                customerLedger.append('reference', this.ledger.reference)
                customerLedger.append('remark', this.ledger.remark)
                customerLedger.append('credit', this.credit)
                customerLedger.append('debit', this.debit)
                customerLedger.append('balance', this.balance)
                customerLedger.append('customer_id', this.selectedCustomer)

                axios.post('/api/customerledger/create', customerLedger).then((response)=>{
                    if(response.data.success){
                        this.message = 'Customer ledger successfully created'
                        this.snackbar = true
                        setTimeout(()=>{
                            this.$router.push({name: 'customer_ledger'})
                        }, 1000)
                    }
                })

            }
        }
    }
</script>
