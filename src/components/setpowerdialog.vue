<template>
    <div>
        <el-dialog v-model="setpowerDialogVisible" title="分配权限" width="30%" :close-on-click-modal="false"
            :show-close="false">

            <el-tree ref="tree" :data="treeData" show-checkbox node-key="id" :default-checked-keys="p.TreeKey"
                :props="defaultProps" :default-expand-all="true" />
            <template #footer>
                <span class="dialog-footer">
                    <el-button style="color: gray !important;" @click="setpowerDialogCancel">取消</el-button>
                    <el-button type="primary" @click="setRight">确定</el-button>
                </span>
            </template>
        </el-dialog>
    </div>
</template>

<script setup lang='ts'>
import { rights, setRights } from '../../http/req'
import { ref, onMounted, watch } from 'vue'

let p = defineProps(['setPowerInfo', 'setpowerDialogVisible', 'TreeKey'])
const emit = defineEmits(['setpowerDialogCancel'])
const setpowerDialogCancel = function (status: any) {
    emit('setpowerDialogCancel', status)
}

const treeData = ref()
const defaultProps = {
    children: 'children',
    label: 'authName'
}
const tree = ref()
watch(() => p.TreeKey,
    (n, o) => {
        if (tree.value != undefined) {
            tree.value.setCheckedKeys(n)
        }
    },
    { deep: true })
onMounted(async () => {
    const { data } = await rights('tree')
    treeData.value = data.data

})

const setRight = async function () {
    let half = tree.value.getHalfCheckedKeys()
    let key = tree.value.getCheckedKeys()
    let allKeys = half.concat(key)
    console.log(allKeys)
    const res = await setRights(p.setPowerInfo.id, allKeys.toString())

    setpowerDialogCancel(res.status)
}
</script>

<style  scoped>
</style>










