import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//
import "@/assets/css/global.css";
//
import mapConfig from "@/assets/js/mapConfig";

const app = createApp(App);
app.config.globalProperties.$mapConfig = mapConfig;
app.use(router).use(ElementPlus).mount("#app");
