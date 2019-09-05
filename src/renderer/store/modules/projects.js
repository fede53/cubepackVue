import Vue from 'vue'
import appService from '../../server/app.service'
import VueLodash from 'vue-lodash'

import  CpFtp from '../../components/Widget/CpFtp';
const fs = require('fs');
const path = require('path');
const mkDirRec = require('mkdir-recursive');

import { getField, updateField } from 'vuex-map-fields';

Vue.use(VueLodash) // options is optional

const state = {
    projects: [],
    project: [],
    projectFiles: [],
    projectFilesSelectedItems: [],
    projectLockedSelectedItems: [],
    projectUser: {},
    projectDetail: [],
    id: 0,
    loaded: false
}

const getters = {
    projects: state => state.projects,
    project: state => state.project,
    projectFiles: state => state.projectFiles,
    projectFilesSelectedItems: state => state.projectFilesSelectedItems,
    projectFilesLockedItems: state => state.projectFilesLockedItems,
    projectUser: state => state.projectUser,
    projectDetail: state => state.projectDetail,
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
            console.log(error.toString())
            this.dispatch('addMessage', this.error)
        })
    },

    setProjectFilesSelectedItems(context, data) {
        context.commit('setProjectFilesSelectedItems', data)
    },

    setProjectFilesLockedtems(context, data) {
        context.commit('setProjectFilesLockedItems', data)
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

}

const mutations = {

    setId(state, id) {
        state.id = id
    },

    list (state, data) {
        state.projects = data.result
    },

    detail (state, data) {
        state.projectDetail = data.result
        state.loaded = true
    },

    edit(state, data) {
        state.project = data.result
        state.projectUser = data.data.projectUser
    },

    create(state, data) {
        state.project = []
        state.projectUser = {}
        state.project.type = 'cube'
        state.projectUser.local_folder = 'test'
    },

    save(state) {
        state.project = []
        state.projectUser = {}
    },

    delete(state) {
        state.project = []
        state.projectUser = {}
    },

    file(state, data) {
        state.projectFiles = data.items
        state.projectFilesLockedItems = data.checked
    },

    lockFiles(state, data) {
        this.dispatch('addMessage', 'Files Locked')
    },

    unlockFiles(state, data) {
        state.projectFiles = data.items
        var filesToUpload = state.projectFilesLockedItems;
        state.projectFilesLockedItems = data.checked
        //To upload
        console.log(filesToUpload)
    },

    downloadFiles(state, data) {
        var localPath = state.projectDetail.local_folder
        var ftpInstance = new CpFtp()
        ftpInstance.downloadFiles(data.result, localPath)
    },

    setProjectFilesSelectedItems(state, data) {
       state.projectFilesSelectedItems = data
    },

    setProjectFilesLockedItems(state, data) {
        state.projectFilesLockedItems = data
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
