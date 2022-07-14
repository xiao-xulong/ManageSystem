<template>
    <div>
        <el-card class="box-card">
            <el-alert title="注意： 只允许为第三级分类设置相关参数" type="warning" show-icon />
            <span style="font-size:18px; margin-right: 30px;">选择商品分类:</span>
            <el-cascader class="cascader" v-model="value" :options="options" :props="props" @change="handleChange" />
            <el-tabs v-model="activeName" class="tabs" @tab-click="handleClick">
                <el-tab-pane label="动态参数" name="many">
                    <el-button type="primary" :disabled="btnDisabled" class="addBtn" @click="add">添加参数</el-button>
                    <el-table :data="actAttr" border style="width: 100%" row-key="attr_id">
                        <el-table-column type="expand" width="120">
                            <template v-slot="scope">
                                <el-tag v-for="(item, index) in scope.row.attr_vals" closable
                                    @close="tagClose(index, scope.row)">
                                    {{ item }}
                                </el-tag>
                                <!-- <template #default="props"> -->
                                <el-input v-if="scope.row.inputVisible" ref="InputRef" v-model="scope.row.inputValue"
                                    class="tagInput" @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button v-else class="button-new-tag ml-1" size="small"
                                    @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                                <!-- </template> -->
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#" width="180" />
                        <el-table-column prop="attr_name" label="参数名称" />
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" :icon="Edit" @click="edit(scope.row)">编辑</el-button>
                                <el-button type="danger" :icon="Delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>
                <el-tab-pane label="静态属性" name="only">
                    <el-button type="primary" :disabled="btnDisabled" class="addBtn" @click="add">添加属性</el-button>
                    <el-table :data="staticAttr" border style="width: 100%" row-key="attr_id">
                        <el-table-column type="expand" width="120">
                            <template v-slot="scope">
                                <!-- <template #default="props"> -->
                                <el-tag v-for="item in scope.row.attr_vals" closable @close="tagClose(item, scope.row)">
                                    {{ item
                                    }}</el-tag>
                                <el-input v-show="scope.row.inputVisible" ref="InputRef" v-model="scope.row.inputValue"
                                    class="tagInput" @keyup.enter="handleInputConfirm(scope.row)"
                                    @blur="handleInputConfirm(scope.row)" />
                                <el-button v-show="!scope.row.inputVisible" class="button-new-tag" size="small"
                                    @click="showInput(scope.row)">
                                    + New Tag
                                </el-button>
                                <!-- </template> -->
                            </template>
                        </el-table-column>
                        <el-table-column type="index" label="#" width="180" />
                        <el-table-column prop="attr_name" label="参数名称" />
                        <el-table-column label="操作">
                            <template v-slot="scope">
                                <el-button type="primary" :icon="Edit" @click="edit(scope.row)">编辑</el-button>
                                <el-button type="danger" :icon="Delete">删除</el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-tab-pane>

            </el-tabs>
        </el-card>
    </div>

    <el-dialog v-model="editDialogVisible" title="编辑属性" width="30%">
        <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" label-width="100px" class="demo-ruleForm"
            status-icon>
            <el-form-item label="属性名字" prop="attr_name">
                <el-input v-model="ruleForm.attr_name" />
            </el-form-item>
            <el-form-item label="参数" prop="attr_vals">
                <el-input v-model="ruleForm.attr_vals" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitEdit">确定</el-button>
            </span>
        </template>
    </el-dialog>


    <el-dialog v-model="addDialogVisible" title="编辑属性" width="30%">
        <el-form ref="addFormRef" :model="addForm" :rules="addFormRules" label-width="100px" class="demo-ruleForm"
            status-icon>
            <el-form-item label="属性名字" prop="attr_name">
                <el-input v-model="addForm.attr_name" />
            </el-form-item>
            <el-form-item label="参数" prop="attr_vals">
                <el-input v-model="addForm.attr_vals" />
            </el-form-item>

        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="submitAdd">确定</el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup lang='ts'>
