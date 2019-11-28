<template>
    <section class="create-transaction">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-text>
                        <v-form
                                ref="transactionForm"
                                v-model="valid"
                                lazy-validation>
                            lazy-validation>
                            <h2>Sale assistance</h2>
                            <v-container grid-list-md>
                                <v-layout row wrap>
                                    <v-flex xs6>
                                        <v-autocomplete
                                                dark
                                                color="dark"
                                                label="Select Staff"
                                                :items="saleAssistants"
                                                item-text="name"
                                                v-model="selectedSaleAssistant"
                                                :rules="[v => !!v || 'Select Staff']"
                                                append-icon="account_circle"
                                                chips
                                                persistent-hint
                                                return-object>
                                        </v-autocomplete>
                                    </v-flex>

                                    <v-flex xs6>
                                        <v-menu
                                                ref="menu"
                                                v-model="menu"
                                                :close-on-content-click="false"
                                                :nudge-right="40"
                                                :return-value.sync="date"
                                                lazy
                                                transition="scale-transition"
                                                offset-y
                                                full-width
                                                min-width="290px"
                                        >
                                            <template v-slot:activator="{ on }">
                                                <v-text-field
                                                        v-model="date"
                                                        label="Select Date"
                                                        prepend-icon="event"
                                                        readonly
                                                        v-on="on"
                                                ></v-text-field>
                                            </template>
                                            <v-date-picker v-model="date" no-title scrollable>
                                                <v-spacer></v-spacer>
                                                <v-btn flat color="primary" @click="onClearDate()">Clear</v-btn>
                                                <v-btn flat color="primary" @click="$refs.menu.save(date)">OK</v-btn>
                                            </v-date-picker>
                                        </v-menu>
                                    </v-flex>
                                </v-layout>

                                <product-component :saleAssistant="selectedSaleAssistant"></product-component>
                            </v-container>
                        </v-form>

                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>


    </section>
</template>

