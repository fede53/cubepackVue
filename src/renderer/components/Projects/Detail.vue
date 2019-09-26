<template>
    <transition name="transitiondetail">
        <div class="container_full" v-if="loaded">

            <div class="div_project_list">
                <i :class="( projectDetail.project_user_project.type == 'cube' ) ? 'fal fa-cube' : 'fab fa-wordpress-simple'"></i>
                <div class="inner">
                    <div class="flex">

                        <div class="info-project">


                            <div class="box-title">
                                <h1 class="headline mb-0" v-if="typeof(projectDetail.project_user_project) != 'undefined'">{{projectDetail.project_user_project.name}}</h1>
                                <div class="project-version">[vers. <span class="span_vers">{{projectDetail.version}}</span>]</div>
                            </div>
                            <div class="project-folder" v-on:click="openProjectFolder"><i class="fas fa-folder"></i> {{this.$store.state.projectsModule.projectDetail.local_folder}}</div>

                        </div>

                        <div class="content">
                            <ul v-if="isNew">
                                <li>
                                    <i class="fal fa-wrench" @click="navigate(projectDetail.id)"></i>
                                </li>
                                <li class="li_upload">
                                    <i class="fal fa-cloud-upload" @click="uploadProject()"></i>
                                </li>
                            </ul>
                            <ul v-else>
                                <!--<li class="li_watch">
                                    <a href="" class="btn"><i class="fal fa-eye"></i></a>
                                </li>

                                <li class="li_upload">
                                    <a href="" class="btn btn-up-down"><i class="fal fa-cloud-upload"></i></a>
                                </li>
                                <li class="li_download">
                                    <i class="fal fa-cloud-download" @click="downloadFiles()" ></i>
                                </li>-->

                                <li>
                                    <i class="fal fa-wrench" @click="navigate(projectDetail.id)"></i>
                                </li>
                                <li>
                                    <i class="fal fa-trash-alt"></i>
                                </li>
                                <li v-if="!isLocked">
                                    <i class="fal fa-lock" @click="lockFilesDialog()"></i>
                                </li>
                                <li v-if="isLocked">
                                    <i class="fal fa-unlock" @click="unlockFiles()"></i>
                                </li>

                                <li class="ml-6">
                                    <v-menu offset-y>
                                        <template v-slot:activator="{ on }">
                                            <i class="fas fa-cog" v-on="on"></i>
                                        </template>
                                        <v-list>

                                            <v-list-item dense rounded>
                                                <v-list-item-content>
                                                    <v-list-item-title @click="processBackup()">
                                                        <i class="fal fa-arrow-alt-up mr-4"></i>
                                                        Crea backup
                                                    </v-list-item-title>
                                                </v-list-item-content>
                                            </v-list-item>

                                        </v-list>
                                    </v-menu>
                                </li>
                            </ul>
                        </div>



                    </div>

                </div>
            </div>

            <div class="inner_sx">

                <FileLog :local_folder="projectDetail.local_folder" :project_id="projectDetail.id" />

            </div>
            <div class="inner_dx">
                <ProjectControl />
            </div>

            <Confirm :dialog="confirm.dialog"
                     :title="confirm.title"
                     :content="confirm.content"
            >

                <template v-slot:confirm-buttons>

                    <div style="display: flex; flex-wrap: wrap">

                    <div style="width: 100%" v-if="confirm.buttons =='backup'">
                        <v-textarea
                                v-model="description"
                                filled
                                label="Backup Description"
                                auto-grow

                        ></v-textarea>
                    </div>
                    <div style="width: 100%">
                        <v-btn v-if="confirm.buttons =='backup'" color="primary" @click="closeConfirm();">No</v-btn>
                        <v-btn v-if="confirm.buttons =='backup'" color="primary" @click="executeBackup(true);">Si</v-btn>

                        <v-btn v-if="confirm.buttons =='lock'" color="primary" @click="lockFiles(false);">No</v-btn>
                        <v-btn v-if="confirm.buttons =='lock'" color="primary" @click="lockFiles(true);">Si</v-btn>
                    </div>
                    </div>

                </template>
            </Confirm>

        </div>
    </transition>
