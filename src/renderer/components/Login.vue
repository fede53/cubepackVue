<template>
    <div id="login">

        <v-card
                class="pa-12"
                width="100%"
        >

            <form>

                <a href="" class="logo">
                    <img src="~@/assets/img/logo.png" alt="">
                </a>

                <v-text-field
                        v-model="email"
                        label="Email"
                        @keyup.enter="login()"
                ></v-text-field>

                <v-text-field
                        v-model="password"
                        label="Password"
                        type="password"
                        @keyup.enter="login()"
                ></v-text-field>



                <v-btn color="primary" @click="login">Login</v-btn>


            </form>

        </v-card>

    </div>
</template>

<script>
    import { mapGetters, mapActions } from 'vuex'

    export default {
        name: 'login',
        data () {
            return{
                email : "federico.germi@blastness.com",
                password : "palomo82"
            }
        },
        computed: {
            ...mapGetters(['isAuthenticated'])
        },
        methods: {
            ...mapActions({
                logout: 'logout'
            }),
            login () {
                this.$store.dispatch('login', {urlToConnect: 'login', methodToConnect: 'post', email: this.email, password: this.password})
                    .then(() => {
                        this.email = ''
                        this.password = ''
                        this.$router.replace("/dashboard")
                    })

            }
        },
        created() {
            if(this.$store.getters.isAuthenticated){
                this.$router.replace("/dashboard")
            }
        }
    }
</script>

<style>

</style>
