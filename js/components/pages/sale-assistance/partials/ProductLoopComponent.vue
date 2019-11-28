<template>
    <v-data-table
            :headers="headers"
            :items="products"
            hide-actions
            no-data-text="Please scan item to add"
            class="elevation-1"
    >
        <template v-slot:items="props">
            <td>{{ props.item.name }}</td>
            <td>{{ props.item.color }}</td>
            <td>{{ props.item.product_warranty }}</td>
            <td>{{ props.item.sale_price }} TK.</td>
            <td>{{ props.item.barcode }}</td>
            <td>
                <span v-if="props.item.sale_status === 1">Pending</span>
                <span v-if="props.item.sale_status === 2">Sold</span>
                <span v-if="props.item.sale_status === 3">Returned</span>
            </td>
            <td>
                <v-btn small
                       icon
                       flat
                       color="success"
                       @click="onTransaction(props.item)">
                    <v-icon>add_to_queue</v-icon>
                </v-btn>

                <v-btn small
                       icon
                       flat
                       color="error"
                       @click="onRemoveProduct(props.item)">
                    <v-icon>delete</v-icon>
                </v-btn>
            </td>
        </template>
    </v-data-table>
</template>

<script>

    import {mapGetters} from 'vuex'

    export default {
        props:{
            saleAssistant: Object
        },

        data() {
            return {
                headers: [
                    {
                        text: 'Name',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {text: 'Color', value: 'color'},
                    {text: 'Warranty', value: 'warranty'},
                    {text: 'Price', value: 'salePrice'},
                    {text: 'Barcode', value: 'barcode'},
                    {text: 'Status', value: 'status'},
                    {text: 'Action', value: 'action'}
                ],
            }
        },

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

            selectedSerials() {
                this.updateStore(this.selectedProduct.id);
            }

        },
        computed: {
            ...mapGetters({
                products: 'getSaleAssistantProducts'
            })
        },

        created() {
        },

        methods: {

            onRemoveProduct(product) {
                this.$store.commit('removeSaleAssistantProduct', product);
            },

            onTransaction(product){
                this.$router.push({
                    name: 'sale_assistance_transaction',
                    params:{
                        staffId: this.saleAssistant.id,
                        barcode: product.barcode
                    }
                })
            }
        }
    }
</script>

<style>
    .v-btn--floating.v-btn--small.remove-item {
        width: 20px;
        height: 20px;
        top: 0;
    }
</style>
