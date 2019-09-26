<template>
    <div class="console">
        <v-card
                class="pa-4"
                width="100%"
                height="100%"
        >
            <ul class="lista-console"></ul>
        </v-card>
    </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        name: 'ProjectConsole',
        data: () => {
            return {
            }
        },
    }
</script>