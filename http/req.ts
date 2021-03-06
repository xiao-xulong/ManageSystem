import axios from "axios";
import { da } from "element-plus/lib/locale";
// https://www.liulongbin.top:8888/api/private/v1
const http = axios.create({
    baseURL: 'https://www.liulongbin.top:8888/api/private/v1',
    timeout: 10000,
    // headers: {'X-Custom-Header': 'foobar'}
})
http.interceptors.request.use((config: any) => {
    console.log(config)
    config.headers.Authorization = sessionStorage.getItem('token')
    return config
})
const login = function (data: any) {
    return http.post('login',
        data
    )
}
const menus = function () {
    return http.get('menus')
}

const users = function (pagenum: any, pagesize: any, query: any) {
    return http.get('users', { params: { pagenum: pagenum, pagesize: pagesize, query: query } })
}

const userState = function (id: any, state: any) {
    return http.put(`users/${id}/state/${state}`)
}

const AlterUser = function (id: any, info: any) {
    return http.put(`users/${id}`, info)
}

const AddUser = function (info: any) {
    return http.post('users', info)
}
const delUser = function (id: any) {
    return http.delete(`users/${id}`)
}
const rights = function (type: any) {
    return http.get(`rights/${type}`)
}

const roles = function () {
    return http.get(`roles`)
}
const addRoles = function (data: any) {
    return http.post(`roles`, data)
}
const editRole = function (id: any, roleName: any, roleDesc: any) {
    return http.put(`roles/${id}`, { roleName: roleName, roleDesc: roleDesc })
}
const delRole = function (id) {
    return http.delete(`roles/${id}`)
}
const delRights = function (roleId: any, rightId: any) {
    return http.delete(`roles/${roleId}/rights/${rightId}`)
}
const setRights = function (id: any, rids: any) {
    return http.post(`roles/${id}/rights`, { rids: rids })
}
const submitUserRole = function (id: any, rid: any) {
    return http.put(`users/${id}/role`, rid)
}
const getCategories = function (type: any, pagenum: any, pagesize: any) {
    return http.get(`categories`, { params: { type: type, pagenum: pagenum, pagesize: pagesize } })
}

const postCategories = function (cat_pid: any, cat_name: any, cat_level: any) {
    return http.post(`categories`, { cat_pid: cat_pid, cat_name: cat_name, cat_level: cat_level })
}
const getAttributes = function (id: any, sel: any) {
    return http.get(`categories/${id}/attributes`, { params: { sel: sel } })
}
const addAttributes = function (id: any, attr_name: any, attr_sel: any, attr_vals: any) {
    return http.post(`categories/${id}/attributes`, { attr_name: attr_name, attr_sel: attr_sel, attr_vals: attr_vals })
}
const editCategories = function (id: any, cat_name: any) {
    return http.put(`categories/${id}`, { cat_name: cat_name })
}
const delCategories = function (id: any) {
    return http.delete(`categories/${id}`)
}
const postAttributes = function (id: any, attr_name: any, attr_sel: any, attr_vals: any, attrId: any) {
    return http.put(`categories/${id}/attributes/${attrId}`, { attr_name: attr_name, attr_sel: attr_sel, attr_vals: attr_vals })
}


const getGoods = function (query: any, pagenum: any, pagesize: any) {
    return http.get(`goods`, { params: { query: query, pagenum: pagenum, pagesize: pagesize } })
}
const uploadPic = function (file: any) {
    return http.post(`upload`, { file: file })
}
const postGoods = function (data: any) {
    return http.post(`goods`, data)
}
const delGoods = function (id: any) {
    return http.delete(`goods/${id}`)
}
const getOrders = function (info: any) {
    return http.get(`orders`, { params: info })
}
const getechart = function () {
    return http.get(`reports/type/1`)
}

const getKuaidi = function () {
    return {
        "data": [
            {
                "time": "2018-05-10 09:39:00",
                "ftime": "2018-05-10 09:39:00",
                "context": "?????????,??????????????????,????????????????????????",
                "location": ""
            },
            {
                "time": "2018-05-10 08:23:00",
                "ftime": "2018-05-10 08:23:00",
                "context": "[?????????]?????????????????????????????????????????? ???????????? 95338??????????????????",
                "location": ""
            },
            {
                "time": "2018-05-10 07:32:00",
                "ftime": "2018-05-10 07:32:00",
                "context": "???????????? [?????????????????????????????????]",
                "location": ""
            },
            {
                "time": "2018-05-10 02:03:00",
                "ftime": "2018-05-10 02:03:00",
                "context": "?????????[????????????????????????]?????????,???????????? [?????????????????????????????????]",
                "location": ""
            },
            {
                "time": "2018-05-09 23:05:00",
                "ftime": "2018-05-09 23:05:00",
                "context": "???????????? [????????????????????????]",
                "location": ""
            },
            {
                "time": "2018-05-09 21:21:00",
                "ftime": "2018-05-09 21:21:00",
                "context": "?????????[?????????????????????]?????????,???????????? [????????????????????????]",
                "location": ""
            },
            {
                "time": "2018-05-09 13:07:00",
                "ftime": "2018-05-09 13:07:00",
                "context": "???????????? ???????????????",
                "location": ""
            },
            {
                "time": "2018-05-09 12:25:03",
                "ftime": "2018-05-09 12:25:03",
                "context": "????????????",
                "location": ""
            },
            {
                "time": "2018-05-09 12:22:24",
                "ftime": "2018-05-09 12:22:24",
                "context": "??????????????????HLA?????????????????????????????????????????????????????????",
                "location": ""
            },
            {
                "time": "2018-05-08 21:36:04",
                "ftime": "2018-05-08 21:36:04",
                "context": "??????????????????",
                "location": ""
            }
        ],
        "meta": { "status": 200, "message": "???????????????????????????" }
    }

}
export {
    login, menus, users, userState, AlterUser, AddUser, delUser, rights, roles,
    delRights, addRoles, setRights, submitUserRole, getCategories, postCategories, getAttributes, postAttributes,
    getGoods, uploadPic, postGoods, getOrders, getKuaidi, getechart, delGoods, editRole, delRole, editCategories, delCategories
    , addAttributes
}