<template>
    <div class="company-transaction">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>Company Return</h2>
                </v-flex>
            </v-layout>

            <v-divider class="mb-3 dark"></v-divider>
        </v-container>

        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs6>
                                <v-select
                                        dark
                                        color="dark"
                                        :items="companies"
                                        item-text="name"
                                        item-value="id"
                                        label="Select A Company"
                                        required
                                        v-model="selectedCompany"
                                ></v-select>
                            </v-flex>

                            <v-flex xs6>
                                <v-select
                                        dark
                                        color="dark"
                                        :items="products"
                                        item-text="name"
                                        item-value="product_id"
                                        label="Select A product"
                                        required
                                        return-object
                                        v-model="selectedProduct"
                                ></v-select>
                            </v-flex>

                            <v-layout row wrap v-if="selectedProduct && selectedProduct.is_barcode !== 'no'">
                                <v-flex xs12>
                                    <h2>{{ selectedProduct.name }}</h2>
                                    <div><span>Quantity: {{ selectedProduct.quantity }} left</span></div>
                                </v-flex>

                                <v-flex xs12>
                                    <v-data-table
                                            :headers="headers"
                                            :items="availableProducts"
                                            class="elevation-1"
                                            :rows-per-page-items="[-1]"
                                    >
                                        <template v-slot:items="props">
                                            <td class="text-xs-left">
                                                <v-checkbox
                                                        :true-value="props.item"
                                                        :false-value="props.item.id"
                                                        color="white"
                                                        @change="onChangeSerial"
                                                ></v-checkbox>
                                            </td>
                                            <td class="text-xs-left">{{ props.item.color }}</td>
                                            <td class="text-xs-left">{{ props.item.barcode }}</td>
                                            <td class="text-xs-left">{{ props.item.imei }}</td>
                                            <td class="text-xs-left">{{ props.item.product_warranty }}</td>
                                        </template>
                                    </v-data-table>
                                </v-flex>
                            </v-layout>

                            <v-flex xs6 v-else>
                                <v-text-field
                                        type="number"
                                        label="Quantity"
                                        v-model="quantity"
                                        color="white"
                                ></v-text-field>
                            </v-flex>

                            <v-flex xs6>
                                <v-text-field
                                        label="Note"
                                        v-model="note"
                                        color="white"
                                ></v-text-field>
                            </v-flex>


                        </v-layout>
                    </v-card-text>

                    <v-card-actions v-if="selectedProduct">
                        <v-spacer></v-spacer>
                        <v-btn color="success"
                               @click="onReturnProduct">
                            Return product
                        </v-btn>

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
            {{ snackbar_message }}
        </v-snackbar>
    </div>
</template>
<script>
    /* eslint-disable no-unreachable */
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            snackbar: false,
            snackbar_message: '',
            selectedCompany: '',
            selectedProduct: '',
            headers: [
                {
                    text: 'Action',
                    align: 'left',
                    sortable: false,
                    value: 'action'
                },

                {
                    text: 'Color',
                    align: 'left',
                    sortable: false,
                    value: 'color'
                },

                {
                    text: 'Barcode',
                    align: 'left',
                    sortable: false,
                    value: 'barcode'
                },

                {
                    text: 'IMEI',
                    align: 'left',
                    sortable: false,
                    value: 'imei'
                },

                {
                    text: 'Warranty',
                    align: 'left',
                    sortable: false,
                    value: 'warrantry'
                }
            ],
            selectedSerials: [],
            note:'',
            quantity: 1
        }),

        computed: {
            ...mapGetters({
                companies: 'getCompanies',
                totalCompany: 'getTotalCompany',
                transitions: 'getCompanyTransitions',
                previousBalance: 'getCompanyPreviousBalance',
                products: 'getCompanyProducts',
                availableProducts: 'getProductSerials'
            })
        },

        watch: {
            selectedCompany(value) {
                this.$store.dispatch('fetchCompanyProducts', {companyId: value})
            },

            selectedProduct(product) {
                this.$store.dispatch('fetchProductSerialForCompany', {productId: product.product_id})
            }
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                // get all product
                this.$store.dispatch('loadCompanies')
            },

            onChangeSerial(serial) {
                if (this.isObject(serial)) {
                    this.selectedSerials.push(serial)
                } else {
                    this.selectedSerials = _.filter(this.selectedSerials, (curSerial) => {
                        return curSerial.id != serial
                    })
                }
            },

            onReturnProduct() {
                let companyReturn = new FormData()
                let quantity = 0
                companyReturn.append('product_id', this.selectedProduct.id)
                companyReturn.append('company_id', this.selectedCompany)
                companyReturn.append('note', this.note)
                companyReturn.append('is_barcode', this.selectedProduct.is_barcode)

                if (this.selectedProduct.is_barcode === 'no') {
                    companyReturn.append('quantity', this.quantity)
                } else {
                    companyReturn.append('quantity', this.selectedSerials.length)
                    _.forEach(this.selectedSerials, (serial, index) => {
                        companyReturn.append(`serials[${index}]`, serial.id)
                    })
                }

                axios.post('/api/companies/return', companyReturn).then((response) => {
                    this.snackbar_message = this.selectedProduct.name + ' successfully  returned'
                    this.snackbar = true;
                })
            },

            isObject(val) {
                return val instanceof Object;
            }
        }
    }
</script>
