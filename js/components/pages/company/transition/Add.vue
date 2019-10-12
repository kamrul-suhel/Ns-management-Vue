<template>
    <div class="company-transaction">
            <v-card class="px-2 py-2">
                <v-card-title>
                    <span class="headline">Add company transaction</span>
                </v-card-title>

                <v-card-text class="pt-0">
                    <v-container grid-list-md>
                        <v-layout wrap>
                            <v-flex xs6>
                                <v-select
                                        dark
                                        color="dark"
                                        :items="companies"
                                        item-text="name"
                                        item-value="id"
                                        label="Select A Company"
                                        required
                                        @input="onCompanyChange()"
                                        v-model="selectedCompany"></v-select>
                            </v-flex>

                            <v-flex xs6>
                                <v-select
                                        dark
                                        color="dark"
                                        :items="payment_type"
                                        label="Payment type"
                                        v-model="editedItem.payment_type"
                                ></v-select>
                            </v-flex>

                            <v-flex xs6>
                                <v-select
                                        dark
                                        color="dark"
                                        :items="accounts"
                                        label="Select Account"
                                        v-model="editedItem.account"
                                ></v-select>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        dark
                                        color="dark"
                                        label="Reference"
                                        disabled
                                        hint="Reference number will auto generate"
                                        persistent-hint
                                        v-model="editedItem.reference"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        dark
                                        color="dark"
                                        label="Remarks"
                                        hint="Remarks"
                                        v-model="editedItem.remarks">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        dark
                                        color="dark"
                                        label="Debit"
                                        type="number"
                                        hint="How much"
                                        @input="onDebitUpdate()"
                                        v-model="editedItem.debit">
                                </v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        dark
                                        color="dark"
                                        label="Credit"
                                        hint="Credit"
                                        type="number"
                                        @input="onCreditUpdate()"
                                        v-model="editedItem.credit">
                                </v-text-field>
                            </v-flex>


                            <v-flex xs6>
                                <v-text-field
                                        dark
                                        color="dark"
                                        v-model="editedItem.balance"
                                        disabled
                                        label="Balance"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        dark
                                        color="dark"
                                        v-model="editedItem.manuel_date"
                                        label="Manuel date"
                                ></v-text-field>
                            </v-flex>

                        </v-layout>
                    </v-container>
                </v-card-text>

                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn dark
                           color="dark"
                           raised
                           @click.native="close">Cancel
                    </v-btn>

                    <v-btn dark
                           color="dark"
                           raised
                           @click.native="save">Create Transaction
                    </v-btn>
                </v-card-actions>
            </v-card>
    </div>
</template>
<script>
    /* eslint-disable no-unreachable */

    import axios from 'axios'

    export default {
        data: () => ({
            companies: [],

            selectedCompany:'',
            payment_type:['cash', 'cheque', 'product', 'other'],

            editedItem: {
                id: '',
                company_id:'',
                payment_type:'',
                reference:'',
                remarks:'',
                debit:'',
                credit:'',
                balance:'',
                manuel_date:'',
                account:null
            },

            accounts:[],
            selectedAccount:{}
        }),

        computed: {
        },

        watch: {
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                // get all product
                axios.get('/api/ctransaction')
                    .then((response) => {
                        this.companies = response.data.companies
                        this.accounts = [...response.data.accounts]
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            },

            onCreditUpdate(){
                this.editedItem.balance = Number(this.balance) + Number(this.editedItem.credit) - Number(this.editedItem.debit);
            },

            onCompanyChange(value){
                let url =  '/api/selectedcompany/' + this.selectedCompany;
                axios.get(url).then((response) => {
                    if(response.data) {
                        this.balance = response.data.balance;
                        this.editedItem.balance = response.data.balance;
                    }
                });
            },

            convertNumber(value){
                if(value === ''){
                    return parseFloat('0');
                }

                return parseFloat(value);
            },

            save() {
                let form = new FormData();
                let url = '/api/ctransaction';
                form.append('company_id', this.selectedCompany);
                form.append('store_id', this.$store.getters.getSelectedShopId);
                form.append('payment_type', this.editedItem.payment_type);
                form.append('emreferenceail', this.editedItem.reference);
                form.append('remarks', this.editedItem.remarks);
                form.append('debit', this.editedItem.debit);
                form.append('credit', this.editedItem.credit);
                form.append('balance', this.editedItem.balance);
                form.append('manuel_date', this.editedItem.manuel_date);

                if (this.editedIndex !== -1) {
                    // update product
                    form.append('_method', 'PATCH');
                    url = url + '/'+this.editedItem.id;
                    axios.post(url, form)
                        .then((response) => {
                            Object.assign(this.items[this.editedIndex], this.editedItem);
                            this.snackbar_message = 'Transaction '+this.editedItem.name + ' successfully updated.';
                            this.snackbar = true;
                            this.close();
                        })
                } else {
                    // create product
                    axios.post(url, form)
                        .then((response) => {
                            this.items.push(response.data);
                            this.snackbar_message = 'Transaction '+this.editedItem.name + ' successfully created.';
                            this.snackbar = true;
                            this.close();
                        })
                }

            },
        }
    }
</script>
