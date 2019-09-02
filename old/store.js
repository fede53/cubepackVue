import Vue from 'vue'
import Vuex from 'vuex'
import { getField, updateField } from 'vuex-map-fields';
import { createPersistedState, createSharedMutations } from 'vuex-electron'
import modules from './modules'

Vue.use(Vuex)

const state = {
    isAuthenticated: false,
    messages: [],
}

export default new Vuex.Store({
    modules,
    state,
    getters: {
        isAuthenticated: (state) => {
            return state.isAuthenticated
        },
        getField,
    },
    actions: {
        changeMiniVariant(context) {
            context.commit('changeMiniVariant')
        },
        logout (context) {
            console.log('asd');
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
    },
    mutations: {
        logout (state) {
            if (typeof window !== 'undefined') {
                window.localStorage.setItem('token', null)
                window.localStorage.setItem('tokenExpiration', null)
                window.localStorage.setItem('role_id', 0)
            }
            state.isAuthenticated = false
        },
        login (state, loginData) {
            if(loginData.success) {
                if (typeof window !== 'undefined') {
                    window.localStorage.setItem('token', loginData.token)
                    window.localStorage.setItem('role_id', loginData.role_id)
                    var tokenExpiration = (new Date().getTime() / 1000) + loginData.expires_in
                    window.localStorage.setItem('tokenExpiration', tokenExpiration)
                }
                state.isAuthenticated = true
            } else {
                state.isAuthenticated = false
                this.dispatch('addMessage', loginData)
            }

        },
        changeAuthenticated: (context, value) => {
            state.isAuthenticated = value
        },
        addMessage (state, content) {
            state.messages.push({id: parseInt(Math.random() * 100000), msg: content})
        },
        deleteMessage (state, id) {
            let index = Vue._.findIndex(state.messages, function(o) { return o.id == id })
            state.messages.splice(index, 1)
        },
        updateField,
    },
    plugins: [
        createPersistedState(),
        createSharedMutations()
    ],
    strict: process.env.NODE_ENV !== 'production'
})