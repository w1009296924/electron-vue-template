import { BrowserWindow, Menu, app, ipcMain } from "electron";
import { platform } from "os";
import menuconfig from "../config/menu";
import config from "@config";
import setIpc from "./ipcMain";
import { winURL, loadingURL } from "../config/StaticPath";

var loadWindow = null;
var mainWindow = null;
setIpc.Mainfunc(config.IsUseSysTitle);

// ipcMain.on('window-max', () => {
//   if(mainWindow.isMaximized()) {
//      mainWindow.restore()
//   }else{
//     mainWindow.maximize()
//   }
// })
// ipcMain.on('window-min', function () {
//     mainWindow.minimize();
// })
// ipcMain.on('window-close', function () {
//     mainWindow.close();
// })

function createMainWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 975,
    useContentSize: true,
    width: 1440,
    minWidth: 1440,
    show: false,
    frame: config.IsUseSysTitle,
    // frame: false,
    // titleBarStyle: 'hidden',
    titleBarStyle: platform().includes("win32") ? "default" : "hidden",
    webPreferences: {
      contextIsolation: false,
      nodeIntegration: true,
      webSecurity: false,
      // 如果是开发模式可以使用devTools
      devTools:
        process.env.NODE_ENV === "development" || config.build.openDevTools,
      // devTools: true,
      // 在macos中启用橡皮动画
      scrollBounce: process.platform === "darwin",
      enableRemoteModule: true, // 打开remote模块
    },
  });
  // 这里设置只有开发环境才注入显示开发者模式
  if (process.env.NODE_ENV === "development" || config.build.openDevTools) {
    menuconfig.push({
      label: "开发者设置",
      submenu: [
        {
          label: "切换到开发者模式",
          accelerator: "CmdOrCtrl+I",
          role: "toggledevtools",
        },
      ],
    });
  }
  // 载入菜单
  const menu = Menu.buildFromTemplate(menuconfig);
  Menu.setApplicationMenu(menu);
  mainWindow.loadURL(winURL);

  mainWindow.webContents.once("dom-ready", () => {
    mainWindow.show();
    if (process.env.NODE_ENV === "development" || config.build.devTools)
      mainWindow.webContents.openDevTools(true);
    if (config.UseStartupChart) loadWindow.destroy();
  });
  mainWindow.on("maximize", () => {
    mainWindow.webContents.send("w-max", true);
  });
  mainWindow.on("unmaximize", () => {
    mainWindow.webContents.send("w-max", false);
  });
  mainWindow.on("closed", () => {
    mainWindow = null;
    app.quit();
  });
  require("@electron/remote/main").initialize();
  require("@electron/remote/main").enable(mainWindow.webContents);
}

function loadingWindow() {
  loadWindow = new BrowserWindow({
    width: 400,
    height: 600,
    frame: false,
    backgroundColor: "#222",
    skipTaskbar: true,
    transparent: true,
    resizable: false,
    webPreferences: { experimentalFeatures: true },
  });

  loadWindow.loadURL(loadingURL);

  loadWindow.show();

  setTimeout(() => {
    createMainWindow();
  }, 2000);

  loadWindow.on("closed", () => {
    loadWindow = null;
  });
}

function initWindow() {
  if (config.UseStartupChart) {
    return loadingWindow();
  } else {
    return createMainWindow();
  }
}
export default initWindow;
