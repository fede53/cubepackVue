<template>
    <v-dialog v-model="dialog" max-width="290">
        <v-card>
            <v-card-title class="headline">{{title}}</v-card-title>
            <v-card-text class="subtitle-1">
                {{content}}
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <slot name="confirm-buttons"></slot>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>
<script>

    export default {
        name: 'Confirm',
        props: ['title', 'content', 'dialog'],
        data: () => ({

        }),

        computed: {
        },
        methods: {


        },

    }
</script>

<style>

</style>
