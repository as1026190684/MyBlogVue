<template>
<div>
  <div id="app-echarts" >
    <div id="saleIntervalChart" style="width: 500px;height:400px;" ></div>
  </div>
</div>
</template>

<script>
import * as echarts from 'echarts'
export default {

name: "EchartsInterval",

  props: {
    topTen: {
      yAxisData: [],
      xAxisData:[],
    }
  },
  watch: {
    topTen: {
      deep: true,
      handler: function () {
        this.draw()
      }
    }
  },
  data() {
    return{
      saleIntervalChart: null

    };
  },
  mounted() {
    this.drawLine();
  },
  methods:{
    drawLine() {
      // 基于准备好的dom，初始化echarts实例
      this.saleIntervalChart = echarts.init(document.getElementById('saleIntervalChart'));
      // 绘制图表
      this.draw();
      //自适应浏览器放大缩小
      window.onresize = function () {
        this.saleIntervalChart.resize();
      }
    },
    draw() {
      let that = this;

      // 绘制图表
      this.saleIntervalChart.setOption({
        title: {
          text: '学习时长记录图'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        grid: {
          left: '1%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            type: 'category',
            data: this.topTen.xAxisData,
            axisTick: {
              alignWithLabel: true
            }
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ],
        series: [
          {
            name: '时长',
            type: 'bar',
            barWidth: '50%',
            data: this.topTen.yAxisData
          }
        ],
      });
    },

  }
}
</script>

<style scoped>

</style>
