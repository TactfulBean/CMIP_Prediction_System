<template>
  <div class="home-container">
    <el-container>
      <el-header><Header></Header></el-header>
      <el-container>
        <el-aside width="200px"><Aside></Aside></el-aside>
        <el-main><Main></Main></el-main>
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
.el-header {
  font-size: 20px;
  background-color: #434394;
}
.el-aside {
  width: 200px;
  background-color: #99ccff;
}
.el-main {
  width: auto;
  position: relative;
  overflow: hidden;
}
</style>
