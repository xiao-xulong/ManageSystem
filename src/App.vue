<script setup lang="ts">
import { ElConfigProvider } from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

</script>

<template>
  <el-config-provider :locale="zhCn">
    <router-view v-slot="{ Component }">
      <keep-alive include="Login">
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </el-config-provider>

</template>

<style>
#app,
html,
body {
  height: 100%;
}

* {
  margin: 0;
  padding: 0;
}
</style>
