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
    const SSP_Value = ref("SSP2-4.5");
    // 底图缩放至初始位置
    let MapZoom = () => {
      global.$mapConfig.MapZoom(160, 20, 0);
    };
    // 结果图加载
    let RasterLoad = () => {
      global.$mapConfig.removeRaster();
      global.$mapConfig.addRasterLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_MK_SEN_World");
      global.$mapConfig.addFeatureLayer("World");
      global.$mapConfig.addCAV();
      Legend.value.legendRender();
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
      CMIP_Options,
      SSP_Value,
      RasterLoad,
      removeLayer,
    };
  },
};
</script>
<style></style>
