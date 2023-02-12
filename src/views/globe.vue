<template>
  <div class="reciprocalLegend"></div>
  <div id="show-trend">
    <el-button type="primary" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{ message.msg }}</el-button>
  </div>
  <div id="trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card-trend">
      <!-- 指数选择器 -->
      <div id="selectRow">
        <span>极端指数选择：</span>
        <el-select v-model="CMIP_Value" placeholder="Select" @change="RasterLoad()">
          <el-option v-for="item in CMIP_Options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <!-- 指数选择器 -->
      <!-- <div id="selectRow">
        <span>算法选择：</span>
        <el-select v-model="Method_Value" placeholder="Select" @change="RasterLoad()">
          <el-option v-for="item in Method_Options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div> -->
      <!-- 指数选择器 -->
      <div id="selectRow">
        <span>情景选择：</span>
        <!-- <el-select v-model="SSP_Value" placeholder="Select" @change="RasterLoad()">
          <el-option v-for="item in SSP_Options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->
        <el-radio-group v-model="SSP_Value" @change="RasterLoad()">
          <el-radio-button label="SSP1-2.6">SSP1-2.6</el-radio-button>
          <el-radio-button label="SSP2-4.5">SSP2-4.5</el-radio-button>
          <el-radio-button label="SSP5-8.5">SSP5-8.5</el-radio-button>
        </el-radio-group>
      </div>
      <div id="selectRow" style="float: right">
        <el-button color="#409EFF" plain @click="RasterLoad()"><span class="iconfont">&#xe782; </span><span>重新加载</span></el-button>
        <el-button color="#409EFF" plain @click="removeLayer()"><span class="iconfont">&#xe74b; </span><span>清除图层</span></el-button>
      </div>
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
    const message = ref({
      msg: "收起",
      flag: true,
    });
    onMounted(() => {
      RasterLoad();
      MapZoom();
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
    const SSP_Value = ref("SSP1-2.6");
    const SSP_Options = [
      {
        label: "SSP1-2.6",
        value: "SSP1-2.6",
      },
      {
        label: "SSP2-4.5",
        value: "SSP2-4.5",
      },
      {
        label: "SSP5-8.5",
        value: "SSP5-8.5",
      },
    ];
    const Method_Value = ref("SEN");
    const Method_Options = [
      {
        label: "MK",
        value: "MK",
      },
      {
        label: "SEN",
        value: "SEN",
      },
    ];
    // 底图缩放至初始位置
    let MapZoom = () => {
      global.$mapConfig.MapZoom(160, 20, 0);
    };
    // 结果图加载
    let RasterLoad = () => {
      global.$mapConfig.removeRaster();
      // global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_" + Method_Value.value + "_World");
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      global.$mapConfig.addFeatureLayer("World");
      global.$mapConfig.addCAV();
      const jsonUrl = "./json/legend.json";
      axios.get(jsonUrl, { headers: {}, emulateJSON: true }).then((res) => {
        let data = res.data.MK_SEN;
        // if (Method_Value.value == "MK") {
        //   data = res.data.MK;
        // } else if (Method_Value.value == "SEN") {
        //   data = res.data.SEN;
        // }
        let color = null;
        let text = null;
        let type = null;
        if (CMIP_Value.value == "CSDI") {
          type = 0;
        } else if (CMIP_Value.value == "WSDI") {
          type = 1;
        } else if (CMIP_Value.value == "TN10P") {
          type = 2;
        } else if (CMIP_Value.value == "TN90P") {
          type = 3;
        } else if (CMIP_Value.value == "TX10P") {
          type = 4;
        } else if (CMIP_Value.value == "TX90P") {
          type = 5;
        }
        text = data[type].text;
        color = data[type].color;
        let barChart = echarts.init(document.querySelector(".reciprocalLegend"));
        const option = {
          xAxis: { name: "", axisLine: { show: false } },
          yAxis: { type: "", axisLine: { show: false } },
          visualMap: {
            min: text[1],
            max: text[0],
            text: text,
            inRange: {
              color: color,
            },
            textStyle: {
              color: "#434394",
              fontSize: 14,
              fontWeight: 700,
            },
          },
        };
        barChart.clear();
        barChart.setOption(option);
      });
    };
    // 清除图层
    let removeLayer = () => {
      global.$mapConfig.removeRaster();
    };
    return {
      message,
      resultShow,
      CMIP_Value,
      CMIP_Options,
      SSP_Value,
      SSP_Options,
      Method_Value,
      Method_Options,
      RasterLoad,
      removeLayer,
    };
  },
};
</script>
<style></style>
