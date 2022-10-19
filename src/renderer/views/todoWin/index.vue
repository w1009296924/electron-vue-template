<template>
  <div>
    <button @click="clicsss">ss</button>
    <transition-group class="mission-box" name="todo-trans" tag="div">
      <div v-for="item of missionArray" :key="item.id">
        <PendingList :todo="item" @change="change" /></div
    ></transition-group>
    <!-- {{ missionArray }} -->
  </div>
</template>

<script>
import PendingList from "./components/PendingList";
const ipcRenderer = require("electron").ipcRenderer;
export default {
  components: {
    PendingList,
  },
  data() {
    return {
      missionArray: [],
    };
  },
  mounted() {
    this.missionArray = this.$store.getters.missionArray;
    console.log("this.missionArray");
    console.log(this.missionArray);
    ipcRenderer.on("update-mission", (event, arg) => {
      this.missionArray = arg;
    });
  },
  methods: {
    change() {
      console.log("changde");
      ipcRenderer.send("update-mission-child", this.missionArray);
    },
    clicsss() {
      console.log(this.missionArray);
      // console.log(type);
      ipcRenderer.send("update-mission-child", this.missionArray);
    },
  },
};
</script>

<style lang="scss" scoped>
.mission-box {
  padding: 0 14px 2px 14px;
  margin-top: 10px;
  height: calc(100% - 76px);
  overflow-y: overlay;
}
.todo-trans-move {
  transition: transform 0.4s ease;
}
</style>
