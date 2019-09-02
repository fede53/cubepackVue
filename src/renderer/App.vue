<template>
  <div id="app">
    <router-view/>
    <messages />
  </div>
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
