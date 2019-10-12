<template>
    <div class="products">

        <Overview :overview="overview"></Overview>

        <v-container grid-list-md>
            <v-layout row wrap>
                <v-card width="100%">
                    <v-card-title>
                        <v-btn dark fab small
                               color="dark"
                               @click="$router.push('products/add')">
                            <v-icon>add</v-icon>
                        </v-btn>

                        <v-spacer></v-spacer>

                        <v-select
                                dark
                                color="dark"
                                label="Filter by category"
                                :items="categories"
                                v-model="selectedCategory">

                        </v-select>

                        <v-text-field
                                dark
                                color="dark"
                                prepend-icon="search"
                                label="Search"
                                v-model="search"></v-text-field>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table
                                :headers="headers"
                                :items="items"
                                :pagination.sync="pagination"
                                :total-items="total"
                                :rows-per-page-items="row_per_page"
                                :loading="loading"
                        >
                            <template slot="items" slot-scope="props">
                                <tr @click="props.expanded = !props.expanded">
                                    <td>{{ props.item.created_at | convertDate }}</td>
                                    <td>{{ props.item.name }} <br/> {{ props.item.description }}</td>
                                    <td>{{ props.item.quantity }}</td>
                                    <!--<td class="text-xs-center">TK. {{ props.item.sale_price }}</td>-->
                                    <td>TK. {{ props.item.sale_price }}</td>
                                    <td>{{ props.item.status }}</td>
                                    <td class="justify-start layout px-0">
                                        <v-btn dark
                                               color="dark"
                                               icon
                                               class="mx-0"
                                               @click="editItem(props.item)">
                                            <v-icon color="white">edit</v-icon>
                                        </v-btn>
                                        <v-btn icon
                                               dark
                                               color="dark"
                                               class="mx-0"
                                               @click="openDeleteDialog(props.item)">
                                            <v-icon color="white">delete</v-icon>
                                        </v-btn>
                                    </td>
                                </tr>
                            </template>

                            <v-divider></v-divider>

                            <template slot="expand" slot-scope="props">
                                <v-card flat>
                                    <v-card-text>
                                        <table width="100%">
                                            <tr>
                                                <td><strong>Additional info</strong></td>
                                            </tr>

                                            <tr v-for="(serial, index) in props.item.serials" :key="index">
                                                <td>
                                                    Barcode: {{ serial.barcode }}
                                                </td>
                                                <td>
                                                    IMEI: {{ serial.imei }}
                                                </td>
                                                <td>
                                                    Color: {{ serial.color }}
                                                </td>
                                            </tr>
                                        </table>

                                        <v-divider></v-divider>

                                        <table with="100%">
                                            <tr>
                                                <td><strong>Companies</strong></td>
                                                <td><strong>Mobile</strong></td>
                                                <td><strong>Phone</strong></td>
                                                <td><strong>Quantity</strong></td>
                                                <td><strong>Purchased date</strong></td>
                                            </tr>
                                            <tr v-for="(company, index) in props.item.companies" :key="index">
                                                <td>{{ company.name}}</td>
                                                <td>{{ company.mobile }}</td>
                                                <td>{{ company.phone }}</td>
                                                <td>{{ company.pivot.product_quantity }}</td>
                                                <td>{{ company.pivot.created_at | convertDate }}</td>
                                            </tr>
                                        </table>

                                        <p>Purchase price : {{ props.item.purchase_price }}</p>
                                    </v-card-text>
                                </v-card>
                            </template>

                            <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                Your search for "{{ search }}" found no results.
                            </v-alert>

                            <template slot="no-data">
                                Please wait products loading....
                            </template>
                        </v-data-table>
                    </v-card-text>
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
            {{ snackbar_message }}
        </v-snackbar>

        <v-dialog v-model="deleteDialog" persistent max-width="290">
            <v-card color="error">
                <v-card-text>
                    <div class="text-xs-center">
                        <v-icon color="white" size="50">warning</v-icon>
                    </div>
                    <p class="text-xs-center">Are you sure you want to delete {{deleteItem.title}} {{
                        deleteItem.description}}</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1" flat @click.native="deleteDialog = false">Disagree</v-btn>
                    <v-btn color="dark darken-1" flat @click.native="deleteItemD()">Agree</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'

    import Overview from './OverView'

    export default {
        components: {
            Overview
        },

        data: () => ({
            categories: [],
            selectedCategory: null,

            overview: {},

            deleteDialog: false,
            deleteItem: {},

            snackbar: false,
            snackbar_message: '',

            headers: [
                {
                    text: 'Date',
                    align: 'left',
                    sortable: true,
                    value: 'created_at'
                },

                {
                    text: 'Title',
                    value: 'name',
                    sortable: true
                },

                {
                    text: 'Quantity',
                    value: 'quantity',
                    sortable: true
                },
                {
                    text: 'Price',
                    value: 'sale_price',
                    sortable: true
                },
                {
                    text: 'Status',
                    value: 'status',
                    sortable: true
                },
                {
                    text: 'Action',
                    value: 'action'
                }
            ],

            search: '',
            pagination: {
                page: 1,
                rowsPerPage: 15, // -1 for All
                sortBy: 'name'
            },

            items: [],
            row_per_page: [15, 20, 30, 50, {'text': 'All', 'value': -1}],
            loading: 'white',
            total: null,
        }),

        computed: {
            ...mapGetters({
                selectedShop: 'getSelectedShop'
            }),
        },

        watch: {
            selectedShop() {
                this.initialize();
            },

            dialog(val) {
                val || this.close()
            },

            selectedCategory(value) {
                this.fetchProducts();
            },

            search(){
                this.fetchProducts();
            },

            pagination() {
                this.fetchProducts();
            }

        },

        created() {
            this.initialize();
            //Barcode scannser
            this.$barcodeScanner.init(this.onBarcodeScanned);
        },

        methods: {
            async initialize() {
                const shopId = this.selectedShop.id

                if (!shopId) {
                    return;
                }

                this.fetchProducts();

                let categoriesUrl = '/api/categories'
                if (shopId) {
                    categoriesUrl += '?shopId=' + shopId
                }

                // get all categories
                await axios.get(categoriesUrl)
                    .then((response) => {
                        let categories = response.data;
                        this.categories.push({value : 0, text:'All' });
                        categories.forEach((value) => {
                            let category = {};
                            category.value = value.id;
                            category.text = value.name;

                            this.categories.push(category)
                        })
                    })
                    .catch((error) => {
                        console.log('categories error');
                        console.log(error)
                    })
            },

            async fetchProducts() {
                if(!this.selectedShop.id){
                    return;
                }

                this.loading = 'white';
                let productsUrl = '/api/products' + this.getProductParams();

                // get all product
                await axios.get(productsUrl)
                    .then((response) => {
                        this.items = response.data.products.data;
                        this.total = response.data.products.total;
                        this.loading = false;

                        this.overview = {
                            quantityType: response.data.quantity_types,
                            totalProduct: response.data.total_product,
                            avaliableProduct: response.data.avaliable_product,
                            unavaliableProduct: response.data.unavaliable_product ? response.data.unavaliable_product : 0,
                            totalStock: response.data.total_stock,
                            stockProduct: response.data.stock_product,
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },

            getProductParams() {
                const shopId = this.selectedShop.id
                let params = '';
                params += '?query_type=productPage';
                if (shopId) {
                    params += '&shopId=' + shopId + '&allSerial=true'
                }

                if (this.selectedCategory && this.selectedCategory !== null) {
                    params += '&category_id=' + this.selectedCategory
                }

                if (this.search && this.search !== null) {
                    params += '&search=' + this.search
                }

                _.map(this.pagination, (value, key) => {
                    params += `&${key}=${value}`
                })
                console.log('Params is : ', params);
                return params;
            },

            openDeleteDialog(deleteItem) {
                this.$router.push({name: 'productDelete', params: {id: deleteItem.id}})
                // this.deleteItem = deleteItem;
                // this.deleteDialog = true;
            },

            deleteItemD() {
                let url = 'api/products/' + this.deleteItem.id
                axios.delete(url).then((response) => {
                    this.deleteDialog = false;
                    const index = this.items.indexOf(this.deleteItem)
                    this.items.splice(index, 1)
                    this.snackbar_message = 'You successfully delete ' + this.deleteItem.name;
                    this.snackbar = true;
                    this.initialize();
                });
            },

            close() {
                this.dialog = false;
                this.selectedCategories = [];
                setTimeout(() => {
                    this.editedItem = Object.assign({}, this.defaultItem);
                    this.editedIndex = -1;
                }, 300)
            },

            changeSort(column) {
                if (this.pagination.sortBy === column) {
                    this.pagination.descending = !this.pagination.descending
                } else {
                    this.pagination.sortBy = column
                    this.pagination.descending = false
                }
            },

            customFilter(items, search, filter) {
                search = search && search.toString().toLowerCase();
                if (search === '') {
                    return items;
                }
                let filterItem = [];
                items.forEach((item) => {
                    let isItem = false;
                    let itemSerial = false;
                    if (item.serials.length > 0) {
                        item.serials.forEach((serial) => {
                            let productSerial = serial.barcode.toString().toLowerCase();
                            if (productSerial.includes(search)) {
                                isItem = true;
                            }
                        })

                    }

                    let itemName = item.name.toString().toLowerCase();
                    if (itemName.includes(search)) {
                        itemSerial = true
                    }

                    if (isItem || itemSerial) {
                        filterItem.push(item);
                    }
                })
                return filterItem;

            },

            editItem(product) {
                this.$router.push({name: 'editProduct', params: {id: product.id}});
            }
        }
    }
</script>

<style>
    .products table.table thead th:first-child {
        padding: 0 15px;
    }

</style>
