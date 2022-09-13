<template>
  <div class="app-container">
    <div class="main-box">
      <HomeCard width="728" height="430" title="近期待办">
        {{ noteArray }}
        <div v-for="(item, index) in noteArray" :key="index">s{{ item }}dd</div>
      </HomeCard>
      <HomeCard width="544" height="430" title="工时日历">
        <div class="calendar-box">
          <Calendar />
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
  </div>
</template>
<script>
import HomeCard from "./components/HomeCard";
import QucikEntry from "./components/QuickEntry";
import Calendar from "./components/Calendar";
import Note from "./components/Note";
import draggable from "vuedraggable";
import BScroll from "@better-scroll/core";
import MouseWheel from "@better-scroll/mouse-wheel";
BScroll.use(MouseWheel);
export default {
  components: { HomeCard, QucikEntry, Calendar, Note, draggable },
  data() {
    return {
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
      updatingNote: false, //用于Note的重新渲染
    };
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
    addNote() {
      this.noteArray.push({ content: "" });
      this.$nextTick(() => {
        const element =
          document.querySelectorAll(".note-class")[this.noteArray.length - 1];
        console.log(element);
      });
      this.refreshNote();
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
</style>
