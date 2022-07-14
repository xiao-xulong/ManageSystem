<template>
    <div>
        <el-dialog :model-value="dialogVisible" :title="title" width="30%" :close-on-click-modal="false"
            :show-close="false">
            <!-- 编辑用户表单 -->
            <el-form v-if="!d.AddDiglogShow" ref="ruleFormRef" :model="AlterRuleForm" label-width="80px"
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="AlterRuleForm.username" disabled />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="AlterRuleForm.email" />
                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="AlterRuleForm.mobile" />
                </el-form-item>
            </el-form>
            <!-- 添加用户表单 -->
            <el-form ref="AddRuleFormRef" v-if="d.AddDiglogShow" :model="AddRuleForm" :rules="rules" label-width="80px"
                class="demo-ruleForm">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="AddRuleForm.username" />
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="AddRuleForm.password" />
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input type="email" v-model="AddRuleForm.email" />

                </el-form-item>
                <el-form-item label="电话" prop="mobile">
                    <el-input v-model="AddRuleForm.mobile" />
                </el-form-item>
            </el-form>

            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="visibleChange"><span style="color: gray;">取消</span></el-button>
                    <el-button type="primary" @click="confirm">提交</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { reactive, ref, watch, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import { AlterUser, AddUser } from '../../http/req'
let d = defineProps({
    dialogVisible: {
        type: Boolean,

    },
    alterUserInfo: {
        type: Object,
        // default: '默认值',
    },
    AddDiglogShow: {
        type: Boolean
    }
})

watch(() => d.alterUserInfo, (n, o) => {
    // AddDiglogShow.value = true
    console.log(d.alterUserInfo)
    AlterRuleForm.value = d.alterUserInfo

})
watch(() => d.AddDiglogShow, (n, o) => {
    // AddDiglogShow.value = true
    if (n === true) {
        title.value = "添加用户"
    } else {
        title.value = "编辑用户"
    }

})
const title = ref('')
//添加用户表单的dom
const AddRuleFormRef = ref()
//编辑用户表单数据
const AlterRuleForm = ref()
//添加用户表单数据
let AddRuleForm = reactive({
    username: '',
    password: '',
    email: '',
    mobile: ''
})
// 自定义邮箱规则
const checkEmail = (rule: any, value: any, callback: any) => {
    const regEmail = /^\w+@\w+(\.\w+)+$/
    if (regEmail.test(value)) {
        // 合法邮箱
        return callback()
    }
    callback(new Error('请输入合法邮箱'))
}
// 自定义手机号规则
const checkMobile = (rule: any, value: any, callback: any) => {
    const regMobile = /^1[34578]\d{9}$/
    if (regMobile.test(value)) {
        return callback()
    }
    // 返回一个错误提示
    callback(new Error('请输入合法的手机号码'))
}

const rules = reactive<FormRules>({
    username: [
        { required: true, message: '请输入用户名', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ],
    password: [
        { required: true, message: '请输入密码', trigger: 'blur' },
        // { min: 3, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' }
    ],
    email: [
        { required: true, message: '请输入邮箱', trigger: 'blur' },
        { validator: checkEmail, trigger: 'blur' }
    ],
    mobile: [
        { required: true, message: '请输入手机号', trigger: 'blur' },
        { validator: checkMobile, trigger: 'blur' }
    ]
})



//向父组件传递信息
const emit = defineEmits<{ (e: 'visibleChange'): void, (e: 'addUserRefresh'): void }>();
//传递diglog显示消失布尔值
const visibleChange = function () {
    emit('visibleChange')
    console.log('visibleChange')

}
//提交修改用户信息或添加用户
const confirm = async function () {
    //如果是添加用户界面
    if (d.AddDiglogShow === true) {
        //添加用户验证
        AddRuleFormRef.value.validate(async (v: any) => {
            if (v === false) {
                return
            } else {
                const AddRes = (await AddUser(AddRuleForm)).data
                console.log(AddRes)
                ElMessage({
                    message: AddRes.meta.msg,
                    type: 'success',
                    duration: 3000
                })
                //重置表单
                AddRuleFormRef.value.resetFields()
                //重新调用查询用户方法
                emit('addUserRefresh')
                visibleChange()
            }
        })
        //是修改用户界面
    } else {
        const AlterRes = (await AlterUser(AlterRuleForm.value.id, { email: AlterRuleForm.value.email, mobile: AlterRuleForm.value.mobile })).data
        ElMessage({
            message: AlterRes.meta.msg,
            type: 'success',
            duration: 3000
        })
        visibleChange()
    }


}
</script>

<style  scoped>
</style>
