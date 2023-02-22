<template>
  <Legend :CMIP_Value="CMIP_Value" :Type="Type" ref="Legend"></Legend>
  <el-button type="primary" id="show-trend" :class="{ open_trend: message.flag, close_trend: !message.flag }" @click="resultShow">{{
    message.msg
  }}</el-button>
  <el-card id="trend" class="box-card-trend" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <!-- 指数选择器 -->
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
</template>
<script>
import { ref, onMounted, getCurrentInstance } from "vue";
import Legend from "@/components/Legend.vue";
export default {
  components: { Legend },
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    const Legend = ref(null);
    const message = ref({
      msg: "收起",
      flag: true,
    });
    onMounted(() => {
      global.$mapConfig.MapZoom(160, 20, 0);
      global.$mapConfig.removeRaster();
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      global.$mapConfig.addFeatureLayer("World");
      global.$mapConfig.addCAV();
      Legend.value.legendRender();
      // RasterLoad();
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
    // 结果图加载
    let RasterLoad = () => {
      // global.$mapConfig.removeRaster();
      // global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      // global.$mapConfig.addFeatureLayer("World");
      // global.$mapConfig.addCAV();
      global.$mapConfig.changeSource("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      Legend.value.legendRender();
    };
    let ReLoad = () => {
      global.$mapConfig.removeRaster();
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN");
      global.$mapConfig.addVectorLayer("./geojson/China_SEN.geojson", 0.5);
      global.$mapConfig.addCAV();
    };
    // 清除图层
    let removeLayer = () => {
      global.$mapConfig.removeRaster();
    };
    return {
      message,
      Legend,
      resultShow,
      CMIP_Value,
      Type,
      SSP_Value,
      RasterLoad,
      ReLoad,
      removeLayer,
    };
  },
};
</script>
<style></style>
