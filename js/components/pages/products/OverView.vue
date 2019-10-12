<template>
    <v-container grid-list-md class="pt-0">
        <v-layout row wrap>
            <v-flex xs12 class="pt-0">
                <h2>Products</h2>
            </v-flex>
        </v-layout>

        <v-divider class="mb-3 dark"></v-divider>

        <v-layout row wrap>
            <v-flex xs4>
                <v-card flat class="cyan lighten-1 white--text">
                    <v-card-title>Total product</v-card-title>
                    <v-card-text class="pt-0">
                        <h2 class="display-2 white--text text-xs-center">
                            <strong>{{overview.totalProduct}}</strong>
                        </h2>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs4>
                <v-card flat class="blue darken-1 white--text">
                    <v-card-title>Total quantity</v-card-title>
                    <v-card-text class="pt-0">
                        <h2 class="display-2 white--text text-xs-center">
                            <strong>{{overview.stockProduct}}</strong>
                        </h2>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs4>
                <v-card flat class="light-blue white--text">
                    <v-card-title>Product Available</v-card-title>
                    <v-card-text class="pt-0">
                        <h2 class="display-2 white--text text-xs-center">
                            <strong>{{overview.avaliableProduct}}</strong>
                        </h2>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs6>
                <v-card flat class="light-green lighten-1 white--text">
                    <v-card-title>Product Unavailable</v-card-title>
                    <v-card-text class="pt-0">
                        <h2 class="display-2 white--text text-xs-center">
                            <span style="font-size:12px"></span>
                            <strong>{{overview.unavaliableProduct}}</strong>
                        </h2>
                    </v-card-text>
                </v-card>
            </v-flex>

            <v-flex xs6>
                <v-card flat class="orange darken-1 white--text">
                    <v-card-title>Total Stock</v-card-title>
                    <v-card-text class="pt-0">
                        <h2 class="display-2 white--text text-xs-center">
                            <span style="font-size:12px">TK.</span>
                            <strong>{{overview.totalStock}}</strong>
                        </h2>
                    </v-card-text>
                </v-card>
            </v-flex>
        </v-layout>
    </v-container>
</template>

<script>
    export default {
        props: [
            'overview'
        ],

        data(){
            return {

            }
        },

        created(){
        },


        methods : {

        }
    }
</script>