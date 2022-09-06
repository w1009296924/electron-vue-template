<template>
  <div class="menu-box" @click="clickMenu">
    <img class="menu-icon" :src="iconPath" />
    <div class="menu-name">{{ name }}</div>
  </div>
</template>
<script>
import { shell } from "electron";
export default {
  name: "quick-entry",
  components: {},
  props: {
    name: {
      type: String,
      default: "",
    },
    iconPath: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {
    clickMenu() {
      if (!this.url) {
        return;
      }
      const split = this.url.indexOf(":");
      const type = this.url.substring(0, split);
      const arg = this.url.substring(split + 1);
      if (type === "add") {
      } else if (type === "web") {
        shell.openExternal(arg);
      } else if (type === "app") {
        shell.openPath(arg);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.menu-box {
  width: 88px;
  height: 124px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  align-items: center;
  .menu-icon {
    // background-color: green;
    width: 100%;
    height: 71%;
  }
  .menu-name {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 400;
  }
}
</style>
