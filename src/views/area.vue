<template>
  <div id="show-mean">
    <el-button type="primary" :class="{ open_mean: message.flag, close_mean: !message.flag }" @click="resultShow">{{ message.msg }}</el-button>
  </div>
  <div id="mean" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card-mean">
      <template #header>
        <div class="card-header">
          <div id="selectRow">
            <span class="select-span">极端指数选择：</span>
            <el-radio-group v-model="CMIP_Value" @change="drawEchart()">
              <el-radio-button label="WSDI">WSDI</el-radio-button>
              <el-radio-button label="CSDI">CSDI</el-radio-button>
              <el-radio-button label="TN10P">TN10P</el-radio-button>
              <el-radio-button label="TN90P">TN90P</el-radio-button>
              <el-radio-button label="TX10P">TX10P</el-radio-button>
              <el-radio-button label="TX90P">TX90P</el-radio-button>
            </el-radio-group>
          </div>
        </div>
      </template>
      <div id="chart"></div>
    </el-card>
  </div>
</template>
<script>
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    let echarts = global.$echarts;
    let axios = global.$axios;
    onMounted(() => {
      global.$mapConfig.MapZoom(110, 35, 4.5);
      global.$mapConfig.removeRaster();
      drawEchart();
      global.$mapConfig.addFeatureLayer("China_Area");
      global.$mapConfig.addCAV();
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

    const CMIP_Value = ref("WSDI");
    let drawEchart = () => {
      let data1 = null;
      let data2 = null;
      let data3 = null;
      const jsonUrl = "./json/area.json";
      axios.get(jsonUrl, {}).then((res) => {
        let CMIP = CMIP_Value.value;
        // console.log(res);
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
        // console.log(data1);
        var chartDom = document.getElementById("chart");
        var myChart = echarts.init(chartDom);
        var option;
        option = {
          title: {
            text: "区域指数均值盒须图",
            left: "center",
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
            top: "10%",
          },
          tooltip: {
            trigger: "item",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            left: "10%",
            top: "20%",
            right: "10%",
            bottom: "15%",
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
    return {
      message,
      resultShow,
      CMIP_Value,
      drawEchart,
    };
  },
};
</script>
<style></style>
