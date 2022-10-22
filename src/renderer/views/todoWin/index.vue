<template>
  <div class="main-box" @mouseenter="enter" @mouseleave="leave">
    <div class="header" @mousedown="moveWin"></div>
    <div class="content-box"></div>
    <button @click="clicsss">ss</button>
    <transition-group class="mission-box" name="todo-trans" tag="div">
      <div v-for="item of missionArray" :key="item.id">
        <PendingList :todo="item" @change="change" /></div
    ></transition-group>
    <!-- {{ missionArray }} -->
  </div>
</template>

<script>
import PendingList from './components/PendingList';
const ipcRenderer = require('electron').ipcRenderer;
export default {
  components: {
    PendingList,
  },
  data() {
    return {
      missionArray: [],
      isKeyDown: false,
      dinatesX: 0,
      dinatesY: 0,
    };
  },
  mounted() {
    this.missionArray = this.$store.getters.missionArray;
    console.log('this.missionArray');
    console.log(this.missionArray);
    ipcRenderer.on('update-mission', (event, arg) => {
      this.missionArray = arg;
    });
    ipcRenderer.on('moved', (event, arg) => {
      console.log('moved');
      console.log(arg);
    });
  },
  methods: {
    change() {
      console.log('changde');
      ipcRenderer.send('update-mission-child', this.missionArray);
    },
    clicsss() {
      console.log(this.missionArray);
      // console.log(type);
      ipcRenderer.send('update-mission-child', this.missionArray);
    },
    enter() {
      // console.log('enter');
      ipcRenderer.send('mouse-enter-win');
    },
    leave() {
      // console.log('leave');
      ipcRenderer.send('mouse-leave-win');
    },
    moveWin(e) {
      this.isKeyDown = true;
      this.dinatesX = Math.floor(e.x * window.devicePixelRatio);
      this.dinatesY = Math.floor(e.y * window.devicePixelRatio);

      document.addEventListener('mousemove', this.mousemoveHandler);
      document.addEventListener('mouseup', this.mouseupHandler);
    },
    mousemoveHandler(ev) {
      if (this.isKeyDown) {
        const x = ev.screenX - this.dinatesX;
        const y = ev.screenY - this.dinatesY;
        //给主进程传入坐标
        ipcRenderer.send('todo-win-move', {
          appX: x,
          appY: y,
        });
      }
    },
    mouseupHandler(ev) {
      this.isKeyDown = false;
      ipcRenderer.send('todo-win-moved');
      document.removeEventListener('mousemove', this.mousemoveHandler);
      document.removeEventListener('mouseup', this.mouseupHandler);
    },
  },
};
</script>

<style lang="scss" scoped>
.main-box {
  width: 100vw;
  height: 100vh;
  background: red;
  overflow-y: hidden;
  // -webkit-app-region: drag;
  z-index: 2;
  .header {
    z-index: 1;
    height: 16px;
  }
  .content-box {
    height: 200px;
    // -webkit-app-region: no-drag;
  }
}
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
