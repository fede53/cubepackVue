<template>

    <header>

        <router-link to="/dashboard" class="logo">
            <img src="~@/assets/img/logo.png" alt="">
        </router-link>

        <div class="version"></div>

        <div class="search">
            <input type="text" id="search" placeholder="Ricerca progetto">
            <i class="fas fa-search"></i>
            <i class="fas fa-circle"></i>
            <i class="fal fa-sign-out" @click="logout()"></i>
        </div>

    </header>

</template>




<script>
    export default {
        name: 'Header',
        methods: {
            logout () {
                this.$store.dispatch('logout')
                    .then(() => {
                        this.$router.replace("/login")
                    })
            }

        },

    }
</script>

