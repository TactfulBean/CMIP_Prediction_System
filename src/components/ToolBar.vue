<template>
  <div id="tool-bar">
    <div>
      <el-tooltip class="box-item" effect="customized" content="返回初始位置" placement="left-start">
        <el-button type="primary" class="tool-button" plain circle @click="btn1Click()"
          ><span class="iconfont">&#xe60b; </span></el-button
        >
      </el-tooltip>
    </div>
    <div>
      <el-tooltip class="box-item" effect="customized" content="清除图层" placement="left-start">
        <el-button type="primary" class="tool-button" plain circle @click="btn2Click()"
          ><span class="iconfont">&#xe74b; </span></el-button
        >
      </el-tooltip>
    </div>
    <!-- <div>
      <el-tooltip class="box-item" effect="customized" content="鹰眼模块" placement="left-start">
        <el-button type="primary" class="tool-button" :plain="plain[3]" circle @click="isOn(3)"
          ><span class="iconfont">&#xe76c; </span></el-button
        >
      </el-tooltip>
    </div> -->
    <div>
      <el-tooltip class="box-item" effect="customized" content="卫星图" placement="left-start">
        <el-button type="primary" class="tool-button" plain circle @click="btn5Click()"
          ><span class="iconfont">&#xe608; </span></el-button
        >
      </el-tooltip>
    </div>
    <!-- <div>
      <el-tooltip class="box-item" effect="customized" content="全屏" placement="left-start">
        <el-button type="primary" class="tool-button" :plain="plain[5]" circle @click="isOn(5)"
          ><span class="iconfont">&#xe615; </span></el-button
        >
      </el-tooltip>
    </div> -->
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
      global.$mapConfig.location(110, 35);
    };
    let btn2Click = () => {
      global.$mapConfig.removeLayer();
    };
    let btn3Click = () => {
      // global.$mapConfig.changeMap();
    };
    let btn4Click = () => {
      // global.$mapConfig.changeMap();
    };
    let btn5Click = () => {
      global.$mapConfig.changeMap();
    };
    let btn6Click = () => {
      // global.$mapConfig.changeMap();
    };
    return {
      plain,
      isOn,
      btn1Click,
      btn2Click,
      btn3Click,
      btn4Click,
      btn5Click,
      btn6Click,
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
  /* rgb(110, 182, 255) */
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
  color: #fff;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
  border: 2px solid rgb(255, 255, 255);
  background: rgb(153, 204, 255);
}

.el-popper.is-customized .el-popper__arrow::before {
  border: 2px solid rgb(255, 255, 255);
  background: rgb(153, 204, 255);
  right: 0;
}
</style>
