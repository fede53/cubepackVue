<template>


    <v-navigation-drawer temporary fixed v-model="appMenu">

        <section class="section_sx">
            <div class="col_sx">
                <draggable
                        v-model="projects"
                        tag="ul"
                        v-bind="dragOptions"
                        class="project-list"
                >
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
                </draggable>
            </div>
        </section>
    </v-navigation-drawer>


</template>

<script>
    import { mapGetters, mapMutations } from 'vuex'
    import draggable from 'vuedraggable'
    import Header from '@/components/Blocks/Header'

    export default {
        name: 'ProjectsList',
        components: {
            Header, draggable
        },

        data: () => ({
            menu : false
        }),

        computed: {
            ...mapGetters('projectsModule', ['projects']),
            ...mapGetters(['appMenu']),
            projects:
                {
                    get()
                    {
                        return this.$store.state.projectsModule.projects
                    },
                    set(value)
                    {
                        this.$store.dispatch('projectsModule/changeProjectOrder', {urlToConnect: 'change_order', methodToConnect: 'post', projects: value})
                    }
                },
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            },
            appMenu: {
                get () { return this.$store.getters.appMenu },
                set (v) { return this.$store.commit('setAppMenu', v) }
            }
        },
        methods: {
            ...mapMutations(['setAppMenu']),
            list () {
                this.$store.dispatch('projectsModule/list', {urlToConnect: 'projects', user_id: localStorage.getItem('user_id')})
            },
            openModal () {
                this.$store.dispatch('openModal')
            },
            getClass(type){
                return type  == 'cube' ? 'fal fa-cube' : 'fab fa-wordpress-simple'
            },
            navigate(id){
                this.$router.push({name: 'projectDetail', params: { id: id }})
                //this.$router.replace("/dashboard", {id: id, module: 'projects', opz: 'projects'})
                //this.$store.dispatch('openModal', {id: id, module: 'projects', opz: 'projects'})
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
