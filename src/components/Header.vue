<template>
  <el-menu :ellipsis="false" mode="horizontal" background-color="#434394" text-color="#fff" active-text-color="#409EFF">
    <div class="title">测试</div>
    <div class="flex-grow" />
    <el-menu-item index="1" @click="jumpPage('https://tactfulbean.eu.org/')">
      <span class="nav-item" style="padding-left: 5px">Blog</span></el-menu-item
    >
    <el-menu-item index="2" @click="jumpPage('https://github.com/TactfulBean')"
      ><span class="nav-item" style="padding-left: 5px">Github</span></el-menu-item
    >
  </el-menu>
</template>
<script>
export default {
  setup() {},
  components: {},
};
</script>
<style>
.title {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 20px;
  color: #fff;
  font-size: 24px;
}
.flex-grow {
  flex-grow: 1;
}
</style>
