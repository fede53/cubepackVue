<template>
    <div id="messagesBlock">
        <ul>
            <messagecontent 
                v-for="message in messages"
                v-bind:message="message" />
        </ul>
    </div>
</template>

<script>
    
    import { mapGetters } from 'vuex'
    import messagecontent from './messagecontent'
    
    export default{
        name: 'messages',
        components:{
            messagecontent
        },
        computed: {
            ...mapGetters(['messages'])
        },
        methods: {
            hideMessage(event){
            }
        },
    }
</script>