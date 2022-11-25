<template>
  <div class="home-container">
    <el-container>
      <el-header><Header></Header></el-header>
      <el-container>
        <el-aside width="200px"><Aside></Aside></el-aside>
        <el-main>
          <Main></Main>
          <router-view></router-view>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>
<script>
import Header from "@/components/Header.vue";
import Aside from "@/components/Aside.vue";
import Main from "@/components/Main.vue";

export default {
  setup() {},
  components: {
    Header,
    Aside,
    Main,
  },
};
</script>
<style>
.el-aside {
  background-color: #99ccff;
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
</style>
