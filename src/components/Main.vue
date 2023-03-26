<template>
  <div id="map" class="map">
    <div id="top-menu">
      <TopMenu></TopMenu>
    </div>
    <ToolBar></ToolBar>
  </div>
</template>
<script setup>
import { onMounted, getCurrentInstance } from "vue";
import TopMenu from "@/components/TopMenu.vue";
import ToolBar from "@/components/ToolBar.vue";
const global = getCurrentInstance().appContext.config.globalProperties;
onMounted(() => {
  global.$mapConfig.initMap();
});
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
  width: 120px;
  color: rgb(67, 67, 148);
  text-align: center;
  font-size: 14px;
  font-weight: 700;
  border-radius: 3px;
  background-color: rgba(153, 204, 255);
  box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
  border: 3px solid rgb(255, 255, 255);
}
/* 比例尺 */
.ol-scale-line.ol-unselectable {
  display: inline-block;
  position: absolute;
  height: 19px;
  top: 35px;
  font-weight: 700;
  background-color: rgba(153, 204, 255);
  box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
  border: 3px solid rgb(255, 255, 255);
}
.ol-scale-line-inner {
  color: rgb(67, 67, 148);
  border: 1px solid rgb(67, 67, 148);
  border-top: none;
}
.ol-overviewmap {
  left: auto;
  right: 10px;
  top: 50px;
  bottom: auto;
}
#top-menu {
  z-index: 10;
  position: absolute;
  right: 20px;
  display: inline-block;
}
.ol-popup {
  position: absolute;
  background-color: white;
  -webkit-filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  filter: drop-shadow(0 1px 4px rgba(0, 0, 0, 0.2));
  padding: 15px;
  border-radius: 10px;
  border: 1px solid #cccccc;
  bottom: 12px;
  left: -50px;
}
.ol-popup:after,
.ol-popup:before {
  top: 100%;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  position: absolute;
  pointer-events: none;
}
.ol-popup:after {
  border-top-color: white;
  border-width: 10px;
  left: 48px;
  margin-left: -10px;
}
.ol-popup:before {
  border-top-color: #cccccc;
  border-width: 11px;
  left: 48px;
  margin-left: -11px;
}
.ol-popup-closer {
  text-decoration: none;
  position: absolute;
  top: 2px;
  right: 8px;
}
.ol-popup-closer:after {
  content: "✖";
}
</style>
