<template>
    <div class="company-transaction">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-flex xs12>
                    <h2>Company Return List</h2>
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
                                            {{ props.item.name }}
                                        </td>
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
                    text: 'Quantity',
                    align: 'left',
                    sortable: false,
                    value: 'quantity'
                },

                {
                    text: 'Return date',
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
                axios.get(`/api/companies/return/${value}`).then((response)=>{
                    this.products = [...response.data.products]
                })
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

            onReturnProduct() {
                let companyReturn = new FormData()
                let quantity = 0
                companyReturn.append('product_id', this.selectedProduct.id)
                companyReturn.append('company_id', this.selectedCompany)
                companyReturn.append('note', this.note)
                companyReturn.append('is_barcode', this.selectedProduct.is_barcode)

                if (this.selectedProduct.is_barcode === 'no') {
                    companyReturn.append('quantity', quantity)
                } else {
                    companyReturn.append('quantity', this.selectedSerials.length)
                    _.forEach(this.selectedSerials, (serial, index) => {
                        companyReturn.append(`serials[${index}]`, serial.id)
                    })
                }

                axios.post('/api/companies/return', companyReturn).then((response) => {
                    console.log(response)
                })

                return
                let form = new FormData();
                let url = '/api/ctransaction';
                form.append('company_id', this.selectedCompany);
                form.append('store_id', this.$store.getters.getSelectedShopId);
                form.append('payment_type', this.editedItem.payment_type);
                form.append('reference', this.editedItem.reference);
                form.append('remarks', this.editedItem.remarks);
                form.append('debit', this.editedItem.debit);
                form.append('credit', this.editedItem.credit);
                form.append('balance', this.editedItem.balance);
                form.append('manuel_date', this.editedItem.manuel_date);

                if (this.editedIndex !== -1) {
                    // update product
                    form.append('_method', 'PATCH');
                    url = url + '/' + this.editedItem.id;
                    axios.post(url, form)
                        .then((response) => {
                            this.$store.dispatch('loadCompanyTransitions', {companyId: this.selectedCompany})
                            this.snackbar_message = 'Transaction ' + this.editedItem.name + ' successfully updated.';
                            this.snackbar = true;
                            this.close();
                        })
                } else {
                    // create product
                    axios.post(url, form)
                        .then((response) => {
                            this.$store.dispatch('loadCompanyTransitions', {companyId: this.selectedCompany})
                            this.snackbar_message = 'Transaction ' + this.editedItem.name + ' successfully created.';
                            this.snackbar = true;
                            this.close();
                        })
                }

            },

            isObject(val) {
                return val instanceof Object;
            }
        }
    }
</script>
