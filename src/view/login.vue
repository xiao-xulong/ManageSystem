<template>
    <aside></aside>
    <main>
        <el-card class="box-card">
            <el-form ref="ruleFormRef" :model="ruleForm" :rules="rules" :size="formSize">
                <el-form-item>
                    <div class="formTitle">登录</div>
                </el-form-item>
                <el-form-item prop="name">
                    <el-input v-model.trim="ruleForm.name" placeholder="用户名" />
                </el-form-item>
                <!-- 密码框 -->
                <el-form-item prop="pwd">
                    <el-input :type="PwdinputType" v-model.trim="ruleForm.pwd" placeholder="密码">
                        <!-- 密码输入框眼睛svg图标 -->

                        <template #suffix>
                            <svg @click="eyeChange" v-show="!PwdinputEye" t="1650711313739" class="svg"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8204">
                                <path
                                    d="M972 366.8h-52.8c-20.8 39.7-46.6 76.1-77.1 108.7-42.9 45.9-92.8 82-148.4 107.2C636.2 608.7 575 622 512 622s-124.2-13.2-181.7-39.3c-55.6-25.2-105.5-61.2-148.4-107.2-30.5-32.6-56.2-69-77.1-108.7H52c28.1 60.5 66.4 114.7 112.4 160L76.8 638.5l35.8 32.1 87.5-111.7c34.9 28.6 73.3 52.5 114.5 70.9L268 766.7l43.9 17.1 46.5-136.9c41.4 13.9 85.1 22.3 130.2 24.4v145.8h46.7V671.4c45.2-2.2 88.8-10.6 130.2-24.4L712 783.9l43.9-17.1-46.5-136.9c41.1-18.4 79.6-42.3 114.5-70.9l87.5 111.7 35.8-32.1-87.5-111.7c45.9-45.4 84.2-99.6 112.3-160.1z"
                                    fill="" p-id="8205"></path>
                            </svg>
                            <svg @click="eyeChange" v-show="PwdinputEye" t="1650711407953" class="svg"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="8360">
                                <path
                                    d="M858.9 438.1l119.2-142-38.3-32.1-119 141.8c-32.4-25.6-69-49.6-108.9-69.3l61.4-168.6-47-17.1L666 316.3c-40.7-15.5-84-26-129-28.9v-170h-50v170c-45.2 2.8-88.7 12.8-129.5 27.8l-59.8-164.4-47 17.1 60.7 166.8c-40.5 19.3-77.6 43.1-110.4 68.5L84.2 264l-38.3 32.1 116.8 139.2C93.7 498.1 52 564.1 52 596.6c0 72.3 205.9 310 460 310s460-250.1 460-310c0-27.3-42.7-93.9-113.1-158.5z m62.5 158.5c-2.5 7.4-11.2 25.4-32.7 53.2-24.4 31.5-57 64.5-91.7 92.7-42 34.1-86.2 61.3-131.4 80.6-51.8 22.2-103.5 33.5-153.6 33.5-51.4 0-104.1-11.1-156.6-33.1-46.1-19.3-90.7-46.1-132.5-79.8-35.2-28.4-67.3-61.2-90.5-92.4-22.6-30.4-29.4-49.1-30.3-54.7 0.9-5.6 7.7-24.3 30.3-54.7 23.2-31.2 55.4-64 90.5-92.4 41.8-33.7 86.4-60.6 132.5-79.8 52.5-21.9 105.2-33.1 156.6-33.1 50.2 0 101.9 11.3 153.6 33.5 45.2 19.4 89.4 46.5 131.4 80.6 34.8 28.3 67.3 61.2 91.7 92.7 21.5 27.8 30.2 45.9 32.7 53.2zM626 510v-93.4c-32.8-21.3-72-33.6-114-33.6-116 0-210 94-210 210s94 210 210 210 210-94 210-210c0-29.5-6.1-57.5-17.1-83H626z m-0.9 196.1C594.9 736.4 554.7 753 512 753s-82.9-16.6-113.1-46.9C368.6 675.9 352 635.7 352 593s16.6-82.9 46.9-113.1C429.1 449.7 469.3 433 512 433c22.2 0 43.9 4.6 64 13.3V560h92.6c2.3 10.8 3.4 21.8 3.4 33 0 42.7-16.6 82.9-46.9 113.1z"
                                    fill="" p-id="8361">
                                </path>
                            </svg>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="UserAgree">
                    <el-checkbox v-model="ruleForm.checked">已阅读并同意用户协议 和 隐私政策</el-checkbox>
                </el-form-item>
                <el-form-item>
                    <el-button @click="submit(ruleFormRef)" style="color: white !important;">登录</el-button>

                </el-form-item>
            </el-form>
        </el-card>
    </main>
</template>

