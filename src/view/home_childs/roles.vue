<template>
    <div>
        <el-card class="box-card">
            <el-button type="primary" @click="addUser">添加用户</el-button>
            <el-table :data="tableData" row-key="id" stripe border style="width: 100%">
                <!-- 扩展栏 -->
                <el-table-column type="expand" width='80' align="center">
                    <template v-slot="scope">
                        <el-row v-for="item in scope.row.children" :key="item" class="rowBottom">
                            <el-col :span="6">
                                <div>
                                    <span class="tagCenter ">
                                        <el-tag @close="roleDel(scope.row.id, item.id)" closable>{{
                                                item.authName
                                        }}
                                        </el-tag>
                                        <CaretRight class="rightIcon" />
                                    </span>
                                </div>
                            </el-col>
                            <el-col :span="18">
                                <el-row v-for="(c, index) in item.children" :key="c.id"
                                    :class="index + 1 == item.children.length ? '' : 'rowBottom'">
                                    <el-col :span="6">
                                        <span class="tagCenter ">
                                            <el-tag @close="roleDel(scope.row.id, c.id)" closable class="tagMargin">{{
                                                    c.authName
                                            }}</el-tag>
                                            <CaretRight class="rightIcon" />
                                        </span>
                                    </el-col>
                                    <el-col :span="18">
                                        <span class=" lastTag tagMargin" v-for="cc in c.children" :key="cc.id">
                                            <el-tag @close="roleDel(scope.row.id, cc.id)" closable class="tagMargin">{{
                                                    cc.authName
                                            }}</el-tag>
                                        </span>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                    </template>
                </el-table-column>

                <el-table-column label="#" type="index" width='100' align="center" />

                <el-table-column :prop="item.prop" :label="item.label" v-for="item in tableColumns">
                    <template v-slot="scope">
                        <div v-if="item.prop == 'work'">
                            <el-button type="primary" @click="alterRoles(scope.row)" :icon="Edit">编辑</el-button>
                            <el-button type="warning" :icon="Setting" @click="setPower(scope.row)">分配权限</el-button>
                            <el-button type="danger" :icon="Delete" @click="deleteRole(scope.row.id)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>

            </el-table>
        </el-card>
        <!-- 添加窗口 -->
        <roleDiglog :roleDialogVisible="roleDialogVisible" @roleDialogCancel="roleDialogCancel"></roleDiglog>
        <!-- 设置权限窗口 -->
        <setPowerDiglog :setPowerInfo="setPowerInfo" :setpowerDialogVisible="setpowerDialogVisible" :TreeKey="TreeKey"
            @setpowerDialogCancel="setpowerDialogCancel"></setPowerDiglog>
        <EditRoledialog :visible="editRoleDialogVisible" @cancel="editRoleDialogCancel" :info="editRoleInfo">
        </EditRoledialog>
    </div>
</template>

<script setup lang='ts' >
import { onMounted, ref } from 'vue'
import roleDiglog from '../../components/roleDiglog.vue';
import setPowerDiglog from '../../components/setpowerdialog.vue';
import { roles, delRights, delRole } from '../../../http/req'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
    Delete,
    Edit,
    Setting,
    CaretRight
} from '@element-plus/icons-vue'
import EditRoledialog from '../../components/editRoledialog.vue'
interface tableCols {
    prop: string;
    label: string
}

const tableColumns = ref<tableCols[]>([{ prop: 'roleName', label: '角色名称' },
{ prop: 'roleDesc', label: '角色描述' },
{ prop: 'work', label: '操作' }])

onMounted(() => {
    rolesGet()
})
const tableData = ref()
//设置权限窗口显示控制
const setpowerDialogVisible = ref<boolean>(false)
const setpowerDialogCancel = function (status: any) {
    setpowerDialogVisible.value = false
    if (status == 200) {
        rolesGet()
    }
}
//添加用户窗口关闭
const roleDialogCancel = function (i: any) {
    console.log(i)
    roleDialogVisible.value = false
    if (i === 201) {
        rolesGet()
    } else {
        return
    }

}
//添加窗口显示控制
const roleDialogVisible = ref<boolean>(false)
const addUser = function () {
    roleDialogVisible.value = true
}
//角色信息获取
const rolesGet = async function () {
    const r = await roles()
    console.log(r)
    tableData.value = r.data.data
}
//删除权限
const roleDel = function (roleId: any, rightId: any) {
    ElMessageBox.confirm(
        '确定删除?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const r = await delRights(roleId, rightId)
            // console.log(tableData.value)
            tableData.value.forEach((item: any) => {
                if (item.id == roleId) {
                    item.children = r.data.data
                }
            });
        })
        .catch()




}
//设置权限
const setPowerInfo = ref()
//选中的权限
const TreeKey = ref([] as any[])
const setPower = function (info: any) {
    TreeKey.value = []
    setPowerInfo.value = info
    setpowerDialogVisible.value = true
    getTreeKey(info)
    console.log(TreeKey.value)
}
const getTreeKey = function (e: any) {
    if (e.children) {
        e.children.forEach((item: any) => {
            if (item.children) {
                item.children.forEach((levelTwo: any) => {
                    if (levelTwo.children) {
                        levelTwo.children.forEach((levelThree: any) => {
                            TreeKey.value.push(levelThree.id)
                        });
                    }
                })
            }
        });
    }
}
//修改角色信息弹窗控制
const editRoleInfo = ref()
const editRoleDialogVisible = ref(false)
const alterRoles = async function (i: any) {
    console.log(i)
    editRoleDialogVisible.value = true
    editRoleInfo.value = i
    //  const r=  await delGoods()
    //  console.log(r)
}
//角色信息弹窗关闭
const editRoleDialogCancel = function (state: any) {
    if (state === 1) {
        rolesGet()
    }
    editRoleDialogVisible.value = false
}
//删除角色
const deleteRole = function (i: any) {
    ElMessageBox.confirm(
        '确定删除?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const r = await delRole(i)
            console.log(r)
            rolesGet()
        })
        .catch()
}
</script>

<style  scoped>
.el-button {
    margin-bottom: 15px;
}

.tagCenter {
    /* width: 100%; */
    position: relative;
    left: 50%;
    /* top: 50%; */
    transform: translate(0, -50%);
}

/* 最后一行标签 */
.lastTag {
    margin-left: 30px;
}

.rightIcon {
    width: 20px;
    vertical-align: middle;
}

.rowBottom {
    border-bottom: solid 1px rgb(169, 165, 165);
}

:deep(.el-row) {

    height: auto;
    display: flex;
    align-items: center;
    /* margin-top: 20px;
    margin-bottom: 20px; */
}


:deep(.el-tag) {
    height: 40px;
    font-size: 16px;
    margin-top: 5px;
    margin-bottom: 5px;
}

:deep(.el-tag__close) {
    width: 18px !important;
    height: 18px !important;
}
</style>
