<template>
  <el-menu
    id="aside-menu"
    class="aside-menu"
    :router="true"
    :alwaysShow="true"
    :default-active="default_active"
    active-text-color="#409EFF"
    background-color="#fff"
  >
    <template v-for="item in menulist" :key="index">
      <el-menu-item :index="item.router">
        <template #title
          ><span class="iconfont">{{ item.icon }} </span><span id="top_menu_title">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script setup>
import { reactive, getCurrentInstance } from "vue";
let global = getCurrentInstance().appContext.config.globalProperties;
let default_active = global.$router.currentRoute._value.fullPath.split("/")[1];
let menulist = reactive([
  {
    name: "极端气候变化格局",
    router: "timeline",
    icon: "\ue600",
  },
  {
    name: "气候指数空间趋势",
    router: "trend",
    icon: "\ue600",
  },
  {
    name: "区域气候指数对比",
    router: "area",
    icon: "\ue626",
  },
  {
    name: "全球空间趋势总览",
    router: "globe",
    icon: "\ue76c",
  },
]);
</script>
<style></style>
