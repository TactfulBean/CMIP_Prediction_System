<template>
  <div id="show-mean">
    <el-button type="primary" :class="{ open_mean: message.flag, close_mean: !message.flag }" @click="resultShow">{{
      message.msg
    }}</el-button>
  </div>
  <div id="mean" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card-mean">
      <template #header>
        <div class="card-header">
          <span style="padding: 0 20px 0 0">均值图表</span>
          <!-- 指数选择器 -->
          <span>极端指数选择：</span>
          <el-select v-model="CMIP_Value" class="m-2" placeholder="Select" @change="drawEchart()">
            <el-option v-for="item in CMIP_Options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </template>
      <div id="chart"></div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
import axios from "axios";
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    onMounted(() => {
      drawEchart();
      global.$mapConfig.addFeatureLayer("China_Area");
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
    const CMIP_Options = [
      {
        label: "TN10P",
        value: "TN10P",
      },
      {
        label: "TN90P",
        value: "TN90P",
      },
      {
        label: "TX10P",
        value: "TX10P",
      },
      {
        label: "TX90P",
        value: "TX90P",
      },
      {
        label: "CSDI",
        value: "CSDI",
      },
      {
        label: "WSDI",
        value: "WSDI",
      },
    ];
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
                  return "NEC";
                } else if (value == 1) {
                  return "NC";
                } else if (value == 2) {
                  return "NWC";
                } else if (value == 3) {
                  return "EC";
                } else if (value == 4) {
                  return "CC";
                } else if (value == 5) {
                  return "SWC1";
                } else if (value == 6) {
                  return "SWC2";
                } else if (value == 7) {
                  return "SC";
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
      CMIP_Options,
      drawEchart,
    };
  },
};
</script>
<style>
#chart {
  width: 100%;
  height: 100%;
}
.el-card__body {
  height: 350px;
}

#show-mean {
  position: absolute;
  z-index: 10;
  bottom: 452px;
}
#mean {
  position: absolute;
  z-index: 10;
  width: 100%;
  bottom: 0;
}
.box-card-mean {
  height: 450px;
}

@keyframes result-open-mean {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}
@keyframes result-close-mean {
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
@keyframes open-mean {
  from {
    transform: translateY(452px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes close-mean {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(452px);
  }
}
.result-open {
  animation: result-open-mean 0.75s !important;
}
.result-close {
  animation: result-close-mean 0.75s !important;
  transform: translateY(100%);
}
.open_mean {
  animation: open-mean 0.75s !important;
}
.close_mean {
  animation: close-mean 0.75s !important;
  transform: translateY(452px);
}
</style>
