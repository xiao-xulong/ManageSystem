<template>
    <div>
        <div class="main" ref="main"></div>
    </div>
</template>

<script setup lang='ts'>
import * as _ from 'lodash'
import { onMounted, ref } from 'vue';
import { getechart } from '../../../http/req';
import * as echarts from 'echarts';
let main = ref()
onMounted(async () => {
    let a = { b: 123 }
    let aa = { b: 321, c: 'kkk' }
    const obj = Object.assign(a, aa)
    console.log(obj)
    const r = await getechart()
    console.log(r.data.data)

    let myChart = echarts.init(main.value);
    let option = {
        legend: r.data.data.legend,
        title: {
            text: 'ECharts 入门示例'
        },
        tooltip: {},
        xAxis: r.data.data.xAxis,
        yAxis: r.data.data.yAxis,
        series: r.data.data.series
    }
    let mergeOption = {
        title: {
            text: '用户来源'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#E9EEF3'
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                boundaryGap: false
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ]
    }
    _.merge(option, mergeOption)
    myChart.setOption(option);
})
</script>

<style  scoped>
.main {
    width: 900px;
    height: 500px;
}
</style>
