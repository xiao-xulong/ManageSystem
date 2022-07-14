<template>
    <div>
        <el-dialog v-model="categoriesDialogVisible" title="添加分类" width="30%" :close-on-click-modal="false"
            @close="diaC" :show-close="false">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="80px" class="demo-ruleForm"
                status-icon>
                <el-form-item label="分类名称" prop="name">
                    <el-input v-model="ruleForm.name" />
                </el-form-item>
                <el-form-item label="父级分类" prop="fatherCat">
                    <el-cascader v-model="ruleForm.fatherCat" :options="options" :props="props" clearable />
                </el-form-item>
            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="categoriesDialogCancel(0)" style="color: gray!important;">取消</el-button>
                    <el-button type="primary" @click="addCategories">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import type { FormInstance, FormRules } from 'element-plus'
import { getCategories, postCategories } from '../../http/req'
import { onMounted, reactive, ref } from 'vue';
import { ElMessage } from 'element-plus'
let p = defineProps(['categoriesDialogVisible'])
const emit = defineEmits(['categoriesDialogCancel'])
const categoriesDialogCancel = function (status: any) {
    emit('categoriesDialogCancel', status)
}
onMounted(() => {
    getOptions()
})
//表单参数
const ruleForm = reactive({ name: '', fatherCat: [] })
const ruleFormRef = ref()
const rules = reactive<FormRules>({
    name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },
        { min: 1, max: 5, message: 'Length should be 3 to 5', trigger: 'blur' },
    ]
})
//级联选择器参数
const props = {
    label: 'cat_name',
    value: 'cat_id',
    checkStrictly: true
}
//级联选择器数据源
const options = ref([])
//获取级联选择器数据源
const getOptions = async function () {
    let r = await getCategories(2, '', '')
    console.log(2)
    console.log(r.data.data)
    options.value = r.data.data
}
const diaC = function () {
    console.log(ruleForm)
    ruleFormRef.value.resetFields()
}

//添加分类方法需要的各参数
//分类父 ID
const cat_pid = ref()
//分类名称
const cat_name = ref()
//分类层级
const cat_level = ref()

const addCategories = function () {
    ruleFormRef.value.validate(async (state: any) => {
        if (state === true) {
            if (ruleForm.fatherCat.length === 0) {
                cat_pid.value = 0
            } else {
                cat_pid.value = ruleForm.fatherCat[ruleForm.fatherCat.length - 1]
            }
            cat_name.value = ruleForm.name
            cat_level.value = ruleForm.fatherCat.length
            const r = await postCategories(cat_pid.value, cat_name.value, cat_level.value)
            console.log(r.data)
            if (r.data.meta.status === 201) {
                ElMessage({
                    message: r.data.meta.msg,
                    type: 'success',
                })
                await getOptions()
                categoriesDialogCancel(1)
            } else {
                ElMessage.error(r.data.meta.msg)
                categoriesDialogCancel(0)
            }

        }
    })


}

</script>

<style  scoped>
:deep(.el-cascader) {
    width: 100%;
}
</style>
