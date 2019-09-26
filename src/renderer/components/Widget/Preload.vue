<template>
    <v-overlay :value="preload">
        <v-progress-circular
                :rotate="-90"
                :size="100"
                :width="15"
                :value="preloadPerc"
                color="primary"
        >
            {{ preloadPerc }}
        </v-progress-circular>
    </v-overlay>
</template>

<script>
    import { mapGetters } from 'vuex'

    export default {
        name: "Preload",
        computed: {
            ...mapGetters(['preload', 'preloadPerc']),

            isNew: function() {
                return !this.projectFiles.length > 0
            }
        },
    }
</script>

<style scoped>

</style>