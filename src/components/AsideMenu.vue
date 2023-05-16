<template>
	<el-menu
		id="aside-menu"
		class="aside-menu"
		:router="true"
		:alwaysShow="true"
		:default-active="default_active"
		active-text-color="#409EFF"
		background-color="#fff"
		mode="horizontal"
		:ellipsis="false"
	>
		<template v-for="item in menuList" :key="index">
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
let menuList = reactive([
	{
		name: "极端气候变化格局",
		router: "timeline",
		icon: "\ue600"
	},
	{
		name: "气候指数空间趋势",
		router: "trend",
		icon: "\ue600"
	},
	{
		name: "区域气候指数对比",
		router: "area",
		icon: "\ue626"
	},
	{
		name: "全球空间趋势总览",
		router: "globe",
		icon: "\ue76c"
	}
]);
</script>
<style scoped>
.aside-menu {
	left: 0.5%;
	position: absolute;
	z-index: 99;
	height: 40px;
	background-color: #ffffff;
	border-radius: 5px;
	box-shadow: 2px 2px 3px rgb(0 0 0 / 30%);
}
#top_menu_title {
	padding: 0 5px;
}
</style>
