
<template>
    <div>
        <el-dialog v-model="setUserRoleDialogVisible" title="设置角色" width="30%" :close-on-click-modal="false"
            :show-close="false">
            <p>当前的用户： {{ userInfo.username }}</p>
            <p>当前的角色： {{ userInfo.role_name }}</p>


            <div><span>分配的新角色：</span>
                <el-select v-model="SelectedRole" class="m-2" placeholder="Select">
                    <el-option v-for="item in roleInfo" :key="item.id" :label="item.roleName" :value="item.id" />
                </el-select>
            </div>
            <template #footer>
                <span class="dialog-footer">
                    <el-button style="color: gray !important;" @click="setUserRoleDialogCancel('cancel')">取消
                    </el-button>
                    <el-button type="primary" @click="setUserRoleDialogCancel('submit')">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, ref } from 'vue';
import { roles } from '../../http/req'
let p = defineProps(['setUserRoleDialogVisible', 'userInfo'])

const emit = defineEmits(['setUserRoleDialogCancel'])
const setUserRoleDialogCancel = function (state: any) {
    emit('setUserRoleDialogCancel', { id: p.userInfo.id, rid: SelectedRole.value, type: state })
}

const SelectedRole = ref()
const roleInfo = ref()
onMounted(async () => {
    const res = await roles()
    roleInfo.value = res.data.data
})
</script>

<style  scoped lang="less">
p {
    font-size: 18px;
    margin-bottom: 10px;
}

span {
    font-size: 18px;
}

:deep(.el-select) {
    width: 250px;

    .el-input {
        width: 250px;
    }
}
</style> -->








