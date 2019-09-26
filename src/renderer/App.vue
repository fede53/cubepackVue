<template>
  <v-app dark>
    <router-view/>
    <messages />
    <Preload />
  </v-app>
</template>

<script>

  import messages from '@/components/Messages/messages'
  import Preload from '@/components/Widget/Preload'

  export default{
      name: 'Cubepack',
      components: {
          messages,
          Preload
      }
  }


</script>
