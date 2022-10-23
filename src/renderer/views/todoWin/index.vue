<template>
  <div class="main-box" @mouseenter="enter" @mouseleave="leave">
    <div class="header" @mousedown="moveWin">
      待办事项
      <div style="display: inline-block">
        <img
          class="img"
          src="@/assets/todoWin/min.png"
          @click="sysBtnClick('window-mini')"
        />
        <img
          class="img"
          src="@/assets/todoWin/max.png"
          @click="sysBtnClick('window-max')"
        />
        <img
          class="img"
          src="@/assets/todoWin/close.png"
          @click="sysBtnClick('window-close')"
        />
      </div>
    </div>
    <div
      v-for="(item, index) of contentData"
      :key="index"
      @click="showDetail(index)"
    >
      <div class="content-title">
        <div>
          <div class="radius" :style="{ background: item.radiusColor }" />
          {{ item.title }}
        </div>
        <img
          class="arrow"
          :src="
            require(item.showDetail
              ? '@/assets/todoWin/up.png'
              : '@/assets/todoWin/down.png')
          "
        />
      </div>
      <div v-show="item.showDetail" @click.stop>
        <div
          v-for="(pending, index) of item.pendingList"
          :key="index + 'a'"
          class="content-pending"
        >
          <div class="pendingName" :class="{ gray: pending.status }">
            <img
              class="select"
              :src="
                require(pending.status
                  ? '@/assets/todoWin/select.png'
                  : '@/assets/todoWin/unselect.png')
              "
              @click.stop="changeStatus(pending)"
            />
            <div>
              {{ pending.pendingName }}
            </div>
          </div>
          <div class="pendingDate" :class="{ gray: pending.status }">
            {{ pending.date }}
          </div>
        </div>
      </div>
    </div>
    <!-- <button @click="clicsss">ss</button> -->
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
      contentData: [
        {
          title: "今日待办 (0)",
          showDetail: false,
          radiusColor: "#ef5c59",
          pendingList: [],
        },
        {
          title: "三天内待办 (0)",
          showDetail: false,
          radiusColor: "#fd8d00",
          pendingList: [],
        },
        {
          title: "本周待办 (0)",
          showDetail: false,
          radiusColor: "#4dbb59",
          pendingList: [],
        },
      ],
      showWeekDetail: false,
      isKeyDown: false,
      dinatesX: 0,
      dinatesY: 0,
    };
  },
  computed: {
    // contentTitle(index) {
    //   return index == 0
    //     ? `今日待办 (${this.todayPending.length})`
    //     : index == 1
    //     ? `三天内待办 (${this.threeDaysPending.length})`
    //     : `本周待办 (${this.weekPending.length})`;
    // },
  },
  mounted() {
    //加载待办数据
    this.contentData[0].pendingList = [
      {
        pendingName:
          "测试测试测试一波名字灰常灰常长的情况哈哈哈哈哈哈哈哈哈哈哈哈哈哈哈",
        date: "2022-10-23",
        status: false,
      },
      {
        pendingName: "测试测试测试",
        date: "2022-10-23",
        status: false,
      },
      {
        pendingName: "测试测试测试一",
        date: "2022-10-25",
        status: true,
      },
    ];
    this.updateTitle();
    console.log(this.contentData[0].title);
    this.missionArray = this.$store.getters.missionArray;
    console.log("this.missionArray");
    console.log(this.missionArray);
    ipcRenderer.on("update-mission", (event, arg) => {
      this.missionArray = arg;
    });
    ipcRenderer.on("moved", (event, arg) => {
      console.log("moved");
      console.log(arg);
    });
  },
  methods: {
    sysBtnClick(type) {
      var ipc = require("electron").ipcRenderer;
      ipc.invoke(type);
    },
    showDetail(index) {
      this.contentData[index].showDetail = !this.contentData[index].showDetail;
    },
    changeStatus(pending) {
      //改变待办的status
      //改完后更新title数字
      pending.status = !pending.status;
      this.updateTitle();
    },
    updateTitle() {
      this.contentData.forEach((item) => {
        const count = item.pendingList.filter((item) => {
          return !item.status;
        }).length;
        item.title = item.title.split("(")[0] + "(" + count + ")";
      });
    },
    change() {
      console.log("changde");
      ipcRenderer.send("update-mission-child", this.missionArray);
    },
    clicsss() {
      console.log(this.missionArray);
      // console.log(type);
      ipcRenderer.send("update-mission-child", this.missionArray);
    },
    enter() {
      // console.log('enter');
      ipcRenderer.send("mouse-enter-win");
    },
    leave() {
      // console.log('leave');
      ipcRenderer.send("mouse-leave-win");
    },
    moveWin(e) {
      this.isKeyDown = true;
      this.dinatesX = Math.floor(e.x * window.devicePixelRatio);
      this.dinatesY = Math.floor(e.y * window.devicePixelRatio);

      document.addEventListener("mousemove", this.mousemoveHandler);
      document.addEventListener("mouseup", this.mouseupHandler);
    },
    mousemoveHandler(ev) {
      if (this.isKeyDown) {
        const x = ev.screenX - this.dinatesX;
        const y = ev.screenY - this.dinatesY;
        //给主进程传入坐标
        ipcRenderer.send("todo-win-move", {
          appX: x,
          appY: y,
        });
      }
    },
    mouseupHandler(ev) {
      this.isKeyDown = false;
      ipcRenderer.send("todo-win-moved");
      document.removeEventListener("mousemove", this.mousemoveHandler);
      document.removeEventListener("mouseup", this.mouseupHandler);
    },
  },
};
</script>

<style lang="scss" scoped>
.main-box {
  user-select: none;
  width: 100vw;
  height: 100vh;
  overflow-y: hidden;
  // -webkit-app-region: drag;
  z-index: 2;
  .header {
    display: flex;
    justify-content: space-between;
    align-content: center;
    z-index: 1;
    height: 39px;
    line-height: 39px;
    padding-left: 20px;
    font-family: PingFangSC-Medium;
    font-size: 18px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: bold;
    background-image: linear-gradient(
      90deg,
      rgba(211, 223, 255, 0.59) 0%,
      rgba(227, 250, 255, 0) 99%
    );
    .img {
      cursor: pointer;
      -webkit-user-drag: none; //设置图片不可拖拽
      width: 16px;
      height: 16px;
      margin-right: 12px;
    }
  }
  .content-title {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 36px 0 20px;
    // -webkit-app-region: no-drag;
    height: 48px;
    line-height: 48px;
    font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: bold;
    .radius {
      margin-right: 8px;
      display: inline-block;
      height: 8px;
      width: 8px;
      border-radius: 12px;
    }
    .arrow {
      width: 24px;
      height: 24px;
      -webkit-user-drag: none; //设置图片不可拖拽
    }
  }
  .content-pending {
    margin: 0 32px;
    padding: 12px 0 8px 0;
    border-bottom: 1px solid #e6ecff;
    .pendingName {
      display: flex;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      color: rgba(0, 0, 0, 0.65);
      letter-spacing: 0;
      font-weight: 600;
      .select {
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin: 2px 4px 0 0;
        -webkit-user-drag: none; //设置图片不可拖拽
      }
    }
    .pendingDate {
      margin-left: 24px;
      font-family: PingFangSC-Regular;
      font-size: 12px;
      color: rgba(0, 0, 0, 0.25);
      letter-spacing: 0;
      font-weight: 400;
    }
    .gray {
      opacity: 0.7;
      text-decoration: line-through; //删除线
    }
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
