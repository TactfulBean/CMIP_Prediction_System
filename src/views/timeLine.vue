<template>
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
              <el-radio-button label="WSDI">WSDI</el-radio-button>
              <el-radio-button label="CSDI">CSDI</el-radio-button>
              <el-radio-button label="TN10P">TN10P</el-radio-button>
              <el-radio-button label="TN90P">TN90P</el-radio-button>
              <el-radio-button label="TX10P">TX10P</el-radio-button>
              <el-radio-button label="TX90P">TX90P</el-radio-button>
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
        <el-slider v-model="year" :step="10" show-stops :min="2021" :max="2100" @change="print()" />
      </div>
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
      global.$mapConfig.MapZoom(125, 35, 4.5);
      global.$mapConfig.removeRaster();
      global.$mapConfig.addCAV();
      RasterLoad();
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
    const year = ref(2021);
    let timeSet = ref({
      interval: null,
      message: "暂停播放",
      flag: true,
    });

    let RasterLoad = () => {
      year.value = 2021;
      clearInterval(timeSet.value.interval);
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
        console.log("计时器调用" + year.value);
        // 方法体
        if (year.value >= 2100) {
          timeSet.value.message = "重新播放";
          clearInterval(timeSet.value.interval);
        }
      }, 2000);
      timeSet.value.message = "暂停播放";
    };
    let reTimeSet = () => {
      if (timeSet.value.message == "继续播放") {
        setTimeSet();
        timeSet.value.message = "暂停播放";
      } else if (timeSet.value.message == "暂停播放") {
        clearInterval(timeSet.value.interval);
        console.log("计时器停止");
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
      console.log("手动选择" + year.value);
    };
    return {
      message,
      resultShow,
      CMIP_Value,
      year,
      timeSet,
      RasterLoad,
      reTimeSet,
      print,
    };
  },
};
</script>
<style>
#time {
  position: absolute;
  z-index: 10;
  width: 100%;
  bottom: 0;
}
#show-time {
  position: absolute;
  z-index: 10;
  bottom: 152px;
}
.box-card-time {
  height: 150px;
}
.open_time {
  animation: open-tean 0.75s !important;
}
.close_time {
  animation: close-time 0.5s !important;
  transform: translateY(152px);
}
@keyframes open-tean {
  from {
    transform: translateY(152px);
  }
  to {
    transform: translateY(0);
  }
}
@keyframes close-time {
  from {
    transform: translateY(0);
  }
  to {
    transform: translateY(152px);
  }
}
.slider-demo-block {
  padding: 0 30px;
}
</style>
