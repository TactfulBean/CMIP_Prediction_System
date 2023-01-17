<template>
  <div class="reciprocalLegend"></div>
  <div id="show">
    <el-button type="primary" :class="{ open: message.flag, close: !message.flag }" @click="resultShow">{{
      message.msg
    }}</el-button>
  </div>
  <div id="render" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card">
      <!-- 指数选择器 -->
      <div id="selectRow">
        <span>极端指数选择：</span>
        <el-select v-model="CMIP_Value" class="m-2" placeholder="Select" @change="RasterLoad()">
          <el-option v-for="item in CMIP_Options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>

      <!-- 指数选择器 -->
      <div id="selectRow">
        <span>算法选择：</span>
        <el-select v-model="Method_Value" class="m-2" placeholder="Select" @change="RasterLoad()">
          <el-option v-for="item in Method_Options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>

      <!-- 指数选择器 -->
      <div id="selectRow">
        <span>SSP选择：</span>
        <el-select v-model="SSP_Value" class="m-2" placeholder="Select" @change="RasterLoad()">
          <el-option v-for="item in SSP_Options" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>
      </div>
      <div id="selectRow" style="float: right">
        <el-button color="#409EFF" plain @click="RasterLoad()"
          ><span class="iconfont">&#xe782; </span><span>重新加载</span></el-button
        >
        <el-button color="#409EFF" plain @click="removeLayer()"
          ><span class="iconfont">&#xe74b; </span><span>清除图层</span></el-button
        >
      </div>
    </el-card>
  </div>
</template>
<script>
import * as echarts from "echarts";
import axios from "axios";
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { Circle, Fill, Stroke, Style } from "ol/style.js";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    const message = ref({
      msg: "收起",
      flag: true,
    });
    onMounted(() => {
      RasterLoad();
      designHoverOnMap();
    });
    //卸载完成
    onUnmounted(() => {
      DELdesignHoverOnMap();
      console.log("onUnmounted");
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
    // 结果图加载
    let RasterLoad = () => {
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_" + Method_Value.value);
      global.$mapConfig.addFeatureLayer(Method_Value.value);
      const jsonUrl = "./json/legend.json";
      axios.get(jsonUrl, { headers: {}, emulateJSON: true }).then((res) => {
        let data = null;
        if (Method_Value.value == "MK") {
          data = res.data.MK;
        } else if (Method_Value.value == "SEN") {
          data = res.data.SEN;
        }
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
    // 鼠标选中样式
    let highFeature = null;
    let selectStyle = new Style({
      stroke: new Stroke({
        color: "#0095d9",
        width: 3,
      }),
      fill: new Fill({
        color: "rgba(56,161,219,0.2)",
      }),
    });
    let defaultStyle = new Style({
      stroke: new Stroke({
        color: "#007bbb",
        width: 0.5,
      }),
      fill: new Fill({
        color: "rgba(0,0,0,0)",
      }),
    });
    // 鼠标移动监听
    // 鼠标移动监听器
    let pointermove = (event) => {
      let pixel = event.pixel;
      let features = global.$mapConfig.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
        return {
          feature: feature,
          layer: layer,
        };
      });
      if (features) {
        // console.log(features);
        global.$mapConfig.getMap().getTargetElement().style.cursor = "pointer";
        if (highFeature != null) {
          highFeature.setStyle(defaultStyle);
        }
        features.feature.setStyle(selectStyle);
        highFeature = features.feature;
      } else {
        if (highFeature) {
          highFeature.setStyle(defaultStyle);
        }
        global.$mapConfig.getMap().getTargetElement().style.cursor = "";
      }
    };
    // 启用监听器
    let designHoverOnMap = () => {
      global.$mapConfig.getMap().on("pointermove", pointermove);
    };
    // 终止监听器
    let DELdesignHoverOnMap = () => {
      global.$mapConfig.getMap().un("pointermove", pointermove);
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
<style>
#show {
  position: absolute;
  z-index: 10;
  bottom: 92px;
  left: 20px;
}
#render {
  border-radius: 20px;
  position: absolute;
  z-index: 10;
  width: 100%;
  bottom: 0;
  bottom: 10px;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
}
.box-card {
  height: 80px;
  border-radius: 20px;
}
@keyframes result-open {
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0%);
    opacity: 1;
  }
}
@keyframes result-close {
  from {
    transform: translateY(0%);
    opacity: 1;
  }
  to {
    transform: translateY(100%);
    opacity: 0;
  }
}
@keyframes open {
  from {
    transform: translateY(92px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes close {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(92px);
  }
}
.result-open {
  animation: result-open 0.8s !important;
  opacity: 1;
}
.result-close {
  animation: result-close 0.7s !important;
  transform: translateY(100%);
  opacity: 0;
}
.open {
  animation: open 0.75s !important;
}
.close {
  animation: close 0.75s !important;
  transform: translateY(92px);
}
#selectRow {
  display: inline-block;
  padding: 0 10px;
}
.reciprocalLegend {
  width: 200px;
  height: 400px;
  position: absolute;
  left: 2%;
  bottom: 150px;
  animation: out 1s;
}
@keyframes out {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
.ol-popup {
  position: absolute;
  background-color: white;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
  min-width: 280px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>
