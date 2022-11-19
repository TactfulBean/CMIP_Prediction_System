<template>
  <el-menu
    class="aside-menu"
    :router="true"
    :alwaysShow="true"
    :default-openeds="opened"
    :default-active="default_active"
    active-text-color="#409EFF"
    background-color="#fff"
  >
    <template v-for="(item, index) in menulist" :key="index">
      <el-sub-menu v-if="item.child" :index="item.router">
        <template #title>{{ item.name }}</template>
        <template v-for="(item2, index2) in item.child" :key="index2">
          <el-sub-menu v-if="item2.child" :index="item2.router">
            <template #title>{{ item2.name }}</template>
            <el-menu-item v-for="(child3, index3) in item2.child" :key="index3" :index="child3.router">
              <!-- <el-icon><component :is="item.icon"></component></el-icon> -->
              <template #title> {{ child3.name }} </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item2.router">
            <!-- <el-icon><component :is="item.icon"></component></el-icon> -->
            <template #title> {{ item2.name }} </template>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="item.router">
        <!-- <el-icon><component :is="item.icon"></component></el-icon> -->
        <template #title>{{ item.name }} </template>
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
        name: "功能集1",
        router: "1",
        child: [
          {
            name: "功能1",
            router: "function1",
          },
          {
            name: "功能2",
            router: "function2",
          },
        ],
      },
      {
        name: "功能集2",
        router: "2",
        child: [
          {
            name: "功能1",
            router: "render1",
          },
          {
            name: "功能2",
            router: "render2",
          },
        ],
      },
      {
        name: "功能集3",
        router: "3",
        child: [
          {
            name: "功能1",
            router: "analyze1",
          },
          {
            name: "功能2",
            router: "analyze2",
          },
        ],
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
