<template>
    <div>
        <div class="file"><div class="body">
            <v-treeview
                    selectable
                    selected-color="blue"
                    :items="projectFiles"
                    dark
                    v-model="selectedItems"
            >
                <template v-slot:prepend="{ item }">
                    <div v-if="item.locked!=''">
                        <v-icon color="#cb2390" class="icon-lock">
                            mdi-lock-alert
                        </v-icon>
                        <span v-if="!item.open">({{ item.locked }})</span>
                    </div>
                    <div v-else>
                        <v-icon v-if="item.open">
                            mdi-folder-open
                        </v-icon>
                        <v-icon v-else-if="typeof(files[item.ext]) != 'undefined'">
                            {{files[item.ext]}}
                        </v-icon>
                        <v-icon v-else>
                            mdi-file
                        </v-icon>

                    </div>
                </template>
            </v-treeview>
        </div>
    </div></div>
</template>

<script>

    import { mapGetters } from 'vuex'
    import axios from 'axios';

    export default {
        name: 'ProjectFile',
        data: () => ({
            files: {
                html: 'mdi-language-html5',
                php: 'mdi-language-php',
                js: 'mdi-nodejs',
                json: 'mdi-json',
                md: 'mdi-markdown',
                pdf: 'mdi-file-pdf',
                png: 'mdi-file-image',
                txt: 'mdi-file-document-outline',
                xls: 'mdi-file-excel',
            }
        }),

        computed: {
            ...mapGetters('projectsModule', ['projectFiles', 'projectFilesSelectedItems']),
            selectedItems:
                {
                    get()
                    {
                        return this.$store.state.projectsModule.projectFilesSelectedItems
                    },
                    set(value)
                    {
                        this.$store.dispatch('projectsModule/setProjectFilesSelectedItems', value)
                    }
                }
        },
        methods: {
            fileList () {

                this.$store.dispatch('projectsModule/fileCleaner', {}).then(()=>{

                    this.$store.dispatch('projectsModule/file', {urlToConnect: 'scan_projects/'+this.$route.params.id, id: this.$route.params.id}).then(()=>{
                        //this.$store.projectsModule.loaded = true
                    })
                })

            },
        },
        watch: {
            '$route' (to, from) {
                this.fileList()
            }
        },
        created () {
            this.fileList()
        },







    }
</script>

<style>
    .v-treeview-node--disabled .v-treeview-node__checkbox {
        display: none !important;
    }
</style>
