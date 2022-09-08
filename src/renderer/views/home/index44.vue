<template>
  <div class="app-container">
    <div class="main-box">
      <HomeCard width="728" height="420" title="工时日历">
        <div class="calendar-box">
          <Calendar />
        </div>
      </HomeCard>
      <HomeCard width="544" height="420" title="便签">
        <div class="note-box wrapper" ref="wrapper" @click="clickss">
          <div class="note-content">
            <Note
              v-for="(item, index) in noteArray"
              :key="index"
              :class="{ 'rotate-note': !item.focus }"
            />
          </div>
        </div>
      </HomeCard>
      <HomeCard width="728" height="433" title="近期待办"></HomeCard>
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
import HomeCard from './components/HomeCard';
import QucikEntry from './components/QuickEntry';
import Calendar from './components/Calendar';
import Note from './components/Note';
import draggable from 'vuedraggable';
import IScroll from 'iscroll/build/iscroll-probe';
export default {
  components: { HomeCard, QucikEntry, Calendar, Note, draggable },
  data() {
    return {
      quickEntryArray: [
        {
          name: '归档目录',
          iconPath: require('@/assets/entry_飞云.png'),
          url: 'web:https://www.baidu.com',
        },
        {
          name: '百度',
          iconPath: require('@/assets/entry_飞云.png'),
          url: 'app:D:/VSCodePro/electron-vue-template/src/renderer/assets/user.png',
        },
        {
          name: 'Fdev',
          iconPath: require('@/assets/entry_飞云.png'),
          url: 'web:https://www.baidu.com',
        },
        {
          name: '飞云',
          iconPath: require('@/assets/entry_飞云.png'),
          url: 'web:https://www.baidu.com',
        },
        {
          name: 'IPMP',
          iconPath: require('@/assets/entry_飞云.png'),
          url: 'web:https://www.baidu.com',
        },
        {
          name: '添加',
          iconPath: require('@/assets/entry_飞云.png'),
          url: 'add',
        },
      ],
      noteArray: [
        { conten: '', focus: false },
        { conten: '', focus: false },
        { conten: '', focus: false },
      ],
    };
  },
  created() {
    console.log('created');
  },
  mounted() {
    // setTimeout(() => {
    //   this.bs = new BScroll(this.$refs.wrapper, {
    //     //...
    //     scrollX: true,
    //     scrollY: false,
    //     mouseWheel: true,
    //     // speed: 20,
    //     // invert: false,
    //     // easeTime: 300,
    //   });
    // }, 3000);

    this.$nextTick(() => {
      this.bs = new IScroll(this.$refs.wrapper, {
        scrollX: true,
        scrollY: false,
        mouseWheel: true,
        // mouseWheelSpeed: 100,
        // disableMouse: true,
        // disableTouch: true,
        // scrollbars: true,
        disablePointer: true,
        disableTouch: true,
        disableMouse: true,
        // stopPropagation: true,
        // probeType: 3,
        // speed: 20,
        // invert: false,
      });
    });
    setTimeout(() => {
      // console.log(document.querySelectorAll('.tox-edit-area__iframe'));
      document.querySelectorAll('.tox-edit-area__iframe').forEach((element) => {
        element.contentWindow.document.addEventListener(
          'mousewheel',
          this.hander,
          false
        );
      });
    }, 1000);
  },
  methods: {
    onMove(e) {
      if (e.relatedContext.element.name == '添加') return false;
      return true;
    },
    scrollNotes(e) {
      console.log(e);
      const step = 0.4;
      e.target.scrollLeft += step * e.deltaY;
    },
    clickss(e) {
      console.log(e);
    },
    hander(e) {
      // console.log(e.view.document.hasFocus());
      // e.preventDefault();
      // e.stopPropagation();
      if (!e.view.document.hasFocus()) {
        let eventClone = new e.constructor(e.type, e);
        document
          .querySelector('.note-box')
          .firstChild.dispatchEvent(eventClone);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
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
  // padding-top: 10px;
}
.note-box {
  padding: 0 16px;
  margin-left: 16px;
  display: flex;
  align-items: center;
  height: calc(100% - 48px);
  width: 512px;
  overflow: hidden;
  .note-content {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .rotate-note {
    // pointer-events: none !important;
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
</style>
