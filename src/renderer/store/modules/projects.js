import Vue from 'vue'
import appService from '../../server/app.service'
import VueLodash from 'vue-lodash'

const ClientFTP = require('ftp');
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
    projectUser: [],
    projectDetail: [],
    id: 0,
    loaded: false
}

const getters = {
    projects: state => state.projects,
    project: state => state.project,
    projectFiles: state => state.projectFiles,
    projectFilesSelectedItems: state => state.projectFilesSelectedItems,
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
            context.commit('file', data)
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

    setProjectFilesSelectedItems(context, data) {
        context.commit('setProjectFilesSelectedItems', data)
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
        state.projectUser = []
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
        state.projectUser = []
        state.project.type = 'cube'
    },

    save(state) {
        state.project = []
        state.projectUser = []
    },

    delete(state) {
        state.project = []
        state.projectUser = []
    },

    file(state, data) {
        state.projectFiles = data.items
    },

    lockFiles(state, data) {
        console.log(state.projectFilesSelectedItems)
        this.dispatch('addMessage', 'Files Locked')
    },

    downloadFiles(state, data) {
        var ftpData = {
            ftp_server: '151.236.33.162',
            ftp_username: 'cubepack',
            ftp_password: 'Vfzh88^3',
            ftp_folder: '/httpdocs'
        }
        var localPath = '/Users/federicogermi/Desktop/testftp'
        var connectionParams = { host: ftpData.ftp_server, port:'21', user: ftpData.ftp_username, password: ftpData.ftp_password, keepalive: 10000 }
        var ftpClient = new ClientFTP();
        ftpClient.on('ready', function(err) {
            for( var i=0; i<data.result.length; i++) {
                var fileName = data.result[i];
                (
                    function (localPath, fileName) {
                        ftpClient.get(ftpData.ftp_folder + fileName, (err, stream) => {

                            if (err) throw err;
                            stream.once('close', () => {
                                ftpClient.end();
                            });
                            console.log('CREATE -> '+localPath + path.dirname(fileName));
                            mkDirRec.mkdir(localPath + path.dirname(fileName), (err) => {
                                if (err) console.log(err);
                                console.log('INSIDE -> '+localPath + fileName);
                                stream.pipe(fs.createWriteStream(localPath + fileName));
                            });
                        })
                    }
                )(localPath, fileName)
            }
        });
        ftpClient.connect(connectionParams);
    },

    setProjectFilesSelectedItems(state, data) {
       state.projectFilesSelectedItems = data
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