</template>

<script>

    import { mapGetters } from 'vuex'
    import ProjectControl from '@/components/Projects/Control'
    import FileLog from '@/components/Projects/FileLog'
    import Confirm from '@/components/Modal/Confirm'

    export default {
        name: 'ProjectDetail',
        data: () => {
            return {
                items: [
                    { title: 'Click Me' },
                    { title: 'Click Me' },
                    { title: 'Click Me' },
                    { title: 'Click Me 2' },
                ],
                confirm:{
                    dialog: false,
                    title: '',
                    content: '',
                    buttons: null
                },
                description: ''

            }
        },
        components: {
            ProjectControl, FileLog, Confirm
        },
        computed: {
            ...mapGetters('projectsModule', ['projectDetail', 'projectFiles', 'loaded', 'projectFilesLockedItems', 'projectFilesLockedItemsOwner']),

            isNew: function() {
                return !this.projectFiles.length > 0
            },

            isLocked: function() {
                return this.projectFilesLockedItemsOwner.length > 0
            }
        },
        methods: {
            detail () {
                this.$store.dispatch('projectsModule/detail', {urlToConnect: 'projects/'+this.$route.params.id, id: this.$route.params.id}).then(()=>{

                })
            },

            lockFilesDialog () {
                this.confirm.dialog = true
                this.confirm.title = "Vuoi aggiornare la copia locale?"
                this.confirm.content = "Cubepack scaricherà dal server i file selezionati sovrascrivendo la tua copia locale"
                this.confirm.buttons = 'lock'
            },

            closeConfirm () {
                this.confirm.dialog = false
            },

            processBackup () {
                this.description = ''
                this.confirm.dialog = true
                this.confirm.title = "Vuoi creare un backup?"
                this.confirm.content = "Vuoi creare un backup dei file remoti"
                this.confirm.buttons = 'backup'
            },

            executeBackup () {
                this.confirm.dialog = false
                this.$store.dispatch('projectsModule/executeBackup', {
                    urlToConnect: 'execute_backup/' + this.$store.state.projectsModule.projectDetail.project_id,
                    id: this.$store.state.projectsModule.projectDetail.project_id,
                    description: this.description,
                    methodToConnect: "post"
                }).then(() => {
                    this.description = ''
                })
            },

            lockFiles (download) {
                this.confirm.dialog = false
                this.$store.dispatch('projectsModule/lockFiles', {
                    urlToConnect: 'lock_files/' + this.$store.state.projectsModule.projectDetail.project_id,
                    id: this.$store.state.projectsModule.projectDetail.project_id,
                    methodToConnect: "post",
                    files: JSON.stringify(this.$store.state.projectsModule.projectFilesSelectedItems),
                    download: download
                }).then(() => {
                    //NOP
                })
            },

            unlockFiles () {
                this.$store.dispatch('projectsModule/unlockFiles', {urlToConnect: 'unlock_files/'+this.$store.state.projectsModule.projectDetail.project_id, id: this.$store.state.projectsModule.projectDetail.project_id, methodToConnect: "post"}).then(()=>{
                    //this.$store.projectsModule.loaded = true
                })
            },

            downloadFiles () {
                this.$store.dispatch('projectsModule/downloadFiles', {urlToConnect: 'download_files/'+this.$store.state.projectsModule.projectDetail.project_id, id: this.$store.state.projectsModule.projectDetail.project_id, methodToConnect: "get"}).then(()=>{
                    //this.$store.projectsModule.loaded = true
                })
            },

            uploadProject () {
                console.log('Apri finestra dialogo')
            },

            navigate(id){
                this.$store.dispatch('openModal', {id: id, module: 'projects', opz: 'projects'})
            },
            openProjectFolder() {
                require('electron').shell.openItem(this.$store.state.projectsModule.projectDetail.local_folder)
            }
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