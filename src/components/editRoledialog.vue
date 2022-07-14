<template>
    <div>
        <el-dialog v-model="visible" title="编辑角色" width="30%" :close-on-click-modal="false">
            <el-form :rules="rules" ref="ruleFormRef" :model="form" label-width="80px">
                <el-form-item label="角色名称" prop="roleName">
                    <el-input v-model="form.roleName" />
                </el-form-item>
                <el-form-item label="角色描述" prop="roleDesc">
                    <el-input v-model="form.roleDesc" />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="cancel(0)">取消</el-button>
                    <el-button type="primary" @click="submit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref, watch } from 'vue'
import type { FormInstance, FormRules } from 'element-plus'
import { editRole } from '../../http/req';

const ruleFormRef = ref()
let d = defineProps({
    visible: {
        type: Boolean

    },
    info: {
        default: {
            id: "",
            roleName: "",
            roleDesc: ""
        },

    }
})

const emit = defineEmits(['cancel']);
const cancel = function (state: any) {
    emit('cancel', state)
}

watch(() => d.info.roleName, (n, o) => {
    // AddDiglogShow.value = true

    form.roleName = d.info.roleName
    form.roleDesc = d.info.roleDesc

})
const submit = function () {
    ruleFormRef.value.validate(async (r: any) => {
        if (r === true) {
            const r = await editRole(d.info.id, form.roleName, form.roleDesc)
            console.log(r)
            cancel(1)
        }
    })
}

const form = reactive({
    roleName: '',
    roleDesc: '',

})
const rules = reactive<FormRules>({
    roleName: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' }
    ],
    roleDesc: [
        { required: false, trigger: 'blur' }
    ],
})
</script>

<style  scoped>
</style>
