import { routerKey } from 'vue-router'
import { createStore } from 'vuex'


// const modules = import.meta.glob('../view/home_childs/*.vue')
const store = createStore({
    state: {
        routeFlag: false,
        // rouInfo: modules
    },
    mutations: {
        tre() {
            return 'xxx'
        },
        //路由拼接及添加
        routesJoin(state, router) {
            const modules = import.meta.glob('../view/home_childs/*.vue')
            const childsRou = JSON.parse(sessionStorage.getItem('rc'))
            console.log(modules)
            console.log(modules['../view/home_childs/users.vue'])
            console.log(childsRou)
            childsRou.forEach((c) => {
                console.log(c.component)
                router.addRoute('Home', {
                    path: '/' + c.path, name: `${c.path}`, meta: c.meta,
                    component: modules[`${c.compoent}`]
                })
                // r.children.push({
                //     path: '/' + c.path, name: `${c.path}`, meta: c.meta,
                //     component: modules[`${c.compoent}`]



                // })
            })
            // console.log(r)
            // console.log(' routesJoin routesJoin routesJoin routesJoin routesJoin')
            // router.addRoute(r)

        }
    },
    actions: {

    },
    getters: {

    }
})

export default store