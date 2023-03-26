<template>
  <Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="LegendRef"></Legend>
  <div id="show-time">
    <el-button type="primary" :class="{ open_time: message.flag, close_time: !message.flag }" @click="resultShow">{{ message.msg }}</el-button>
  </div>
  <div id="time" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card-time">
      <template #header>
        <div class="card-header">
          <div id="selectRow">
            <span class="select-span">极端指数选择：</span>
            <el-radio-group v-model="CMIP_Value" @change="RasterLoad()">
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
          <div id="selectRow" style="float: right">
            <el-button color="#409EFF" plain @click="reTimeSet()"
              ><span class="iconfont">&#xe782; </span><span>{{ timeSet.message }}</span></el-button
            >
          </div>
        </div>
      </template>
      <div class="slider-demo-block">
        <el-slider v-model="year" :step="10" show-stops :min="2021" :max="2100" :marks="marks" @change="print()" />
      </div>
    </el-card>
  </div>
  <el-button type="primary" id="show-timeLine" @click="resultShow1">{{ timeLine.msg }}</el-button>
  <el-card id="timeLine" :class="{ 'open-card-X': timeLine.flag, 'close-card-X': !timeLine.flag }">
    <div id="timeLine-content" style="width: 100%; height: 100%"></div>
  </el-card>
</template>
<script setup>
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import Legend from "@/components/Legend.vue";
const global = getCurrentInstance().appContext.config.globalProperties;
let echarts = global.$echarts;
let axios = global.$axios;
onMounted(() => {
  global.$mapConfig.MapZoom(115, 35, 4.5);
  global.$mapConfig.removeLayer();
  global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_SSP2-4.5_" + year.value);
  global.$mapConfig.changeVector("./geojson/China_MK_SEN.geojson", 0.5);
  drawEchart();
  RasterLoad();
});
onUnmounted(() => {
  clearInterval(timeSet.value.interval);
});
// 子组件
let LegendRef = ref(null);

const message = ref({
  msg: "收起",
  flag: true,
});
const timeLine = ref({
  msg: "收起窗口",
  flag: true,
});
const marks = ref({
  2021: "2021",
  2031: "2031",
  2041: "2041",
  2051: "2051",
  2061: "2061",
  2071: "2071",
  2081: "2081",
  2091: "2091",
  2100: "2100",
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
  if (timeLine.value.flag) {
    timeLine.value.msg = "展开窗口";
    timeLine.value.flag = false;
  } else {
    timeLine.value.msg = "收起窗口";
    timeLine.value.flag = true;
  }
};
const CMIP_Value = ref("WSDI");
const Type = ref(2);
const year = ref(2021);
let timeSet = ref({
  interval: null,
  message: "暂停播放",
  flag: true,
});

let RasterLoad = () => {
  year.value = 2021;
  clearInterval(timeSet.value.interval);
  LegendRef.value.legendRender();
  drawEchart();
  setTimeSet();
};
let setTimeSet = () => {
  timeSet.value.interval = setInterval(function () {
    if (!timeSet.value.flag) {
      if (year.value == 2091) {
        year.value += 9;
      } else {
        year.value += 10;
      }
    }
    timeSet.value.flag = false;
    global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_SSP2-4.5_" + year.value);
    //
    if (year.value >= 2100) {
      timeSet.value.message = "重新播放";
      clearInterval(timeSet.value.interval);
    }
  }, 2500);
  timeSet.value.message = "暂停播放";
};
let reTimeSet = () => {
  if (timeSet.value.message == "继续播放") {
    setTimeSet();
    timeSet.value.message = "暂停播放";
  } else if (timeSet.value.message == "暂停播放") {
    clearInterval(timeSet.value.interval);
    // console.log("计时器停止");
    timeSet.value.message = "继续播放";
  } else if (timeSet.value.message == "重新播放") {
    year.value = 2021;
    setTimeSet();
    timeSet.value.message = "暂停播放";
  }
};
let print = () => {
  if (year.value != 2100 && timeSet.value.message == "重新播放") {
    timeSet.value.message = "继续播放";
  }
  global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_SSP2-4.5_" + year.value);
  // console.log("手动选择" + year.value);
};
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
    var chartDom = document.getElementById("timeLine-content");
    var myChart = echarts.init(chartDom);
    var option;

    option = {
      title: {
        text: CMIP_Value.value + "(" + CMIPText + ")" + "年均趋势图",
      },
      grid: {
        left: "5%",
        top: "30%",
        right: "0%",
        bottom: "10%",
      },
      tooltip: {
        trigger: "axis",
      },
      legend: {
        data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
        right: 0,
      },
      xAxis: {
        type: "category",
        data: data,
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          name: "SSP1-2.6",
          data: data1,
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: {
            color: "#2ca9e1",
          },
        },
        {
          name: "SSP2-4.5",
          data: data2,
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: {
            color: "#f6ad49",
          },
        },
        {
          name: "SSP5-8.5",
          data: data3,
          type: "line",
          smooth: true,
          symbol: "none",
          itemStyle: {
            color: "#e83929",
          },
        },
      ],
    };
    myChart.clear();
    option && myChart.setOption(option);
  });
};
</script>
<style>
.slider-demo-block {
  padding: 0 30px;
}
</style>
