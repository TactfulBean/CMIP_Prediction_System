<template>
  <el-menu
    id="aside-menu"
    class="aside-menu"
    :router="true"
    :alwaysShow="true"
    :default-openeds="opened"
    :default-active="default_active"
    active-text-color="#409EFF"
    background-color="#fff"
  >
    <template v-for="(item, index) in menulist" :key="index">
      <!-- <el-sub-menu v-if="item.child" :index="item.router">
        <template #title
          ><span class="iconfont">{{ item.icon }} </span><span id="top_menu_title">{{ item.name }}</span></template
        > -->
      <!-- <template v-for="(item2, index2) in item.child" :key="index2">
          <el-sub-menu v-if="item2.child" :index="item2.router">
            <template #title>{{ item2.name }}</template>
            <el-menu-item v-for="(child3, index3) in item2.child" :key="index3" :index="child3.router">
              <template #title> {{ child3.name }} </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item2.router">
            <template #title>
              <span class="iconfont">{{ item2.icon }} </span><span id="top_menu_title">{{ item2.name }}</span>
            </template>
          </el-menu-item>
        </template> -->
      <!-- </el-sub-menu> -->
      <!-- <el-menu-item v-else :index="item.router"> -->
      <el-menu-item :index="item.router">
        <template #title
          ><span class="iconfont">{{ item.icon }} </span><span id="top_menu_title">{{ item.name }}</span>
        </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
import { reactive, getCurrentInstance, ref } from "vue";
export default {
  setup() {
    let global = getCurrentInstance().appContext.config.globalProperties;
    // 默认展开的菜单
    let opened = reactive(["1", "2", "3"]);
    // 保持菜单刷新后选中项高亮
    let default_active = global.$router.currentRoute._value.fullPath.split("/")[1];
    // 菜单项点击事件
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
    return {
      menulist,
      opened,
      default_active,
    };
  },
};
</script>
<style></style>
