import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import Vuetify from 'vuetify'
import VueLodash from 'vue-lodash'
import Vuelidate from 'vuelidate'

import '@mdi/font/css/materialdesignicons.css' // Ensure you are using css-loader
import './assets/css/fontawesome/css/all.min.css'
import 'vuetify/dist/vuetify.min.css'
import './assets/css/style.css' // Ensure you are using css-loader

import colors from 'vuetify/lib/util/colors'

Vue.use(Vuelidate)
Vue.use(Vuetify)
Vue.use(VueLodash)
Vue.config.productionTip = false

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))

new Vue({
    components: { App },
    router,
    store,
    vuetify: new Vuetify({
        theme: {
            dark: true,
            themes: {
                light: {
                    primary: '#cb2390',
                },
                dark: {
                    primary: '#cb2390',
                    secondary: '#424242',
                    accent: '#82B1FF',
                    error: '#FF5252',
                    info: '#2196F3',
                    success: '#4CAF50',
                    warning: '#FFC107',
                    background: colors.indigo.base
                }
            },


        },
        iconfont: 'md'
    }),
    render: h => h(App),
}).$mount('#app')

require('electron').ipcRenderer.on('project_new', (event , data) => {
    store.dispatch('openModal', {id: null, module: 'projects', opz: 'projects'})
});

require('electron').ipcRenderer.on('project_clone', (event , data) => {
    store.dispatch('openModal', {id: null, module: 'projects', opz: 'clone'})
});

require('electron').ipcRenderer.on('settings', (event , data) => {
    store.dispatch('openModal', {id: null, module: 'settings', opz: 'list'})
});

require('electron').ipcRenderer.on('users', (event , data) => {
    router.push( '/users' );
});

