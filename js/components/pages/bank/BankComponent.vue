<template>
    <section class="setting-page">
        <v-container grid-list-xl>
            <v-layout row wrap>
                <v-flex xs7>
                    <v-card>
                        <v-card-title class="justify-space-between">
                            <h2>Banks</h2>
                            <div>
                                <span><strong>Balance :</strong> {{ balance }}</span>
                                <span><strong>Withdraw :</strong> {{ withdraw }}</span>
                            </div>
                        </v-card-title>

                        <v-card-text>
                            <v-data-table
                                    dark
                                    :headers="headers"
                                    :items="banks"
                                    :search="search"
                                    :rows-per-page-items=row_per_page
                            >
                                <template slot="items" slot-scope="props">
                                    <td>{{ props.index + 1 }}</td>
                                    <td class="text-xs-left">
                                        <router-link dark
                                                     class="white--text"
                                                     :to="{name: 'bankAccount', params:{id:props.item.id}}">
                                            {{ props.item.name }}
                                        </router-link>
                                    </td>

                                    <td class="text-xs-left">{{ props.item.address }}</td>
                                    <td class="text-xs-left">{{ props.item.phone }}</td>
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
                            <h2>Bank Information</h2>
                            <v-spacer></v-spacer>
                        </v-card-title>

                        <v-card-text>
                            <v-layout row wrap>
                                <v-flex xs12>
                                    <v-text-field
                                            color="white"
                                            label="Bank Name"
                                            v-model="editedItem.name"
                                            hint="Name of bank">
                                    </v-text-field>
                                </v-flex>

                                <v-flex xs12>
                                    <v-textarea
                                            color="white"
                                            label="Address"
                                            v-model="editedItem.address"
                                            hint="Address of bank">
                                    </v-textarea>
                                </v-flex>

                                <v-flex xs12>
                                    <v-text-field
                                            color="white"
                                            label="Phone"
                                            v-model="editedItem.phone"
                                            hint="Bank phone number">
                                    </v-text-field>
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
                                    @click="onAddBank()">{{ editedIndex <= 0 ? 'Create bank' : 'Update bank'}}
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-flex>
            </v-layout>
        </v-container>

        <!-- Delete Bank -->
        <v-dialog v-model="deleteDialog"
                  persistent
                  max-width="290">
            <v-card color="error">
                <v-card-text>
                    <div class="text-xs-center"><v-icon color="white" size="50">warning</v-icon></div>
                    <p class="text-xs-center">Are you sure you want to delete {{deleteBank.name}}</p>
                    <p class="text-xs-center">If you delete bank you will lost all account in this bank.</p>
                </v-card-text>
                <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="dark darken-1"
                           flat
                           @click.native="deleteDialog = false"
                    >Cancel</v-btn>

                    <v-btn color="dark darken-1"
                           flat
                           @click.native="confirmDeleteBank()"
                    >Delete Bank</v-btn>
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
            deleteBank: {},

            banks: [],
            balance:0,
            withdraw: 0,

            defaultItem: {
                name: '',
                address: '',
                phone: '',
            },

            editedItem: {},
            editedIndex:-1,


            headers: [
                {
                    text: 'Id',
                    value: 'id',
                    sortable: true
                },
                {
                    text: 'Name',
                    value: 'name',
                    sortable: true
                },
                {
                    text: 'Address',
                    value: 'address',
                },
                {
                    text: 'Phone',
                    value: 'phone'
                },
                {
                    text: 'Action',
                    value: 'action'
                }
            ],
        }),

        computed: {
        },

        watch: {},

        created() {
            this.initialize()
        },

        methods: {
            async onAddBank() {
                let url = 'api/banks';
                if(this.editedIndex >= 0){
                    url = 'api/banks/'+ this.editedItem.id
                }
                console.log("Edited item: ", this.editedItem)
                let method = this.editedIndex >= 0 ? 'patch' : 'post'
                const response = await axios[method](url, this.editedItem)
                let newBank = {...response.data}

                //edit item. replace with existing item
                if(this.editedIndex >= 0){
                    let index = this.banks.findIndex(bank => {
                        return newBank.id === bank.id
                    })

                    let banks = [...this.banks]
                    banks[index] = newBank

                    this.banks = [...banks]
                    return
                }

                this.banks.push(newBank)
            },

            async initialize() {
                 const response = await axios.get('api/banks')

                 this.banks = [...response.data.banks]
                this.balance = response.data.balance
                this.withdraw = response.data.withdraw
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

            openDeleteDialog(bank) {
                this.deleteBank = {...bank}
                this.deleteDialog = true;
            },

            async confirmDeleteBank(){
                const url = `api/banks/${this.deleteBank.id}`

                const response = await axios.delete(url)

                console.log("response : ", response.data)
                const index = this.banks.indexOf(this.deleteBank)
                this.deleteDialog = false;
                this.banks.splice(index, 1)

            }
        }
    }
</script>
