import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import VueLodash from 'vue-lodash'

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import './assets/css/style.css' // Ensure you are using css-loader
import './assets/css/fontawesome/css/fontawesome.min.css'
import './assets/css/fontawesome/css/light.min.css'
import 'vuetify/dist/vuetify.min.css'

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuetify)
Vue.use(VueLodash)
Vue.config.productionTip = false

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

new Vue({
    components: { App },
    router,
    store,
    template: '<App/>',
    vuetify: new Vuetify({
        theme: {
            light: {
                primary: '#cb2390',
                secondary: colors.red.lighten4, // #FFCDD2
                accent: colors.indigo.base, // #3F51B5
            },
            dark: {
                primary: '#cb2390',
                secondary: colors.red.lighten4, // #FFCDD2
                accent: colors.indigo.base, // #3F51B5
            }
        },
        iconfont: 'md'
    })
}).$mount('#app')

require('electron').ipcRenderer.on('project_new', (event , data) => {
    store.dispatch('openModal', {id: 0, module: 'projects', opz: 'projects'})
});

require('electron').ipcRenderer.on('project_clone', (event , data) => {
    store.dispatch('openModal', {id: 0, module: 'projects', opz: 'clone'})
});

require('electron').ipcRenderer.on('settings', (event , data) => {
    store.dispatch('openModal', {id: 0, module: 'settings', opz: 'list'})
});

require('electron').ipcRenderer.on('users', (event , data) => {
    store.dispatch('openModal', {id: 0, module: 'users', opz: 'list'})
});

