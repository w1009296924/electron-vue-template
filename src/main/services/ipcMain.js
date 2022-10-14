import {
  ipcMain,
  dialog,
  BrowserWindow,
  globalShortcut,
  screen,
} from "electron";
import Server from "../server/index";
import { winURL } from "../config/StaticPath";
import downloadFile from "./downloadFile";
import Update from "./checkupdate";
import { updater } from "./HotUpdater";
import NoticeAni from "./noticeAnimate";
import path from "path";

export default {
  Mainfunc(IsUseSysTitle) {
    const allUpdater = new Update();
    ipcMain.handle("IsUseSysTitle", async () => {
      return IsUseSysTitle;
    });
    ipcMain.handle("window-mini", (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.minimize();
    });
    ipcMain.handle("window-max", async (event, args) => {
      if (BrowserWindow.fromWebContents(event.sender)?.isMaximized()) {
        BrowserWindow.fromWebContents(event.sender)?.unmaximize();
        return { status: false };
      } else {
        BrowserWindow.fromWebContents(event.sender)?.maximize();
        return { status: true };
      }
    });
    // ipcMain.handle("notice-close", (event, args) => {
    //   BrowserWindow.fromWebContents(event.sender).close();
    // });
    ipcMain.handle("window-close", (event, args) => {
      BrowserWindow.fromWebContents(event.sender)?.close();
    });
    ipcMain.handle("start-download", (event, msg) => {
      downloadFile.download(
        BrowserWindow.fromWebContents(event.sender),
        msg.downloadUrL
      );
    });
    ipcMain.handle("check-update", (event, args) => {
      allUpdater.checkUpdate(BrowserWindow.fromWebContents(event.sender));
    });
    ipcMain.handle("confirm-update", () => {
      allUpdater.quitInstall();
    });
    ipcMain.handle("hot-update", (event, arg) => {
      updater(BrowserWindow.fromWebContents(event.sender));
    });
    ipcMain.handle("open-messagebox", async (event, arg) => {
      const res = await dialog.showMessageBox(
        BrowserWindow.fromWebContents(event.sender),
        {
          type: arg.type || "info",
          title: arg.title || "",
          buttons: arg.buttons || [],
          message: arg.message || "",
          noLink: arg.noLink || true,
        }
      );
      return res;
    });
    ipcMain.handle("open-errorbox", (event, arg) => {
      dialog.showErrorBox(arg.title, arg.message);
    });
    ipcMain.on("openDirectory", function (event, p) {
      dialog
        .showOpenDialog({
          title: "请选择文件夹",
          buttonLabel: "选择文件夹",
          defaultPath: "D:\\",
          properties: ["openDirectory"],
        })
        .then((files) => {
          if (files.filePaths[0]) {
            // 如果有选中
            // 发送选择的对象给子进程
            event.sender.send("selectedItem", files.filePaths[0]);
          }
        })
        .catch((err) => {
          console.log(err);
        });
    });
    ipcMain.handle("statr-server", async () => {
      try {
        const serveStatus = await Server.StatrServer();
        return serveStatus;
      } catch (error) {
        dialog.showErrorBox("错误", error);
      }
    });
    ipcMain.handle("stop-server", async (event, arg) => {
      try {
        const serveStatus = await Server.StopServer();
        return serveStatus;
      } catch (error) {
        dialog.showErrorBox("错误", error);
      }
    });

    ipcMain.on("drag-start", (event, filePath, icon) => {
      event.sender.startDrag({
        file: filePath, // string | string[]
        icon: icon,
      });
      return true;
    });

    let childWin = null;
    let cidArray = [];
    ipcMain.handle("open-win", (event, arg) => {
      let cidJson = { id: null, url: "" };
      let data = cidArray.filter((currentValue) => {
        if (currentValue.url === arg.url) {
          return currentValue;
        }
      });
      if (data.length > 0) {
        //获取当前窗口
        let currentWindow = BrowserWindow.fromId(data[0].id);
        //聚焦窗口
        currentWindow.focus();
      } else {
        //获取主窗口ID
        let parentID = event.sender.id;
        let rate = screen.getPrimaryDisplay().workAreaSize.width / 1920;
        //创建窗口
        childWin = new BrowserWindow({
          width: parseInt((arg?.width || 842) * rate),
          height: parseInt((arg?.height || 595) * rate),
          //width 和 height 将设置为 web 页面的尺寸(译注: 不包含边框), 这意味着窗口的实际尺寸将包括窗口边框的大小，稍微会大一点。
          useContentSize: true,
          //自动隐藏菜单栏，除非按了Alt键。
          autoHideMenuBar: true,
          //窗口大小是否可调整
          resizable: arg?.resizable ?? false,
          //窗口的最小高度
          minWidth: arg?.minWidth || 842,
          show: arg?.show ?? false,
          alwaysOnTop: arg?.alwaysOnTop ?? false,
          skipTaskbar: arg?.skipTaskbar ?? false,
          movable: arg.movable,
          //窗口透明度
          opacity: arg?.opacity || 1.0,
          transparent: true,
          // backgroundColor: "#00000000",
          //当前窗口的父窗口ID
          parent: parentID,
          frame: arg?.frame === false ? false : IsUseSysTitle,
          webPreferences: {
            zoomFactor: rate,
            nodeIntegration: true,
            webSecurity: false,
            //使用webview标签 必须开启
            webviewTag: arg?.webview ?? false,
            // 如果是开发模式可以使用devTools
            devTools: process.env.NODE_ENV === "development",
            // 在macos中启用橡皮动画
            scrollBounce: process.platform === "darwin",
            // 临时修复打开新窗口报错
            contextIsolation: false,
            // preload: path.resolve("./src/main/services/preload.js"),
          },
        });
        childWin.loadURL(winURL + `#${arg.url}`);
        // childWin.loadURL(`http://localhost:9080/static/notice.html`);
        let sizeObj;
        if (arg?.isNotice) {
          sizeObj = screen.getPrimaryDisplay().workAreaSize;
          const { width, height } = sizeObj;
          const [cwidth, cheight] = childWin.getContentSize();
          const left = parseInt(width - (cwidth || 0) - 5);
          const top = parseInt(height);
          childWin.setPosition(left, top);
        }

        cidJson.id = childWin?.id;
        cidJson.url = arg.url;
        cidArray.push(cidJson);
        childWin.webContents.once("dom-ready", () => {
          if (arg?.isNotice) {
            NoticeAni.show(
              childWin,
              parseInt((arg?.height || 595) * rate),
              parseInt((arg?.width || 842) * rate),
              sizeObj.height
            );
            // show(childWin);
          } else {
            childWin.show();
          }
          childWin.webContents.send("send-data", arg.sendData);
          if (arg.IsPay) {
            // 检查支付时候自动关闭小窗口
            const testUrl = setInterval(() => {
              const Url = childWin.webContents.getURL();
              if (Url.includes(arg.PayUrl)) {
                childWin.close();
              }
            }, 1200);
            childWin.on("close", () => {
              clearInterval(testUrl);
            });
          }
        });
        childWin.on("closed", () => {
          childWin = null;
          let index = cidArray.indexOf(cidJson);
          if (index > -1) {
            cidArray.splice(index, 1);
          }
        });
      }
      childWin.on("maximize", () => {
        if (cidJson.id != null) {
          BrowserWindow.fromId(cidJson.id).webContents.send("w-max", true);
        }
      });
      childWin.on("unmaximize", () => {
        if (cidJson.id != null) {
          BrowserWindow.fromId(cidJson.id).webContents.send("w-max", false);
        }
      });
    });
  },
};
