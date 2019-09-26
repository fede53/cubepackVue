<template>
    <div>
        <div class="file">

            <v-card
                class="pa-4"
                width="100%"
                height="100%" style="overflow: hidden; overflow-y: auto;"
        >
            <v-treeview
                    selectable
                    selected-color="blue"
                    :items="projectFiles"
                    item-key="path"
                    item-text="name"
                    dark
                    v-model="selectedItems"
            >
                <template v-slot:prepend="{ item }">
                    <div @contextmenu.prevent="$refs.menu.open($event, { item: item })">
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
                    </div>
                </template>
                <template v-slot:label="{ item }">
                    <span @contextmenu.prevent="$refs.menu.open($event, { item: item })">{{item.name}}</span>
                </template>

            </v-treeview>

            <vue-context ref="menu">
                <template slot-scope="child" v-if="child.data">
                    <li>
                        <a href="#" @click.prevent="deleteFromRepository(child.data.item)">
                            Delete "{{ child.data.item.name }}"
                        </a>
                    </li>
                </template>
            </vue-context>

            </v-card>
        </div>

        <Confirm :dialog="dialogDelete"
                 :title="title"
                 :content="content"
        >

            <template v-slot:confirm-buttons>
                <v-btn color="primary" @click="dialogDelete = false;dialogDeleteData=null;">{{labelClose}}</v-btn>
                <v-btn color="primary" v-if="dialogLockedList.length==0" @click="deleteFromRepositoryProcess();">Si</v-btn>
            </template>
        </Confirm>

    </div>
</template>

<script>

    var _ = require('lodash');
    import { mapGetters } from 'vuex'
    import { VueContext } from 'vue-context';
    import Confirm from '@/components/Modal/Confirm'

    export default {
        name: 'ProjectFile',
        components: {
            VueContext, Confirm
        },
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
            },
            dialogDelete: false,
            dialogDeleteData: null,
            dialogLockedList: []

        }),

        computed: {
            ...mapGetters('projectsModule', ['projectDetail', 'projectFiles', 'projectFilesSelectedItems', 'projectFilesLockedItems']),
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
                },
            title: function() {
                return this.dialogLockedList.length > 0 ? 'Impossibile eliminare la cartella' : 'Vuoi eliminare questo file dal repository remoto?'
            },
            content: function() {
                return this.dialogLockedList.length > 0 ? 'Impossibile eliminare la cartella' : 'IMPORTANTE: La cancellazione del file non potrà essere ripristinata!'
            },
            labelClose: function() {
                return this.dialogLockedList.length > 0 ? 'Chiudi' : 'No'
            }
        },
        methods: {
            clearFileList() {
                this.$store.dispatch('projectsModule/fileCleaner', {});
            },
            fileList () {

                this.$store.dispatch('projectsModule/file', {urlToConnect: 'scan_projects/'+this.$store.state.projectsModule.projectDetail.project_id, id: this.$store.state.projectsModule.projectDetail.project_id}).then(()=>{
                        //this.$store.projectsModule.loaded = true
                    })
            },
            deleteFromRepository(item) {
                if( item != null ) {
                    this.dialogLockedList = this.checkLocked(item, [])
                    this.dialogDeleteData = item
                    this.dialogDelete = true
                    if( this.dialogLockedList.length > 0 ) {

                    }
                }
            },
            deleteFromRepositoryProcess() {
                if( this.dialogDeleteData != null ) {
                    this.$store.dispatch('projectsModule/deletePath', {
                        urlToConnect: 'delete_path',
                        methodToConnect: 'post',
                        id: this.$store.state.projectsModule.projectDetail.project_id,
                        path: this.dialogDeleteData.path
                    }).then(() => {
                        this.dialogDeleteData = null
                        this.dialogLockedList = []
                        this.dialogDelete = false
                    })
                }
            },

            checkLocked(item, lockedFiles) {
                for( let locked of this.projectFilesLockedItems ) {
                    if( item.path == locked.path ) {
                        lockedFiles.push(item)
                    }
                }
                var children = item.children
                if( typeof children != 'undefined' && children.length > 0 ) {
                    for( let innerItem of children ) {
                        this.checkLocked(innerItem, lockedFiles)
                    }
                }
                return lockedFiles
            }
        },
        watch: {
            '$route' (to, from) {
                this.fileList()
            }
        },
        created () {
            this.clearFileList()
            this.fileList()
            setInterval(
                () => {
                    this.fileList()
                }, 60000
            )
        },

    }
</script>

<style>
    .v-treeview-node--disabled .v-treeview-node__checkbox {
        display: none !important;
    }

    .icon-lock {
        margin-left: -24px;
        background-color: #424242;
    }
</style>
