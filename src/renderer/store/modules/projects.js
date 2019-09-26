import Vue from 'vue'
import appService from '@/server/app.service'
import CpFtp from '@/components/Helpers/CpFtp';
const fs = require('fs');
const path = require('path');
const mkDirRec = require('mkdir-recursive');
import { getField, updateField } from 'vuex-map-fields';

import CpWatcher from '@/components/Helpers/CpWatcher';
import CpFile from '@/components/Helpers/CpFile'

var _ = require('lodash')


const state = {
    projects: [],
    project: [],
    projectFiles: [],
    projectFilesSelectedItems: [],
    projectFilesLockedItems: [],
    projectFilesLockedItemsOwner: [],
    projectFilesRepository: [],
    projectUserFileCompiled: { scss: [], js: [] },
    projectUser: [],
    projectDetail: [],
    // lista di file per widget new e missing
    projectLocalFileList:[],
    id: null,
    loaded: false
}

const getters = {
    projects: state => state.projects,
    project: state => state.project,
    projectFiles: state => state.projectFiles,
    projectFilesSelectedItems: state => state.projectFilesSelectedItems,
    projectFilesLockedItems: state => state.projectFilesLockedItems,
    projectFilesLockedItemsOwner: state => state.projectFilesLockedItemsOwner,
    projectFilesRepository: state => state.projectFilesRepository,
    projectUserFileCompiled: state => state.projectUserFileCompiled,
    projectUser: state => state.projectUser,
    projectDetail: state => state.projectDetail,
    projectLocalFileList: state => state.projectLocalFileList,
    id: state => state.id,
    loaded: state => state.loaded,
    getField
}

