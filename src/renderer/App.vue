<template>
  <v-app dark>
    <router-view/>
    <messages />
  </v-app>
</template>

<script>

  import messages from '@/components/Messages/messages'

  export default{
      name: 'Cubepack',
      components: {
          messages
      }
  }


</script>
