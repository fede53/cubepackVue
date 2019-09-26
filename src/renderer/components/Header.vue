<template>

    <header>

        <div class="logo-container">
            <v-app-bar-nav-icon @click.stop="appMenu = !appMenu" class="mr-3"></v-app-bar-nav-icon>

            <router-link to="/dashboard" class="logo">
                <img src="~@/assets/img/logo.png" alt="">
            </router-link>
        </div>

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
    import { mapGetters } from 'vuex'

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
        computed: {
            ...mapGetters(['appMenu']),
            appMenu: {
                get () { return this.$store.getters.appMenu },
                set (v) { return this.$store.commit('setAppMenu', v) }
            }
        }

    }
</script>

