<template>
    <div>
        <div class="fileCards">

            <v-card
                    width="100%"
                    class="pa-3 mb-2"
            >
                <v-card-title  class="subtitle_widget subtitle-1"><v-checkbox color="blue" v-model="newFilesSelectAll" :label="GLOBAL_CONSTS.LABELS.WIDGETS.TITLE_FILE_NEW + ' (' + this.newFilesSelectedItems.length + '/' + this.newFileList.length + ')'" v-on:change="newFilesCheckAll"></v-checkbox></v-card-title>
                <div class="treeCnt">
                    <v-treeview
                            selectable
                            selected-color="blue"
                            :items="newFileList"
                            item-key="path"
                            item-text="path"
                            dark
                            open-all
                            v-model="newFilesSelectedItems"
                    >
                    </v-treeview>
                </div>
                <div>
                    <v-btn small color="error" @click="openConfirm({dialog: true,title: 'Delete',content: 'Vuoi cancellare i file locali selezionati non presenti sul repository?',buttons: GLOBAL_CONSTS.FILES.LABEL_NEW_DELETE })">Discard</v-btn>
                    <v-btn small color="success" @click="openConfirm({dialog: true,title: 'Upload',content: 'Vuoi caricare sul repository i file selezionati?',buttons: GLOBAL_CONSTS.FILES.LABEL_NEW_UPLOAD })">Upload</v-btn>
                </div>
            </v-card>
            <v-card width="100%"
                    class="pa-3"
            >
                <v-card-title  class="subtitle_widget subtitle-1"><v-checkbox color="blue" v-model="deleteFilesSelectAll" :label="GLOBAL_CONSTS.LABELS.WIDGETS.TITLE_FILE_DELETED +' (' + this.deletedFilesSelectedItems.length + '/' + this.deletedFileList.length + ')'" v-on:change="deleteFilesCheckAll"></v-checkbox></v-card-title>
                <div class="treeCnt">
                    <v-treeview
                            selectable
                            selected-color="blue"
                            :items="deletedFileList"
                            item-key="path"
                            item-text="path"
                            dark
                            open-all
                            v-model="deletedFilesSelectedItems"
                    >
                    </v-treeview>
                </div>
                <div>
                    <v-btn small color="success" @click="openConfirm({dialog: true,title: 'Download',content: 'Vuoi scaricare dal repository i file selezionati?',buttons: GLOBAL_CONSTS.FILES.LABEL_MISSING })">Download</v-btn>
                </div>
            </v-card>

        </div>
        <Confirm :dialog="confirm.dialog"
                 :title="confirm.title"
                 :content="confirm.content"
        >
            <template v-slot:confirm-buttons>
                <v-btn color="primary" @click="openConfirm({ dialog: false })">No</v-btn>
                <v-btn v-if="confirm.buttons == GLOBAL_CONSTS.FILES.LABEL_NEW_DELETE" color="primary" @click="deleteLocalFiles">Si</v-btn>
                <v-btn v-if="confirm.buttons == GLOBAL_CONSTS.FILES.LABEL_NEW_UPLOAD" color="primary" @click="uploadLocalFiles">Si</v-btn>
                <v-btn v-if="confirm.buttons == GLOBAL_CONSTS.FILES.LABEL_MISSING" color="primary" @click="downloadLocalFiles">Si</v-btn>
            </template>
        </Confirm>
    </div>

</template>

<script>
  import { mapGetters } from 'vuex'
  import { GLOBAL_CONSTS } from '@/constants.js'
  import Header from '@/components/Blocks/Header'
  import Confirm from '@/components/Modal/Confirm'
  import CpFtp from '@/components/Helpers/CpFtp'
  import CpFile from '@/components/Helpers/CpFile'


  var rimraf = require("rimraf");
  var _ = require('lodash')
  var fs = require('fs')
  var path = require('path')


