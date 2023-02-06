<template>
  <el-menu :ellipsis="false" mode="horizontal" background-color="#4c6cb3" text-color="#fff" active-text-color="#409EFF">
    <div class="title">CMIP6-极端气候预测系统</div>
    <div class="flex-grow" />
    <el-menu-item index="1" @click="jumpPage('https://tactfulbean.tk/')">
      <span class="nav-item" style="padding-left: 5px"><span class="iconfont">&#xeaf9; </span>Blog</span></el-menu-item
    >
    <el-menu-item index="2" @click="jumpPage('https://github.com/TactfulBean')"
      ><span class="nav-item" style="padding-left: 5px"><span class="iconfont">&#xe673; </span>Github</span></el-menu-item
    >
  </el-menu>
</template>
<script>
export default {
  setup() {
    let jumpPage = (path) => {
      window.location.href = path;
    };
    return {
      jumpPage,
    };
  },
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
