import Vue from 'vue'
import appService from '../../server/app.service'
import VueLodash from 'vue-lodash'
import router from '../../router'

Vue.use(VueLodash) // options is optional


const state = {
    users: [],
    user: [],
    userRoles: [],
    id: 0
}

const getters = {
    users: state => state.users,
    user: state => state.user,
    userRoles: state => state.userRoles,
}

const actions = {

    list (context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('list', { users: data })
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    detail (context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('detail', { user: data })
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    create (context, credentials) {
        appService.connectToServer(credentials).then(data => {
            context.commit('create', { user: data })
        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    save (context, credentials) {
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
    delete (context, credentials) {
        appService.connectToServer(credentials).then(data => {
            if( data.success ) {
                context.commit('delete', { success: data.success, id: data.id  })
                this.dispatch('addMessage', data)
            } else {
                this.dispatch('addMessage', data)
            }

        }).catch(error => {
            this.error = error.toString()
            this.dispatch('addMessage', this.error)

        })
    },

    reset (context) {
        state.user = []
    },

}

const mutations = {

    list (state, data) {
        state.users = data.users.result
    },
    detail (state, data) {
        state.user = data.user.result
        state.userRoles = data.user.data.roles
    },
    create (state, data) {
        state.userRoles = data.user.data.roles
    },
    save () {
        state.user = []
        router.replace("/users")
    },
    delete (state, data) {
        let index = Vue._.findIndex(state.users, function(o) { return o.id == data.id; });
        state.users.splice(index, 1)
    }

}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations
}
