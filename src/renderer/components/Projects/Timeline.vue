<template>
        <div>
            <div class="timeline">
                <v-card
                        class="pa-4"
                        width="100%"
                        height="80%"
                >
                    <ul class="lista-histories"></ul>
                </v-card>

                <div id="action_chat"></div>
                <v-card
                        class="pa-4 write"
                        width="100%"
                        height="18%"
                >
                    <textarea id="chat_send"></textarea>
                    <v-btn color="primary" id="btn_chat_send">Send</v-btn>
                </v-card>
            </div>
        </div>
</template>

<script>

    import { mapGetters } from 'vuex'

    export default {
        name: 'ProjectTimeline',
        data: () => {
            return {
            }
        },

    }
</script>