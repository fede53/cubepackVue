<template>

    <div>
        <div class="intro">
            <i class="fal fa-project-diagram"></i>
            <div class="inner">
                <h1 @click="pProject()">Projects list</h1>
            </div>
        </div>


            <draggable
                    v-model="projects"
                    tag="ul"
                    v-bind="dragOptions"
                    class="project-list"
            >
            <li v-for="project in projects" class="li_project_list" v-on:click="navigate(project.id)">
                <div class="wrapper">
                    <i v-bind:class="getClass(project.project_user_project.type)"></i>
                    <div class="inner">


                        <div class="flex">
                            <h1>{{ project.project_user_project.name }}</h1>
                            <div>[vers. <span class="span_vers">{{ project.project_user_project.version }}</span> ]</div>
                        </div>
                    </div>
                </div>
                <h2>{{ project.local_folder }}</h2>
            </li>
            </draggable>

    </div>
</template>

<script>
    import { mapGetters } from 'vuex'
    import draggable from 'vuedraggable'

    export default {
        name: 'ProjectsList',
        components: {
            draggable,
        },
        computed: {
            ...mapGetters('projectsModule', ['projects']),
            projects:
                {
                    get()
                    {
                        return this.$store.state.projectsModule.projects
                    },
                    set(value)
                    {
                        this.$store.dispatch('projectsModule/setProjectOrder', value)
                    }
                },
            dragOptions() {
                return {
                    animation: 200,
                    group: "description",
                    disabled: false,
                    ghostClass: "ghost"
                };
            }
        },
        methods: {
            pProject() {
                console.log(this.$store.state.projectsModule.projects);

            },
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
            }

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
