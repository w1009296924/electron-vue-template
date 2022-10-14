<template>
  <div class="notice">
    <div class="header">
      <div class="title">待办提醒</div>
      <div class="close-btn" @click="close">
        <i class="el-icon-close"></i>
        <!-- <svg-icon icon-class="sys_close"></svg-icon> -->
      </div>
    </div>
    <div>Notice</div>
  </div>
</template>

<script>
// import { ipcRenderer } from "electron";
export default {
  methods: {
    close() {
      // ipcRenderer.invoke("open-notice", data);
      // ipcRenderer.send("notice-close");
      var ipc = require("electron").ipcRenderer;
      // console.log(type);
      ipc.invoke("window-close");
    },
  },
};
</script>

<style lang="scss" scoped>
.notice {
  // background: red;
}

.header {
  display: flex;
  justify-content: space-between;
  .close-btn {
    // margin-top: 4px;
    // margin-right: 4px;
    height: 24px;
    width: 24px;
    padding-top: 4px;
    padding-left: 4px;
    border-radius: 2px;
    &:hover {
      background-color: rgb(218, 218, 218);
    }
  }
}
</style>