const actions = {

    setId(context, id) {
        context.commit('setId', id)
    },

    list(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('list', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    detail(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('detail', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    edit(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('edit', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    create(context, credentials) {
        appService.connectToServer(credentials).then(data => {
             context.commit('create', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    save(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            if( data.success ) {
                context.commit('save')
                this.dispatch('addMessage', data)
                this.dispatch('projectsModule/detail', {urlToConnect: 'projects/'+credentials.id, id: credentials.id})
                this.dispatch('projectsModule/list', {urlToConnect: 'projects', user_id: localStorage.getItem('user_id')})
            } else {
                this.dispatch('addMessage', data)
            }
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    delete(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            if( data.success ) {
                context.commit('delete', { success: data.success, id: data.id  })
                this.dispatch('addMessage', data)
            } else {
                this.dispatch('addProject', data)
            }

        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    file(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('file', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    lockFiles(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('file', data)

            if(credentials.download) {

                context.dispatch('downloadFiles', {urlToConnect: 'download_files/'+credentials.id, id: credentials.id, methodToConnect: "get"}).then(data => {
                }).catch(error => {
                    this.error = error.toString()
                    this.dispatch('addMessage', this.error)
                })
            }


        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    unlockFiles(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('unlockFiles', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    downloadFiles(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('downloadFiles', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    changeProjectOrder(context, credentials) {
        context.commit('changeProjectOrder', credentials.projects)
        appService.connectToServer(credentials).then(data => {
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })

    },

    executeBackup(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            this.dispatch('addMessage', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })

    },

    selectFolder(context, credentials) {
        require('electron').remote.dialog.showOpenDialog({
            defaultPath: credentials.local_folder,
            properties: ['openDirectory', 'createDirectory']
        }, (files) => {
            if (files !== undefined && files.length > 0) {
                context.commit('selectFolder', { label: credentials.label , value: files[0], local_folder:credentials.local_folder })
            }
        });
    },

    selectScss(context, credentials) {
        require('electron').remote.dialog.showOpenDialog({
            defaultPath: credentials.local_folder,
            filters: [{ name: 'Scss Files', extensions: ['scss'] }],
            properties: ['openFile', 'multiSelections']
        }, (files) => {
            if (files !== undefined && files.length > 0) {
                context.commit('selectScss', {files: files, local_folder: credentials.local_folder })
            }
        })
    },

    selectJS(context, credentials) {
        require('electron').remote.dialog.showOpenDialog({
            defaultPath: credentials.local_folder,
            filters: [{ name: 'JS Files', extensions: ['js'] }],
            properties: ['openFile', 'multiSelections']
        }, (files) => {
            if (files !== undefined && files.length > 0) {
                context.commit('selectJS', {files: files, local_folder: credentials.local_folder })
            }
        })
    },

    setProjectFilesSelectedItems(context, data) {
        context.commit('setProjectFilesSelectedItems', data)
    },

    setProjectFilesLockedtems(context, data) {
        context.commit('setProjectFilesLockedItems', data)
    },

    setProjectFilesRepository(context, data) {
        context.commit('setProjectFilesRepository', data)
    },

    fileCleaner(context, data) {
        context.commit('fileCleaner', data)
    },

    setLocalFolder(context, folder) {
        context.commit('setLocalFolder', folder)
    },

    setProjectOrder(context, data) {
        context.commit('setProjectOrder', data)
    },

    setLoaded(context, data) {
        context.commit('setLoaded', data)
    },

    reset() {
        state.projects = []
        state.project = []
        state.projectUser = {}
        state.projectDetail = []
        state.id = []
    },

    deletePath(context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('file', data)
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)
        })
    },

    scanProjectFolder(context, credentials) {
        var cpFile = new CpFile()
        cpFile.walk(credentials.local_folder, credentials.local_folder, (err, results) => {
            if (err) throw err;
            context.commit('scanProjectFolder', results)
        });
    },

}

const mutations = {

    executeBackup(state, data) {
        //state.projectLocalFileList = data
    },

    scanProjectFolder(state, data) {
        state.projectLocalFileList = data
    },

    setId(state, id) {
        state.id = id
    },

    list (state, data) {
        state.projects = data.result
    },

    detail (state, data) {
        state.projectDetail = data.result
        state.loaded = true
        new CpWatcher(data.result, this)
    },

    edit(state, data) {
        state.project = data.result
        state.projectUser = data.data.projectUser
        state.projectUserFileCompiled.scss = data.data.projectUserFileCompiled.scss
        state.projectUserFileCompiled.js = data.data.projectUserFileCompiled.js
    },

    create(state, data) {
        state.project = []
        state.projectUser = []
        Vue.set(state.project, 'type', 'cube')
        Vue.set(state.projectUser, 'local_folder', '')
    },

    selectFolder(state, data) {
        if( data.label == 'local_folder' ) {
            Vue.set(state.projectUser, data.label, data.value.replace(data.local_folder, ''))
        } else {
            Vue.set(state.project, data.label, data.value.replace(data.local_folder, ''))
        }
    },

    save(state) {
        state.project = []
        state.projectUser = []
    },

    delete(state) {
        state.project = []
        state.projectUser = {}
    },

    /*
     * data.items struttura delle cartelle
     * data.locked elenco file bloccati
     * data.repository elenco di tutti i file remoti
     */
    file(state, data) {
        state.projectFiles = data.items
        state.projectFilesLockedItems = data.itemsLocked
        state.projectFilesLockedItemsOwner = data.itemsLockedOwner
        state.projectFilesRepository = data.itemsFlat
    },

    changeProjectOrder(state, data) {
        state.projects = data
    },

    lockFiles(state, data) {
        this.dispatch('addMessage', 'Files Locked')
    },

    unlockFiles(state, data) {
        var localPath = state.projectDetail.local_folder
        var projectID = state.projectDetail.project_id
        var filesToUpload = state.projectFilesLockedItemsOwner
        state.projectFiles = data.items
        state.projectFilesLockedItems = data.itemsLocked
        state.projectFilesLockedItemsOwner = data.itemsLockedOwner
        state.projectFilesRepository = data.itemsFlat

        if( filesToUpload.length > 0 ) {
            var ftpInstance = new CpFtp()
            var counter = filesToUpload.length
            var currentCounter = 0
            this.dispatch('openPreload', {});
            ftpInstance.uploadFiles(filesToUpload, localPath, projectID, true, (finish) => {
                if (finish) {
                    this.dispatch('closePreload', {});
                }
                currentCounter++
                this.dispatch('setPreloadPerc', Math.round((currentCounter * 100) / counter))
            })
        }
    },

    downloadFiles(state, data) {
        var localPath = state.projectDetail.local_folder
        var projectID = state.projectDetail.project_id
        if( data.result.length > 0 ) {
            var ftpInstance = new CpFtp()
            var counter = data.result.length
            var currentCounter = 0
            this.dispatch('openPreload', {});
            ftpInstance.downloadFiles(data.result, localPath, projectID, false, (finish) => {
                if (finish) {
                    this.dispatch('closePreload', {});
                }
                currentCounter++
                this.dispatch('setPreloadPerc', Math.round((currentCounter * 100) / counter))
            })
        }
    },

    selectScss(state, data) {
        for(let file of data.files) {
            if(typeof (_.find(state.projectUserFileCompiled.scss, { 'file': file.replace(data.local_folder, '') })) == 'undefined' ){
                state.projectUserFileCompiled.scss.push({ file: file.replace(data.local_folder, '') })
            }
        }
    },

    selectJS(state, data) {
        for(let file of data.files) {
            if(typeof (_.find(state.projectUserFileCompiled.js, { 'file': file.replace(data.local_folder, '') })) == 'undefined' ){
                state.projectUserFileCompiled.js.push({ file: file.replace(data.local_folder, '') })
            }
        }
    },

    removeScssFile(state, data) {
        state.projectUserFileCompiled.scss.splice(state.projectUserFileCompiled.scss.indexOf(data.file), 1);
    },

    removeJSFile(state, data) {
        state.projectUserFileCompiled.js.splice(state.projectUserFileCompiled.js.indexOf(data.file), 1);
    },

    setProjectFilesSelectedItems(state, data) {
       state.projectFilesSelectedItems = data
    },

    setProjectFilesLockedItems(state, data) {
        state.projectFilesLockedItems = data
     },

    setProjectFilesLockedItemsOwner(state, data) {
        state.projectFilesLockedItemsOwner = data
    },

    setProjectFilesRepository(state, data) {
        state.projectFilesRepository = data
    },

    fileCleaner(state, data) {
        state.projectFiles = []
    },

    setLoaded(state,data){
        state.loaded = data.flag
    },

    setLocalFolder(context, folder) {
        state.projectUser.local_folder = folder
    },

    setProjectOrder(context, data) {
        state.projects = data
    },

    updateField,
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
