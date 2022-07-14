<template>
    <div>
        <el-dialog :close-on-click-modal="false" :show-close="false" v-model="roleDialogVisible" title="添加角色"
            width="30%">

            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm"
                status-icon>
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="ruleForm.roleName" />
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="ruleForm.roleDesc" />
                </el-form-item>
            </el-form>


            <template #footer>
                <span class="dialog-footer">
                    <el-button style="color: gray !important;" @click="roleDialogCancel">取消</el-button>
                    <el-button type="primary" @click="addRole">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref } from 'vue'
import type { FormRules } from 'element-plus'
import { addRoles } from '../../http/req'
import { ElMessage } from 'element-plus'

const p = defineProps({
    roleDialogVisible: {
        type: Boolean
    }
})
//添加用户窗口关闭
const emit = defineEmits(['roleDialogCancel'])
const roleDialogCancel = function (i: any) {
    emit('roleDialogCancel', i)
}
const ruleFormRef = ref()
const ruleForm = reactive({
    roleName: '',
    roleDesc: ''
})
//添加用户
const addRole = function () {
    ruleFormRef.value.validate(async (v: any) => {
        if (v === true) {
            const r = await addRoles(ruleForm)
            if (r.data.meta.status == 201) {
                ElMessage({
                    type: 'success',
                    message: r.data.meta.msg,
                })
                roleDialogCancel(r.data.meta.status)
                console.log(r)
            } else {
                roleDialogCancel(r.data.meta.status)
                ElMessage.error(r.data.meta.msg)
                console.log(r)
            }

        }
    })
}
//表单规则
const rules = reactive<FormRules>({
    roleName: [
        { required: true, message: 'Please input角色名称', trigger: 'blur' },
        { min: 3, max: 8, message: 'Length should be 3 to 8', trigger: 'blur' },
    ]
})
</script>

<style>
.el-message-icon--success {
    font-size: 20px !important;
}

.el-message-icon--error {
    font-size: 20px !important;
}
</style>
