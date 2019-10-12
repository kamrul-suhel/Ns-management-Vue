<template>
    <div class="company-transaction">
            <v-card class="px-2 py-2">
                <v-card-title>
                    <span class="headline">{{ formTitle }}</span>
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

                    <v-btn dark color="dark" raised @click.native="close">Cancel</v-btn>

                    <v-btn dark color="dark" raised @click.native="save">{{ editedIndex == -1 ? 'Create Transaction' :
                        'Update Transaction' }}
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
            dialog: false,
            deleteDialog:false,
            search: '',
            pagination: {
                sortBy: 'name'
            },

            snackbar: false,
            snackbar_message: '',

            headers: [
                {
                    text: 'Name',
                    value: 'name',
                    sortable: true
                },

                {
                    text: 'Mobile',
                    value: 'mobile',
                    sortable: false
                },
                {
                    text: 'Payment Type',
                    value: 'payment_type',
                    sortable: true
                },
                {
                    text: 'Debit',
                    value: 'debit',
                    sortable: true
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
                    value: 'created_at',
                    sortable: true
                },
                {
                    text: 'Manuel date',
                    value: 'menuel_date',
                    sortable: true
                },


                {
                    text: 'Actions'
                }
            ],
            total_customer: '',
            items: [],
            companies: [],

            editedIndex: -1,
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
            },

            selectedCompany:'',
            payment_type:['cash', 'cheque', 'product', 'other'],
            defaultItem: {
                id: '',
                payment_type:'cash',
                reference:'',
                remarks:'',
                debit:0,
                credit:0,
                balance:'',
                manuel_date:''
            },
            row_per_page: [20, 30, 50, {'text': 'All', 'value': -1}],

            deleteItem:{},
            balance:0,

        }),

        computed: {
            formTitle() {
                return this.editedIndex === -1 ? 'New Transaction' : 'Update Transaction'
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            },

        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                // get all product
                axios.get('/api/ctransaction')
                    .then((response) => {
                        this.items = response.data.transactions;
                        this.companies = response.data.companies;
                    })
                    .catch((error) => {
                        console.log(error)
                    })

            },

            getNestedItem(item, name){
                if(item.company){
                    return item.company[name]
                }
                return 'unknown';
            },

            onDebitUpdate(){
                this.editedItem.balance = Number(this.balance) + Number(this.editedItem.credit) - Number(this.editedItem.debit);
            },

            onCreditUpdate(){
                this.editedItem.balance = Number(this.balance) + Number(this.editedItem.credit) - Number(this.editedItem.debit);
            },


            changeBalance(){
                console.log(this.editedItem.balance);
                this.editedItem.balance = this.editedItem.credit - this.editedItem.debit;
            },

            onCompanyChange(value){
                let url =  'api/selectedcompany/' + this.selectedCompany;
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


            openDeleteDialog(deleteItem){
                this.deleteItem = deleteItem;
                this.deleteDialog = true;
            },

            deleteItemD () {
                let url = 'api/ctransaction/'+this.deleteItem.id;
                axios.delete(url).then((response) => {
                    this.deleteDialog = false;
                    const index = this.items.indexOf(this.deleteItem)
                    this.items.splice(index, 1)
                });
            },

            close() {
                this.dialog = false
                this.selectedCategories = [];
                this.selectedCompany = '',
                    setTimeout(() => {
                        this.editedItem = Object.assign({}, this.defaultItem);
                        this.editedIndex = -1
                    }, 300)
            },

            editItem(item) {
                // get selected categories & all categories
                this.editedIndex = this.items.indexOf(item);
                this.editedItem = Object.assign({}, item);
                this.dialog = true
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

            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column;
                    this.pagination.descending = false
                }
            },

            viewTransition(){

            },

            convertDate(date){
                if(date){
                    var current_date = new Date(date.replace(/-/g, "/"));
                    var daysOfWeek = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
                    var monthsOfYear = ["January", "February", "March", "April", "May", "June", "July", "August",
                        "September", "October", "November", "December"];
                    var daysOfMonth = ["NaN", "1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th", "9th", "10th",
                        "11th", "12th", "13th", "14th", "15th", "16th", "17th", "18th", "19th", "20th",
                        "21st", "22nd", "23rd", "24th", "25th", "26th", "27th", "28th", "29th", "30th", "31st"];


                    var returnDate = daysOfWeek[current_date.getDay()] + ", "
                        + monthsOfYear[current_date.getMonth()] + " "
                        + daysOfMonth[current_date.getDate()]
                        + ", " + current_date.getFullYear();
                    return returnDate;
                }
                return date;
            }
        }
    }
</script>
