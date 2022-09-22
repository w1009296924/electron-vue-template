<template>
  <div class="notice">
    <div>Notice</div>
    <button @click="close">close</button>
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
      ipc.invoke("notice-close");
    },
  },
};
</script>

<style lang="scss" scoped>
.notice {
  background: red;
}
</style>
