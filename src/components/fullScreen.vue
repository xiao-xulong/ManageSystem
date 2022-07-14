<template>
    <div @click="fullScreen">
        <svg v-show="!isFull" t="1650977042854" viewBox="0 0 1024 1024" version="1.1" p-id="4082">
            <path
                d="M240.8 196l178.4 178.4-45.6 45.6-177.6-179.2-68 68V128h180.8l-68 68z m133.6 408.8L196 783.2 128 715.2V896h180.8l-68-68 178.4-178.4-44.8-44.8zM715.2 128l68 68-178.4 178.4 45.6 45.6 178.4-178.4 68 68V128H715.2z m-65.6 476.8l-45.6 45.6 178.4 178.4-68 68H896V715.2l-68 68-178.4-178.4z"
                p-id="4083"></path>
        </svg>
        <svg v-show="isFull" t="1650977224496" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4236">
            <path
                d="M142.4 96.8l-44.8 44.8 173.6 174.4-68 68H384V203.2l-67.2 67.2zM752.8 316l173.6-174.4-44.8-44.8-174.4 173.6-67.2-67.2V384h180.8zM270.4 707.2l-169.6 170.4 44.8 49.6 170.4-174.4 68 68V640H203.2zM820.8 640H640v180.8l68-68 170.4 174.4 44.8-49.6-169.6-170.4z"
                p-id="4237"></path>
        </svg>
    </div>
</template>

<script setup lang='ts'>
import screenfull from 'screenfull'
import { ref } from 'vue';
const isFull = ref(screenfull.isFullscreen)
const fullScreen = function () {
    if (screenfull.isEnabled) {
        screenfull.toggle()
        isFull.value = !isFull.value
    }
}
</script>

<style  scoped>
svg {
    width: 40px;
    height: 40px;
    position: relative;
    top: 50%;
    transform: translateY(-50%);
}
</style>
