<template>
    <v-container grid-list-md>
        <v-layout row wrap>
            <v-flex xs12>
                <h2>Transition</h2>
            </v-flex>
        </v-layout>

        <v-divider class="mb-3 dark"></v-divider>

        <v-layout row wrap>
            <v-flex xs6>
                <v-layout row wrap>
                    <v-flex xs6>
                        <v-card flat class="light-green lighten-1 white--text">
                            <v-card-title>Today Transactions</v-card-title>
                            <v-card-text class="pt-0">
                                <h2 class="display-2 white--text text-xs-center">
                                    <strong>{{ overview.todayTotalTransaction }}</strong>
                                </h2>
                            </v-card-text>
                        </v-card>
                    </v-flex>

                    <v-flex xs6>
                        <v-card flat class="cyan lighten-1 white--text">
                            <v-card-title>Total Transactions</v-card-title>
                            <v-card-text class="pt-0">
                                <h2 class="display-2 white--text text-xs-center">
                                    <strong>{{ overview.totalTransactions }}</strong>
                                </h2>
                            </v-card-text>
                        </v-card>
                    </v-flex>
                </v-layout>
            </v-flex>

            <v-flex xs6>
                <v-card flat class="light-blue white--text">
                    <v-card-title>Total Amount Transactions</v-card-title>
                    <v-card-text class="pt-0">
                        <h2 class="display-2 white--text text-xs-center">
                            <strong>&#2547;{{ price_format(overview.totalAmountTransactions) }}</strong></h2>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        name: "Overview",

        props: [
          'overview'
        ],

        data(){
            return{

            }
        },

        created(){

        },

        methods: {
            price_format(val) {
                if(!val){
                    return val;
                }
                return val.toFixed(2).replace(/./g, function (c, i, a) {
                    return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
                });
            },
        }
    }
</script>

<style scoped>

</style>