<template>
  <div id="show">
    <el-button type="primary" :class="{ open: message.flag, close: !message.flag }" @click="resultShow">{{
      message.msg
    }}</el-button>
  </div>
  <div id="render" :class="{ 'result-open': message.flag, 'result-close': !message.flag }">
    <el-card class="box-card">
      <!-- 指数选择器 -->
      <span>极端指数选择：</span>
      <el-select v-model="value" class="m-2" placeholder="Select" @change="monDisabled">
        <el-option v-for="item in options" :key="item.value" :label="item.label" :value="item.value" />
      </el-select>
      <!-- 时间条 -->
      <div class="slider-demo-block">
        <span class="demonstration">年份选择：</span>
        <el-slider v-model="yearValue" :min="yearMin" :max="yearMax" step="1" show-input />
      </div>
      <div class="slider-demo-block">
        <span class="demonstration">月份选择：</span>
        <el-slider v-model="monValue" :min="monMin" :max="monMax" step="1" show-input :disabled="disabled" />
      </div>
    </el-card>
  </div>
</template>
<script>
import { ref, getCurrentInstance } from "vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    const message = ref({
      msg: "收起结果",
      flag: true,
    });
    let resultShow = () => {
      if (message.value.flag) {
        message.value.msg = "展开结果";
        message.value.flag = false;
      } else {
        message.value.msg = "收起结果";
        message.value.flag = true;
      }
    };
    const value = ref("Option1");
    const options = [
      {
        label: "指数1",
        value: "Option1",
      },
      {
        label: "指数2",
        value: "Option2",
      },
      {
        label: "指数3",
        value: "Option3",
      },
      {
        label: "指数4",
        value: "Option4",
      },
      {
        label: "指数5",
        value: "Option5",
      },
    ];
    let monDisabled = () => {
      if (value.value == "Option5" || value.value == "Option4") {
        disabled.value = true;
      } else {
        disabled.value = false;
      }
    };

    const yearValue = ref(2021);
    const monValue = ref(1);
    const yearMin = 2021;
    const yearMax = 2050;
    const monMin = 1;
    const monMax = 12;
    const disabled = ref(false);
    return {
      message,
      resultShow,
      value,
      options,
      monDisabled,
      yearValue,
      monValue,
      yearMin,
      yearMax,
      monMin,
      monMax,
      disabled,
    };
  },
};
</script>
<style>
#show {
  position: absolute;
  z-index: 10;
  bottom: 252px;
}
#render {
  position: absolute;
  z-index: 10;
  width: 100%;
  bottom: 0;
}
.box-card {
  height: 250px;
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
    transform: translateY(252px);
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
    transform: translateY(252px);
  }
}
.result-open {
  animation: result-open 0.75s !important;
}
.result-close {
  animation: result-close 0.75s !important;
  transform: translateY(100%);
}
.open {
  animation: open 0.75s !important;
}
.close {
  animation: close 0.75s !important;
  transform: translateY(252px);
}
</style>
