<template>
  <Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="LegendRef"></Legend>
  <el-button type="primary" id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{
    message.msg
  }}</el-button>
  <el-card id="trend" class="box-card-trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <!-- 指数选择器 -->
    <div id="selectRow">
      <span class="select-span">极端指数选择：</span>
      <el-radio-group v-model="CMIP_Value" @change="RasterLoad(), drawEchart()">
        <el-tooltip class="box-item" effect="customized" content="暖期持续时间指数" placement="top">
          <el-radio-button label="WSDI">WSDI</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="寒潮持续时间指数" placement="top">
          <el-radio-button label="CSDI">CSDI</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="冷夜指数" placement="top">
          <el-radio-button label="TN10P">TN10P</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="暖夜指数" placement="top">
          <el-radio-button label="TN90P">TN90P</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="冷昼指数" placement="top">
          <el-radio-button label="TX10P">TX10P</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="暖昼指数" placement="top">
          <el-radio-button label="TX90P">TX90P</el-radio-button>
        </el-tooltip>
      </el-radio-group>
    </div>
    <!-- 指数选择器 -->
    <div id="selectRow">
      <span class="select-span">情景选择：</span>
      <el-radio-group v-model="SSP_Value" @change="RasterLoad()">
        <el-tooltip class="box-item" effect="customized" content="低辐射强迫情景（可持续发展路线）" placement="top">
          <el-radio-button label="SSP1-2.6">SSP1-2.6</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="中等辐射强迫情景（中等发展路线）" placement="top">
          <el-radio-button label="SSP2-4.5">SSP2-4.5</el-radio-button>
        </el-tooltip>
        <el-tooltip class="box-item" effect="customized" content="高辐射强迫情景（不平衡发展路线）" placement="top">
          <el-radio-button label="SSP5-8.5">SSP5-8.5</el-radio-button>
        </el-tooltip>
      </el-radio-group>
    </div>
  </el-card>
  <!-- 对比窗口 -->
  <el-button type="primary" id="show-contrast" @click="resultShow1">{{ contrast.msg }}</el-button>
  <el-card id="contrast_area" :class="{ 'open-card-X': contrast.flag, 'close-card-X': !contrast.flag }">
    <div id="chart"></div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, getCurrentInstance } from "vue";
import Legend from "@/components/Legend.vue";
const global = getCurrentInstance().appContext.config.globalProperties;
let echarts = global.$echarts;
let axios = global.$axios;
// 子组件
let LegendRef = ref(null);

onMounted(() => {
  global.$mapConfig.MapZoom(110, 35, 4.5);
  global.$mapConfig.removeLayer();
  LegendRef.value.legendRender();
  drawEchart();
  global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
  global.$mapConfig.changeFeature("CMIP:China_Area");
});
const contrast = ref({
  msg: "收起窗口",
  flag: true,
});
const message = ref({
  msg: "收起",
  flag: true,
});

let resultShow = () => {
  if (message.value.flag) {
    message.value.msg = "展开";
    message.value.flag = false;
  } else {
    message.value.msg = "收起";
    message.value.flag = true;
  }
};
let resultShow1 = () => {
  if (contrast.value.flag) {
    contrast.value.msg = "展开窗口";
    contrast.value.flag = false;
  } else {
    contrast.value.msg = "收起窗口";
    contrast.value.flag = true;
  }
};
const SSP_Value = ref("SSP2-4.5");
const CMIP_Value = ref("WSDI");
const Type = ref(1);
// 结果图加载
let RasterLoad = () => {
  global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
  LegendRef.value.legendRender();
};
let drawEchart = () => {
  let data1 = null;
  let data2 = null;
  let data3 = null;
  const jsonUrl = "./json/area.json";
  axios.get(jsonUrl, {}).then((res) => {
    let CMIP = CMIP_Value.value;
    if (CMIP == "CSDI") {
      data1 = res.data.CSDI[0];
      data2 = res.data.CSDI[1];
      data3 = res.data.CSDI[2];
    } else if (CMIP == "WSDI") {
      data1 = res.data.WSDI[0];
      data2 = res.data.WSDI[1];
      data3 = res.data.WSDI[2];
    } else if (CMIP == "TN10P") {
      data1 = res.data.TN10P[0];
      data2 = res.data.TN10P[1];
      data3 = res.data.TN10P[2];
    } else if (CMIP == "TN90P") {
      data1 = res.data.TN90P[0];
      data2 = res.data.TN90P[1];
      data3 = res.data.TN90P[2];
    } else if (CMIP == "TX10P") {
      data1 = res.data.TX10P[0];
      data2 = res.data.TX10P[1];
      data3 = res.data.TX10P[2];
    } else {
      data1 = res.data.TX90P[0];
      data2 = res.data.TX90P[1];
      data3 = res.data.TX90P[2];
    }
    var chartDom = document.getElementById("chart");
    var myChart = echarts.init(chartDom);
    var option;
    option = {
      title: {
        text: "区域指数均值盒须图",
      },
      dataset: [
        {
          source: data1,
        },
        {
          source: data2,
        },
        {
          source: data3,
        },
        {
          fromDatasetIndex: 0,
          transform: { type: "boxplot" },
        },
        {
          fromDatasetIndex: 1,
          transform: { type: "boxplot" },
        },
        {
          fromDatasetIndex: 2,
          transform: { type: "boxplot" },
        },
      ],
      legend: {
        right: "0",
      },
      tooltip: {
        trigger: "item",
        axisPointer: {
          type: "shadow",
        },
      },
      grid: {
        left: "3%",
        right: "4%",
        bottom: "3%",
        containLabel: true,
      },
      xAxis: {
        type: "category",
        axisLabel: {
          formatter: function (value) {
            if (value == 0) {
              return "NEC(东北)";
            } else if (value == 1) {
              return "NC(北部)";
            } else if (value == 2) {
              return "NWC(西北)";
            } else if (value == 3) {
              return "EC(东部)";
            } else if (value == 4) {
              return "CC(中部)";
            } else if (value == 5) {
              return "SWC1(西南1)";
            } else if (value == 6) {
              return "SWC2(西南2)";
            } else if (value == 7) {
              return "SC(南部)";
            }
          },
        },
      },
      yAxis: {
        type: "value",
        name: "Value",
      },
      series: [
        {
          name: "SSP1-2.6",
          type: "boxplot",
          datasetIndex: 3,
          itemStyle: { borderWidth: 2 },
        },
        {
          name: "SSP2-4.5",
          type: "boxplot",
          datasetIndex: 4,
          itemStyle: { borderWidth: 2 },
        },
        {
          name: "SSP5-8.5",
          type: "boxplot",
          datasetIndex: 5,
          itemStyle: { borderWidth: 2 },
        },
      ],
    };
    myChart.clear();
    option && myChart.setOption(option);
  });
};
</script>
<style></style>
