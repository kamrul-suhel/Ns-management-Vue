<template>
    <v-layout row wrap>

        <v-flex xs6>
            <template v-if="this.saleAssistant">
                <h3>{{selectedProduct.name}}</h3>
                <span>Per unit sale price:  {{ selectedProduct.sale_price}}</span>
            </template>

            <v-autocomplete
                    v-else
                    dark
                    color="dark"
                    label="Select Product"
                    :items="products"
                    :hint="'Per unit sale price: '+ selectedProduct.sale_price"
                    append-icon="add_shopping_cart"
                    v-model="selectedProduct"
                    item-text="name"
                    item-value="name"
                    chips
                    return-object
                    persistent-hint
            ></v-autocomplete>
        </v-flex>

        <v-flex xs6 :style="{position: 'relative'}">
            <v-btn
                    v-if="!this.saleAssistant"
                    class="remove-item"
                    absolute
                    dark
                    fab
                    top
                    right
                    small
                    outline
                    @click="onRemoveProduct()"
                    color="error"
            >
                <v-icon>remove</v-icon>
            </v-btn>

            <v-text-field
                    dark
                    color="dark"
                    label="Pic"
                    type="number"
                    min="1"
                    :max="selectedProduct.quantity"
                    :disabled="selectedProduct.isDisabled || selectedProduct.is_barcode === 'barcode' || selectedProduct.is_barcode === 'serial'"
                    :placeholder="'You have '+ selectedProduct.quantity + ' in your stock'"
                    :hint="'You have '+ selectedProduct.quantity + ' in your stock'"
                    persistent-hint
                    v-model="selectedQuantity"
            ></v-text-field>
        </v-flex>

        <v-flex xs3 v-if="selectedProduct.is_barcode === 'barcode'">
            <v-autocomplete
                    label="Color"
                    dark
                    color="dark"
                    :disabled="selectedProduct.isDisabled"
                    :items="selectedProduct.serials"
                    item-text="color"
                    item-value="color"
                    v-model="selectedSerials"
                    return-object
            ></v-autocomplete>
        </v-flex>

        <v-flex xs3>
            <v-text-field
                    dark
                    color="dark"
                    label="Barcode"
                    :disabled="selectedProduct.isDisabled || selectedProduct.is_barcode === 'barcode'"
                    :value="selectedSerials.barcode && selectedSerials.barcode"
            ></v-text-field>
        </v-flex>

        <v-flex xs3 v-if="selectedProduct.is_barcode === 'barcode'">
            <v-text-field
                    dark
                    color="dark"
                    label="IMEI"
                    :disabled="selectedProduct.isDisabled || selectedProduct.is_barcode === 'barcode'"
                    :value="selectedSerials.imei && selectedSerials.imei"
            ></v-text-field>
        </v-flex>

        <v-flex xs3>
            <v-text-field
                    dark
                    color="dark"
                    label="Warranty"
                    disabled
                    :value="selectedSerials.product_warranty && selectedSerials.product_warranty"
            ></v-text-field>
        </v-flex>

        <v-flex xs6>
            <v-autocomplete
                    v-if="serials.length > 0"
                    label="Serial Number"
                    dark
                    color="dark"
                    :items="serials"
                    item-text="product_serial"
                    item-value="product_serial"
                    v-model="selectedSerials"
                    @change="onSerialChange()"
                    multiple
            ></v-autocomplete>
        </v-flex>

        <v-flex xs6 v-if="serials.length > 0">
            <p class="light-green--text">This product has {{ serials[0].product_warranty }} warranty.</p>
        </v-flex>
    </v-layout>
</template>

<script>

    import TransactionEventBus from '../../../../event_bus/transaction_event';

    export default {
        data() {
            return {
                products: [],
                selectedProduct: {},
                current_product_quantity: '',
                current_product_sale_price: 0,
                selectedQuantity: 1,
                allProductData: '',
                previous_selected_id: '',
                serials: [],
                selectedSerials: [],
                productMessage: 'Select product'
            }
        },

        props: [
            'index',
            'code',
            'saleAssistant'
        ],
        watch: {
            selectedProduct(product) {
                if (product) {
                    this.updateStore(product.id);
                }
            },

            selectedQuantity(val) {
                this.updateStore(this.selectedProduct.id);
            },

            selectedPercentage() {
                this.updateStore(this.selectedProduct.id);
            },

            selectedSerials(){
                this.updateStore(this.selectedProduct.id);
            }

        },

        created() {
            this.initialize();
        },

        methods: {
            onSerialChange() {
                this.updateStore(this.selectedProduct.value);
            },

            initialize() {

                let url = '/api/products?status=available&allSerial=true&shopId=' + this.$store.getters.getSelectedShopId;


                if (this.code && this.code !== 1) {
                    url = url + '&code=' + this.code
                }

                //get all product for store
                axios.get(url)
                    .then((response) => {
                        if (response.data.products) {

                            if(response.data.selected_product &&
                                response.data.selected_product.serials[0].is_sold === 1){
                                this.saleProductErrorMessage = true
                                this.selectedProduct = {}
                                TransactionEventBus.removeProductByCode(this.code);
                                return;
                            }

                            console.log('Product is: ', response.data);

                            this.selectedProduct = {...response.data.selected_product};
                            this.products = [...response.data.products];

                            // set selected quantity if scaned is found
                            if (!_.isEmpty(this.selectedProduct)) {
                                this.selectedQuantity = 1;
                                this.saleProductErrorMessage = false;

                                this.selectedSerials = {...this.selectedProduct.serials[0]};
                                this.selectedProduct = {
                                    ...response.data.selected_product,
                                    isDisabled: true
                                }

                                this.updateStore(this.selectedProduct.id);
                            }
                        }
                    })
                    .catch((error) => {
                        console.log(error)
                    });
            },

            updateStore(id) {
                this.products.forEach((product) => {
                    if (id === product.id) {
                        let newProduct = {
                            ...product,
                            index: this.index
                        };
                        newProduct.quantity = this.selectedQuantity;

                        console.log("product barcode is; ", product);

                        if (product.is_barcode === 'barcode' ||
                            product.is_barcode === 'serial') {
                            newProduct.serials = [{...this.selectedSerials}];
                        }

                        this.$store.dispatch('setTransaction', newProduct)
                            .then(() => {
                                TransactionEventBus.updateProduct();
                            });
                    }
                });
            },

            onRemoveProduct(){
                this.$store.dispatch('removeProduct', this.selectedProduct).then(() => {
                    TransactionEventBus.removeProduct(this.index);
                });
            }
        }
    }
</script>

<style>
    .v-btn--floating.v-btn--small.remove-item{
        width:20px;
        height:20px;
        top:0;
    }
</style>
