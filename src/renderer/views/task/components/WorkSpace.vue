<template>
  <div class="todo-card">
    <div class="title">
      <i class="el-icon-folder-opened"></i>
      <div class="title-text">工作空间</div>
    </div>
    <div
      class="work-space-content-box"
      @drop.prevent="handleDrop"
      @dragenter.prevent=""
      @dragover.prevent="handleDover"
    >
      <div
        v-for="(item, index) in fileArray"
        :key="index"
        class="file-item-box"
        :draggable="true"
        @dragstart="handleDrag($event, item)"
        @contextmenu.prevent="openMenu($event, item)"
      >
        <div
          class="file-item"
          :class="{ 'selected-file': selectedIndex == index }"
          @click="clickFile($event, index, item)"
        >
          <img
            :src="item.icon || require('@/assets/dir.png')"
            :draggable="false"
          />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-show="menuVisible"
        class="context-menu"
        :style="`left:${menuLeft}px;top:${menuTop}px;`"
      >
        <div class="context-menu-item" @click="openFile()">打开</div>
        <!-- <div class="context-menu-item" @click="copyFile()">复制</div> -->
        <div class="context-menu-item" @click="deleteFile()">删除</div>
      </div></transition
    >
  </div>
</template>

<script>
import fileTool from "@/utils/fileTool.js";
import { ipcRenderer, shell } from "electron";
const path = require("path");
export default {
  name: "task-list-box",
  props: {
    title: {
      type: String,
      default: "",
    },
    taskArray: {
      type: Array,
      default: function () {
        return [];
      },
    },
    taskPath: {
      type: String,
      default: "D:/test/",
    },
  },
  data() {
    return {
      fileArray: [],
      selectedIndex: -1,
      menuVisible: false,
      menuLeft: 0,
      menuTop: 0,
      allowDrop: true,
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    handleDover(e) {
      if (this.timeout !== null) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        this.allowDrop = true;
        this.timeout = null;
      }, 200);
    },
    async handleDrag(e, item) {
      console.log(e);
      e.preventDefault();
      this.allowDrop = false;
      // 发送IPC
      await ipcRenderer.send(
        "drag-start",
        item.path,
        // e.target.firstChild.firstChild.currentSrc
        "src/renderer/assets/document.png"
      );
    },
    handleDrop(e) {
      if (!this.allowDrop) {
        return;
      }
      let files = e.dataTransfer.files;
      // console.log(e);
      // console.log(e.dataTransfer.dropEffect);
      // console.log(e.dataTransfer.effectAllowed);
      // console.log(files);
      if (!files || files.length <= 0) {
        return;
      }
      const fs = require("fs");
      let count = 0;
      Object.keys(files).forEach((key) => {
        fs.cp(
          files[key].path,
          this.taskPath + files[key].name,
          { recursive: true },
          (err) => {
            if (err) {
              console.error(err);
            }
            count++;
            if (count == files.length) {
              this.update();
            }
          }
        );
      });
    },
    clickFile(e, index, item) {
      console.log(e);
      if (e.detail == 1) {
        console.log("单击");
        this.selectedIndex = index;
      } else if (e.detail == 2) {
        console.log("双击");
        shell.openPath(path.join(item.path, "/"));
      }
    },
    async update() {
      let arr = [];
      fileTool.getAllfiles(this.taskPath, arr);
      console.log(arr);
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].type == "dir") {
          continue;
        }
        // console.log(item.path);
        const icon = await fileTool.getIcon(arr[i].path);
        // console.log(icon);
        arr[i].icon = icon.toDataURL();
      }
      this.fileArray = arr;
    },
    openMenu(e, item) {
      this.menuVisible = true;
      this.menuLeft = e.layerX;
      this.menuTop = e.layerY;
      this.nowFile = item;
      document.body.addEventListener("click", this.closeMenu);
    },
    closeMenu() {
      this.menuVisible = false;
      document.body.removeEventListener("click", this.closeMenu);
    },
    openFile(file = this.nowFile) {
      shell.openPath(path.join(file.path, "/"));
    },
    copyFile(file = this.nowFile) {
      const { clipboard } = require("electron");
      const fs = require("fs");
      fs.readFile(file.path, (data) => {
        clipboard.writeBuffer("text/plain", data);
      });
      // console.log(clipboard.availableFormats());
      // console.log(clipboard.read("text/plain"));
      // console.log(clipboard.read("text/html"));
    },
    deleteFile(file = this.nowFile) {
      const fs = require("fs");
      fs.rm(file.path, { recursive: true }, () => {
        this.update();
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.todo-card {
  position: relative;
  background: #f3f9ff;
  border-radius: 8px;
  width: 0;
  flex: 1;
  height: 303px;
  .context-menu {
    position: absolute;
    background-color: #fff;
    width: 70px;
    font-size: 12px;
    color: #444040;
    border-radius: 4px;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-radius: 3px;
    border: 1px solid rgba(0, 0, 0, 0.15);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.175);
    white-space: nowrap;
    z-index: 1000;
    .context-menu-item {
      display: block;
      line-height: 24px;
      text-align: center;
      transition: all 0.2s ease-in-out;
      &:not(:last-child) {
        border-bottom: 1px solid rgba(0, 0, 0, 0.1);
      }
      &:hover {
        cursor: pointer;
        background: #66b1ff;
        border-color: #66b1ff;
        color: #fff;
      }
    }
  }
}
.title {
  margin-top: 16px;
  margin-left: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
  .title-line {
    height: 20px;
    width: 4px;
    background: #5380dc;
    border-radius: 2px 0 0 2px;
  }
  .title-text {
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 500;
  }
}
.work-space-content-box {
  padding: 0 20px;
  margin-top: 20px;
  height: calc(100% - 67px);
  display: flex;
  flex-wrap: wrap;
  column-gap: 13px;
  overflow-y: overlay;
  .file-item-box {
    height: 75px;
    .file-item {
      width: 75px;
      display: flex;
      flex-direction: column;
      align-items: center;
      padding-top: 4px;
      gap: 4px;
      border-radius: 10px;
      border: 1px solid transparent;
      transition: all 0.12s ease-in-out;
      // overflow: hidden;
      // text-overflow: ellipsis;
      div {
        min-height: 24px;
        max-height: 32px;
        width: 90%;
        font-size: 12px;
        text-align: center;
        word-break: break-all;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      &.selected-file {
        background-color: #d9e8fb;
      }
      &:hover {
        border: 1px solid #b2cef4;
      }
    }
  }
  &::-webkit-scrollbar {
    width: 6px;
  }
}

.fade-enter-active,
.fade-leave-active {
  transition: all 0.12s ease;
}

.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
