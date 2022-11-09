import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
//ElementPlus
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
//
import "@/assets/css/global.css";

createApp(App).use(router).mount("#app");
