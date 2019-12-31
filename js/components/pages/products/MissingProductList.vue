<template>
    <div class="company-transaction">
        <v-container grid-list-md py-0>
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>Missing Product List</h2>
                </v-flex>
            </v-layout>

            <v-divider class="mb-2 dark"></v-divider>
        </v-container>

        <v-container grid-list-lg>
            <v-layout row wrap>
                <v-card
                        raised
                        width="100%">
                    <v-card-text>
                        <v-layout row wrap>
                            <v-flex xs12>
                                <v-data-table
                                        :headers="headers"
                                        :items="products"
                                        :rows-per-page-items="[-1]"
                                        class="elevation-1"
                                        no-data-text="Please select a company"
                                        no-results-text="You did not return any products"
                                >
                                    <template v-slot:items="props">
                                        <td class="text-xs-left">
                                            {{ props.item.product_name }}
                                        </td>
                                        <td class="text-xs-left">{{ props.item.note }}</td>
                                        <td class="text-xs-left">{{ props.item.quantity }}</td>
                                        <td class="text-xs-left">{{ props.item.created_at |convertDate }}</td>
                                        <td class="text-xs-left">{{ props.item.color }}</td>
                                        <td class="text-xs-left">{{ props.item.barcode }}</td>
                                        <td class="text-xs-left">{{ props.item.imei }}</td>
                                        <td class="text-xs-right">{{ props.item.product_warranty }}</td>
                                    </template>
                                </v-data-table>
                            </v-flex>
                        </v-layout>
                    </v-card-text>

                    <v-card-actions>
                    </v-card-actions>
                </v-card>
            </v-layout>
        </v-container>
    </div>
</template>
<script>
    /* eslint-disable no-unreachable */
    import {mapGetters} from 'vuex'

    export default {
        data: () => ({
            selectedCompany: '',
            products:[],
            headers: [
                {
                    text: 'Name',
                    align: 'left',
                    sortable: false,
                    value: 'name'
                },

                {
                    text: 'Note',
                    align: 'left',
                    sortable: false,
                    value: 'note'
                },

                {
                    text: 'Quantity',
                    align: 'left',
                    sortable: false,
                    value: 'quantity'
                },

                {
                    text: 'Missing date',
                    align: 'left',
                    sortable: false,
                    value: 'return_date'
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
                    align: 'right',
                    sortable: false,
                    value: 'warrantry'
                }
            ]
        }),

        computed: {
            ...mapGetters({
                companies: 'getCompanies'
            })
        },

        watch: {
            selectedCompany(value) {

            }
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                axios.get(`/api/product/missing/list`).then((response)=>{
                    this.products = [...response.data.products]
                })
            }
        }
    }
</script>
