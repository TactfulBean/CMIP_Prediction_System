<template>
  <div id="tool-bar">
    <div>
      <el-tooltip class="box-item" effect="customized" content="返回初始位置" placement="left-start">
        <el-button type="primary" class="tool-button" plain circle @click="btn1Click()"><span class="iconfont">&#xe60b; </span></el-button>
      </el-tooltip>
    </div>
    <div>
      <el-tooltip class="box-item" effect="customized" content="清除图层" placement="left-start">
        <el-button type="primary" class="tool-button" plain circle @click="btn2Click()"><span class="iconfont">&#xe74b; </span></el-button>
      </el-tooltip>
    </div>
  </div>
</template>
<script>
import { ref, getCurrentInstance } from "vue";
export default {
  components: {},
  setup() {
    let global = getCurrentInstance().appContext.config.globalProperties;
    let plain = ref([true, true, true, true, true, true]);
    let isOn = (no) => {
      if (plain.value[no] == true) {
        plain.value[no] = false;
      } else {
        plain.value[no] = true;
      }
    };
    let btn1Click = () => {
      global.$mapConfig.MapZoom(110, 35, 4.5);
    };
    let btn2Click = () => {
      global.$mapConfig.removeLayer();
    };
    // 位置切换
    return {
      plain,
      isOn,
      btn1Click,
      btn2Click,
    };
  },
};
</script>
<style>
#tool-bar {
  transition: 0.5s;
  position: absolute;
  z-index: 10;
  width: 34px;
  top: 25%;
  border-radius: 10px;
  background-color: rgb(236, 246, 255);
  opacity: 0.75;
  right: 0;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 40%);
  border: 2px solid rgb(110, 182, 255);
}
#tool-bar:hover {
  opacity: 1;
  transition: 0.8s;
}
.tool-button {
  text-align: center;
  width: 30px;
  height: 30px;
  margin: 4px 2px;
  transition: 0.8s;
}
.el-popper.is-customized {
  font-size: 14px;
  color: #000;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
  border: 1px solid #409eff;
  background: #fff;
}
.el-popper.is-customized .el-popper__arrow::before {
  border: 1px solid #409eff;
  background: #fff;
  right: 0;
}
</style>
