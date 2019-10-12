<template>
    <div class="transaction-component">

        <Overview :overview="overView"></Overview>

        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card color="error">
                <v-card-text>
                    <div class="text-xs-center">
                        <v-icon color="white" size="50">warning</v-icon>
                    </div>
                    <p class="text-xs-center">Are you sure you want to delete {{deleteItem.title}}
                        {{ deleteItem.description}}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1" flat @click.native="deleteDialog = false">Disagree</v-btn>
                    <v-btn color="dark darken-1" flat @click.native="deleteItemD()">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-title class="pb-0 pt-0">
                        <v-btn
                                :disabled="!createTransaction"
                                dark
                                small
                                color="dark"
                                @click="onGotoCreateTransaction('create')">
                            Create new Transaction
                        </v-btn>

                        <v-btn
                                small
                                :disabled="!createTransaction"
                                dark
                                color="dark"
                                @click="onDueTransaction()">
                            Crate Due Transaction
                        </v-btn>
                        <p class="red--text" v-if="!createTransaction">To make a transaction please first make a
                            customer & product</p>
                        <v-spacer></v-spacer>
                        <v-text-field
                                dark
                                color="dark"
                                prepend-icon="search"
                                label="Search"
                                v-model="search"></v-text-field>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table
                                :disable-initial-sort="true"
                                :headers="headers"
                                :items="items"
                                :total-items="totalRows"
                                :pagination.sync="pagination"
                                :rows-per-page-items="row_per_page"
                                :loading="loading"
                        >

                            <template slot="headers" slot-scope="props">
                                <tr>
                                    <th
                                            v-for="header in props.headers"
                                            :key="header.value"
                                            :class="['column sortable', pagination.descending ? 'desc' : 'asc', header.value === pagination.sortBy ? 'active' : '']"
                                            @click="changeSort(header.value)"
                                    >
                                        <v-icon small>arrow_upward</v-icon>
                                        {{ header.text}}
                                    </th>
                                </tr>
                            </template>

                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded"
                                    :class="{'grey darken-2': props.item.status === 0 && role ==='admin'}">
                                    <td class="text-xs-center">
                                        <v-badge color="red"
                                                 :style="{width: '100px !important'}"
                                                 v-if="props.item.status === 0 && role ==='admin'">
                                            <template v-slot:badge>
                                                <span>!</span>
                                            </template>
                                            <span >{{ props.item.created_at | convertDate }}</span>
                                        </v-badge>

                                        <span v-else :style="{width: '100px !important',display:'inline-block'}">{{ props.item.created_at | convertDate }}</span>
                                    </td>

                                    <td class="text-xs-center">{{ props.item.customer && props.item.customer.name }}
                                    </td>
                                    <td class="text-xs-center">{{ props.item.invoice_number.toUpperCase() }}</td>
                                    <td class="text-xs-center">
                                        {{ props.item.products.length ? props.item.products.length : 0 }}
                                    </td>

                                    <td class="text-xs-center">
                                        {{ getPaymentStatus(props.item.payment_status) }}
                                    </td>

                                    <td class="text-xs-center">TK.
                                        {{ props.item.discount_amount ? price_format(props.item.discount_amount): 0 }}
                                    </td>

                                    <td class="text-xs-center">TK.
                                        {{ props.item.paid ? price_format(props.item.paid): 0 }}
                                    </td>

                                    <td class="text-xs-center">TK.
                                        {{ props.item.payment_due ? price_format(props.item.payment_due): 0 }}
                                    </td>

                                    <td class="text-xs-center">TK.
                                        {{ props.item.service_charge ? price_format(props.item.service_charge): 0 }}
                                    </td>

                                    <td class="text-xs-center">TK.
                                        {{ props.item.total ? price_format(props.item.total): 0 }}
                                    </td>

                                    <td class="justify-start layout px-0">
                                        <v-btn icon class="mx-0"
                                               @click="viewTransition(props.item)">
                                            <v-icon clor="dark">view_comfy</v-icon>
                                        </v-btn>

                                        <v-btn icon class="mx-0"
                                               @click="openDeleteDialog(props.item)">
                                            <v-icon color="dark">delete</v-icon>
                                        </v-btn>

                                        <v-btn icon class="mx-0"
                                               @click="onPrintTransaction(props.item)">
                                            <v-icon color="dark">print</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </template>

                            <template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-text>
                                        <v-layout row wrap>
                                            <v-flex xs6 class="mb-3">
                                                <h3>Update status</h3>
                                                <v-btn-toggle v-model="props.item.type"
                                                              @change="updateStatus(props.item)">
                                                    <v-btn flat value="due-paid">
                                                        Due
                                                    </v-btn>
                                                    <v-btn flat value="pending">
                                                        Pending
                                                    </v-btn>
                                                    <v-btn flat value="paid">
                                                        Paid
                                                    </v-btn>

                                                    <v-btn flat value="rol-back">
                                                        Return Product
                                                    </v-btn>
                                                </v-btn-toggle>
                                            </v-flex>

                                            <v-flex xs6 class="mb-3" v-if="role === 'admin'">
                                                <h3>Approved transaction</h3>
                                                <v-btn-toggle v-model="props.item.status"
                                                              mandatory
                                                              @change="acceptDenyTransaction(props.item)">
                                                    <v-btn flat :value="1">
                                                        Approved
                                                    </v-btn>

                                                    <v-btn flat :value="0">
                                                        Pending
                                                    </v-btn>
                                                </v-btn-toggle>
                                            </v-flex>

                                            <v-flex xs6 class="mb-3" v-if="props.item.bkash && props.item.bkash.amount">
                                                <h3>Bkash</h3>
                                                <v-btn-toggle v-model="props.item.bkash.status"
                                                              class="mb-3"
                                                              @change="updateBkashStatus(props.item)">
                                                    <v-btn flat :value="0">
                                                        Processing
                                                    </v-btn>
                                                    <v-btn flat :value="1">
                                                        Completed
                                                    </v-btn>
                                                </v-btn-toggle>
                                                <ul>
                                                    <li>Phone Number: {{ props.item.bkash.phone_number }}</li>
                                                    <li>Amount: {{ props.item.bkash.amount }}</li>
                                                </ul>
                                            </v-flex>
                                        </v-layout>

                                        <h3>Products: </h3>
                                        <v-layout row wrap>
                                            <v-flex xs4 v-for="(product, index) in props.item.products" :key="index">
                                                <ul>
                                                    <li>Name: {{ product.name }}</li>
                                                    <li>Sale quantity: {{ product.sale_quantity }}</li>
                                                    <li>Sale price : {{ product.sale_price }}</li>
                                                    <li>Discount : {{ props.item.discount_amount}}</li>
                                                    <li>Total : {{ product.sale_quantity * product.sale_price }}</li>
                                                    <li v-for="(serial, index) in props.item.serials">
                                                        <ul v-if="serial.product_id === product.id" class="mt-2">
                                                            <li class="ml-0">Color: {{ serial.color && serial.color}}
                                                            </li>
                                                            <li class="ml-0">IMEI: {{ serial.imei && serial.imei}}</li>
                                                            <li class="ml-0">Barcode: {{ serial.barcode &&
                                                                serial.barcode}}
                                                            </li>
                                                            <li class="ml-0">Warranty: {{ serial.product_warranty &&
                                                                serial.product_warranty}}
                                                            </li>
                                                        </ul>
                                                    </li>
                                                </ul>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-text>
                                </v-card>

                                <v-layout row wrap>
                                    <v-flex xs6>
                                        <v-card flat>
                                            <v-card-text>
                                                <h3>Customer information: </h3>
                                                <v-layout row wrap>
                                                    <v-flex xs6>
                                                        Name : {{props.item.customer && props.item.customer.name}}
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        Address : {{props.item.customer && props.item.customer.address}}
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        Email : {{props.item.customer && props.item.customer.email}}
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        Mobile : {{props.item.customer && props.item.customer.mobile}}
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        Phone : {{props.item.customer && props.item.customer.phone}}
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>

                                    <v-flex xs6>
                                        <v-card flat>
                                            <v-card-text>
                                                <h3>Seller information: </h3>
                                                <v-layout row wrap>
                                                    <v-flex xs6>
                                                        Name : {{props.item.seller && props.item.seller.name}}
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        Email : {{props.item.seller && props.item.seller.email}}
                                                    </v-flex>
                                                    <v-flex xs6>
                                                        Type or user : {{props.item.seller && props.item.seller.role}}
                                                    </v-flex>
                                                </v-layout>
                                            </v-card-text>
                                        </v-card>
                                    </v-flex>
                                </v-layout>


                                <v-divider/>
                            </template>

                            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                            </v-alert>

                            <template slot="no-data">
                                Please wait transactions loading....
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
    /* eslint-disable no-unreachable */

    import axios from 'axios'
    import {mapGetters} from 'vuex'

    import Overview from './Overview'

    export default {
        components: {
            Overview
        },

        data: () => ({
            dialog: false,
            overView: {},
            deleteDialog: false,
            deleteItem: {},
            companyExists: true,
            productExists: true,

            headers: [
                {
                    text: 'Date',
                    value: 'created_at',
                    sortable: true
                },

                {
                    text: 'C Name',
                    value: 'customer.name',
                    sortable: true
                },

                {
                    text: 'Invoice number',
                    value: 'invoice_number',
                    sortable: false
                },
                {
                    text: 'Product',
                    value: 'product',
                    sortable: true
                },

                {
                    text: 'Status',
                    value: 'transaction_status',
                    sortable: false
                },

                {
                    text: 'Discount',
                    value: 'discount',
                    sortable: true
                },

                {
                    text: 'paid',
                    value: 'paid',
                    sortable: false
                },

                {
                    text: 'Due',
                    value: 'payment_due',
                    sortable: true
                },

                {
                    text: 'Service charge',
                    value: 'service_charge',
                    sortable: true
                },

                {
                    text: 'Total',
                    value: 'total',
                    sortable: true
                },

                {
                    text: 'Actions'
                }
            ],
            total_customer: '',
            items: [],
            products: [],
            allProductData: [],
            current_product_quantity: '',
            selectedProduct: [],
            customers: [],
            selectedCustomer: [],
            payment_due: '',
            paid: '',

            editedIndex: -1,
            editedItem: {
                id: '',
                name: 'New title',
                email: 'new Description',
                quantity: '',
                active: '1',

            },
            paymentStatus: [
                {text: 'paid', value: 1},
                {text: 'Due', value: 2},
                {text: 'Half paid', value: 3},
                {text: 'Pending', value: 4}
            ],

            selectedPaymentStatus: 1,
            active: [1, 2],


            defaultItem: {
                name: '',
                descriptin: ''
            },

            search: '',
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
                selectedShop: 'getSelectedShop',
                role: 'getUserRole',
                userId: 'getUserId'
            }),

            formTitle() {
                return this.editedIndex === -1 ? 'New Transaction' : 'Edit Transaction'
            },

            createTransaction() {
                return this.companyExists && this.productExists ? true : false;
            }
        },

        watch: {
            dialog(val) {
                val || this.close()
            },

            selectedShop() {
                this.initialize();
            },

            selectedProduct(val) {
                let change_product = '';
                this.allProductData.forEach(function (product) {
                    if (val === product.id) {

                        change_product = product;
                    }
                });
                this.current_product_quantity = change_product.quantity;
            },

            selectedPaymentStatus(selectedValue) {
            },

            pagination() {
                this.getAllTransactions();
            }
        },

        created() {
            this.initialize()
        },

        updated() {
        },

        methods: {
            initialize() {
                this.getAllTransactions();

                //get all product
                axios.get('/api/products')
                    .then((response) => {
                        if (response.data.products.length > 0) {
                            this.products = response.data.products;
                            this.allProductData = response.data.products;
                            let array_products = [];
                            this.products.forEach((product) => {
                                var product = {text: product.name, value: product.id};
                                array_products.push(product);
                            })
                            this.products = array_products;
                        } else {
                            this.productExists = false;
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });


                // get all customers
                axios.get('/customers')
                    .then((response) => {
                        if (response.data.length > 0) {
                            this.customers = response.data;
                            var array_customer = [];
                            this.customers.forEach((customer) => {
                                var customer = {text: customer.name, value: customer.id};
                                array_customer.push(customer);
                            })
                            this.customers = array_customer;
                        } else {
                            this.companyExists = false
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },

            async getAllTransactions() {
                // get all transaction
                const params = this.getQueryParams();
                const url = `/api/transactions${params}`;
                this.loading = 'white';

                await axios.get(url)
                    .then((response) => {
                        if (response.data.transactions) {
                            this.items = response.data.transactions;
                        }
                        this.totalRows = response.data.total_rows;
                        this.overView = {
                            totalTransactions: response.data.total_transactions,
                            todayTotalTransaction: response.data.today_total_transaction,
                            totalAmountTransactions: response.data.total_tk
                        }
                        this.loading = false;
                    })
                    .catch((error) => {
                        console.log(error)
                    })
            },

            getQueryParams() {
                const shopId = this.selectedShop.id
                let params = '';
                params += '?query_type=transactionPage';
                if (shopId) {
                    params += '&shopId=' + shopId + '&allSerial=true'
                }

                if (this.selectedCategory && this.selectedCategory !== null) {
                    params += '&category_id=' + this.selectedCategory
                }

                _.map(this.pagination, (value, key) => {
                    params += `&${key}=${value}`
                })
                return params;
            },

            openDeleteDialog(deleteItem) {
                this.deleteItem = deleteItem;
                this.deleteDialog = true;
            },

            deleteItemD() {
                let url = 'api/transactions/' + this.deleteItem.id + '/delete ';
                axios.get(url).then((response) => {
                    this.deleteDialog = false;
                    const index = this.items.indexOf(this.deleteItem)
                    this.items.splice(index, 1)

                    this.fetchProducts();
                });
            },

            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },

            viewTransition() {

            },

            price_format(val) {
                return val.toFixed(2).replace(/./g, function (c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            },

            onGotoCreateTransaction(value) {
                this.$router.push({name: 'create_transaction', params: {type: value}});
            },

            onPrintTransaction(item) {
                this.$router.push({name: 'print_transaction', params: {id: item.id}});
            },

            getPaymentStatus(value) {
                let status = '';
                switch (value) {
                    case 1:
                        status = 'Paid';
                        break;
                    case 2:
                        status = 'Due'
                        break;
                    case 3:
                        status = 'Half paid';
                        break;
                    case 4:
                        status = 'Pending';
                        break;
                    default:
                        status = '';
                }
                return status;
            },

            onDueTransaction() {
                this.$router.push({name: 'create_due_transaction'});
            },

            customFilter(items, search, filter) {
                search = search.toString().toLowerCase();

                if (search === '') {
                    return items;
                }
                let filterItem = [];
                items.forEach((item) => {
                    let isSerial = false;
                    let transaction = false;
                    if (item.serials.length > 0) {
                        item.serials.forEach((serial) => {
                            let itemSerial = serial.product_serial.toString().toLowerCase();
                            if (itemSerial.includes(search)) {
                                isSerial = true;
                            }
                        })
                    }

                    if (item.invoice_number.toString().toLowerCase().includes(search)) {
                        transaction = true;
                    }

                    if (isSerial || transaction) {
                        filterItem.push(item);
                    }
                })
                return filterItem;
            },

            updateStatus(transaction) {

                if (transaction.type === 'rol-back') {
                    this.openDeleteDialog(transaction);
                    return;
                }

                let transactionId = transaction.id;

                let url = 'api/transactions/' + transactionId;
                axios.put(url, {payment_type: transaction.type}).then((response) => {

                });

            },

            acceptDenyTransaction(transaction) {

                let transactionId = transaction.id;

                let url = 'api/transactions/' + transactionId;
                axios.put(url, {status: transaction.status, user_id: this.userId}).then((response) => {
                    console.log("response is; ", response);
                });

            },

            updateBkashStatus(transaction) {
                let transactionId = transaction.id;
                let url = 'api/transactions/' + transactionId;
                axios.put(url, {
                    bkash_id: transaction.bkash.id,
                    bkash_status: transaction.bkash.status
                }).then((response) => {
                    this.initialize()
                });

            }
        }
    }
</script>
