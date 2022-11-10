<template>
  <div id="map" class="map"></div>
</template>
<script>
import { onMounted, getCurrentInstance } from "vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    onMounted(() => {
      global.$mapConfig.initMap();
    });
  },
  components: {},
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
  border-radius: 3px;
  background-color: rgba(153, 204, 255);
}
/* 比例尺 */
.ol-scale-line.ol-unselectable {
  display: inline-block;
  position: absolute;
  height: 19px;
  top: 30px;
  background-color: rgba(153, 204, 255);
}
.ol-scale-line-inner {
  color: rgb(67, 67, 148);
  border: 1px solid rgb(67, 67, 148);
  border-top: none;
}
</style>
