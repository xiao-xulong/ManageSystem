<template>
    <div>
        <el-card class="box-card">
            <el-alert center show-icon title="info alert" type="info" />
            <div class="stepBox">
                <el-steps :active="activeTab - 0" finish-status="success">
                    <el-step v-for="item in steps" :title="item.title" />
                </el-steps>
            </div>
            <el-tabs :before-leave="tabChange" v-model="activeTab" tab-position="left" class="demo-tabs">
                <el-tab-pane label="基本信息" name="0">
                    <el-form label-position="top" ref="baseInfoRuleFormRef" :model="baseInfoForm"
                        :rules="baseInfoFormRules" label-width="200px" class="demo-ruleForm" status-icon>
                        <el-form-item label="商品名称" prop="goodName">
                            <el-input v-model="baseInfoForm.goodName" />
                        </el-form-item>
                        <el-form-item label="商品价格" prop="goodPrice">
                            <el-input v-model="baseInfoForm.goodPrice" />
                        </el-form-item>
                        <el-form-item label="商品重量" prop="goodWeight">
                            <el-input v-model="baseInfoForm.goodWeight" />
                        </el-form-item>
                        <el-form-item label="商品数量" prop="goodNum">
                            <el-input v-model="baseInfoForm.goodNum" />
                        </el-form-item>
                        <el-form-item label="商品分类" prop="goodCate">

                            <el-cascader v-model="baseInfoForm.goodCate" :options="options" :props="props"
                                @change="handleChange" />
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="商品参数" name="1">
                    <div v-for="item in attr">
                        <p style="margin-top:20px ;margin-bottom: 20px;"> {{ item.attr_name }}</p>
                        <el-checkbox-group v-model="item.attr_vals" size="small">

                            <el-checkbox v-for="val in item.attr_vals" :label="val" border />
                        </el-checkbox-group>
                    </div>

                </el-tab-pane>
                <el-tab-pane label="商品属性" name="2">
                    <el-form label-width="120px" label-position="top">
                        <el-form-item v-for="item in property" :label="item.attr_name">
                            <el-input v-model="item.attr_vals" />
                        </el-form-item>
                    </el-form>
                </el-tab-pane>
                <el-tab-pane label="商品图片" name="3">
                    <el-upload v-model:file-list="fileList" class="upload-demo"
                        action="http://175.27.228.178:3434/api/private/v1/upload" :on-preview="handlePreview"
                        list-type="picture-card" :headers="uploadHeader" :on-success="sucUpload" :on-remove="delUpload">
                        点击上传

                    </el-upload>
                </el-tab-pane>
                <el-tab-pane label="商品内容" name="4">
                    <div style="border: 1px solid #ccc" class="Editor">
                        <Toolbar style="border-bottom: 1px solid #ccc" :editor="editorRef"
                            :defaultConfig="toolbarConfig" mode="default" />
                        <Editor style="height: 500px; overflow-y: hidden;" v-model="valueHtml"
                            :defaultConfig="editorConfig" mode="default" @onCreated="handleCreated" />
                    </div>
                    <el-button type="primary" @click="addGood">添加商品</el-button>
                </el-tab-pane>


            </el-tabs>

        </el-card>
        <el-dialog v-model="dialogVisible">
            <img style="width:100% ;" :src="dialogImageUrl" alt="Preview Image" />
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, onBeforeUnmount, ref, shallowRef } from 'vue'
import { FormInstance, FormRules, ElMessage, ElMessageBox } from 'element-plus'
import '@wangeditor/editor/dist/css/style.css'
import { getAttributes, getCategories, postGoods, uploadPic } from '../../../http/req';
import type { UploadProps, UploadUserFile, Action } from 'element-plus'
import { Editor, Toolbar } from '@wangeditor/editor-for-vue'
//步骤条信息
const steps = ref([{ title: '基本信息' }, { title: '商品参数' }, { title: '商品属性' }, { title: '商品图片' }, { title: '商品内容' }, { title: '完成' }])
//选中的tab面板名称
const activeTab = ref<any>('0')
const baseInfoRuleFormRef = ref()
//基本信息表单信息
const baseInfoForm = reactive({
    goodName: 'snow',
    goodPrice: '',
    goodWeight: '',
    goodNum: '',
    goodCate: [],

})
//基本信息表单规则
const baseInfoFormRules = reactive<FormRules>({
    goodName: [
        { required: true, message: '不得为空', trigger: 'blur' },
        { min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur' },
    ],
    goodPrice: [
        { required: true, message: '不得为空', trigger: 'blur' },
        { min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur' },
    ],
    goodWeight: [
        { required: true, message: '不得为空', trigger: 'blur' },
        { min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur' },
    ],
    goodNum: [
        { required: true, message: '不得为空', trigger: 'blur' },
        { min: 1, max: 10, message: 'Length should be 1 to 10', trigger: 'blur' },
    ],
    goodCate: [
        { required: true, message: '不得为空', trigger: 'blur' }
    ]
})
const options = ref()
const props = {
    value: 'cat_id',
    label: 'cat_name',
    children: 'children'
}
onMounted(async () => {
    const r = await getCategories('', '', '')
    console.log(r.data.data)
    options.value = r.data.data
})
//面板切换
const tabChange = async function (n: any, old: any) {
    console.log(property.value)
    if (Number(n) > 0) {
        const r = await baseInfoRuleFormRef.value.validate()
        //通过验证后获取后几个面板所需的数据
        if (r === true) {
            const r1 = await getAttributes(baseInfoForm.goodCate[baseInfoForm.goodCate.length - 1], 'many')
            r1.data.data.forEach((item: any) => {
                if (item.attr_vals != "") {
                    let newAttr_val = item.attr_vals.split(',')
                    item.attr_vals = newAttr_val
                }
            });
            attr.value = r1.data.data
            const r2 = await getAttributes(baseInfoForm.goodCate[baseInfoForm.goodCate.length - 1], 'only')
            console.log(r.data)
            property.value = r2.data.data
        }
        return r
    }
    else if (Number(n) < Number(old)) {
        return true
    }
    else {
        return false
    }

}
//级联选择器改变时
const handleChange = function () {
    if (baseInfoForm.goodCate.length != 3) {
        baseInfoForm.goodCate = []
    }
}
//动态参数
const attr = ref()
//静态属性
const property = ref()

const allAttr = ref([]) as any
//图片列表
const fileList = ref<UploadUserFile[]>([

])
//删除上传的图片
const delUpload: UploadProps['onRemove'] = (uploadFile, uploadFiles) => {
    console.log(uploadFiles)
}
//预览弹窗
const handlePreview: UploadProps['onPreview'] = (uploadFile) => {
    dialogImageUrl.value = uploadFile.url!
    dialogVisible.value = true
}
//图片上传成功
const sucUpload = function (response: any, uploadFile: any) {
    pics.push({ pic: response.data.tmp_path })
}
const pics = reactive([])
const uploadHeader = { Authorization: sessionStorage.getItem('token') }
const dialogImageUrl = ref('')
const dialogVisible = ref(false)
//添加商品
const addGood = async function () {
    // 静动态参数数据处理
    attr.value.forEach((item: any) => {
        let a = { attr_id: item.attr_id, attr_value: item.attr_vals.toString() }
        allAttr.value.push(a)
    });
    property.value.forEach((item: any) => {
        let a = { attr_id: item.attr_id, attr_value: item.attr_vals }
        allAttr.value.push(a)
    });
    let params = {
        goods_name: baseInfoForm.goodName,
        goods_cat: baseInfoForm.goodCate.toString(),
        goods_price: Number(baseInfoForm.goodPrice),
        goods_number: Number(baseInfoForm.goodNum),
        goods_weight: Number(baseInfoForm.goodWeight),
        goods_introduce: valueHtml.value,
        pics: pics,
        attrs: allAttr.value
    }
    // const r = await postGoods(params)
    console.log(params)
    ElMessageBox.alert('后端接口有问题 无法添加商品', '提示', {
        // if you want to disable its autofocus
        // autofocus: false,
        confirmButtonText: 'OK'
    })
}
const editorRef = shallowRef()

// 富文本内容 HTML
const valueHtml = ref('')
const toolbarConfig = {}
const editorConfig = { placeholder: '请输入内容...' }

// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
    const editor = editorRef.value
    if (editor == null) return
    editor.destroy()
})
const handleCreated = (editor: any) => {
    editorRef.value = editor // 记录 editor 实例，重要！
}

</script>

<style  scoped lang="less">
:deep(.el-steps) {
    width: 80%;
}

:deep(.el-tabs) {
    height: 800px !important;

    .el-tabs__item {
        height: 60px;
        font-size: 20px;
        line-height: 60px;
    }
}

//步骤条
.stepBox {
    display: flex;
    justify-content: center;
}

:deep(.el-form) {
    margin-top: 20px;
}

:deep(.el-input) {
    margin-bottom: 10px;

    .el-input__inner {
        height: 42px;
    }
}

//富文本
.Editor {
    height: 500px;
    margin-top: 20px;
    margin-bottom: 20px;
    overflow: hidden;
}
</style>
