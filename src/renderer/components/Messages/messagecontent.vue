<template>
    <li :class="(message.msg.success == true) ? 'success' : 'error'">
        {{message.msg.message}}
    </li>
</template>

<script>
    export default{
        name: 'messageContent',
        props: ['message'],
        created: function () {
            setTimeout(this.deleteMessageMethods, 5000);
        },
        methods: {
            deleteMessageMethods(){
                this.$store.dispatch('deleteMessage', this.message.id)
            }
        },

    }
</script>