<script>
    import ProductLoopComponent from './partials/ProductLoopComponent';
    import TransactionEventBus from '../../../event_bus/transaction_event';

    import {mapGetters, mapMutations} from 'vuex';
    import saleAssistance from "../../../store/modules/saleAssistance";

    export default {
        components: {
            'productComponent': ProductLoopComponent
        },

        data: () => ({

            customers: [
                {
                    text: 'No customer',
                    value: 1
                }
            ],
            selectedCustomer: {},
            previousDue: 0,
            payment_due: '',
            paid: '',
            discount: 0,

            paymentStatus: [
                {
                    text: 'paid',
                    value: 1
                },
                {
                    text: 'Due',
                    value: 2
                },
                {
                    text: 'Half paid',
                    value: 3
                },
                {
                    text: 'Pending',
                    value: 4
                }
            ],
            selectedPaymentStatus: 1,
            active: [1, 2],

            isWarranty: false,
            warranty: [
                {text: 'Yes', value: 1},
                {text: 'No', value: 0}
            ],

            serial_number: '',
            length_warranty: '',

            service_charge: 0,
            special_discount: 0,

            // Bkash
            valid: true,
            paymentType: null,
            paymentTypes: [
                {text: 'Bkash', value: 'bkash'},
                {text: 'Cash', value: 'cash'},
                {text: 'Bank', value: 'Transaction'}
            ],

            phoneNumber: null,
            phoneNumberRules: [
                v => !!v || 'Phone is required'
            ],

            amount: 0,
            amountRules: [
                v => !!v || 'Amount is required'
            ],
            bankAccountId: null,
            reference: null,


            saleProductErrorMessage: false,
            // date: new Date().toISOString().substr(0, 10),
            date: null,
            pickerDate: null,
            menu: false,
        }),

        computed: {
            selectedSaleAssistant: {
                get() {
                    return this.$store.getters.getSelectedSaleAssistant;
                },
                set(value) {
                    const date = this.date;
                    this.$store.dispatch('getSaleAssistantProducts', {selectedUser: value, date: date})
                }
            },
            ...mapGetters({
                saleAssistants: 'getSaleAssistants',
                products: 'getSaleAssistantProducts'
            }),

            formTitle() {
                return this.editedIndex === -1 ? 'New Transaction' : 'Edit Transaction'
            }
        },

        watch: {
            selectedProduct(val) {
                var change_product = '';
                this.allProductData.forEach(function (product) {
                    if (val === product.id) {
                        change_product = product;
                    }
                });
                this.current_product_quantity = change_product.quantity;
            },

            date(date) {
                this.$store.dispatch('getSaleAssistantProducts', {selectedUser: this.selectedSaleAssistant, date: date})
            },

            selectedCustomer(val) {
                this.previousDue = 0;
                let url = '/transaction/due/create?customer_id=' + val.value;
                axios.get(url).then((response) => {
                    this.previousDue = response.data.previous_record.previousDue ? response.data.previous_record.previousDue : 0;
                })
            },

            special_discount(discount) {
                this.discount = discount;
            },

            service_charge(serviceCharge) {

            }
        },

        created() {
            this.initialize();

            //Barcode scanner
            this.$barcodeScanner.init(this.onBarcodeScanned);

            TransactionEventBus.$on('updateProduct', () => {
                this.updateStore();
            });

            TransactionEventBus.$on('removeProduct', (index) => {
                this.totalProduct.splice(index, 1);
                this.updateStore();
            });

            TransactionEventBus.$on('removeProductByCode', (code) => {
                const index = this.totalProduct.findIndex(p => p === code);
                this.totalProduct.splice(index, 1);
                this.saleProductErrorMessage = true
            });

        },

        methods: {

            async initialize() {

                // get all customers
                axios.get('/customers')
                    .then((response) => {
                        if (response.data.length > 0) {
                            this.customers = response.data;
                            let array_customer = [];
                            this.customers.forEach((customer) => {
                                let customerE = {text: customer.name, value: customer.id};
                                array_customer.push(customerE);
                            })
                            this.customers = array_customer;
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });

                // get all bank account
                const accounts = await axios.get('/api/bankaccounts')
                this.bankAccounts = accounts.data;

                // Get all sale assistant
                this.$store.dispatch('getSaleAssistant')

            },

            updateSaleAssistant(saleAssistant) {
                console.log('sale assistant ', saleAssistant);
                console.log('sale date ', this.date);

            },

            selectedWarranty(value) {
                this.isWarranty = false;
                if (value === 1) {
                    this.isWarranty = true;
                }

                if (value === 0) {
                    this.isWarranty = false;
                }
            },

            onCreateTransaction() {

                if (this.$refs.transactionForm.validate()) {
                    let form = new FormData()
                    let total = this.total_amount_transactions - this.special_discount;
                    let url = '/api/customers/' + this.selectedCustomer.value + '/transactions';

                    form.append('payment_status', this.selectedPaymentStatus);
                    form.append('discount', this.discount);
                    form.append('special_discount', this.special_discount);
                    form.append('length_warranty', this.length_warranty);
                    form.append('total', total);
                    form.append('service_charge', this.service_charge);
                    form.append('store_id', this.$store.getters.getSelectedShopId);
                    form.append('seller_id', this.$store.getters.getUserId);
                    form.append('bkash', this.bkash);
                    form.append('phone_number', this.phoneNumber);
                    form.append('amount', this.amount);
                    form.append('payment_type', this.paymentType);
                    form.append('account_id', this.bankAccountId);
                    form.append('reference', this.reference);

                    if (this.selectedPaymentStatus > 1) {
                        form.append('payment_due', total - this.paid);
                    }
                    form.append('paid', this.paid);

                    let products = JSON.stringify(this.$store.getters.getProduct);

                    form.append('products', products);

                    axios.post(url, form)
                        .then((response) => {
                            if (response.data) {
                                TransactionEventBus.createProduct('Transaction successfully created');
                                this.$store.commit('resetProductTransition')
                                this.$router.push({
                                    'name': 'print_transaction',
                                    params: {id: response.data.transaction_id}
                                });
                            }
                        });
                }
            },

            onCancelTransaction() {
                this.$router.push({name: 'transaction'});
            },

            updateStore() {
                let totalTransactions = this.$store.getters.getProduct;
                let total = 0;
                totalTransactions.forEach((product) => {
                    total += product.sale_price * product.quantity;
                });
                this.total_amount_transactions = total;
            },

            close() {
                this.dialog = false
                this.selectedCategories = []
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem)
                    this.editedIndex = -1
                }, 300)
            },

            addProduct() {
                this.totalProduct.push('1')
            },

            onBarcodeScanned(code) {
                this.saleProductErrorMessage = false
                this.barcodeDailog = true;
                this.totalProduct.push(code);
                this.barcode = code;
                if (code !== '') {
                    this.barcodeDailog = true;
                    this.barcode = code;
                }
            },

            addBarcode(code) {
                let codes = ['19853/49QR04618oasdlj', '19052/29QC04297'];
                code = '19853/49QR04618';
                codes.shift();

                let url = '/api/sale-assistant/product?status=available&allSerial=true&shopId=' + this.$store.getters.getSelectedShopId;


                if (this.code && this.code !== 1) {
                    url = url + '&code=' + this.code
                }

                //get all product for store
                axios.get(url)
                    .then((response) => {
                        const product = response.data;

                        if (Object.entries(response.data).length === 0 && response.data.constructor === Object) {
                            console.log('entry is empty');
                        } else {
                            this.$store.commit('setProduct', product)
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },

            validate() {
                if (this.$refs.form.validate()) {
                    this.snackbar = true
                }
            },
            reset() {
                this.$refs.form.reset()
            },
            resetValidation() {
                this.$refs.form.resetValidation()
            },

            onClearDate(){
                this.date = null
                this.menu = false
            }
        },

        destroyed() {
            this.$store.commit('resetProductTransition');
        }
    }
</script>
