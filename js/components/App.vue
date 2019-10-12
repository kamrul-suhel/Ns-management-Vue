<template>
    <div id="app">
        <v-app
                dark
                id="inspire"
        >
            <navigation-component v-if="isLogin"></navigation-component>
            <header-component v-if="isLogin"></header-component>
            <v-content>
                <v-container fill-height :class="{'fill-height justify-center align-content-center': !login}">
                    <v-layout >
                        <v-flex>
                            <input type="text" hidden data-barcode="barcode"/>
                            <router-view></router-view>
                        </v-flex>
                    </v-layout>
                </v-container>
            </v-content>
        </v-app>
    </div>
</template>

<script>
    import  HeaderComponent  from './Layout/HeaderComonent.vue';
    import  NavigationComponent  from './Layout/NavigationComponent.vue';
    import  LoginEventBus  from '../event_bus/login-event-bus';

    import {mapGetters} from 'vuex';

    export default {
        name: 'App',
        components: {
            NavigationComponent,
            HeaderComponent,
        },

        computed:{
            ...mapGetters({
                isLogin: 'getIsLogin'
            })
        },

        data: () => ({
            login:false,
            barcodeDialog: false,
            barcode:''
        }),

        props: {
            source: String
        },

        async created() {
            const response = await axios.get('/islogin');

            if(!response.data.error){
                // set all shop.
                await this.$store.dispatch('fetchShop', 1);

                this.login = true;
                this.$store.commit('setUser', response.data);

                this.$store.commit('setSelectedShop', response.data.store_id)

                let route = this.$route.name;
                if(route != 'login'){
                    this.$router.push({name: route});
                    return;
                }
                this.$router.push({name: 'home'})
            }

            LoginEventBus.$on('successLogin', ()=> {
                this.login = true;
                this.$router.push({name: 'home'})
            });

            LoginEventBus.$on('logoutChangeState', () => {
                this.login = false;
            });
        },

        methods: {
            // Reset to the last barcode before hitting enter (whatever anything in the input box)
            resetBarcode () {
                let barcode = this.$barcodeScanner.getPreviousCode()
                // do something...
            }
        }
    }
</script>
