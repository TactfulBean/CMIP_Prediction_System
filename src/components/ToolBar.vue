<template>
  <div id="tool-bar">
    <div><el-button type="primary" class="tool-button" plain circle>11</el-button></div>
    <div><el-button type="primary" class="tool-button" plain circle>22</el-button></div>
    <div><el-button type="primary" class="tool-button" plain circle>33</el-button></div>
  </div>
</template>
<script>
export default {
  components: {},
  setup() {},
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
  background-color: rgb(0, 130, 200);
  opacity: 0.75;
  right: 0;
}
#tool-bar:hover {
  opacity: 1;
  transition: 0.5s;
}
.tool-button {
  text-align: center;
  width: 30px;
  height: 30px;
  margin: 4px 2px;
  transition: 0.5s;
}
</style>
