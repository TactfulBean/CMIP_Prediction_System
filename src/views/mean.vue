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
import { ref, onMounted } from "vue";
export default {
  setup() {
    onMounted(() => {
      drawEchart();
    });
    const message = ref({
      msg: "收起结果",
      flag: true,
    });
    let resultShow = () => {
      if (message.value.flag) {
        message.value.msg = "展开结果";
        message.value.flag = false;
      } else {
        message.value.msg = "收起结果";
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
    let base = 2021;
    let data = new Array(30);
    for (let i = 0; i < data.length; i++) {
      data[i] = base;
      base += 1;
    }

    let drawEchart = () => {
      let data1 = null;
      let data2 = null;
      let data3 = null;
      const jsonUrl = "./json/SSP.json";
      axios.get(jsonUrl, { headers: {}, emulateJSON: true }).then((res) => {
        let CMIP = CMIP_Value.value;
        if (CMIP == "CSDI") {
          data1 = res.data.CSDI[0].data;
          data2 = res.data.CSDI[1].data;
          data3 = res.data.CSDI[2].data;
        } else if (CMIP == "WSDI") {
          data1 = res.data.WSDI[0].data;
          data2 = res.data.WSDI[1].data;
          data3 = res.data.WSDI[2].data;
        } else if (CMIP == "TN10P") {
          data1 = res.data.TN10P[0].data;
          data2 = res.data.TN10P[1].data;
          data3 = res.data.TN10P[2].data;
        } else if (CMIP == "TN90P") {
          data1 = res.data.TN90P[0].data;
          data2 = res.data.TN90P[1].data;
          data3 = res.data.TN90P[2].data;
        } else if (CMIP == "TX10P") {
          data1 = res.data.TX10P[0].data;
          data2 = res.data.TX10P[1].data;
          data3 = res.data.TX10P[2].data;
        } else {
          data1 = res.data.TX90P[0].data;
          data2 = res.data.TX90P[1].data;
          data3 = res.data.TX90P[2].data;
        }
        var chartDom = document.getElementById("chart");
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          title: {
            text: CMIP_Value.value + "年均趋势图",
          },
          tooltip: {
            trigger: "axis",
          },
          legend: {
            data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
          },
          xAxis: {
            type: "category",
            data: data,
          },
          yAxis: {
            type: "value",
          },
          series: [
            { name: "SSP1-2.6", data: data1, type: "line" },
            { name: "SSP2-4.5", data: data2, type: "line" },
            { name: "SSP5-8.5", data: data3, type: "line" },
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
