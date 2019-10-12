<template>
    <div class="products">
        <v-container grid-list-md>
            <v-layout row wrap>
                <v-card width="100%">
                    <v-card-title>
                        <h1>{{product.name}}
                            <v-btn small
                                   color="red"
                                   dark
                                   @click="productDelete(product)"
                                   v-if="isDelete">
                                Delete entire product
                            </v-btn>
                        </h1>
                    </v-card-title>

                    <v-card-text>
                        <v-data-table
                                :headers="headers"
                                :items="product.serials"
                                hide-actions
                        >
                            <template slot="headerCell" slot-scope="props">
                                <v-tooltip bottom>
                                    <template v-slot:activator="{ on }">
                                      <span v-on="on">
                                        {{ props.header.text }}
                                      </span>
                                    </template>
                                    <span>
                                      {{ props.header.text }}
                                    </span>
                                </v-tooltip>
                            </template>
                            <template v-slot:items="props">
                                <td>{{ props.item.color }}</td>
                                <td>{{ props.item.barcode }}</td>
                                <td>{{ props.item.imei }}</td>
                                <td>{{ props.item.product_warranty }}</td>
                                <td>
                                    <div v-if="props.item.is_sold !== 1">
                                        <v-icon
                                                color="red"
                                                small
                                                @click="deleteItemDialog(props.item)"
                                        >
                                            delete
                                        </v-icon>
                                    </div>
                                    <div v-else>
                                        <span class="green--text">Product sold</span>
                                    </div>
                                </td>
                            </template>
                        </v-data-table>
                    </v-card-text>
                </v-card>
            </v-layout>

            <v-snackbar
                    :timeout="4000"
                    top
                    right
                    color="success"
                    multi-line
                    v-model="snackbar">
                {{ snackbar_message }}
            </v-snackbar>
        </v-container>

        <v-dialog v-model="deleteDialog"
                  persistent
                  max-width="450">
            <v-card color="dark">
                <v-card-text>
                    <div class="text-xs-center">
                        <v-icon color="white" size="50">warning</v-icon>
                    </div>
                    <p class="text-xs-center">Please select option</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1"
                           flat
                           @click.native="deleteDialog = false">Cancel
                    </v-btn>

                    <v-btn color="dark darken-1"
                           flat
                           @click.native="deleteItem()">Only delete
                    </v-btn>

                    <v-btn color="dark darken-1"
                           flat
                           @click.native="deleteItem('quantity')">Delete with quantity
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>
<script>
    import axios from 'axios'

    export default {
        data() {
            return {
                snackbar: false,
                snackbar_message: '',
                product: {},
                isDelete: true,
                deleteDialog: false,
                selectedDeleteSerial: {},

                headers: [
                    {
                        text: 'Color',
                        align: 'left',
                        sortable: false,
                        value: 'name'
                    },
                    {text: 'Barcode', value: 'barcode'},
                    {text: 'IMEI', value: 'imei'},
                    {text: 'Warranty', value: 'warranty'},
                    {text: 'Option', value: 'warranty'}
                ]
            }
        },

        created() {
            this.initialize()
        },

        methods: {
            initialize() {
                const id = this.$route.params.id;
                axios.get(`/api/products/${id}`).then((response) => {
                    if (response.data) {
                        this.product = {...response.data}

                        // Check product has serial
                        _.map(this.product.serials, (serial) => {
                            if (serial.is_sold === 1) {
                                this.isDelete = false
                            }
                        })
                    }
                })
            },

            deleteProduct() {

            },

            deleteItemDialog(item) {
                this.selectedDeleteSerial = {...item}
                this.deleteDialog = true
            },

            async deleteItem(type = 'only') {
                let url = '/api/product_serials/' + this.selectedDeleteSerial.id + '?type=' + type
                await axios.delete(url).then((response) => {
                        let newSerial = []
                        _.map(this.product.serials, (serial) => {
                            if (serial.id !== this.selectedDeleteSerial.id) {
                                newSerial.push(serial)
                            }
                        })

                        this.snackbar_message = `IMEI: ${this.selectedDeleteSerial.imei} has been delete.`
                        this.snackbar = true;
                        this.selectedDeleteSerial = {}
                        this.deleteDialog = false

                        this.product = {
                            ...this.product,
                            serials: [...newSerial]
                        }
                    },
                    error => {
                        console.log(error);
                    })
            },

            productDelete(product) {
                let url = '/api/products/' + product.id
                axios.delete(url).then((response) => {
                        this.snackbar_message = `Product has been delete successfully ${product.name}.`
                        this.snackbar = true
                        setTimeout(() => {
                            this.$router.push({name: 'transaction'})
                        }, 1500)
                    },
                    error => {
                        console.log(error);
                    })
            }
        }
    }
</script>