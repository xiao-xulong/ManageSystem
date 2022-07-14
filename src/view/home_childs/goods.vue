<template>
    <div>
        <el-card class="box-card">
            <div class="mt-4">
                <el-input v-model="SearchInput" @input="SearchBack" placeholder="Please input"
                    class="input-with-select">
                    <template #append>
                        <el-button :icon="Search" @click="goodsInfo" />
                    </template>
                </el-input>
                <el-button type="primary" @click="goAddGoodPage">添加商品</el-button>
            </div>
            <el-table :data="tableData" border style="width: 100%">
                <el-table-column type="index" label="#" width="150" />
                <el-table-column v-for="item in columns" :prop="item.prop" :label="item.label">
                    <template #default="scope">
                        <div v-if="item.prop === 'work'">
                            <el-button type="primary" :icon="Edit" />
                            <el-button type="danger" @click="deleteGood(scope.row)" :icon="Delete" />
                        </div>
                        <div v-if="item.prop === 'add_time'">
                            {{ proxy.$dayjs(scope.row.add_time).format('YYYY-MM-DD HH:mm:ss') }}
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination class="paginationBox" v-model:currentPage="pageNum" v-model:page-size="pageSize"
                :page-sizes="[5, 10, 20, 30]" background layout="total, sizes, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { ref, onMounted, getCurrentInstance } from 'vue'
import { useRouter } from 'vue-router'
import { Search, Edit, Delete } from '@element-plus/icons-vue'
import { delGoods, getGoods } from '../../../http/req';
import { ElMessage, ElMessageBox } from 'element-plus'
const { proxy } = getCurrentInstance() as any
const router = useRouter()
const SearchInput = ref()
//表格数据源
const tableData = ref()
//页数
const pageNum = ref(1)
const pageSize = ref(5)
//总数据量
const total = ref()
const handleSizeChange = function () {
    goodsInfo()
}
const handleCurrentChange = function () {
    goodsInfo()
}
//行数据
const columns = ref([{ prop: 'goods_name', label: '商品名称' }, { prop: 'goods_price', label: '商品价格' }, { prop: 'goods_weight', label: '商品重量' }
    , { prop: 'add_time', label: '添加时间' }, { prop: 'work', label: '操作' }
])
onMounted(() => {
    goodsInfo()
})
const goodsInfo = async function () {
    const r = await getGoods(SearchInput.value, pageNum.value, pageSize.value)
    console.log(r.data)
    total.value = r.data.data.total
    tableData.value = r.data.data.goods
}
const SearchBack = function () {
    if (SearchInput.value == "") {
        goodsInfo()
    }
}
const goAddGoodPage = function () {
    router.push('/addGood')
}
const deleteGood = function (i: any) {
    ElMessageBox.confirm(
        '确定删除?',
        '警告',
        {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
        }
    )
        .then(async () => {
            const r = await delGoods(i.goods_id)
            console.log(r.data)
            goodsInfo()
        })
        .catch()

}
</script>

<style  scoped lang="less">
:deep(.el-table) {
    margin-top: 15px;
}

.input-with-select {
    width: 500px;
    /* height: 50px; */
    vertical-align: middle;
    margin-right: 15px;

    :deep(.el-input__inner) {
        height: 40px;
    }
}

.paginationBox {
    margin-top: 15px;
    display: flex;
    justify-content: center;
}
</style>
