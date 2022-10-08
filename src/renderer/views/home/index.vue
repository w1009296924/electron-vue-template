<template>
  <div class="app-container">
    <div class="main-box">
      <HomeCard width="728" height="430" title="近期待办">
        <template v-slot:header>
          <button @click="() => addTodo()">B</button>
        </template>
        <transition-group class="mission-box" name="todo-trans" tag="div">
          <div
            v-for="item of missionArray"
            :key="item.missionName"
            @contextmenu.prevent="openMenu([$event, item])"
          >
            <PendingList :todo="item" /></div
        ></transition-group>
        <!-- {{ noteArray }}
        <div v-for="(item, index) in noteArray" :key="index">s{{ item }}dd</div>
        <div v-for="(item, index) in missionArray" :key="index + 'd'">
          {{ item }}dd
        </div> -->
      </HomeCard>
      <HomeCard width="544" height="430" title="工时日历">
        <div class="calendar-box">
          <Calendar @openMenu="openMenu" />
        </div>
      </HomeCard>
      <HomeCard width="728" height="433" title="便签">
        <template v-slot:header>
          <button @click="addNote">B</button>
        </template>
        <div class="note-box wrapper" ref="wrapper">
          <div class="note-content" v-if="!updatingNote">
            <Note
              v-for="(item, index) in noteArray"
              :key="index"
              v-model="item.content"
              class="note-class"
              @deleteNote="deleteNote(index)"
            />
          </div>
        </div>
      </HomeCard>
      <HomeCard width="544" height="433" title="快速入口">
        <draggable
          v-model="quickEntryArray"
          delay="50"
          animation="300"
          filter=".forbid"
          ghostClass="ghost"
          :move="onMove"
        >
          <transition-group class="quick-entrys">
            <qucik-entry
              v-for="element in quickEntryArray"
              :key="element.name"
              :name="element.name"
              :iconPath="element.iconPath"
              :url="element.url"
              :class="{ forbid: element.name == '添加' }"
            />
          </transition-group>
        </draggable>
      </HomeCard>
    </div>

    <transition name="fade">
      <div
        v-show="todoMenuVisible"
        class="context-menu"
        :style="`left:${menuLeft}px;top:${menuTop}px;`"
      >
        <div class="context-menu-item" @click="deleteTodo(nowItem)">
          删除待办
        </div>
      </div></transition
    >
    <transition name="fade">
      <div
        v-show="calendarMenuVisible"
        class="context-menu"
        :style="`left:${menuLeft}px;top:${menuTop}px;`"
      >
        <div class="context-menu-item" @click="addTodo(nowItem)">添加待办</div>
      </div></transition
    >
    <IncreaseDialog ref="addTodo"></IncreaseDialog>
  </div>
