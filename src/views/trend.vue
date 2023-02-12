<template>
  <div class="reciprocalLegend"></div>
  <el-button type="primary" id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{
    message.msg
  }}</el-button>

  <el-card id="trend" class="box-card-trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <!-- 指数选择器 -->
    <div id="selectRow">
      <span class="selectSpan">极端指数选择：</span>
      <el-select v-model="CMIP_Value" placeholder="Select" @change="RasterLoad()">
        <el-option v-for="item in CMIP_Options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <!-- 指数选择器 -->
    <div id="selectRow">
      <span class="selectSpan">情景选择：</span>
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
  <el-button type="primary" id="show-contrast" @click="resultShow1">{{ contrast.msg }}</el-button>
  <el-card id="contrast" :class="{ 'open-contrast': contrast.flag, 'close-contrast': !contrast.flag }">111</el-card>
</template>
<script>
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { Fill, Stroke, Style } from "ol/style.js";
export default {
  components: {},
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    let echarts = global.$echarts;
    let axios = global.$axios;
    const message = ref({
      msg: "收起",
      flag: true,
    });
    const contrast = ref({
      msg: "收起对比窗口",
      flag: true,
    });
    onMounted(() => {
      MapZoom();
      RasterLoad();
      designHoverOnMap();
      designClickOnMap();
    });
    //卸载完成
    onUnmounted(() => {
      DELOverlay();
      DELdesignHoverOnMap();
      DELdesignClickOnMap();
      // console.log("onUnmounted");
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
        contrast.value.msg = "展开对比窗口";
        contrast.value.flag = false;
      } else {
        contrast.value.msg = "收起对比窗口";
        contrast.value.flag = true;
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
    const Method_Value = ref("SEN");
    // 底图缩放至初始位置
    let MapZoom = () => {
      global.$mapConfig.MapZoom(110, 35, 4.5);
    };
    // 结果图加载
    let RasterLoad = () => {
      DELOverlay();
      global.$mapConfig.removeRaster();
      // global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_" + Method_Value.value);
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
      global.$mapConfig.addVectorLayer("./geojson/China_" + Method_Value.value + ".geojson", 0.5);
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

    // 地图单击事件
    let pointerclick = (event) => {
      const coordinate = event.coordinate;
      let pixel = event.pixel;
      let features = global.$mapConfig.getMap().forEachFeatureAtPixel(pixel, function (feature, layer) {
        return {
          feature: feature,
          layer: layer,
        };
      });
      if (features) {
        // let title = features.feature.values_.NAME + "  " + CMIP_Value.value + "均值(" + Method_Value.value + ")";
        let title = features.feature.values_.NAME + "  " + CMIP_Value.value + "区域变化均值(通过95%显著性检验)";
        let data1;
        let data2;
        let data3;
        if (CMIP_Value.value == "CSDI") {
          data1 = features.feature.values_.CSDI126;
          data2 = features.feature.values_.CSDI245;
          data3 = features.feature.values_.CSDI585;
        } else if (CMIP_Value.value == "WSDI") {
          data1 = features.feature.values_.WSDI126;
          data2 = features.feature.values_.WSDI245;
          data3 = features.feature.values_.WSDI585;
        } else if (CMIP_Value.value == "TN10P") {
          data1 = features.feature.values_.TN10P126;
          data2 = features.feature.values_.TN10P245;
          data3 = features.feature.values_.TN10P585;
        } else if (CMIP_Value.value == "TN90P") {
          data1 = features.feature.values_.TN90P126;
          data2 = features.feature.values_.TN90P245;
          data3 = features.feature.values_.TN90P585;
        } else if (CMIP_Value.value == "TX10P") {
          data1 = features.feature.values_.TX10P126;
          data2 = features.feature.values_.TX10P245;
          data3 = features.feature.values_.TX10P585;
        } else if (CMIP_Value.value == "TX90P") {
          data1 = features.feature.values_.TX90P126;
          data2 = features.feature.values_.TX90P245;
          data3 = features.feature.values_.TX90P585;
        }
        let overlay = global.$mapConfig.getOverlay();
        // 渲染统计表
        var chartDom = global.$mapConfig.getContent();
        var myChart = echarts.init(chartDom);
        var option;
        const labelRight = {
          position: "right",
        };

        option = {
          title: {
            text: title,
          },
          tooltip: {
            trigger: "axis",
            axisPointer: {
              type: "shadow",
            },
          },
          grid: {
            top: 40,
            bottom: 20,
            right: 60,
            left: 60,
          },
          xAxis: {
            type: "value",
            position: "bottom",
            splitLine: {
              lineStyle: {
                type: "dashed",
              },
            },
          },
          yAxis: {
            type: "category",
            axisLine: { show: false },
            axisLabel: { show: false },
            axisTick: { show: false },
            splitLine: { show: false },
            data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
          },
          series: [
            {
              name: "value",
              type: "bar",
              stack: "Total",
              label: {
                show: true,
                formatter: "{b}",
              },
              data: [
                {
                  value: data1,
                  label: labelRight,
                  itemStyle: {
                    color: "#2ca9e1",
                  },
                },
                {
                  value: data2,
                  label: labelRight,
                  itemStyle: {
                    color: "#ffea00",
                  },
                },
                {
                  value: data3,
                  itemStyle: {
                    color: "#e83929",
                  },
                },
              ],
            },
          ],
        };
        overlay.setPosition(coordinate);
        myChart.clear();
        option && myChart.setOption(option);
        // 设置弹窗位置
        global.$mapConfig.getMap().addOverlay(overlay);
      } else {
        DELOverlay();
      }
    };
    // 启用监听器
    let designClickOnMap = () => {
      global.$mapConfig.getMap().on("singleclick", pointerclick);
    };
    // 终止监听器
    let DELdesignClickOnMap = () => {
      global.$mapConfig.getMap().un("singleclick", pointerclick);
    };
    // 弹出框隐藏
    let DELOverlay = () => {
      let overlay = global.$mapConfig.getOverlay();
      overlay.setPosition(undefined);
    };
    return {
      message,
      contrast,
      resultShow,
      resultShow1,
      CMIP_Value,
      CMIP_Options,
      SSP_Value,
      Method_Value,
      RasterLoad,
      removeLayer,
      DELOverlay,
    };
  },
};
</script>
<style></style>
