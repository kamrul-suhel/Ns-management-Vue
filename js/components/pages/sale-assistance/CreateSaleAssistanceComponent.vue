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
                                lazy-validation>
                            <h2>Sale assistance</h2>
                            <v-container grid-list-md>
                                <v-layout row wrap>
                                    <v-flex xs12>
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
                                </v-layout>

                                <product-component></product-component>

                                <v-layout row wrap>
                                    <v-flex xs12 class="text-xs-right">
                                        <v-btn dark color="dark" raised @click.native="onCancelTransaction()">Cancel
                                        </v-btn>

                                        <v-btn dark raised @click="onCreateSaleRecord()">
                                            Create Record
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
    import ProductLoopComponent from './partials/ProductLoopComponent';
    import TransactionEventBus from '../../../event_bus/transaction_event';

    import {mapGetters} from 'vuex';

    export default {
        components: {
            'productComponent': ProductLoopComponent
        },

        data: () => ({
            testCodes : ['19853/49QR04618', '11872/00877969'],
            selectedSaleAssistant:{}
        }),

        computed: {
            ...mapGetters({
                saleAssistants: 'getSaleAssistants',
                products: 'getSaleAssistantProducts'
               })
        },

        watch: {
            selectedSaleAssistant(saleAssistant){
                this.$store.commit('setSaleAssistant', saleAssistant)
            }
        },

        created() {
            this.initialize();

            //Barcode scanner
            this.$barcodeScanner.init(this.onBarcodeScanned);
        },

        methods: {
            async initialize() {
                this.$store.commit('resetSaleAssistant');
                // Get all sale assistant
                this.$store.dispatch('getSaleAssistant')

            },

            onCreateSaleRecord() {

                if (this.$refs.transactionForm.validate()) {
                    let form = new FormData()

                    form.append('userId', this.$store.getters.getSelectedSaleAssistantId);
                    const products = this.$store.getters.getSaleAssistantProducts;
                    console.log(products);

                    products.forEach((product, index)=>{
                        form.append('serial['+index+']', product.id)
                    });

                    const url = '/api/sale-assistant/create'

                    axios.post(url, form)
                        .then((response) => {
                            if (response.data) {
                                this.$router.push({
                                    name: 'sale_assistance_update'
                                });
                            }
                        });
                }
            },

            addProduct() {
                this.totalProduct.push('1')
            },

            onBarcodeScanned(code) {
                console.log('code is : ', code);
                this.barcode = code;
                if (code !== '') {
                    this.addBarcode(code);
                }
            },

            addBarcode(code) {
                let url = '/api/sale-assistant/product?status=available&allSerial=true&shopId=' + this.$store.getters.getSelectedShopId;
                url = url + '&code='+ code;

                if (this.code && this.code !== 1) {
                    // url = url + '&code=' + this.code
                    url = url + '&code=' + code
                }

                //get all product for store
                axios.get(url)
                    .then((response) => {
                        const product = response.data;

                        if(Object.entries(response.data).length === 0 && response.data.constructor === Object){
                            console.log('entry is empty');
                        }else{
                            this.$store.commit('setProduct', product)
                        }

                    })
                    .catch((error) => {
                        console.log(error)
                    });
            }
        },

        destroyed() {
            // this.$store.commit('resetSaleAssistant');
        }
    }
</script>
