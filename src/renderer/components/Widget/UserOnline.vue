<template>
    <div>
        <Header title="User" icon_sx="fal fa-users" />

        <ul class="user-list">
            <li v-for="user in userOnline">
                <div class="avatar placeholder"><i class="fal fa-user"></i></div>
                <div class="info">{{user.name}}
                    <div class="now"></div>
                </div>
            </li>
        </ul>

    </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import Header from '@/components/Blocks/Header'

  export default {
    name: 'UserOnline',
    components: {
      Header
    },
    computed: {
        ...mapGetters(['userOnline'])
    },
  }


</script>
