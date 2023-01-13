<template>
  <el-menu class="top-menu" :unique-opened="true" mode="horizontal" :alwaysShow="true" :ellipsis="false">
    <template v-for="(item, index) in menulist" :key="index">
      <el-sub-menu v-if="item.child" :index="item.router">
        <template #title
          ><span class="iconfont">{{ item.icon }} </span><span id="top_menu_title">{{ item.name }}</span></template
        >
        <template v-for="(item2, index2) in item.child" :key="index2">
          <el-sub-menu v-if="item2.child" :index="item2.router">
            <template #title>{{ item2.name }}</template>
            <el-menu-item
              v-for="(child3, index3) in item2.child"
              :key="index3"
              :index="child3.router"
              @click="menuClick(child3.router, item3.type)"
            >
              <template #title> {{ child3.name }} </template>
            </el-menu-item>
          </el-sub-menu>
          <el-menu-item v-else :index="item2.router" @click="menuClick(item2.router, item2.type)">
            <template #title>
              <span class="iconfont">{{ item2.icon }} </span><span id="top_menu_title">{{ item2.name }}</span>
            </template>
          </el-menu-item>
        </template>
      </el-sub-menu>
      <el-menu-item v-else :index="item.router" @click="menuClick(item.router, item.type)">
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
    const menuClick = (menu_router, type) => {
      if (type == "map") {
        global.$mapConfig.menuClickEvent(menu_router);
      }
      if (type == "location") {
        global.$mapConfig.location(menu_router[0], menu_router[1]);
      }
    };
    const menulist = reactive([
      {
        name: "地图",
        router: "1",
        icon: "\ue620",
        type: "map",
        child: [
          {
            name: "天地图",
            router: "map1",
            icon: "\ue620",
            type: "map",
          },
          {
            name: "天地图-卫星图",
            router: "map2",
            icon: "\ue620",
            type: "map",
          },
          {
            name: "雷林",
            router: "map3",
            icon: "\ue620",
            type: "map",
          },
        ],
      },
      {
        name: "快速定位",
        router: "2",
        icon: "\ue60b",
        type: "location",
        child: [
          {
            name: "北京",
            router: [116.41667, 39.91667],
            icon: "\ue60b",
            type: "location",
          },
          {
            name: "石家庄",
            router: [114.48333, 38.03333],
            icon: "\ue60b",
            type: "location",
          },
          {
            name: "杭州",
            router: [120.2, 30.26667],
            icon: "\ue60b",
            type: "location",
          },
          {
            name: "上海",
            router: [121.43333, 31.22],
            icon: "\ue60b",
            type: "location",
          },
          {
            name: "成都",
            router: [104.04, 30.4],
            icon: "\ue60b",
            type: "location",
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
#top_menu_title {
  padding: 0 5px;
}
</style>
