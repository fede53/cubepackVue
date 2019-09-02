<template>
    <div>
        <div>ciao ciao ciao</div>
        <slot name="activetor"></slot>
    </div>
</template>

<script>
  export default {
    name: 'Prova',
      methods: {
          logout () {
              this.$store.dispatch('logout')
                  .then(() => {
                      this.$router.replace("/login")
                  })
          },

      },
  }
</script>

<style>

</style>
