<template>
    <div id="login">

        <div class="inner">

            <a href="" class="logo">
                <img src="~@/assets/img/logo.png" alt="">
            </a>

            <div class="form-element">
                <label>Email:</label>
                <input type="text" v-model="email" @keyup.enter="login()">
            </div>

            <div class="form-element">
                <label>Password</label>
                <input type="password" v-model="password" @keyup.enter="login()">
            </div>

            <div class="form-button">
                <input class="btn-form" type="button" value="Login" v-on:click="login()">
            </div>

        </div>

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
