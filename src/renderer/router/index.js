import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'
import Layout from '@/components/Layout'

Vue.use(Router)

const router = new Router({
    mode: 'hash',
    linkActiveClass: 'is-active',
    scrollBehavior: () => ({ y: 0 }),
    routes: [
        {
          path: '/login',
          component: () => import('@/components/Login')
        },
        {
            path: '',
            component: Layout,
            redirect: 'dashboard',
            children: [


                {
                    path: '/dashboard',
                    component: () => import('@/components/Dashboard'),
                    name: 'dashboard',
                    meta: {
                        requiresLogin: true,
                        title: 'dashboard',
                        icon: 'dashboard',
                        noCache: true,
                        admin: false
                    },

                    children: [

                        {
                            path: '/projects/:id?/detail/',
                            component: () => import('@/components/Projects/Detail'),
                            name: 'projectDetail',
                            meta: { requiresLogin: true, title: 'project', icon: 'project', noCache: true, admin: false },
                        },


                    ]
                },




            ]
        },
        { path: '*', component: () => import('@/components/Dashboard'), }
    ]
})

router.beforeEach((to, from, next) => {

    let expiration = window.localStorage.getItem('tokenExpiration')
    var unixTimestamp = new Date().getTime() / 1000
    if (!(expiration !== null && parseInt(expiration) - unixTimestamp > 0)) {
        store.dispatch('logout')
    }
    require('electron').ipcRenderer.send('set-application-menu', {role_id : window.localStorage.getItem('role_id')});

    if (to.matched.some(record => record.meta.requiresLogin)) {
        if (!store.getters.isAuthenticated) {
            next({
                path: '/login'
            })
        } else {
            if( to.meta.admin == true && window.localStorage.getItem('role_id') > 2 ) {
                next({
                    path: '/dashboard'
                })
            } else {
                next()
            }
        }
    } else {
        next()
    }
});


export default router
