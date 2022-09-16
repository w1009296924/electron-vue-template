<template>
  <div class="todo-card">
    <div class="title">
      <i class="el-icon-folder-opened"></i>
      <div class="title-text">工作空间</div>
    </div>
    <div
      class="work-space-content-box"
      @drop.prevent="dd"
      @dragenter.prevent=""
      @dragover.prevent=""
    >
      <div
        v-for="(item, index) in fileArray"
        :key="index"
        class="file-item-box"
      >
        <div
          class="file-item"
          :class="{ 'selected-file': selectedIndex == index }"
          @click="clickFile($event, index, item)"
        >
          <img :src="item.icon || require('@/assets/dir.png')" />
          <div>{{ item.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import fileTool from "@/utils/fileTool.js";
import { shell } from "electron";
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
    };
  },
  mounted() {
    this.update();
  },
  methods: {
    dd(e) {
      let files = e.dataTransfer.files;
      console.log(files);
      //   const fs = require("fs");
      //   fs.cp(
      //     files[0].path,
      //     "d:/test/" + files[0].name,
      //     { recursive: true },
      //     (err) => {
      //       if (err) {
      //         console.error(err);
      //       }
      //     }
      //   );
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
  },
};
</script>

<style lang="scss" scoped>
.todo-card {
  background: #f3f9ff;
  border-radius: 8px;
  flex: 1;
  height: 303px;
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
  margin-top: 10px;
  height: calc(100% - 57px);
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
      transition: all 0.2s ease-in-out;
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
}
</style>