export default {
    name: 'FileLog',
    data: function() {
        return {
            newFilesSelectedItems: [],
            deletedFilesSelectedItems: [],
            newFilesSelectAll: false,
            deleteFilesSelectAll: false,
            GLOBAL_CONSTS: Object.assign({}, GLOBAL_CONSTS),
            confirm:{
                dialog: false,
                title: '',
                content: '',
                buttons: null
            }
        }
    },
    props: ['local_folder', 'project_id'],
    components: {
      Header, Confirm
    },
    computed: {
        ...mapGetters('projectsModule', ['projectFiles', 'projectFilesRepository', 'projectFilesLockedItems', 'projectLocalFileList']),
        newFileList: function() {
            var result = []
            if( typeof(this.projectFilesRepository) != 'undefined' && this.projectFilesRepository.length > 0 ) {
                result = _.differenceBy(this.projectLocalFileList, this.projectFilesRepository, 'path');
                result = _.differenceBy(result, this.projectFilesLockedItems, 'path');
            }
            return result
        },
        deletedFileList: function() {
            var result = []
            if( typeof(this.projectFilesRepository) != 'undefined' && this.projectLocalFileList.length > 0 ) {
                result = _.differenceBy(this.projectFilesRepository, this.projectLocalFileList, 'path');
                result = _.differenceBy(result, this.projectFilesLockedItems, 'path');
            }
            return result
        },

    },
    methods: {
        createLocalIni() {
            this.$store.dispatch('projectsModule/scanProjectFolder', { local_folder: this.local_folder });
        },
        openConfirm(obj) {
            if( ((obj.buttons == GLOBAL_CONSTS.FILES.LABEL_NEW_DELETE||obj.buttons == GLOBAL_CONSTS.FILES.LABEL_NEW_UPLOAD) && this.newFilesSelectedItems.length > 0) || (obj.buttons == GLOBAL_CONSTS.FILES.LABEL_MISSING && this.deletedFilesSelectedItems.length > 0) || obj.buttons == null  ) {
                this.confirm = Object.assign(this.confirm, obj)
            }
        },
        newFilesCheckAll() {
            this.newFilesSelectedItems = []
            if( this.newFilesSelectAll ) {
                for( let fileObj of this.newFileList ) {
                    this.newFilesSelectedItems.push(fileObj.path)
                }
            }
        },
        deleteFilesCheckAll() {
            this.deletedFilesSelectedItems = []
            if( this.deleteFilesSelectAll ) {
                for( let fileObj of this.deletedFileList ) {
                    this.deletedFilesSelectedItems.push(fileObj.path)
                }
            }
        },
        deleteLocalFiles() {
            this.openConfirm({ dialog: false })
            var counter = this.newFilesSelectedItems.length
            var currentCounter = 0
            this.$store.dispatch('openPreload', {});
            try {
                for( let fileName of this.newFilesSelectedItems ) {
                    var fullFileName = this.local_folder + fileName;
                    if( fs.existsSync(fullFileName) ) {
                        if( !fs.lstatSync(fullFileName).isDirectory() ) {
                            fs.unlinkSync(fullFileName)
                        }
                    }
                    currentCounter++
                    this.$store.dispatch('setPreloadPerc', Math.round((currentCounter * 100) / counter))
                }
            } catch(err) {
                console.error(err)
            }
            this.$store.dispatch('closePreload', {})
            this.newFilesSelectedItems = []
            this.clearLocalFolder(this.local_folder)
            this.createLocalIni()
        },
        uploadLocalFiles() {
            this.openConfirm({ dialog: false })
            var localPath = this.$store.state.projectsModule.projectDetail.local_folder
            var projectID = this.$store.state.projectsModule.projectDetail.project_id
            var ftpInstance = new CpFtp()
            var counter = this.newFilesSelectedItems.length
            var currentCounter = 0
            var fileToUpload = this.newFilesSelectedItems
            this.$store.dispatch('openPreload', {});
            try {
                ftpInstance.uploadFiles(fileToUpload, localPath, projectID, false, (finish) => {
                    if (finish) {
                        this.$store.dispatch('closePreload', {});
                        this.$store.dispatch('projectsModule/file', {urlToConnect: 'scan_projects/'+projectID, id: projectID})
                        this.createLocalIni()
                    }
                    currentCounter++
                    this.$store.dispatch('setPreloadPerc', Math.round((currentCounter * 100) / counter))
                })
            } catch(err) {
                console.error(err)
            }
            this.newFilesSelectedItems = []
        },
        downloadLocalFiles() {
            this.openConfirm({ dialog: false })
            var localPath = this.$store.state.projectsModule.projectDetail.local_folder
            var projectID = this.$store.state.projectsModule.projectDetail.project_id
            var ftpInstance = new CpFtp()
            var counter = this.deletedFilesSelectedItems.length
            var currentCounter = 0
            var fileToDownload = this.deletedFilesSelectedItems
            this.$store.dispatch('openPreload', {});
            try {
                ftpInstance.downloadFiles(fileToDownload, localPath, projectID, false, (finish) => {
                    if (finish) {
                        this.$store.dispatch('closePreload', {});
                        this.$store.dispatch('projectsModule/file', {urlToConnect: 'scan_projects/'+projectID, id: projectID})
                        this.createLocalIni()
                    }
                    currentCounter++
                    this.$store.dispatch('setPreloadPerc', Math.round((currentCounter * 100) / counter))
                })
            } catch(err) {
                console.error(err)
            }
            this.deletedFilesSelectedItems = []
        },
        clearLocalFolder(folder) {
            var isDir = fs.statSync(folder).isDirectory();
            if (!isDir) {
                return;
            }
            var files = fs.readdirSync(folder);
            if (files.length > 0) {
                files.forEach((file) => {
                    var fullPath = path.join(folder, file);
                    this.clearLocalFolder(fullPath);
                });

                files = fs.readdirSync(folder);
            }

            if (files.length == 0) {
                console.log("removing: ", folder);
                fs.rmdirSync(folder);
                return;
            }
        }
    },
    created () {
        this.createLocalIni()
    }
}



</script>
