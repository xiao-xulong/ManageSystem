<template>
    <div>
        <el-card class="box-card">
            <el-button type="primary" @click="categoriesDiglogShow">添加分类</el-button>

            <el-table :data="CategoriesInfo" style="width: 100%; margin-bottom: 20px" row-key="cat_id" border>
                <!-- 索引栏 -->
                <el-table-column type="index" align="center" width="80">
                    <template v-slot="scope">
                        {{ scope.row.index }}
                    </template>
                </el-table-column>

                <el-table-column v-for="item in tabColumns" :prop="item.prop" :label="item.label">
                    <template v-slot="scope">
                        <!-- 商品有效性栏 -->
                        <div v-if="item.prop === 'cat_deleted'">
                            <svg v-show="scope.row.cat_deleted === false" t="1656316309152" class="icon"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6637">
                                <path
                                    d="M514.048 59.392q93.184 0 174.592 35.328t142.336 96.768 96.256 143.36 35.328 175.104-35.328 175.616-96.256 143.872-142.336 96.768-174.592 35.328-175.104-35.328-142.848-96.768-96.256-143.872-35.328-175.616 35.328-175.104 96.256-143.36 142.848-96.768 175.104-35.328zM795.648 423.936q18.432-18.432 19.456-45.568t-17.408-45.568-45.056-17.92-45.056 18.944l-288.768 288.768-99.328-98.304q-18.432-18.432-45.056-18.944t-45.056 17.92-18.944 43.52 17.92 43.52l142.336 143.36q18.432 18.432 48.128 17.92t48.128-18.944l-4.096 4.096z"
                                    p-id="6638" fill="#1afa29"></path>
                            </svg>

                            <svg v-show="scope.row.cat_deleted === true" t="1656316259054" class="icon"
                                viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="3250">
                                <path
                                    d="M827.392 195.584q65.536 65.536 97.792 147.456t32.256 167.936-32.256 167.936-97.792 147.456-147.456 98.304-167.936 32.768-168.448-32.768-147.968-98.304-98.304-147.456-32.768-167.936 32.768-167.936 98.304-147.456 147.968-97.792 168.448-32.256 167.936 32.256 147.456 97.792zM720.896 715.776q21.504-21.504 18.944-49.152t-24.064-49.152l-107.52-107.52 107.52-107.52q21.504-21.504 24.064-49.152t-18.944-49.152-51.712-21.504-51.712 21.504l-107.52 106.496-104.448-104.448q-21.504-20.48-49.152-23.04t-49.152 17.92q-21.504 21.504-21.504 52.224t21.504 52.224l104.448 104.448-104.448 104.448q-21.504 21.504-21.504 51.712t21.504 51.712 49.152 18.944 49.152-24.064l104.448-104.448 107.52 107.52q21.504 21.504 51.712 21.504t51.712-21.504z"
                                    p-id="3251" fill="#d81e06"></path>
                            </svg>
                        </div>
                        <!-- 商品分类层级 -->
                        <div v-if="item.prop === 'cat_level'">
                            <el-tag v-show="scope.row.cat_level == 0">一级</el-tag>
                            <el-tag type="success" v-show="scope.row.cat_level == 1">二级</el-tag>
                            <el-tag type="warning" v-show="scope.row.cat_level == 2">三级</el-tag>
                        </div>
                        <!-- 操作栏 -->
                        <div v-if="item.prop === 'work'">
                            <el-button type="primary" :icon="Edit" @click="edit(scope.row)">编辑</el-button>
                            <el-button type="danger" :icon="Delete" @click="del(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!-- 分页器 -->
            <div class="example-pagination-block">
                <el-pagination :page-size="pagesize" :pager-count="11" layout="total,prev, pager, next, jumper, slot"
                    :total="total" @current-change="handleCurrentChange" v-model:currentPage="pagenum">
                </el-pagination>
            </div>
        </el-card>
        <categoriesDiglog :categoriesDialogVisible="categoriesDialogVisible"
            @categoriesDialogCancel="categoriesDialogCancel"></categoriesDiglog>
        <!-- 编辑分类弹框 -->
        <el-dialog v-model="dialogVisible" title="编辑分类" width="30%" :close-on-click-modal="false">
            <el-form :rules="rules" ref="ruleFormRef" :model="form" label-width="80px">
                <el-form-item label="分类名称" prop="catName">
                    <el-input v-model="form.catName" />
                </el-form-item>

            </el-form>
            <template #footer>
                <span class="dialog-footer">
                    <el-button @click="dialogVisible = false">取消</el-button>
                    <el-button type="primary" @click="submitEdit">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { onMounted, reactive, ref } from 'vue';
import { delCategories, editCategories, getCategories } from '../../../http/req'
import { Delete, Edit } from '@element-plus/icons-vue'
import categoriesDiglog from '../../components/categoriesDiglog.vue';
import type { FormInstance, FormRules } from 'element-plus'
import { ElMessage, ElMessageBox } from 'element-plus'
const ruleFormRef = ref()
const tabColumns = ref([{ prop: 'cat_name', label: '分类名称' }, { prop: 'cat_deleted', label: '是否有效' }, { prop: 'cat_level', label: '排序' }, { prop: 'work', label: '操作' }])
const CategoriesInfo = ref()
const index = ref(0)
//页面数
const pagenum = ref(1)
//页面数据数
const pagesize = ref(5)
//总数据数
const total = ref()
//页面数改变触发
const handleCurrentChange = async function () {
    index.value = 0
    await categoriesInfo()
}

//分类数据
const categoriesInfo = async function () {
    index.value = 0
    const r = await getCategories(3, pagenum.value, pagesize.value)
    // console.log(r)
    console.log(r.data.data)
    r.data.data.result.forEach((item: any) => {
        index.value++
        item.index = index.value
    });
    CategoriesInfo.value = r.data.data.result
    total.value = r.data.data.total

}
onMounted(async () => {
    await categoriesInfo()
})
//添加分类弹框
const categoriesDialogVisible = ref(false)
const categoriesDiglogShow = function () {
    categoriesDialogVisible.value = true
}
const categoriesDialogCancel = function (status: any) {
    if (status) {
        categoriesInfo()
    }
    categoriesDialogVisible.value = false
}
//编辑分类弹框
const dialogVisible = ref(false)
const edit = function (i: any) {
    console.log(i.cat_id)
    dialogVisible.value = true
    form.catName = i.cat_name
    form.catId = i.cat_id
}
const form = reactive({
    catName: '',
    catId: 0
})
const rules = reactive<FormRules>({
    catName: [
        { required: true, message: '不得为空', trigger: 'blur' }
    ]
})
//提交编辑分类
const submitEdit = async function () {
    ruleFormRef.value.validate(async (r: any) => {
        if (r === true) {
            const r = await editCategories(form.catId, form.catName)
            console.log(form.catId)
            dialogVisible.value = false
            categoriesInfo()
        }
    })

}
//删除分类
const del = function (i: any) {
    ElMessageBox.confirm(
        '确定删除？',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '关闭',
            type: 'warning',
        }
    )
        .then(async () => {
            await delCategories(i.cat_id)
            categoriesInfo()
        })

}
</script>

<style  scoped>
:deep(.el-button) {
    margin-bottom: 10px;
}

:deep(.el-pagination) {
    /* display: inline-block; */
    width: 600px;
    position: relative;
    left: 50%;
    transform: translateX(-50%);
}

.icon {
    width: 30px;
    height: 30px;
}
</style>
