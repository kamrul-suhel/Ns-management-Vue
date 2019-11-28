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
                            <h2>Sale product</h2>
                            <v-container grid-list-md>
                                <v-layout row wrap>
                                    <v-flex xs12>
                                        <v-autocomplete
                                                dark
                                                color="dark"
                                                label="Select Customer"
                                                :items="customers"
                                                v-model="selectedCustomer"
                                                :rules="[v => !!v || 'Select customer']"
                                                append-icon="account_circle"
                                                required
                                                chips
                                                persistent-hint
                                                return-object>
                                        </v-autocomplete>
                                    </v-flex>

                                    <v-flex xs12 v-if="previousDue > 0">
                                        <p class="red--text">This customer has TK. {{ previousDue }} due.</p>
                                    </v-flex>

                                    <v-flex xs12 v-if="saleProductErrorMessage">
                                        <p class="red--text">This product is sold</p>
                                    </v-flex>
                                </v-layout>

                                <product-component
                                        v-for="(code, index) in totalProduct"
                                        :key="index"
                                        :code="code"
                                        :saleAssistant="true"
                                        :index="index"
                                ></product-component>

                                <v-layout row wrap>
                                    <v-flex xs6>
                                        <v-select
                                                dark
                                                color="dark"
                                                label="Payment Type"
                                                hint="What kind of payment"
                                                :items="paymentTypes"
                                                v-model="paymentType">

                                        </v-select>
                                    </v-flex>
                                    <v-flex xs6></v-flex>

                                    <v-flex xs6 v-if="paymentType === 'bkash'">
                                        <v-text-field
                                                dark
                                                color="dark"
                                                label="Phone number"
                                                v-model="phoneNumber"
                                                type="number"
                                                :rules="phoneNumberRules"
                                                required
                                                hint="Type your phone number">

                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs6 v-if="paymentType === 'bkash'">
                                        <v-text-field
                                                dark
                                                color="dark"
                                                label="Amount"
                                                v-model="amount"
                                                :rules="amountRules"
                                                required
                                                type="number"
                                                hint="How much in this Bkash">

                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs6 v-if="paymentType === 'Transaction'">
                                        <v-select
                                                dark
                                                color="dark"
                                                label="Select Account"
                                                hint="which account you want to put your money."
                                                :items="bankAccounts"
                                                item-value="id"
                                                item-text="name"
                                                :rules="[v => !!v || 'Item is required']"
                                                required
                                                v-model="bankAccountId">

                                        </v-select>
                                    </v-flex>

                                    <v-flex xs6 v-if="paymentType === 'Transaction'">
                                        <v-text-field
                                                dark
                                                color="dark"
                                                label="Reference"
                                                v-model="reference"
                                                hint="For your personal reference">

                                        </v-text-field>
                                    </v-flex>
                                </v-layout>

                                <v-layout row wrap>
                                    <v-flex xs6>
                                        <v-select
                                                dark
                                                color="dark"
                                                label="Payment Status"
                                                hint="What is the payment status."
                                                :items="paymentStatus"
                                                v-model="selectedPaymentStatus"
                                        ></v-select>
                                    </v-flex>

                                    <v-flex xs6 v-if="selectedPaymentStatus > 1">
                                        <v-text-field
                                                dark
                                                color="dark"
                                                label="How much paid"
                                                v-model="paid"
                                                type="number"
                                                hint="Put how much paid">

                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs6>
                                        <v-text-field
                                                dark
                                                disabled
                                                color="dark"
                                                label="Discount amount"
                                                v-model="discount"
                                                type="number"
                                                hint="Put how much paid">

                                        </v-text-field>
                                    </v-flex>

                                    <v-flex xs6>
                                        <v-text-field
                                                dark
                                                color="dark"
                                                label="Special discount"
                                                v-model="special_discount"
                                        ></v-text-field>
                                    </v-flex>

                                    <v-flex xs6>
                                        <v-text-field
                                                dark
                                                color="dark"
                                                label="Service charge"
                                                v-model="service_charge"
                                        ></v-text-field>
                                    </v-flex>
                                </v-layout>

                                <v-layout row wrap>
                                    <v-spacer></v-spacer>
                                    <v-flex xs3 class="text-xs-right">
                                        <p><strong>Total: {{ total_amount_transactions }}</strong></p>
                                        <p v-if="paid > 0"><strong>paid: {{ paid }}</strong></p>
                                    </v-flex>
                                    <v-flex xs3 class="text-xs-right">
                                        <p v-if="selectedPaymentStatus > 1"><strong>Due: {{ total_amount_transactions -
                                            paid
                                            }}</strong></p>
                                        <p><strong>Discount: {{ discount }}</strong></p>
                                        <p><strong>Grand total: {{ parseFloat(total_amount_transactions) +
                                            parseFloat(service_charge) - parseFloat(discount)
                                            }}</strong></p>

                                    </v-flex>
                                </v-layout>

                                <v-layout row wrap>
                                    <v-flex xs12 class="text-xs-right">
                                        <v-btn dark color="dark" raised @click.native="onCancelTransaction()">Cancel
                                        </v-btn>

                                        <v-btn dark raised @click="onCreateTransaction()">
                                            Create transaction
                                        </v-btn>
                                    </v-flex>
                                </v-layout>
                            </v-container>
                        </v-form>

                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>


    </section>
</template>

<script>
    import ProductLoopComponent from '../transaction/partials/ProductLoopComponent';
    import TransactionEventBus from '../../../event_bus/transaction_event';

    export default {
        components: {
            'productComponent': ProductLoopComponent
        },

        data: () => ({
            total_transactions: 0,
            total_amount_transactions: 0,

            items: [],
            allProductData: [],

            totalProduct: [],
            bankAccounts: [],

            customers: [{text: 'No customer', value: 1}],
            selectedCustomer: {},
            previousDue: 0,
            payment_due: '',
            paid: '',
            discount: 0,

            paymentStatus: [{text: 'paid', value: 1}, {text: 'Due', value: 2}, {
                text: 'Half paid',
                value: 3
            }, {text: 'Pending', value: 4}],
            selectedPaymentStatus: 1,
            active: [1, 2],

            isWarranty: false,
            warranty: [{text: 'Yes', value: 1}, {text: 'No', value: 0}],

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
            saleProductErrorMessage: false
        }),

        computed: {
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

            selectedCustomer(val) {
                this.previousDue = 0;
                let url = '/transaction/due/create?customer_id=' + val.value;
                axios.get(url).then((response) => {
                    this.previousDue = response.data.balance ? response.data.balance : 0;
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
                const staffId = this.$route.params.staffId
                 const code = this.$route.params.barcode

                this.onBarcodeScanned(code)

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

                    form.append('staffId', this.$route.params.staffId);

                    if (this.selectedPaymentStatus > 1) {
                        form.append('payment_due', total - this.paid);
                    }
                    form.append('paid', this.paid);

                    let products = JSON.stringify(this.$store.getters.getProduct);

                    form.append('products', products);

                    axios.post(url, form)
                        .then((response) => {
                            if (response.data) {
                                console.log(response.data);
                                return;

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
                this.$router.push({name: 'sale_assistance_update'});
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
            }
        },

        destroyed() {
            this.$store.commit('resetProductTransition');
        }
    }
</script>
