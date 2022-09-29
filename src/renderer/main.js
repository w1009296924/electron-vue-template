import Vue from "vue";

import App from "./App";
import router from "./router";
import store from "./store";
// 引用element
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css";
import "./permission";
// 日志
import "./error";
import "./icons";
import "@/styles/index.scss";
import "@/styles/dark-mode.scss";

// 引入 i18n 语言包
import VueI18n from "vue-i18n";
import loadLanguage from "./i18n";
const languages = loadLanguage();

if (!process.env.IS_WEB) {
  if (!require("../../config").IsUseSysTitle) {
    require("@/styles/custom-title.scss");
  }
}

// 创建 i18n
Vue.use(VueI18n); // 新版本必须要这个，不知道为什么
const i18n = new VueI18n({
  locale: "zh-CN", // 设置默认语言
  messages: languages, // 设置语言包
});

Vue.use(ElementUI, {
  i18n: (key, value) => i18n.t(key, value),
});

Vue.config.productionTip = false;
/* eslint-disable no-new */
const vue = new Vue({
  components: { App },
  router,
  store,
  i18n,
  template: "<App/>",
}).$mount("#app");
console.log(window.devicePixelRatio);
console.log(window);
// if (window.devicePixelRatio != 1) {//检查配置
const devInnerHeight = 975.0; // 开发时的InnerHeight
const devDevicePixelRatio = 1.0; // 开发时的devicepixelratio
const devScaleFactor = 1.0; // 开发时的ScaleFactor
const zoomFactor =
  (window.innerHeight / devInnerHeight) *
  (window.devicePixelRatio / devDevicePixelRatio) *
  (devScaleFactor / window.devicePixelRatio);
require("electron").webFrame.setZoomFactor(zoomFactor);
console.log(window.innerHeight);
console.log(devInnerHeight);
console.log(window.devicePixelRatio);
console.log(zoomFactor);
// }

export default vue;
