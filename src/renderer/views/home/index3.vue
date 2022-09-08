<template>
  <div class="app-container">
    <div class="main-box">
      <HomeCard width="728" height="420" title="工时日历">
        <div class="calendar-box">
          <Calendar />
        </div>
      </HomeCard>
      <HomeCard width="544" height="420" title="便签">
        <div class="note-box" @mousewheel="handlerMouserScroll">
          <Note
            v-for="(item, index) in noteArray"
            :key="index"
            :class="{ 'rotate-note': !item.focus }"
          />
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
export default {
  components: { HomeCard, QucikEntry, Calendar, Note, draggable },
  data() {
    return {
      scrollAni: null,
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
      // console.log(e);
      const step = 0.4;
      e.target.scrollLeft += step * e.deltaY;

      const startX = e.target.scrollLeft;
      const endX = startX + step * 10;

      let ani = setInterval(() => {
        rate = (right.offsetWidth - midWidth) / offWidth;
        rightContent.style.opacity = Math.abs(rate);
        if (rate > 0) {
          rightContent.classList.remove('min');
        }
        if (rate > 0.98) {
          rightContent.style.opacity = '1';
          clearInterval(ani);
        }
      }, 20);
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
        document.querySelector('.note-box').dispatchEvent(eventClone);
      }
    },
    handlerMouserScroll(event) {
      this.documentObj = event.target;
      //获取滚轮跨距，兼容获取方式
      let detail = event.wheelDelta || event.detail || event.wheelDeltaY;
      /*反向*/
      let moveForwardStep = -1;
      /*正向*/
      let moveBackStep = 1;
      let step = 0;
      //如果跨步大于0，表明正向跨步，将跨步放大100倍，改变滑动速度，如果跨步小于0，表明反向跨步，将跨步放大500倍，改变滑动速度
      step = detail > 0 ? moveForwardStep * 120 : moveBackStep * 120;
      /*覆盖当前滚动条的位置,单位是像素，叠增或剃减*/
      this.documentObj.scrollLeft = this.documentObj.scrollLeft + step;

      //平滑值(越小越慢，不能小于等于0)
      let slipNum = 0.84;
      //末尾值（越小，则越平稳，越大越仓促）
      let endNum = 4;
      /*递减步伐值*/
      let decreasingPaceNum = step;
      /*速度*/
      let paceNum = 60;
      clearInterval(this.scrollAni);
      /*效果一*/
      this.scrollAni = setInterval(() => {
        if (Math.abs(decreasingPaceNum) < endNum) {
          clearInterval(this.scrollAni);
          return;
        }
        decreasingPaceNum = decreasingPaceNum * slipNum;
        this.documentObj.scrollLeft =
          this.documentObj.scrollLeft + decreasingPaceNum;
      }, paceNum);

      /*效果二*/
      // for (let i = 1; Math.abs(decreasingPaceNum) > endNum; i++) {
      //   decreasingPaceNum = decreasingPaceNum * slipNum;
      //   setTimeout(() => {
      //     this.documentObj.scrollLeft =
      //       this.documentObj.scrollLeft + decreasingPaceNum;
      //   }, i * paceNum);
      // }
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
  gap: 10px;
  scroll-behavior: smooth;
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
