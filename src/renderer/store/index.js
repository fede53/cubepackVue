require('dotenv').config()

import Vue from 'vue'
import Vuex from 'vuex'
import VueLodash from 'vue-lodash'
import appService from '../server/app.service'
import projectsModule from './modules/projects'
import usersModule from './modules/users'

import { getField, updateField } from 'vuex-map-fields';
import router from '../router'

const socket = require('socket.io-client')(process.env.SOCKET);

Vue.use(Vuex)
Vue.use(VueLodash)

const state  = {
    isAuthenticated : false,
    messages        : [],
    modal           : false,
    opz             : null,
    userOnline      : [],
    preload         : false,
    preloadPerc     : 0,
    appMenu         : false
}

const store = new Vuex.Store({
    modules: {
        projectsModule,
        usersModule

    },
    state,
    getters: {
        isAuthenticated: (state) => {
            return state.isAuthenticated
        },
        miniVariant: (state) => {
            return state.miniVariant
        },
        messages: (state) => {
            return state.messages
        },
        modal: (state) => {
            return state.modal
        },
        opz: (state) => {
            return state.opz
        },
        userOnline: (state) => {
            return state.userOnline
        },
        preload: (state) => {
            return state.preload
        },
        preloadPerc: (state) => {
            return state.preloadPerc
        },
        appMenu: (state) => {
            return state.appMenu
        },
        getField,
    },
    actions: {
        logout (context) {
            context.commit('logout')
        },
        login (context, credentials) {
            return new Promise((resolve) => {
                appService.connectToServer(credentials)
                    .then((data) => {
                        context.commit('login', data)
                        resolve()
                    })
                    .catch(() => window.alert('Could not login!'))
            })
        },
        changeAuthenticated: (context, value) => {
            context.commit('changeAuthenticated', value)
        },
        addMessage (context, content) {
            context.commit('addMessage', content)
        },
        deleteMessage (context, id) {
            context.commit('deleteMessage', id)
        },

        openModal(context, obj){
            context.commit('openModal', obj)
            context.dispatch(obj.module+'Module/setId', obj.id)
            if(obj.id > 0){
                context.dispatch(obj.module+'Module/edit', {urlToConnect: obj.module+'/'+obj.id+'/edit', id: obj.id})
            } else {
                context.dispatch(obj.module+'Module/create', {urlToConnect: obj.module+'/create'})
            }
        },
        setUserOnline(context, obj){
            context.commit('setUserOnline', obj)
        },
        closeModal(context){
            context.commit('closeModal')
        },
        openPreload(context){
            context.commit('openPreload')
        },
        closePreload(context){
            context.commit('closePreload')
        },
        setPreloadPerc(context, value){
            context.commit('setPreloadPerc', value)
        },
        setAppMenu(context){
            context.commit('setAppMenu')
        }

    },
    mutations: {
        logout (state) {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('token', null)
                window.localStorage.setItem('tokenExpiration', null)
                window.localStorage.setItem('role_id', null)
                window.localStorage.setItem('user_id', null)
            }
            state.isAuthenticated = false
            state.userOnline = []
            socket.emit('logout')

        },
        login (state, loginData) {
            if(loginData.success) {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('token', loginData.token)
                    window.localStorage.setItem('role_id', loginData.role_id)
                    window.localStorage.setItem('user_id', loginData.id)
                    var tokenExpiration = (new Date().getTime() / 1000) + loginData.expires_in
                    window.localStorage.setItem('tokenExpiration', tokenExpiration)
                }
                state.isAuthenticated = true

                socket.emit('login', {
                    token : loginData.token,
                    role_id : loginData.role_id,
                    id : loginData.id
                })


            } else {
                state.isAuthenticated = false
                this.dispatch('addMessage', loginData)
            }

        },
        changeAuthenticated: (state, value) => {
            state.isAuthenticated = value
        },
        addMessage (state, content) {
            state.messages.push({id: parseInt(Math.random() * 100000), msg: content})
        },
        deleteMessage (state, id) {
            let index = Vue._.findIndex(state.messages, function(o) { return o.id == id })
            state.messages.splice(index, 1)
        },
        openModal(state, obj){
            state.modal = true
            state.opz = obj.opz

        },
        setUserOnline(state, obj){
            console.log(obj);
            state.userOnline = []
            for (var key in obj) {
                state.userOnline.push({ id: obj[key].id, name: obj[key].name, surname: obj[key].surname })
            }
        },
        closeModal(state){
            state.modal = false
        },
        openPreload(state){
           state.preload = true
            state.preloadPerc = 0
        },
        closePreload(state){
            state.preload = false
            state.preloadPerc = 0
        },
        setPreloadPerc(state, value){
            state.preloadPerc = value
        },
        setAppMenu (state, data) {
            state.appMenu = data
        },
        updateField,
    }

})

if (typeof window !== 'undefined') {
    // controllo il token
    let expiration = window.localStorage.getItem('tokenExpiration')
    var unixTimestamp = new Date().getTime() / 1000

    if (expiration !== null && parseInt(expiration) - unixTimestamp > 0) {
        store.state.isAuthenticated = true
    }

    /*let token = window.localStorage.getItem('token')
    if(token != '' && token != 'null') {
        store.state.isAuthenticated = true
    }*/

}


socket.on('tryToGetInfo', () => {
    if (typeof window !== 'undefined') {
        if (window.localStorage.getItem('token') != "null") {
            socket.emit('login', {
                token : window.localStorage.getItem('token'),
                role_id : window.localStorage.getItem('role_id'),
                id : window.localStorage.getItem('user_id'),
            })
        }
    }
});

socket.on('reloadUserList', (users) => {
    store.dispatch('setUserOnline', users)
});


export default store