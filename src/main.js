import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//
import * as echarts from "echarts";
//
import axios from "axios";
//
import "@/assets/css/global.css";
import "@/assets/css/animation.css";
import "@/assets/css/result.css";
//
import mapConfig from "@/assets/js/mapConfig";
//
import "@/assets/icon/iconfont.js";
import "@/assets/icon/iconfont.css";

const app = createApp(App);
app.config.globalProperties.$mapConfig = mapConfig;
app.config.globalProperties.$echarts = echarts;
app.config.globalProperties.$axios = axios;

app.use(router).use(ElementPlus).mount("#app");
