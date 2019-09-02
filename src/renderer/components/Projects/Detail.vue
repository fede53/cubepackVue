<template>
    <transition name="transitiondetail">
        <div v-if="loaded">
            <div class="div_project_list">
                <i class="fal fa-cube"></i>
                <div class="inner">
                    <div class="flex">
                        <h1 v-if="typeof(projectDetail.project_user_project) != 'undefined'">{{projectDetail.project_user_project.name}}</h1>
                        <div>[vers. <span class="span_vers">{{projectDetail.version}}</span>]</div>
                    </div>
                    <div class="content">
                        <div v-if="typeof(projectDetail.project_user_project) != 'undefined'">{{projectDetail.project_user_project.description}}</div>
                        <ul>
                            <li class="li_watch">
                                <a href="" class="btn"><i class="fal fa-eye"></i></a>
                            </li>
                            <li class="li_upload">
                                <a href="" class="btn btn-up-down"><i class="fal fa-cloud-upload"></i></a>
                            </li>
                            <li class="li_download">
                                <i class="fal fa-cloud-download" @click="downloadFiles()" ></i>
                            </li>
                            <li>
                                <a href="" class="btn"><i class="fal fa-trash-alt"></i></a>
                            </li>
                            <li>
                                <a href="" class="btn"><i class="fal fa-wrench"></i></a>
                            </li>
                            <li>
                                <i class="fal fa-lock" @click="lockFiles()"></i>
                            </li>
                            <li>
                                <i class="fal fa-unlock" @click="unlockFiles()"></i>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            <ProjectControl />

        </div>
    </transition>
</template>

<script>

    import { mapGetters } from 'vuex'
    import ProjectControl from '@/components/Projects/Control'
    export default {
        name: 'ProjectDetail',
        data: () => {
            return {
            }
        },
        components: {
            ProjectControl
        },
        computed: {
            ...mapGetters('projectsModule', ['projectDetail', 'loaded']),
        },
        methods: {
            detail () {
                this.$store.dispatch('projectsModule/detail', {urlToConnect: 'projects/'+this.$route.params.id, id: this.$route.params.id}).then(()=>{
                    //this.$store.projectsModule.loaded = true
                })
            },

            lockFiles () {
                this.$store.dispatch('projectsModule/lockFiles', {urlToConnect: 'lock_files/'+this.$route.params.id, id: this.$route.params.id, methodToConnect: "post", files: JSON.stringify(this.$store.state.projectsModule.projectFilesSelectedItems)}).then(()=>{
                    //this.$store.projectsModule.loaded = true
                })
            },

            unlockFiles () {
                this.$store.dispatch('projectsModule/unlockFiles', {urlToConnect: 'unlock_files/'+this.$route.params.id, id: this.$route.params.id, methodToConnect: "post"}).then(()=>{
                    //this.$store.projectsModule.loaded = true
                })
            },

            downloadFiles () {
                this.$store.dispatch('projectsModule/downloadFiles', {urlToConnect: 'download_files/'+this.$route.params.id, id: this.$route.params.id, methodToConnect: "get"}).then(()=>{
                    //this.$store.projectsModule.loaded = true
                })
            },



        },
        watch: {
            '$route' (to, from) {
                this.$store.dispatch('projectsModule/setLoaded', {flag: false})
                this.detail()
            }
        },
        created () {
            this.detail()
        },

    }
</script>