</template>
<script>
import HomeCard from "./components/HomeCard";
import QucikEntry from "./components/QuickEntry";
import Calendar from "./components/Calendar";
import Note from "./components/Note";
import PendingList from "@/components/PendingList";
import IncreaseDialog from "@/components/IncreaseDialog";
import draggable from "vuedraggable";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
import { mapGetters } from "vuex";
import myNotification from "@/tools/myNotification";
import { getTaskTree } from "@/utils/taskTool.js";
BScroll.use(MouseWheel);
export default {
  components: {
    HomeCard,
    QucikEntry,
    Calendar,
    Note,
    PendingList,
    IncreaseDialog,
    draggable,
  },
  data() {
    return {
      updatingNote: false, //用于Note的重新渲染
      menuLeft: 0,
      menuTop: 0,
      todoMenuVisible: false,
      calendarMenuVisible: false,
      quickEntryArray: [
        {
          name: "归档目录",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "百度",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "app:D:/VSCodePro/electron-vue-template/src/renderer/assets/user.png",
        },
        {
          name: "Fdev",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "飞云",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "IPMP",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "添加",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "add",
        },
      ],
      noteArray: [
        { content: "" },
        { content: "" },
        { content: "" },
        { content: "" },
      ],
    };
  },
  computed: {
    ...mapGetters(["missionArray"]),
  },
  created() {
    console.log("created");
  },
  mounted() {
    this.$nextTick(() => {
      this.bs = new BScroll(this.$refs.wrapper, {
        scrollX: true,
        scrollY: false,
        mouseWheel: true,
        disableMouse: true,
        disableTouch: true,
        bounce: false,
      });
    });
    setTimeout(() => {
      document.querySelectorAll(".tox-edit-area__iframe").forEach((element) => {
        element.contentWindow.document.addEventListener(
          "mousewheel",
          this.hander,
          false
        );
      });
    }, 1000);
  },
  methods: {
    onMove(e) {
      if (e.relatedContext.element.name == "添加") return false;
      return true;
    },
    hander(e) {
      console.log("handel");
      if (!e.view.document.hasFocus()) {
        let eventClone = new e.constructor(e.type, e);
        document
          .querySelector(".note-box")
          .firstChild.dispatchEvent(eventClone);
      }
    },
    addTodo(item = null) {
      // if(item){

      // }
      this.$refs.addTodo.show(item);
    },
    deleteTodo(item) {},
    addNote() {
      getTaskTree();
      let option = {
        title: "test",
        body: "body",
        icon: "",
        href: "",
      };
      // let noc = new window.Notification(option.title, option);
      // myNotification.DesktopMsg(option);
      // myNotification.createTipsWindow();
      // let data = {
      //   url: "/notice",
      //   resizable: false,
      // };
      // ipcRenderer.invoke("open-notice", data);

      // this.$store.dispatch("setMissionData", [
      //   this.missionArray[0],
      //   {
      //     missionName: "???" + new Date(),
      //     children: [],
      //     // status: !this.missionArray[0].status,
      //     // children: [
      //     //   {
      //     //     pendingType: "上传资料",
      //     //     date: "2016-05-08",
      //     //     status: false,
      //     //   },
      //     // ],
      //   },
      // ]);

      // this.noteArray.push({ content: "" });
      // this.$nextTick(() => {
      //   const element =
      //     document.querySelectorAll(".note-class")[this.noteArray.length - 1];
      //   console.log(element);
      // });
      // this.refreshNote();
    },
    deleteNote(index) {
      const element = document.querySelectorAll(".note-class")[index];
      console.log(element);
      element.classList.add("note-fade");
      setTimeout(() => {
        this.noteArray.splice(index, 1);
        this.refreshNote();
      }, 400);
    },
    refreshNote() {
      this.updatingNote = true;
      this.$nextTick(() => {
        this.updatingNote = false;
        this.$nextTick(() => {
          this.bs.refresh();
          if (this.noteArray.length > 0) {
            this.timer = setInterval(() => {
              if (
                document.querySelectorAll(".tox-edit-area__iframe").length > 0
              ) {
                document
                  .querySelectorAll(".tox-edit-area__iframe")
                  .forEach((element) => {
                    element.contentWindow.document.addEventListener(
                      "mousewheel",
                      this.hander,
                      false
                    );
                  });
                clearInterval(this.timer);
              } else {
                console.log("interval");
              }
            }, 10);
          }
        });
      });
    },
    openMenu([e, item]) {
      console.log(e);
      console.log(item);
      this.menuLeft = e.clientX;
      this.menuTop = e.clientY;
      if (item.children) {
        this.todoMenuVisible = true;
      } else {
        this.calendarMenuVisible = true;
      }
      this.nowItem = item;
      document.body.addEventListener("click", this.closeMenu);
    },
    closeMenu() {
      this.todoMenuVisible = false;
      this.calendarMenuVisible = false;
      document.body.removeEventListener("click", this.closeMenu);
    },
  },
};
</script>

<style lang="scss" scoped>
.app-container {
  background-color: #fff;
}
.main-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.mission-box {
  padding: 0 14px 2px 14px;
  margin-top: 10px;
  height: calc(100% - 76px);
  overflow-y: overlay;
}
.calendar-box {
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: calc(100% - 48px);
  width: 100%;
  margin-top: 11px;
  // padding-top: 10px;
}
.note-box {
  // padding: 0 16px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: calc(100% - 48px);
  width: 95%;
  overflow: hidden;
  .note-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
}
.quick-entrys {
  display: flex;
  flex-wrap: wrap;
  row-gap: 48px;
  column-gap: 84px;
  padding: 47px 56px;
  .ghost {
    opacity: 0;
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

.note-class.note-fade {
  animation: fade 0.4s ease-in-out;
}
@keyframes fade {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
    transform: translateY(40px);
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

.todo-trans-move {
  transition: transform 0.4s ease;
}
</style>
