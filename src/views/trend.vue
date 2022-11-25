<template>
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
      <!-- 时间条 -->
      <!-- <div class="slider-demo-block">
        <span class="demonstration">年份选择：</span>
        <el-slider v-model="yearValue" :min="yearMin" :max="yearMax" step="1" show-input :disabled="disabled_year" />
      </div>
      <div class="slider-demo-block">
        <span class="demonstration">月份选择：</span>
        <el-slider v-model="monValue" :min="monMin" :max="monMax" step="1" show-input :disabled="disabled_mon" />
      </div> -->
    </el-card>
  </div>
</template>
<script>
import { ref, onMounted, getCurrentInstance } from "vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    const message = ref({
      msg: "收起",
      flag: true,
    });
    onMounted(() => {
      global.$mapConfig.addLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_" + Method_Value.value);
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
    // const yearValue = ref(2021);
    // const monValue = ref(1);
    // const yearMin = 2021;
    // const yearMax = 2050;
    // const monMin = 1;
    // const monMax = 12;
    // const disabled_year = ref(false);
    // const disabled_mon = ref(false);
    //
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
    // let monDisabled = () => {
    //   let value2;
    //   if (value.value == "CMIP:CSDI_") {
    //     disabled_year.value = true;
    //     disabled_mon.value = true;
    //   } else {
    //     disabled_year.value = false;
    //     disabled_mon.value = false;
    //   }
    //   if (value.value == "CMIP:CSDI_") {
    //     value2 = "_MK";
    //   }
    //   // CMIP:CSDI_SSP5-8.5_MK
    //   global.$mapConfig.addLayer(value.value + SSP_Value.value + value2);
    // };

    // 结果图加载
    let RasterLoad = () => {
      global.$mapConfig.addLayer("CMIP:" + CMIP_Value.value + "_" + SSP_Value.value + "_" + Method_Value.value);
      // global.$mapConfig.addLayer("CMIP:TX90P_SSP1-2.6_SEN");
    };
    let removeLayer = () => {
      global.$mapConfig.removeLayer();
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
      // monDisabled,
      // yearValue,
      // monValue,
      // yearMin,
      // yearMax,
      // monMin,
      // monMax,
      // disabled_year,
      // disabled_mon,
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
</style>
