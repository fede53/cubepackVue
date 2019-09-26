<template>
    <div>
        <v-card
                class="mb-2"
                width="100%"
        >
            <div class="intro">
                <i v-if="icon_sx != ''" :class="icon_sx +' mr-3'"></i>
                <div class="inner">
                    <h1 class="title mb-0">{{title}}</h1>
                </div>
                <div v-if="r">
                    <router-link class="nav-item is-tab" :to="r">
                        <v-btn
                                dark
                                small
                                absolute
                                bottom
                                right
                                fab
                                color="primary"
                        >
                            <v-icon>{{r_icon}}</v-icon>
                        </v-btn>
                    </router-link>
                </div>
            </div>
        </v-card>
    </div>
</template>

<script>
    export default {
        name: "Header",
        props: ['title', 'icon_sx', 'route_link', 'r', 'r_icon'],
    }
</script>

<style scoped>

</style>