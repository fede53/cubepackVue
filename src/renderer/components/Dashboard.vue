<template>
    <div>
        <ul>
            <li v-for="project in projects" class="li_project_list" v-on:click="navigate(project.id)">
                <v-card
                        width="100%"
                        class="pa-3"
                >
                    <div class="wrapper">
                        <i v-bind:class="getClass(project.project_user_project.type)"></i>
                        <div class="inner">


                            <div class="flex">
                                <h1 class="subtitle-1 mb-0">{{ project.project_user_project.name }}</h1>
                                <div>[vers. <span class="span_vers">{{ project.project_user_project.version }}</span> ]</div>
                            </div>
                        </div>
                    </div>
                    <h2>{{ project.local_folder }}</h2>
                </v-card>
            </li>
        </ul>
    </div>

</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'

  export default {
    name: 'Dashboard',

      computed: {
          ...mapGetters('projectsModule', ['projects']),

      },

      methods: {
          list () {
              this.$store.dispatch('projectsModule/list', {urlToConnect: 'projects', user_id: localStorage.getItem('user_id')})
          },

          navigate(id){
              this.$router.push({name: 'projectDetail', params: { id: id }})
              //this.$router.replace("/dashboard", {id: id, module: 'projects', opz: 'projects'})
              //this.$store.dispatch('openModal', {id: id, module: 'projects', opz: 'projects'})
          },
          getClass(type){
              return type  == 'cube' ? 'fal fa-cube' : 'fab fa-wordpress-simple'
          },
      },

      watch: {
          '$route' (to, from) {
              this.list()
          }
      },
      created () {
          this.list()
      }
  }

</script>
