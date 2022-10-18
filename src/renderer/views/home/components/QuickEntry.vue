<template>
  <div>
    <div
      class="menu-box"
      @click="clickMenu"
      @contextmenu.prevent.stop="openMenu([$event, entry])"
    >
      <img class="menu-icon" :src="entry.iconPath" />
      <div class="menu-name">{{ entry.name }}</div>
    </div>
    <transition name="fade">
      <div
        v-show="entryMenuVisible"
        class="context-menu"
        :style="`left:${menuLeft}px;top:${menuTop}px;`"
      >
        <div class="context-menu-item" @click="editEntry()">编辑入口</div>
        <div class="context-menu-item" @click="deleteEntry()">删除入口</div>
      </div></transition
    >
  </div>
</template>
<script>
import { shell } from "electron";
const path = require("path");
export default {
  name: "quick-entry",
  components: {},
  props: {
    entry: {
      type: Object,
    },
  },
  data() {
    return {
      entryMenuVisible: false,
      menuLeft: 0,
      menuTop: 0,
    };
  },
  methods: {
    clickMenu() {
      if (!this.entry.url) {
        return;
      }
      const split = this.entry.url.indexOf(":");
      const type = this.entry.url.substring(0, split);
      const arg = this.entry.url.substring(split + 1);
      if (type === "web") {
        shell.openExternal(arg);
      } else if (type === "app") {
        shell.openPath(arg);
        // shell.openPath(path.join(arg, "/"));
      }
    },
    openMenu([e, item]) {
      console.log(e);
      console.log(item);
      document.getElementById("a").click();
      this.menuLeft = e.layerX;
      this.menuTop = e.layerY;
      this.entryMenuVisible = true;
      document.body.addEventListener("click", this.closeMenu);
    },
    closeMenu() {
      this.entryMenuVisible = false;
      document.body.removeEventListener("click", this.closeMenu);
    },
    editEntry() {
      this.$emit("editEntry");
    },
    deleteEntry() {
      this.$emit("deleteEntry");
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-box {
  box-sizing: border-box;
  cursor: pointer;
  width: 86px;
  // height: 126px;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  border-radius: 6px;
  border: 1px solid transparent;
  transition: all 0.1s ease-in-out;
  .menu-icon {
    // background-color: green;
    width: 100%;
    height: 64px;
  }
  .menu-name {
    font-family: PingFangSC-Regular;
    font-size: 16px;
    line-height: 16px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 400;
    min-height: 24px;
    max-height: 32px;
    text-align: center;
    word-break: break-all;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &:hover {
    border-color: #b2cef4;
  }
}
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
</style>
