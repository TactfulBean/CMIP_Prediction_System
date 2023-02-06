<template>
  <div id="show-mean">
    <el-button type="primary" :class="{ open_mean: message.flag, close_mean: !message.flag }" @click="resultShow">{{ message.msg }}</el-button>
  </div>
  <div id="mean" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card-mean">
      <template #header>
        <div class="card-header">
          <span style="padding: 0 20px 0 0">均值图表</span>
          <!-- 指数选择器 -->
          <span>极端指数选择：</span>
          <el-select v-model="CMIP_Value" placeholder="Select" @change="drawEchart()">
            <el-option v-for="item in CMIP_Options" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
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
      drawEchart();
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
    let base = 2021;
    let data = new Array(80);
    for (let i = 0; i < data.length; i++) {
      data[i] = base;
      base += 1;
    }

    let drawEchart = () => {
      let data1 = null;
      let data2 = null;
      let data3 = null;
      let CMIPText = null;
      const jsonUrl = "./json/SSP.json";
      axios.get(jsonUrl, { headers: {}, emulateJSON: true }).then((res) => {
        let CMIP = CMIP_Value.value;
        if (CMIP == "CSDI") {
          CMIPText = "寒潮持续时间指数";
          data1 = res.data.CSDI[0].data;
          data2 = res.data.CSDI[1].data;
          data3 = res.data.CSDI[2].data;
        } else if (CMIP == "WSDI") {
          CMIPText = "暖期持续时间指数";
          data1 = res.data.WSDI[0].data;
          data2 = res.data.WSDI[1].data;
          data3 = res.data.WSDI[2].data;
        } else if (CMIP == "TN10P") {
          CMIPText = "冷夜";
          data1 = res.data.TN10P[0].data;
          data2 = res.data.TN10P[1].data;
          data3 = res.data.TN10P[2].data;
        } else if (CMIP == "TN90P") {
          CMIPText = "暖夜";
          data1 = res.data.TN90P[0].data;
          data2 = res.data.TN90P[1].data;
          data3 = res.data.TN90P[2].data;
        } else if (CMIP == "TX10P") {
          CMIPText = "冷昼";
          data1 = res.data.TX10P[0].data;
          data2 = res.data.TX10P[1].data;
          data3 = res.data.TX10P[2].data;
        } else {
          CMIPText = "暖昼";
          data1 = res.data.TX90P[0].data;
          data2 = res.data.TX90P[1].data;
          data3 = res.data.TX90P[2].data;
        }
        var chartDom = document.getElementById("chart");
        var myChart = echarts.init(chartDom);
        var option;

        option = {
          title: {
            text: CMIP_Value.value + "(" + CMIPText + ")" + "年均趋势图",
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
<style></style>
