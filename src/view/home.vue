<template>
    <div class="common-layout">
        <el-container>
            <el-aside>
                <el-menu :collapse="!isExpand" :default-active='deC' active-text-color="red" background-color="#545c64"
                    class="el-menu-vertical-demo" text-color="#fff" router unique-opened>
                    <el-sub-menu :index="item.id" v-for="(item, index) in menuList" :key="item.id">
                        <template #title>
                            <el-icon>
                                <component :is="menuIconList[index]"></component>
                            </el-icon>
                            <span>{{ item.authName }}</span>
                        </template>
                        <el-menu-item :index="childMenu.path" v-for="(childMenu, index) in item.children"
                            :key="childMenu.path" @click="savePath(childMenu.path)">
                            <el-icon>
                                <Menu></Menu>
                            </el-icon>

                            {{ childMenu.authName }}
                        </el-menu-item>

                    </el-sub-menu>

                </el-menu>
            </el-aside>
            <el-container>
                <el-header>

                    <Head @ExpandIconChange="ExpandIconChange" :isExpand="isExpand"></Head>
                </el-header>
                <el-main>
                    <router-view />

                </el-main>
            </el-container>
        </el-container>
    </div>
</template>

<script setup lang='ts' >
import {
    Document,
    Menu as IconMenu,
    Location,
    Setting,
    User, Goods, Tickets, PieChart, Menu, Fold, Expand
} from '@element-plus/icons-vue'
import { onMounted, ref, reactive, onBeforeMount } from 'vue'
import { useRouter } from 'vue-router'
import { menus } from '../../http/req'
import Head from '../components/homeHead.vue'
const menuList = ref([]) as any
const router = useRouter()
const menuIconList = reactive([User, Setting, Goods, Tickets, PieChart])
//菜单数据获取
const menuInit = async () => {
    menuList.value = (await menus()).data.data
    console.log(menuList.value)

}
menuInit()
//选中菜单子项时保存选中项 刷新也不丢失
const savePath = function (p: any) {
    sessionStorage.setItem('path', p)
}
//网页加载时菜单栏的默认选中项
const deC = ref()
const isExpand = ref(true)
const ExpandIconChange = function () {
    isExpand.value = !isExpand.value
}


onMounted(() => {
    if (sessionStorage.getItem('path')) {
        deC.value = sessionStorage.getItem('path')
    } else {
        deC.value = 'users'
    }




})






</script>

<style  scoped lang="less">
:deep(.el-container) {
    // height: 100vh !important;
}

:deep(.el-aside) {
    width: auto;
    height: 100vh;
    background-color: #545c64;
}

:deep(.el-header) {
    height: 7%;

    padding: 0;


}

:deep(.el-main) {
    height: 90vh;
    // overflow: hidden;
}
</style>
