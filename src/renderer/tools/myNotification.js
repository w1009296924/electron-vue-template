// import { BrowserWindow, screen } from "electron";
// const { BrowserWindow, screen } = require("electron");

// win.showInactive(); // 显示但不聚焦于窗口（建议做延时处理）

export default {
  DesktopMsg(option) {
    const { BrowserWindow, screen } = require("@electron/remote");
    // const { winURL } = require("../../main/config/StaticPath");
    const winURL =
      process.env.NODE_ENV === "development"
        ? `http://localhost:25565/`
        : `file://${__dirname}/index.html`;
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      show: false,
      y: 0,
      x: 0,
      frame: false, // 无边框
      skipTaskbar: true, // 使窗口不显示在任务栏中
      movable: false, // 禁止窗口被用户移动
      resizable: false, // 禁止窗口手动调整窗口大小
      fullscreenable: false, // 禁止窗口可以进入全屏状态
      alwaysOnTop: true, // 窗口是否永远在别的窗口的上面
    });
    console.log(winURL + `#${"/notice"}`);
    // win.loadURL(winURL + `#${"/notice"}`);
    win.loadURL(winURL + `#${"/notice"}`);
    // 定位到桌面右上角
    const sizeObj = screen.getPrimaryDisplay().workAreaSize;
    const { width, height } = sizeObj;
    const [cwidth, cheight] = win.getContentSize();
    const left = parseInt(width - (cwidth || 0) - 5);
    const top = 10;
    win.setPosition(left, top);
    win.showInactive(); // 显示但不聚焦于窗口（建议做延时处理）
    setTimeout(() => {
      win.destroy();
    }, 5000);
  },
  createTipsWindow2() {
    const { BrowserWindow, screen } = require("@electron/remote");
    const win = new BrowserWindow({
      width: 800,
      height: 600,
      frame: false, // 无边框窗口
      // transparent: true,
      resizable: false, // 禁止窗口手动调整窗口大小
    });
    win.loadFile(`../../static/notice.html`);
    // win.loadURL(`https://github.com`);
  },
  createTipsWindow() {
    const { BrowserWindow, screen } = require("@electron/remote");
    const win = new BrowserWindow({
      width: 430,
      height: 230,
      frame: false, // 无边框窗口
      show: false,
      y: 0,
      x: 0,
      transparent: true,
      // backgroundColor: "#00000000",
      // alwaysOnTop: true, // 一直显示在最上面
      // skipTaskbar: true, // 使窗口不显示在任务栏中
      // movable: false, // 禁止窗口被用户移动
      resizable: false, // 禁止窗口手动调整窗口大小
      // fullscreenable: false, // 禁止窗口可以进入全屏状态
      webPreferences: {
        nodeIntegration: true,
        webSecurity: false,
        //使用webview标签 必须开启
        // webviewTag: false,
        // 如果是开发模式可以使用devTools
        // devTools: process.env.NODE_ENV === "development",
        // 在macos中启用橡皮动画
        // scrollBounce: process.platform === "darwin",
        // 临时修复打开新窗口报错
        contextIsolation: false,
      },
    });
    // 加载Tips页面，传入消息通信的事件名称和时间
    win.loadURL(`http://localhost:9080/#/notice`);
    const sizeObj = screen.getPrimaryDisplay().workAreaSize;
    const { width, height } = sizeObj;
    const [cwidth, cheight] = win.getContentSize();
    const left = parseInt(width - (cwidth || 0) - 5);
    const top = parseInt(height - (cheight || 0) - 5);
    win.setPosition(left, top);
    win.webContents.once("dom-ready", () => {
      win.showInactive();
      // if (arg.IsPay) {
      //   // 检查支付时候自动关闭小窗口
      //   const testUrl = setInterval(() => {
      //     const Url = win.webContents.getURL();
      //     if (Url.includes(arg.PayUrl)) {
      //       win.close();
      //     }
      //   }, 1200);
      //   win.on("close", () => {
      //     clearInterval(testUrl);
      //   });
      // }
    });
    setTimeout(() => {
      win.destroy();
    }, 5000);
    return win;
  },
};
