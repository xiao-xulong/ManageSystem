<script setup lang="ts">
import { ref } from 'vue'
import { useStore } from 'vuex'
import {
  Fold, Expand
} from '@element-plus/icons-vue'
import { useRouter, useRoute } from 'vue-router'
import fullScreenVue from './fullScreen.vue';
import FullScreen from './fullScreen.vue';
const router = useRouter()
const route = useRoute()
const store = useStore()
console.log(store.state.routeFlag)
let p = defineProps(
  { isExpand: { type: Boolean } }
)
const newp = ref()
//头像地址
const avatarUrl = ref('https://vkceyugu.cdn.bspapp.com/VKCEYUGU-bdbeaf13-95b3-48c4-a13b-687691a23e5f/0cfcda45-149b-4ca9-8a44-b352dc52893a.jpeg')
//传值到父组件进行扩展图标转换
const emit = defineEmits<{ (e: 'ExpandIconChange'): void }>();
const ExpandIconChange = function () {
  emit('ExpandIconChange')
  console.log(newp.value)
}
//退出操作
const logout = function () {
  sessionStorage.clear()
  router.replace('/login')
}
</script>

<template>

  <el-card class="headCard">
    <div
      style="width: 100%;height: 100%; display: inline-block;padding: 0;margin: 0;position: relative;top: 50%;transform: translateY(-50%);">
      <div @click="ExpandIconChange" class="svgBox">
        <Fold v-if="isExpand"></Fold>
        <Expand v-if="!isExpand"></Expand>
      </div>

    </div>
    <div class="box">
      <FullScreen class="fsIcon"></FullScreen>
      <el-dropdown>
        <el-avatar shape="square" size="large" :src="avatarUrl" />
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item @click="logout">退出</el-dropdown-item>

          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </el-card>
</template>

<style scoped lang="less">
.headCard {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:deep(.el-card__body) {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;
  margin: 0;
  padding-top: 0;
  padding-bottom: 0;
}

:deep(.el-dropdown-menu__item) {
  font-size: 18px;
}

.box {
  display: flex;
  justify-content: space-between;
  flex-wrap: nowrap;


}

.svgBox {
  // position: relative;
  // top: 50%;
  // transform: translateY(-50%);
  height: 100%;
}

.fsIcon {
  margin-right: 20px;
}


svg {
  width: 40px;
  height: 40px;
  position: relative;
  top: 50%;
  transform: translateY(-50%);

}
</style>
