<template>
        <div>
            <div class="timeline">
                <div class="body"><ul class="lista-histories"></ul></div>
                <div id="action_chat"></div>
                <div class="write">
                    <textarea id="chat_send"></textarea>
                    <input type="button" id="btn_chat_send" value="Send">
                </div>
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