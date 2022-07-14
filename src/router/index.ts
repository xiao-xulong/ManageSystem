import { CommonProps } from 'element-plus'
import { createRouter, RouteRecordRaw, Router, createWebHistory } from 'vue-router'
import store from '../store/index.js'

const routes: Array<RouteRecordRaw> = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../view/login.vue'),
        meta: {
            title: '登录'
        }
    },
    {
        path: '/',
        name: 'Home',
        component: () => import('../view/home.vue'),

        meta: {
            title: '首页'
        },
        redirect: '/users',
        children: []
    }
    // {
    //     path: '/',
    //     name: 'Home',
    //     component: () => import('../view/home.vue'),
    //     meta: {
    //         title: '首页'
    //     },
    //     redirect: '/users',
    //     children: [
    //         {
    //             path: '/users',
    //             name: 'Users',
    //             meta: {
    //                 title: '用户列表'
    //             },
    //             component: () => import('../view/home_childs/users.vue')
    //         }, {
    //             path: '/roles',
    //             name: 'Roles',
    //             meta: {
    //                 title: '角色列表'
    //             },
    //             component: () => import('../view/home_childs/roles.vue')

    //         },
    //         {
    //             path: '/rights',
    //             name: 'Rights',
    //             component: () => import('../view/home_childs/rights.vue')
    //         },
    //         {
    //             path: '/goods',
    //             name: 'Goods',
    //             component: () => import('../view/home_childs/goods.vue')
    //         },
    //         {
    //             path: '/params',
    //             name: 'Params',
    //             component: () => import('../view/home_childs/params.vue')
    //         },
    //         {
    //             path: '/categories',
    //             name: 'Categories',
    //             component: () => import('../view/home_childs/categories.vue')
    //         },

    //         {
    //             path: '/orders',
    //             name: 'Orders',
    //             component: () => import('../view/home_childs/orders.vue')
    //         },

    //         {
    //             path: '/reports',
    //             name: 'Reports',
    //             component: () => import('../view/home_childs/reports.vue')
    //         }



    //     ]
    // }
]


const router: Router = createRouter({
    history: createWebHistory(),
    routes
})



router.beforeEach((to, from, next) => {
    if (to.path !== '/login') {
        if (sessionStorage.getItem('token') != 'undefined' && sessionStorage.getItem('token') != undefined) {
            if (store.state.routeFlag == false) {
                const info = JSON.parse(sessionStorage.getItem('rc'))
                store.commit('routesJoin', router)
                store.state.routeFlag = true
                next({ ...to, replace: true })

            } else {
                next()
            }
        } else {
            next({ name: 'Login' })
        }
    } else {
        next()
    }






})

export default router
