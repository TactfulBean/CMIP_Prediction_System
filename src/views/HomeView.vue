<template>
  <div class="home-container">
    <el-container>
      <el-header><Header></Header></el-header>
      <el-container>
        <el-aside width="200px" id="asideMenu"><Aside></Aside></el-aside>
        <el-main>
          <Main></Main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script setup>
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Main from "@/components/Main.vue";
</script>
<style>
.el-aside {
  /* background-color: #69a6e4; */
  background-color: #e0e0e0;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 20%);
  z-index: 10;
  overflow: hidden;
}
.el-header {
  padding: 0;
  height: 58px;
  box-shadow: 2px 2px 3px rgb(0 0 0 / 20%);
  z-index: 10;
}
.el-main {
  padding: 0;
  width: auto;
  position: relative;
  overflow: hidden;
}
#top_menu_title {
  font-size: 16px;
  padding: 0 8px;
}
</style>
