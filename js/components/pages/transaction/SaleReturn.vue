<template>
    <section class="create-transaction">
        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-text>
                        <h2>Sale return</h2>
                        <v-container grid-list-md>
                            <v-layout row wrap>
                                <v-flex xs10>

                                    <v-text-field
                                            dark
                                            color="dark"
                                            prepend-icon="search"
                                            label="Search by invoice number"
                                            v-model="invoiceNumber">
                                    </v-text-field>


                                </v-flex>

                                <v-flex xs2>
                                    <v-btn color="dark" @click="searchByInvoice()">Search</v-btn>
                                </v-flex>
                            </v-layout>

                            <v-layout row wrap>
                                <v-card raised
                                        width="100%"
                                        v-for="(product, index)  in products"
                                        :key="product.produc_id"
                                        class="mt-2">
                                    <v-card-title>
                                        <v-flex xs4>
                                            Invoice Number : {{ product.invoice_number }}
                                        </v-flex>

                                        <v-flex xs4>
                                            Barcode : {{ product.barcode }}
                                        </v-flex>

                                        <v-flex xs4>
                                            IMEI: {{ product.imei }}
                                        </v-flex>

                                        <v-flex xs4>
                                            Product Name: {{ product.name }}
                                        </v-flex>

                                        <v-flex xs4>
                                            Product Color: {{ product.color }}
                                        </v-flex>

                                        <v-flex xs4>
                                            Sale Quantity : {{ product.sale_quantity }}
                                        </v-flex>

                                        <v-flex xs4>Price : {{ product.sale_price }}</v-flex>

                                        <v-flex xs4></v-flex>

                                        <v-flex xs4>
                                            <v-text-field
                                                    color="dark"
                                                    @value="product.saleReturnQuantity && product.saleReturnQuantity"
                                                    v-model="product.saleReturnQuantity"
                                                    @input="handleQuantityChange()"
                                                    label="Sale Return Quantity:">
                                            </v-text-field>
                                        </v-flex>
                                    </v-card-title>
                                </v-card>
                            </v-layout>

                            <v-layout row wrap v-if="products.length > 0" class="mt-5">
                                <v-card color="dark" width="100%">
                                    <v-card-text>
                                        <v-layout row wrap>
                                            <v-flex xs6 class="text-xs-right">
                                                <v-textarea
                                                        color="dark"
                                                        multi-line
                                                        label="Reason"
                                                        v-model="reason"
                                                ></v-textarea>
                                            </v-flex>

                                            <v-flex xs6 class="text-xs-right">
                                                <v-text-field
                                                        label="Total Return:"
                                                        v-model="totalSalePrice">
                                                </v-text-field>
                                            </v-flex>
                                        </v-layout>
                                    </v-card-text>
                                </v-card>
                            </v-layout>

                            <v-layout row wrap v-if="products.length">
                                <v-flex xs12 class="text-xs-right">
                                    <v-btn dark
                                           raised
                                           color="dark"
                                           @click.native="onCancelTransaction()">Cancel
                                    </v-btn>

                                    <v-btn dark
                                           raised
                                           @click="handleSaleReturn()">Create Sale Return
                                    </v-btn>
                                </v-flex>
                            </v-layout>
                        </v-container>
                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>
    </section>
</template>

<script>
    import ProductLoopComponent from './partials/ProductLoopComponent';

    export default {
        components: {
            'productComponent': ProductLoopComponent
        },

        data: () => ({
            invoiceNumber: null,
            products: [],
            reason: null,
            totalSalePrice: null,
            totalPurchasePrice:null
        }),

        computed: {},

        watch: {
            products(value) {
                console.log("product is change; ", value);
            }
        },

        created() {
            this.initialize();

            //Barcode scanner
            this.$barcodeScanner.init(this.onBarcodeScanned);
        },

        methods: {
            initialize() {

            },

            handleQuantityChange() {
                this.totalSalePrice = 0;
                this.totalPurchasePrice = 0;
                _.map(this.products, (product) => {
                    // check is selected
                    if (product.saleReturnQuantity > 0) {
                        this.totalSalePrice += product.sale_price * product.saleReturnQuantity;
                        this.totalPurchasePrice += product.purchase_price * product.saleReturnQuantity;
                    }
                })
            },

            async searchByInvoice() {
                const url = `api/transactions/search/search?invoice_number=${this.invoiceNumber}`;
                const response = await axios.get(url);

                this.products = [...response.data];
            },

            async handleSaleReturn() {
                // Get store id
                const storeId = this.$store.getters.getSelectedShopId;
                const userId = this.$store.getters.getUserId;

                let formData = new FormData();
                formData.append('store_id', storeId)
                formData.append('seller_id', userId)
                formData.append('note', this.reason)
                formData.append('total_sale_price', this.totalSalePrice)
                formData.append('total_purchase_price', this.totalPurchasePrice)
                formData.append('transaction_id', this.products[0].transaction_id)

                _.map(this.products, (product, index) => {
                    if(product.saleReturnQuantity && product.saleReturnQuantity > 0){
                        _.map(product, (value, key) => {
                            formData.append(`products[${index}][${key}]`, value);
                        })
                    }
                })

                const response = await axios.post('api/sale-return', formData);

                if(!response.data.error){
                    this.$router.push('products');
                }
            },

            onBarcodeScanned(code) {
                this.barcodeDailog = true;
                this.totalProduct.push(code);
                this.barcode = code;
                if (code !== '') {
                    this.barcodeDailog = true;
                    this.barcode = code;
                }
            },


        },

        destroyed() {
            this.$store.commit('resetProductTransition');
        }
    }
</script>
