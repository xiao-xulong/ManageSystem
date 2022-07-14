<template>
    <el-card class="box-card">
        <div>
            <el-input v-model="searchInfo" placeholder="输入用户名" />
            <el-button type="primary" :icon="Search" @click="search">搜索</el-button>
            <el-button type="primary" @click="addrUser">添加用户</el-button>

        </div>

        <el-table :data="userInfo" border stripe style="width: 100%">

            <el-table-column v-for="item in tabPro" :key="item.prop" :prop="item.prop" :label="item.label">
                <template v-slot="scope">
                    <div v-if="item.prop == 'create_time'">
                        {{ proxy.$dayjs(scope.row.create_time * 1000).format('YYYY-MM-DD') }}
                    </div>
                    <div v-if="item.prop == 'action'">
                        <el-button type="primary" @click="alterUser(scope.row)" :icon="Edit" />
                        <el-button type="warning" @click="setUserRole(scope.row)" :icon="Setting" />
                        <el-button type="danger" :icon="Delete" @click="deleteUser(scope.row.id)" />
                    </div>

                    <div v-if="item.prop == 'mg_state'">
                        <el-switch size="large" v-model="scope.row.mg_state" @change="stateChange(scope.row)" />
                    </div>

                </template>
            </el-table-column>

        </el-table>
        <div>
            <el-pagination v-model:currentPage="pagenum" v-model:page-size="pagesize" :page-sizes="[1, 2, 5, 10]"
                layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                @current-change="handleCurrentChange" />
        </div>

    </el-card>
    <diglog :dialogVisible="dialogVisible" :AddDiglogShow="AddDiglogShow" :alterUserInfo="alterUserInfo"
        @visibleChange="visibleChange" @addUserRefresh="usersGet"></diglog>
    <setUserRoleDiglog :setUserRoleDialogVisible="setUserRoleDialogVisible"
        @setUserRoleDialogCancel="setUserRoleDialogCancel" :userInfo="SetUserRoleInfo"></setUserRoleDiglog>
</template>

<script setup lang='ts'>

import {
    Check,
    Delete,
    Edit,
    Message,
    Search,
    Star, Setting
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import diglog from '../../components/dialog.vue'
import setUserRoleDiglog from '../../components/setUserRoleDiglog.vue'
import { ref, onMounted, getCurrentInstance } from 'vue'
import { users, userState, AlterUser, delUser, submitUserRole } from '../../../http/req'

const { proxy } = getCurrentInstance() as any;
const pagenum = ref(1)
const pagesize = ref(10)
const userInfo = ref([])
const total = ref()
const searchInfo = ref('')
//表格列信息
const tabPro = ref([{ prop: 'username', label: '用户名' },
{ prop: 'email', label: '邮箱' },
{ prop: 'mobile', label: '手机' },
{ prop: 'role_name', label: '角色' },
{ prop: 'mg_state', label: '状态' },
{ prop: 'create_time', label: '创建时间' },
{ prop: 'action', label: '操作' }])
const alterUserInfo = ref()
//搜索 若为空格则显示全部信息
const search = async function () {
    await usersGet()
}
//设置用户角色弹出框显示默认不显示
const setUserRoleDialogVisible = ref(false)
const SetUserRoleInfo = ref()
//关窗口或
const setUserRoleDialogCancel = async function (i: any) {
    if (i.type == 'cancel') {
        setUserRoleDialogVisible.value = false
    } else {
        if (i.rid != undefined) {
            const res = await submitUserRole(i.id, { rid: i.rid })
            console.log('res')
            console.log(res.data.meta)
            await usersGet()
            ElMessage({
                message: res.data.meta.msg,
                type: 'success',
            })
            setUserRoleDialogVisible.value = false
        } else {
            ElMessage({
                message: '请选择角色',
                type: 'warning',
            })
        }

    }



}
const setUserRole = function (i: any) {
    SetUserRoleInfo.value = i
    setUserRoleDialogVisible.value = true
}

//添加与编辑用户弹出框显示默认不显示
const dialogVisible = ref(false)
const AddDiglogShow = ref()
//添加修改按钮显示弹出框 修改表单 传递行数据
const alterUser = function (i: any) {
    console.log(dialogVisible.value)
    dialogVisible.value = true
    alterUserInfo.value = i
    AddDiglogShow.value = false
}
//添加用户按钮显示弹出框 添加表单
const addrUser = function () {
    dialogVisible.value = true
    AddDiglogShow.value = true
}

//弹出框消失
const visibleChange = function () {
    dialogVisible.value = false
}

//开关改变
const stateChange = async function (i: any) {
    console.log(i)
    const r = (await userState(i.id, i.mg_state)).data.meta.msg

    console.log(r)
    ElMessage({
        message: r,
        type: 'success',
        duration: 3000
    })
}

const usersGet = async function () {
    const res = (await users(pagenum.value, pagesize.value, searchInfo.value.trim())).data.data
    userInfo.value = res.users
    total.value = res.total
    console.log(res)
}

const handleCurrentChange = function (pageNum: number) {
    pagenum.value = pageNum
    usersGet()
}

const handleSizeChange = function (pageSize: number) {
    pagesize.value = pageSize
    usersGet()
}
const deleteUser = (id: any) => {
    ElMessageBox.confirm(
        '是否继续删除该用户?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            cancelButtonClass: 'cancelBC'
        }
    )
        .then(async () => {
            const { data } = await delUser(id)
            console.log(data.meta)
            usersGet()
            ElMessage({
                type: 'success',
                message: data.meta.msg,
            })
        })
        .catch(() => {
            ElMessage({
                type: 'info',
                message: '取消删除',
            })
        })
}








onMounted(() => {
    usersGet()
    // .dayjs(1642662900000).format('YYYY-MM-DD')
})
</script>
<style>
.el-message-icon--success {
    font-size: 20px !important;
}

.el-message-icon--info {
    font-size: 20px !important;
}

.cancelBC {
    color: gray !important;
}
</style>
<style  scoped lang="less">
:deep(.el-table) {
    margin-top: 20px;
    margin-bottom: 20px;
}

:deep(.el-input) {
    width: 400px;
    /* margin-bottom: 20px; */
    margin-right: 20px;
    vertical-align: middle;
    border: solid rgb(219, 218, 218) 1px;



}

:deep(.el-switch__core) {
    width: 40px !important;
}

:deep(.el-pagination) {
    max-width: 950px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}

:deep(.el-pagination__editor) {
    width: 100px;
}
</style>
