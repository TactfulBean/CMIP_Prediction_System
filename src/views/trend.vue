<template>
  <Legend :CMIP_Value="CMIP_Value" ref="Legend"></Legend>
  <el-button type="primary" id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{
    message.msg
  }}</el-button>

  <el-card id="trend" class="box-card-trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <!-- 指数选择器 -->
    <div id="selectRow">
      <span>极端指数选择：</span>
      <el-select v-model="CMIP_Value" placeholder="Select" @change="RasterLoad()">
        <el-option v-for="item in CMIP_Options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
    </div>
    <!-- 指数选择器 -->
    <div id="selectRow">
      <span>情景选择：</span>
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
  <el-card id="contrast" :class="{ 'open-contrast': contrast.flag, 'close-contrast': !contrast.flag }">
    <el-button @click="contrastBtn">对比</el-button>
    <span>{{ city2.CMIP_Value }}</span>
    <span style="padding: 0 20px">{{ city1.name }}</span
    ><span>{{ city2.name }}</span>
    <div id="contrast-content" style="width: 100%; height: 200px"></div>
  </el-card>
</template>
<script>
import { ref, onMounted, onUnmounted, getCurrentInstance } from "vue";
import { Fill, Stroke, Style } from "ol/style.js";
import Legend from "@/components/Legend.vue";
export default {
  components: { Legend },
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    let echarts = global.$echarts;
    const Legend = ref(null);
    const message = ref({
      msg: "收起",
      flag: true,
    });
    const contrast = ref({
      msg: "收起对比窗口",
      flag: true,
    });
    let city1 = ref({
      CMIP_Value: "WSDI",
      name: "河北",
      data: [1.88229888482, 6.91878883065, 20.0275192027],
    });
    let city2 = ref({
      CMIP_Value: "WSDI",
      name: "云南",
      data: [11.1327442957, 21.3738245735, 38.8525626326],
    });
    onMounted(() => {
      MapZoom();
      RasterLoad();
      drawContrast();
      designHoverOnMap();
      designClickOnMap();
    });
    //卸载完成
    onUnmounted(() => {
      DELOverlay();
      DELdesignHoverOnMap();
      DELdesignClickOnMap();
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
    const SSP_Value = ref("SSP2-4.5");
    // 底图缩放至初始位置
    let MapZoom = () => {
      global.$mapConfig.MapZoom(110, 35, 4.5);
    };
    // 结果图加载
    let RasterLoad = () => {
      DELOverlay();
      global.$mapConfig.removeRaster();
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
      global.$mapConfig.addVectorLayer("./geojson/China_SEN.geojson", 0.5);
      global.$mapConfig.addCAV();
      Legend.value.legendRender();
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
    // 对比及地图点击弹窗
    // 对比按钮点击
    let contrastBtn = () => {
      city1.value.name = "";
      city2.value.name = "";
    };
    let drawContrast = () => {
      var chartDom = document.getElementById("contrast-content");
      var myChart = echarts.init(chartDom);
      var option;

      option = {
        title: {
          text: "区域变化均值对比",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "shadow",
          },
        },
        legend: {},
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: {
          type: "value",
          boundaryGap: [0, 0.01],
        },
        yAxis: {
          type: "category",
          data: ["SSP1-2.6", "SSP2-4.5", "SSP5-8.5"],
        },
        series: [
          {
            name: city1.value.name,
            type: "bar",
            data: [city1.value.data[0], city1.value.data[1], city1.value.data[2]],
          },
          {
            name: city2.value.name,
            type: "bar",
            data: [city2.value.data[0], city2.value.data[1], city2.value.data[2]],
          },
        ],
      };
      option && myChart.setOption(option);
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
        // 对比事件数据
        let overlay = global.$mapConfig.getOverlay();
        if (city2.value.name != "") {
          overlay.setPosition(coordinate);
        } else {
          overlay.setPosition(undefined);
        }
        if (city1.value.name == "") {
          city1.value.CMIP_Value = CMIP_Value.value;
          city1.value.name = features.feature.values_.NAME;
          city1.value.data[0] = data1;
          city1.value.data[1] = data2;
          city1.value.data[2] = data3;
        } else if (city2.value.name == "") {
          city2.value.CMIP_Value = CMIP_Value.value;
          city2.value.name = features.feature.values_.NAME;
          city2.value.data[0] = data1;
          city2.value.data[1] = data2;
          city2.value.data[2] = data3;
          drawContrast();
        }
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
      Legend,
      message,
      city1,
      city2,
      contrast,
      contrastBtn,
      drawContrast,
      resultShow,
      resultShow1,
      CMIP_Value,
      CMIP_Options,
      SSP_Value,
      RasterLoad,
      removeLayer,
      DELOverlay,
    };
  },
};
</script>
<style></style>
