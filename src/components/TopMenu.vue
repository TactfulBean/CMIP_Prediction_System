<template>
  <el-menu class="top-menu" :unique-opened="true" mode="horizontal" :alwaysShow="true" :ellipsis="false">
    <template v-for="(item, index) in menulist" :key="index">
      <el-sub-menu v-if="item.child" :index="item.router">
        <template #title>{{ item.name }}</template>
        <template v-for="(item2, index2) in item.child" :key="index2">
          <el-sub-menu v-if="item2.child" :index="item2.router">
            <template #title>{{ item2.name }}</template>
            <el-menu-item
              v-for="(child3, index3) in item2.child"
              :key="index3"
              :index="child3.router"
              @click="menuClick(child3.router)"
            >
              <template #title> {{ child3.name }} </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item2.router" @click="menuClick(item2.router)">
            <template #title> {{ item2.name }} </template>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="item.router" @click="menuClick(item.router)">
        <template #title>{{ item.name }} </template>
      </el-menu-item>
    </template>
  </el-menu>
</template>
<script>
import { reactive, getCurrentInstance } from "vue";
export default {
  setup() {
    const global = getCurrentInstance().appContext.config.globalProperties;
    const menuClick = (menu_router) => {
      global.$mapConfig.menuClickEvent(menu_router);
    };
    const menulist = reactive([
      {
        name: "地图",
        router: "1",
        child: [
          {
            name: "OSM地图",
            router: "map1",
          },
          {
            name: "天地图",
            router: "map2",
          },
          {
            name: "高德地图",
            router: "map3",
          },
          {
            name: "高德影像",
            router: "map4",
          },
        ],
      },
      {
        name: "快速定位",
        router: "2",
        child: [
          {
            name: "定位1",
            router: "position1",
          },
          {
            name: "定位2",
            router: "position2",
          },
          {
            name: "定位3",
            router: "position3",
          },
        ],
      },
    ]);
    return {
      menulist,
      menuClick,
    };
  },
};
</script>
<style>
.el-menu {
  border: 0px;
}
.top-menu {
  height: 30px;
  background-color: #ffffff;
  border-radius: 5px;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 20%);
}
</style>
