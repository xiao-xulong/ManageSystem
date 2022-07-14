<template>
    <div>
        <el-card class="box-card">
            <el-input v-model="query" @input="SearchClear" placeholder="Please input" class="input-with-select">
                <template #append>
                    <el-button :icon="Search" @click="tableQuery" />
                </template>
            </el-input>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="#" width="80" />
                <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label">
                    <template #default="scope">
                        <!-- 付款状态 -->
                        <div v-if="item.prop === 'pay_status'">
                            <el-tag class="ml-2" type="danger" v-show="scope.row.pay_status === '0'">未付款</el-tag>
                        </div>
                        <!-- 操作栏 -->
                        <div v-if="item.prop === 'work'">
                            <el-button type="primary" :icon="Edit" @click="editAddress" />
                            <el-button type="success" :icon="AddLocation" @click="seeFastMail(scope.row)" />
                        </div>
                        <!-- 时间栏 -->
                        <div v-if="item.prop === 'create_time'">
                            {{ proxy.$dayjs(scope.row.create_time).format('YYYY-MM-DD HH:mm:ss') }}
                        </div>

                    </template>
                </el-table-column>

            </el-table>
            <!-- 分页器 -->
            <div class="paginationBox">
                <el-pagination v-model:currentPage="PageNum" v-model:page-size="pageSize" :page-sizes="[1, 5, 10, 20]"
                    layout="total, sizes, prev, pager, next, jumper" :total="total" @size-change="handleSizeChange"
                    @current-change="handleCurrentChange" />
            </div>
        </el-card>
    </div>
    <!-- 修改地址弹框 -->
    <el-dialog v-model="editDialogVisible" title="修改地址" width="30%" :close-on-click-modal="false">
        <el-form :model="editAddressForm" label-width="120px">
            <el-form-item label="省/市/区">
                <el-cascader v-model="editAddressForm.address" :props="props" :options="citys" />
            </el-form-item>
            <el-form-item label="详细地址" prop="detail">
                <el-input v-model="editAddressForm.detail" />
            </el-form-item>
        </el-form>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="editDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="editDialogVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>

    <!-- 快递信息弹框 -->
    <el-dialog v-model="fastMailDialogVisible" title="快递信息" width="30%" :close-on-click-modal="false">
        <el-timeline>
            <el-timeline-item v-for="(activity, index) in fastMailInfo" :key="index" :timestamp="activity.time">
                {{ activity.context }}
            </el-timeline-item>
        </el-timeline>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="fastMailDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="fastMailDialogVisible = false">确定</el-button>
            </span>
        </template>
    </el-dialog>

</template>

<script setup lang='ts'>
import { Search, Edit, AddLocation } from '@element-plus/icons-vue'
import { getCurrentInstance, onMounted, reactive, ref } from 'vue';
import { getKuaidi, getOrders } from '../../../http/req';
import type { FormInstance, FormRules } from 'element-plus'
import { citys } from '../../static/citys'
const { proxy } = getCurrentInstance() as any
//表格信息
const total = ref()
const pageSize = ref(5)
const PageNum = ref(1)
//查询信息
const query = ref('')
//弹框显现
const editDialogVisible = ref(false)
const fastMailDialogVisible = ref(false)
onMounted(() => {
    orders()
})
//表格数据源
const tableData = ref()
//表格栏信息
const columns = ref([{ prop: 'order_number', label: '订单编号' }, { prop: 'order_price', label: '订单价格' }, { prop: 'pay_status', label: '是否付款' },
{ prop: 'is_send', label: '是否发货' }, { prop: 'create_time', label: '下单时间' }, { prop: 'work', label: '操作' }])
//获取表格信息
const orders = async function () {
    let params = {
        query: query.value,
        pagenum: PageNum.value,
        pagesize: pageSize.value,
        user_id: "",
        pay_status: "",
        is_send: "",
        order_fapiao_title: "",
        order_fapiao_company: "",
        order_fapiao_content: "",
        consignee_addr: ""

    }
    const r = await getOrders(params)
    tableData.value = r.data.data.goods
    total.value = r.data.data.total
}
//分页器每页条数改变时触发
const handleSizeChange = function () {
    orders()
}
//分页器当前页改变时触发
const handleCurrentChange = function () {
    orders()
}

const SearchClear = function () {
    // if (query.value = "") {
    //     orders()
    // }
}
const tableQuery = function () {
    console.log(query.value)
    orders()
}
//修改地址按钮
const editAddress = function () {
    editDialogVisible.value = true
}
//修改地址表单
const editAddressForm = reactive({
    detail: '',
    address: []
})
//修改地址表单规则
const rules = reactive<FormRules>({
    detail: [
        { required: true, message: '不得为空', trigger: 'blur' },
        { min: 1, max: 100, message: 'Length should be 3 to 5', trigger: 'blur' },
    ],
    address: [
        { required: true, message: 'Please input Activity name', trigger: 'blur' }
    ]
})
//级联选择器配置信息
const props = {
    value: 'value',
    label: "label",
    children: "children"
}
//快递信息
const fastMailInfo = ref()
//查看快递信息
const seeFastMail = async function (i: any) {
    fastMailDialogVisible.value = true
    console.log(i.order_id)
    const r = await getKuaidi(1106975712662)
    console.log(r)
    fastMailInfo.value = r.data
}
</script>

<style  scoped lang="less">
.input-with-select {
    width: 500px;
    /* height: 50px; */
    vertical-align: middle;
    margin-right: 15px;

    :deep(.el-input__inner) {
        height: 40px;
    }
}

:deep(.el-table) {
    margin-top: 10px;
}

.paginationBox {
    margin-top: 10px;
    display: flex;
    justify-content: center;
}
</style>
