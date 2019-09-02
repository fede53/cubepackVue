<template>
    <div>

        <div class="intro">
            <i class="fal fa-users"></i>
            <div class="inner">
                <h1>User</h1>
            </div>
        </div>
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

  export default {
    name: 'UserOnline',
    computed: {
        ...mapGetters(['userOnline'])
    },
  }


</script>
