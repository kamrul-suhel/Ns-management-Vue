<template>
    <section class="setting-page">
        <v-container grid-list-xl>
            <v-layout row wrap>
                <v-flex xs7>
                    <v-card>
                        <v-card-title class="justify-space-between">
                            <h2>Cash</h2>
                            <div>
                                <span><strong>Total add :</strong> {{ add }}</span>
                                <span><strong>Total minus :</strong> {{ minus }}</span>
                            </div>
                        </v-card-title>

                        <v-card-text>
                            <v-data-table
                                    dark
                                    :headers="headers"
                                    :items="cashes"
                                    :search="search"
                                    :rows-per-page-items=row_per_page
                            >
                                <template slot="items" slot-scope="props">
                                    <td class="text-xs-left">
                                        {{ props.item.type === 1 ? 'Add' : 'Minus'  }}
                                    </td>

                                    <td class="text-xs-left">{{ props.item.amount }}</td>
                                    <td class="text-xs-left">{{ props.item.notes }}</td>
                                    <td class="text-xs-left">{{ props.item.created_at | convertDate }}</td>
                                    <td class="justify-start layout px-0">
                                        <v-btn icon class="mx-0" @click="editItem(props.item)">
                                            <v-icon color="dark">edit</v-icon>
                                        </v-btn>
                                        <v-btn icon class="mx-0"
                                               @click="openDeleteDialog(props.item)">
                                            <v-icon color="dark">delete</v-icon>
                                        </v-btn>
                                    </td>
                                </template>

                                <v-alert slot="no-results" :value="true" color="error" icon="warning">
                                    Your search for "{{ search }}" found no results.
                                </v-alert>

                                <template slot="no-data">
                                </template>
                            </v-data-table>
                        </v-card-text>
                    </v-card>
                </v-flex>

                <v-flex xs5>
                    <v-card>
                        <v-card-title>
                            <h2>Cash</h2>
                            <v-spacer></v-spacer>
                        </v-card-title>

                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-select
                                            label="Select type"
                                            color="white"
                                            :items="type"
                                            v-model="editedItem.type"
                                    ></v-select>
                                </v-flex>

                                <v-flex xs12>
                                    <v-text-field
                                            color="white"
                                            label="Amount"
                                            type="number"
                                            v-model="editedItem.amount"
                                            hint="Amount of add or deduct">
                                    </v-text-field>
                                </v-flex>

                                <v-flex xs12>
                                    <v-textarea
                                            color="white"
                                            label="Note"
                                            v-model="editedItem.notes"
                                            hint="Reference">
                                    </v-textarea>
                                </v-flex>
                            </v-layout>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn dark
                                   raised
                                   color="dark"
                                   @click="onReset">Reset</v-btn>
                            <v-btn
                                    dark
                                    raised
                                    color="dark"
                                    @click="onAddCash()">{{ editedIndex <= 0 ? 'Create Cash' : 'Update Cash'}}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- Delete Cash -->
        <v-dialog v-model="deleteDialog"
                  persistent
                  max-width="290">
            <v-card color="error">
                <v-card-text>
                    <div class="text-xs-center"><v-icon color="white" size="50">warning</v-icon></div>
                    <p class="text-xs-center">Are you sure you want to delete {{deleteCash.name}}</p>
                    <p class="text-xs-center">If you delete cash</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1"
                           flat
                           @click.native="deleteDialog = false"
                    >Cancel</v-btn>

                    <v-btn color="dark darken-1"
                           flat
                           @click.native="confirmdeleteCash()"
                    >Delete Cash</v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>

        <v-snackbar
                :timeout="4000"
                top
                right
                color="success"
                multi-line
                v-model="snackbar">
            {{ snackbar_message }}
        </v-snackbar>
    </section>
</template>

<script>
    import axios from 'axios'

    export default {
        data: () => ({
            search: '',
            row_per_page: [20, 30, 50, {'text': 'All', 'value': -1}],
            snackbar: false,
            snackbar_message: '',

            deleteDialog:false,
            deleteCash: {},

            cashes: [],
            add:0,
            minus: 0,

            defaultItem: {
                name: '',
                address: '',
                phone: '',
            },

            editedItem: {},
            editedIndex:-1,


            headers: [
                {
                    text: 'Type',
                    value: 'type',
                },
                {
                    text: 'Amount',
                    value: 'amount'
                },
                {
                    text: 'Note',
                    value: 'note'
                },
                {
                    text: 'Date',
                    value: 'date'
                },
                {
                    text: 'Action',
                    value: 'action'
                }
            ],

            type: [
                {
                    text: 'Add',
                    value: 1
                },
                {
                    text: 'Minus',
                    value: 2
                }
            ]
        }),

        computed: {
        },

        watch: {},

        created() {
            this.initialize()
        },

        methods: {
            async onAddCash() {
                let url = 'api/cash';
                if(this.editedIndex >= 0){
                    url = 'api/cash/'+ this.editedItem.id
                }
                let method = this.editedIndex >= 0 ? 'patch' : 'post'
                const response = await axios[method](url, this.editedItem)
                let newCash = {...response.data}

                //edit item. replace with existing item
                if(this.editedIndex >= 0){
                    let index = this.cashes.findIndex(cash => {
                        return newCash.id === cash.id
                    })

                    let cashes = [...this.cashes]
                    cashes[index] = newCash

                    this.cashes = [...cashes]
                    return
                }

                this.cashes.push(newCash)
            },

            async initialize() {
                 const response = await axios.get('api/cash')

                 this.cashes = [...response.data.cash]
                this.add = response.data.add
                this.minus = response.data.minus
            },

            editItem(item){
                let editedItem = {...item}
                this.editedIndex = 1
                this.editedItem = editedItem
            },

            onReset(){
                this.editedIndex = -1
                this.editedItem = this.defaultItem
            },

            openDeleteDialog(cash) {
                this.deleteCash = {...cash}
                this.deleteDialog = true;
            },

            async confirmdeleteCash(){
                const url = `api/cash/${this.deleteCash.id}`

                const response = await axios.delete(url)

                const index = this.cashes.indexOf(this.deleteCash)
                this.deleteDialog = false;
                this.cashes.splice(index, 1)

            }
        }
    }
</script>
