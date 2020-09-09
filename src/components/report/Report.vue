<template>
  <el-card>
    <div id="main" style="width: 100%; height: 450px;"></div>
  </el-card>
</template>

<script>
import echarts from 'echarts'
import _ from 'lodash'
import { getReportData } from '@/api/report.js'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源',
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3',
            },
          },
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: 'value',
          },
        ],
      },
      chartOpt: {},
    }
  },
  mounted() {
    this.initEchart()
  },
  methods: {
    initEchart() {
      var myChart = echarts.init(document.getElementById('main'))
      getReportData().then((res) => {
        this.chartOpt = _.merge(res.data, this.options)
        myChart.setOption(this.chartOpt)
      })
    },
  },
}
</script>

<style lang="less" scoped>
</style>