<script setup lang='ts'>
import { menus } from '../../http/req'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import { onMounted, ref, reactive, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import type { FormInstance, FormRules } from 'element-plus'

import { login } from '../../http/req'
import { Interface } from 'readline'
const { proxy } = getCurrentInstance() as any

const store = useStore()
const router = useRouter()
const menuList = ref([] as any)
const menuListSave = ref([] as any)
const menuInit = async () => {
    menuList.value = (await menus()).data.data
    console.log('menuList.value')
    // sessionStorage.setItem('routes', JSON.stringify(menuList.value))
    console.log(menuList.value)
}

const formSize = ref('default')
const ruleFormRef = ref<FormInstance>()
const ruleForm = reactive({
    name: 'admin',
    pwd: '123456',
    checked: ''

})
const PwdinputType = ref('password')
let PwdinputEye = ref<boolean>(false)

//法则
const rules = reactive<FormRules>({
    name: [
        { required: true, message: '用户名不得为空', trigger: 'blur' },
        { min: 5, max: 5, message: '长度不得小于或大于5', trigger: 'blur' },
    ],
    pwd: [
        { required: true, message: '密码不得为空', trigger: 'blur' },
        { min: 3, max: 10, message: '长度不得小于3或大于6', trigger: 'blur' },
    ]
})
//密码框明文密文转换
const eyeChange = function () {
    PwdinputEye.value = !PwdinputEye.value
    if (PwdinputType.value == 'password') {
        PwdinputType.value = 'text'
    } else {
        PwdinputType.value = 'password'
    }
}


//登录验证发送请求
const submit = async (formEl: FormInstance | undefined) => {
    if (!formEl) return
    await formEl.validate(async (valid, fields) => {
        if (valid) {
            const loadDom = proxy.$Loading();

            // console.log(proxy.$Loading())
            //登录请求
            const res = (await login({
                username: ruleForm.name,
                password: ruleForm.pwd
            })).data

            //存储token
            sessionStorage.setItem('token', res.data.token)
            if (res.meta.status == 200) {
                await menuInit()
                //获取路由信息集合存储
                menuList.value.forEach((item: any) => {
                    item.children.forEach((c: any) => {
                        menuListSave.value.push({ name: c.path, path: c.path, compoent: "../view/home_childs/" + c.path + '.vue', meta: { title: `${c.authName}` } })
                    });

                });
                menuListSave.value.push({ name: 'addGood', path: 'addGood', compoent: "../view/home_childs/" + 'addGood' + '.vue', meta: { title: '添加商品' } })

                sessionStorage.setItem('rc', JSON.stringify(menuListSave.value))

                ElMessage({
                    message: res.meta.msg,
                    type: 'success',
                })

                router.push('/')
                loadDom.close()
                //存储完毕弹框并跳转

            } else {
                loadDom.close()
                ElMessage.error(res.meta.msg)
            }

        }
    })
}

</script>
<style>
.el-icon {
    font-size: 20px !important;
}
</style>
<style scoped lang="less">
:root {}

aside {
    display: inline-block;
    background-image: url('https://cdn.web-global.fds.api.mi-img.com/mcfe--mi-account/static/static/media/banner.5b1efcd8.jpg');
    background-repeat: no-repeat;
    background-size: cover;
    width: 25%;
    height: 100%;
    color: #f9f9f9;
    vertical-align: middle;
}

//右侧渐变色DIV样式  
main {
    display: inline-block;
    height: 100%;
    width: 75%;
    background: -moz-linear-gradient(left, #dee6e5, #b0d9e4, #bcc6e8);
    background: -webkit-linear-gradient(left, #dee6e5, #b0d9e4, #bcc6e8);
    background: -ms-linear-gradient(left, #dee6e5, #b0d9e4, #bcc6e8);
    background: linear-gradient(left, #dee6e5, #b0d9e4, #bcc6e8);
    -ms-filter: "progid:DXImageTransform.Microsoft.gradient (GradientType=1, startColorstr=#dee6e5, endColorstr=#bcc6e8)";
    vertical-align: middle;

    .box-card {
        width: 520px;
        height: 600px;
        position: relative;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);

        //表单样式  
        :deep(.el-form) {
            width: 80%;
            position: relative;
            left: 50%;
            transform: translateX(-50%);

            .el-form-item--default {
                margin-bottom: 30px !important;
            }

            //表单名字
            .formTitle {
                border-radius: 4px;
                text-align: center;
                height: 50px;
                border-bottom: solid 5px #ff5c00;
                font-size: 26px;
                font-weight: 600;
                letter-spacing: 3px;
                line-height: 50px;
            }

            //输入框样式  
            .el-input {
                .el-input__inner {
                    background-color: #f9f9f9 !important;
                    padding-left: 25px;
                    height: 60px !important;
                    font-size: 20px;


                }

                //  icon图片样式
                .svg {
                    width: 22px;
                    height: auto;
                }
            }

            //错误提示
            .el-form-item__error {

                font-size: 15px !important;
            }

            //多选框样式  
            .el-checkbox__label {
                font-size: 16px !important;
            }

            //按钮样式       
            .el-button {
                width: 100%;
                height: 60px;
                background-color: #ffcba9;
                font-size: 22px;
            }
        }
    }
}
</style>