import { onMounted, ref, nextTick, reactive } from 'vue';
import { getCategories, getAttributes, postAttributes, addAttributes } from '../../../http/req'
import { ElNotification } from 'element-plus'
import type { TabsPaneContext } from 'element-plus'
import { ElInput } from 'element-plus'
import type { FormInstance, FormRules } from 'element-plus'
import {
    Delete,
    Edit,

} from '@element-plus/icons-vue'
onMounted(async () => {
    let r = await getCategories(3, '', '')
    console.log('r.data.data')
    console.log(r.data.data)
    options.value = r.data.data
})
//级联选择器参数
const props = {
    label: 'cat_name',
    value: 'cat_id',
    expandTrigger: 'hover',
}
//级联选择器数据源
const options = ref([])
//级联选择器选中值
const value = ref()
//当绑定值变化时触发的事件
const handleChange = function () {
    console.log(value.value)
    if (value.value.length != 3) {
        value.value = []
        ElNotification({
            title: '提示',
            message: "只允许为第三级分类设置相关参数",
        })
        btnDisabled.value = true
        actAttr.value = []
        staticAttr.value = []
    } else {
        attributes()
        btnDisabled.value = false
    }

}
const btnDisabled = ref(true)
//获取参数数据
const attributes = async function () {
    const r = await getAttributes(value.value[value.value.length - 1], activeName.value)
    r.data.data.forEach((item: any) => {
        item.inputValue = ref('')
        item.inputVisible = ref(false)

        if (item.attr_vals != '') {
            const chars = item.attr_vals.split(',');
            item.attr_vals = chars
            attrVals.value = chars
            // console.log('chars');
            // console.log(chars);
        }

    });
    if (activeName.value === 'many') {
        actAttr.value = r.data.data
    } else {
        staticAttr.value = r.data.data
    }
    console.log('r')
    console.log(r.data)
}
//标签页选择器选中值
const activeName = ref('many')
//tab 被选中时触发
const handleClick = async (tab: TabsPaneContext, event: Event) => {
    if (btnDisabled.value === false) {
        attributes()
    }
    console.log(tab, event)

}
//动态属性表格数据源
const actAttr = ref()
//静态属性表格数据源
const staticAttr = ref()

const InputRef = ref<InstanceType<typeof ElInput>>()

const showInput = (rowInfo: any) => {
    rowInfo.inputVisible = true
    nextTick(() => {
        InputRef.value!.input!.focus()
    })
}
//标签数据
const attrVals = ref([] as any)
//添加新标签
const handleInputConfirm = async function (rowInfo: any) {
    if (rowInfo.inputValue) {
        attrVals.value.push(rowInfo.inputValue)
        // console.log(attrVals.value.toString())
        const r = await postAttributes(rowInfo.cat_id, rowInfo.attr_name, activeName.value, attrVals.value.toString(), rowInfo.attr_id)
        console.log(r.data)
        rowInfo = r.data.data
        rowInfo.inputVisible = false
    } else {
        const r = await postAttributes(rowInfo.cat_id, rowInfo.attr_name, activeName.value, attrVals.value.toString(), rowInfo.attr_id)
        rowInfo = r.data.data
        rowInfo.inputVisible = false
    }


    console.log(rowInfo)
}
const tagClose = function (i: any, rowInfo: any) {
    console.log(i)
    attrVals.value.splice(i, 1)
    console.log(rowInfo)
    handleInputConfirm(rowInfo)
}


const editDialogVisible = ref(false)
const edit = function (i: any) {
    ruleFormRef.value?.resetFields()
    if (i.attr_id) {
        console.log(i)
        ruleForm.attr_name = i.attr_name
        ruleForm.attr_vals = i.attr_vals.toString()
        ruleForm.attr_id = i.attr_id
        ruleForm.attr_sel = i.attr_sel
        ruleForm.cat_id = i.cat_id
    } else {

        ruleForm.attr_id = value.value[value.value.length - 1]
        ruleForm.attr_sel = activeName.value
    }
    editDialogVisible.value = true

}



const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    attr_name: '',
    attr_vals: "",
    attr_id: "",
    attr_sel: "",
    cat_id: ""
})

const rules = reactive<FormRules>({
    attr_name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },

    ]
})
const submitEdit = function () {
    ruleFormRef.value?.validate(async (r) => {
        if (r === true) {
            const r = await postAttributes(ruleForm.cat_id, ruleForm.attr_name, ruleForm.attr_sel, ruleForm.attr_vals, ruleForm.attr_id)
            console.log(r)
            attributes()
            editDialogVisible.value = false
        }
    })

}

const addFormRef = ref<FormInstance>()
const addDialogVisible = ref(false)
const addForm = reactive({
    attr_name: '',
    attr_vals: "",
    attr_sel: "",
    cat_id: ""
})
const addFormRules = reactive<FormRules>({
    attr_name: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' },

    ]
})
const add = function () {
    addFormRef.value?.resetFields()
    addForm.cat_id = value.value[value.value.length - 1]
    addForm.attr_sel = activeName.value
    addDialogVisible.value = true
}
const submitAdd = function () {

    addFormRef.value?.validate(async (r) => {
        if (r === true) {
            const r = await addAttributes(addForm.cat_id, addForm.attr_name, addForm.attr_sel, addForm.attr_vals)
            console.log(r)
            attributes()
            addDialogVisible.value = false

        }
    })
}
//ref prop
</script>

<style  scoped>
:deep(.el-cascader) {
    margin-top: 15px;
}

.addBtn {
    margin-bottom: 20px;
}

.tagInput {
    width: 150px !important;
    margin-left: 10px;
}

.button-new-tag {
    margin-left: 10px;
}

:deep(.el-tag) {
    margin-left: 10px;
}
</style>
