<template>
    <div class="transaction-print full-width">
        <v-container grid-list-lg v-if="initialize">
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-text>
                        <h2 class="text-xs-center logo">{{ setting.name ? setting.name : ''}}</h2>
                        <h3 class="logo-description"><span class="description-style">Authorized</span> distributor of</h3>
                        <div class="logo-img">
                            <img src="/images/sh-tel.gif"/>
                        </div>
                        <h3 class="text-xs-center subtitle">Address: {{ setting.address }}</h3>
                        <v-layout row wrap class="address">
                            <v-flex xs6 class="company-info-left">
                                <p>Phone: {{ setting.phone }}</p>
                                <p>Mobile: {{ setting.mobile }}</p>
                                <p>Email: {{ setting.email }}</p>
                            </v-flex>
                            <v-spacer></v-spacer>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs6>
                                <h3>Customer</h3>
                                <p>{{ customer.name }}</p>
                                <p>{{ customer.mobile }}</p>
                            </v-flex>

                            <v-spacer></v-spacer>

                            <v-flex xs4>
                                <h3>Ship To</h3>
                                <p>{{ customer.address }}</p>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-divider></v-divider>
                        </v-layout>

                        <v-layout row wrap class="transaction-print-table">
                            <v-flex xs12>
                                <table width="100%" class="ns-table-print">
                                    <thead>
                                        <td>Particular</td>
                                        <td>Reference</td>
                                        <td>Remark</td>
                                        <td>Debit</td>
                                        <td>Credit</td>
                                        <td>Balance</td>
                                    </thead>

                                    <tbody>
                                        <tr v-for="(product, index) in transitions"
                                            :key="index">
                                            <td>{{ product.particular }}</td>
                                            <td>{{ product.reference }}</td>
                                            <td>{{ product.remark }}</td>
                                            <td>TK. {{ product.debit | price_format }}</td>
                                            <td>TK. {{ product.credit | price_format }}</td>
                                            <td>TK. {{ product.balance }}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap>
                            <v-flex xs12 class="text-xs-right">
                                <p>Balance: TK. {{ lastTransition.balance }}</p>
                            </v-flex>
                        </v-layout>

                        <v-layout row wrap class="print-btn">
                            <v-flex xs12>
                                <v-btn raised
                                       dark
                                       color="dark"
                                        @click="$router.push({name:'customer_ledger'})">
                                    Back
                                </v-btn>

                                <v-btn raised
                                       dark
                                       color="dark"
                                       @click="onPrint()">
                                    Print
                                </v-btn>
                            </v-flex>
                        </v-layout>

                    </v-card-text>
                </v-card>
            </v-layout>
        </v-container>
    </div>
</template>

<script>
    import store from "../../../store";

    export default {
        data(){
            return {
                transitions: [],
                initialize: false,
                subtotal:0,
                discount:0,
                servicesCharge :0,
                setting: {},
                customer:{},
                lastTransition: {}
            }
        },

        created(){
            this.initilize();
        },

        methods: {
            initilize(){
                const id = this.$route.params.id;
                const storeId = this.$route.params.storeId;
                var url = '/api/customers/'+id+`/ledger/${storeId}`;
                axios.get(url).then((response) => {
                    this.transitions = response.data.transitions;
                    this.setting = {...response.data.setting}
                    this.customer = {...response.data.customer}
                    this.lastTransition = {...response.data.lastTransition}
                    this.initialize = true;
                });
            },

            initializeSubtotal(){
                var subtotal = 0;
                this.transitions.transaction.products.forEach(function(product){
                    subtotal += product.sale_quantity * product.sale_price;
                });
                this.subtotal = subtotal;
            },

            onPrint(){
                window.print();
            }
        }
    }
</script>

<style scoped>

</style>
