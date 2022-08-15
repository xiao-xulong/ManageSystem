<template>
    <div>
        {{ f.a }}
    </div>
</template>

<script setup lang='ts'>
import { inject } from 'vue';
type a = {
    a: string
}
let f = inject('f', { a: 'gg' })
</script>

<style  scoped>
</style>
