<template>
    <div>
        <el-card class="box-card">
            <el-table :data="tableData" border style="width: 100%" stripe>
                <el-table-column label="#" type="index" width="200" align="center">
                </el-table-column>
                <el-table-column v-for="item in tableColumns" :prop="item.prop" :label="item.label">
                    <template v-slot="scope">
                        <div v-if="item.prop === 'level'">
                            <el-tag v-if="scope.row.level == 0">一级</el-tag>
                            <el-tag v-if="scope.row.level == 1" class="ml-2" type="success">二级</el-tag>
                            <el-tag v-if="scope.row.level == 2" class="ml-2" type="warning">三级</el-tag>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script setup lang='ts'>
import { ref, reactive, onMounted } from 'vue'
import { rights } from '../../../http/req'
const tableData = ref([])
const tableColumns = reactive([
    { prop: "authName", label: '权限名称' },
    { prop: "path", label: '路径' },
    { prop: "level", label: '权限等级' }
])

onMounted(async () => {
    const { data } = await rights('list')
    console.log(data.data)
    tableData.value = data.data
})
</script>

<style  scoped>
:deep(.el-tag) {
    height: 40px;
    font-size: 16px;
}
</style>
