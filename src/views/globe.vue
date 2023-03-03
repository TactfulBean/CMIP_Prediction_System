<template>
  <Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="Legend"></Legend>
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
        <el-radio-button label="SSP1-2.6">SSP1-2.6</el-radio-button>
        <el-radio-button label="SSP2-4.5">SSP2-4.5</el-radio-button>
        <el-radio-button label="SSP5-8.5">SSP5-8.5</el-radio-button>
      </el-radio-group>
    </div>
    <div id="selectRow" style="float: right">
      <el-button color="#409EFF" plain @click="ReLoad()"><span class="iconfont">&#xe782; </span><span>重新加载</span></el-button>
      <el-button color="#409EFF" plain @click="removeLayer()"><span class="iconfont">&#xe74b; </span><span>清除图层</span></el-button>
    </div>
  </el-card>
  <!-- 对比窗口 -->
  <el-button type="primary" id="show-contrast" @click="resultShow1">{{ contrast.msg }}</el-button>
  <el-card id="contrast_world" :class="{ 'open-card-X': contrast.flag, 'close-card-X': !contrast.flag }">
    <div id="contrast-content_world" style="width: 100%; height: 400px"></div>
  </el-card>
</template>
<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import Legend from "@/components/Legend.vue";
export default {
  components: { Legend },
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    const Legend = ref(null);
    let echarts = global.$echarts;
    let axios = global.$axios;
    onMounted(() => {
      global.$mapConfig.MapZoom(160, 20, 0);
      ReLoad();
      drawEchart();
      Legend.value.legendRender();
    });
    const message = ref({
      msg: "收起",
      flag: true,
    });
    const contrast = ref({
      msg: "收起对比窗口",
      flag: true,
    });
    const SSP_Value = ref("SSP2-4.5");
    const CMIP_Value = ref("WSDI");
    const Type = ref(1);
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
        contrast.value.msg = "展开对比窗口";
        contrast.value.flag = false;
      } else {
        contrast.value.msg = "收起对比窗口";
        contrast.value.flag = true;
      }
    };
    // 结果图加载
    let RasterLoad = () => {
      global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      Legend.value.legendRender();
    };
    let ReLoad = () => {
      global.$mapConfig.removeLayer();
      global.$mapConfig.changeRaster("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      global.$mapConfig.changeFeature("CMIP:World");
    };
    // 清除图层
    let removeLayer = () => {
      global.$mapConfig.removeLayer();
    };
    let drawEchart = () => {
      const jsonUrl = "./json/world.json";
      let data = null;
      axios.get(jsonUrl, {}).then((res) => {
        let CMIP = CMIP_Value.value;
        if (CMIP == "CSDI") {
          data = res.data.CSDI;
        } else if (CMIP == "WSDI") {
          data = res.data.WSDI;
        } else if (CMIP == "TN10P") {
          data = res.data.TN10P;
        } else if (CMIP == "TN90P") {
          data = res.data.TN90P;
        } else if (CMIP == "TX10P") {
          data = res.data.TX10P;
        } else {
          data = res.data.TX90P;
        }
        var chartDom = document.getElementById("contrast-content_world");
        var myChart = echarts.init(chartDom);
        let option = {
          title: {
            text: "各洲极端气候指数变化均值对比",
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          legend: {
            right: 0,
          },
          grid: {
            left: "3%",
            right: "4%",
            bottom: "3%",
            containLabel: true,
          },
          xAxis: {
            type: "category",
            data: ["非洲", "南极洲", "亚洲", "欧洲", "北美洲", "大洋洲", "南美洲"],
          },
          yAxis: {
            type: "value",
            boundaryGap: [0, 0.01],
          },
          series: [
            {
              name: "SSP1-2.6",
              type: "bar",
              data: [data[0][0], data[1][0], data[2][0], data[3][0], data[4][0], data[5][0], data[6][0]],
              itemStyle: {
                color: "#2ca9e1",
              },
            },
            {
              name: "SSP2-4.5",
              type: "bar",
              data: [data[0][1], data[1][1], data[2][1], data[3][1], data[4][1], data[5][1], data[6][1]],
              itemStyle: {
                color: "#ffea00",
              },
            },
            {
              name: "SSP5-8.5",
              type: "bar",
              data: [data[0][2], data[1][2], data[2][2], data[3][2], data[4][2], data[5][2], data[6][2]],
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
    return {
      message,
      contrast,
      Legend,
      resultShow,
      resultShow1,
      CMIP_Value,
      Type,
      SSP_Value,
      RasterLoad,
      ReLoad,
      removeLayer,
      drawEchart,
    };
  },
};
</script>
<style></style>
