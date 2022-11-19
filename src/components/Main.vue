<template>
  <div id="map" class="map">
    <div id="top-menu">
      <TopMenu></TopMenu>
    </div>
    <div id="tool-bar">
      <ToolBar></ToolBar>
    </div>
  </div>
</template>
<script>
import { onMounted, getCurrentInstance } from "vue";
import TopMenu from "@/components/TopMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    onMounted(() => {
      global.$mapConfig.initMap();
    });
  },
  components: { TopMenu, ToolBar },
};
</script>
<style>
#map {
  height: 100%;
}
/* 鼠标位置 */
.custom-mouse-position {
  display: inline-block;
  position: absolute;
  top: 2px;
  left: 8px;
  padding-top: 4px;
  height: 22px;
  width: 147px;
  color: rgb(67, 67, 148);
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: 3px;
  background-color: rgba(153, 204, 255);
  box-shadow: 2px 2px 3px rgb(0 0 0 / 20%);
}
/* 比例尺 */
.ol-scale-line.ol-unselectable {
  display: inline-block;
  position: absolute;
  height: 19px;
  top: 35px;
  font-weight: 700;
  background-color: rgba(153, 204, 255);
  box-shadow: 2px 2px 3px rgb(0 0 0 / 20%);
}
.ol-scale-line-inner {
  color: rgb(67, 67, 148);
  border: 1px solid rgb(67, 67, 148);
  border-top: none;
}
#top-menu {
  z-index: 10;
  position: absolute;
  right: 20px;
  display: inline-block;
}
</style>
