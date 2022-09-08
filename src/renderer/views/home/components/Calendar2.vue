<template>
  <div class="calendar-wrapper">
    <!-- 月份变换区 -->
    <div class="header rowJcAc" v-if="headerBar">
      <div
        class="arrowIcon rowJcAc"
        @click="changeMonth('pre')"
        v-if="monthOpen"
      >
        <svg-icon icon-class="home"></svg-icon>
        <!-- <van-icon name="arrow-left" color="#9EA8BA" size="12px" /> -->
      </div>

      <!-- <div class="pre " @click="changeMonth('pre')">上个月</div> -->
      <div class="yearMonth">{{ y + '年' + formatNum(m) + '月' }}</div>
      <div
        class="arrowIcon rowJcAc"
        @click="changeMonth('next')"
        v-if="monthOpen"
      >
        <svg-icon icon-class="home"></svg-icon>
        <!-- <van-icon name="arrow" color="#9EA8BA" size="12px" /> -->
      </div>
      <!-- <div class="next" @click="changeMonth('next')">下个月</div> -->
    </div>

    <!-- 星期区 -->
    <div class="week">
      <div class="week-day" v-for="(item, index) in weekDay" :key="index">
        {{ item }}
      </div>
    </div>

    <!-- 日历显示区 -->
    <div :class="{ hide: !monthOpen }" class="content">
      <div :style="{ top: positionTop + 'px' }" class="days">
        <div class="item rowJcAc" v-for="(item, index) in dates" :key="index">
          <div class="restDay" v-if="item.isRestDay">休</div>
          <div
            class="day"
            @click="selectOne(item, $event)"
            :class="{
              choose: choose == `${item.year}-${item.month}-${item.date}`,
              todayChoose: isTodayChoose(item.year, item.month, item.date),
              nolm: !item.isCurM,
              today: isToday(item.year, item.month, item.date),
            }"
          >
            <div
              class="markDay"
              v-if="isMarkDay(item.year, item.month, item.date)"
              :class="[
                choose == `${item.year}-${item.month}-${item.date}`
                  ? 'markDayChoose'
                  : 'markDayNoChoose',
              ]"
            ></div>
            {{ Number(item.date) }}
          </div>
        </div>
      </div>
    </div>
    <!-- 伸缩按钮：待定 -->
    <div class="bottomLine rowJcAc" v-if="collapsible" @click="toggle">
      <div></div>
    </div>
    <!-- 伸缩按钮：待定 -->
    <!-- <img
        src="https://i.loli.net/2020/07/16/2MmZsucVTlRjSwK.png"
        mode="scaleToFill"
        v-if="collapsible"
        @click="toggle"
        class="weektoggle"
        :class="{ down: monthOpen }"
      /> -->
  </div>
</template>

<script>
export default {
  name: 'Calendar',
  props: {
    // 星期几为第一天(0为星期日)
    weekstart: {
      type: Number,
      default: 0,
    },
    // 标记的日期
    markDays: {
      type: Array,
      default: () => {
        return ['2022-09-18'];
      },
    },
    //是否展示月份切换按钮
    headerBar: {
      type: Boolean,
      default: true,
    },
    // 是否展开
    open: {
      type: Boolean,
      default: true,
    },
    //是否可收缩
    collapsible: {
      type: Boolean,
      default: false,
    },
    //未来日期是否不可点击
    disabledAfter: {
      type: Boolean,
      default: false,
    },
    // 默认选中日期
    selectDate: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      weektext: ['日', '一', '二', '三', '四', '五', '六'],
      y: new Date().getFullYear(), // 年
      m: new Date().getMonth() + 1, // 月
      dates: [], // 当前月的日期数据
      positionTop: 0,
      monthOpen: true,
      choose: '',
      isCurM: true,
    };
  },
  created() {
    this.dates = this.monthDay(this.y, this.m);
    // !this.open && this.toggle();
    this.toggle();
  },
  watch: {
    // 点击返回今天
    selectDate() {
      if (this.selectDate) {
        this.choose = this.selectDate;
        this.y = Number(this.selectDate.split('-')[0]);
        this.m = Number(this.selectDate.split('-')[1]);
        this.dates = this.monthDay(this.y, this.m);
        if (!this.monthOpen) {
          let index = -1;
          this.dates.forEach((i, x) => {
            this.isChoose(i.year, i.month, i.date) && (index = x);
          });
          this.positionTop = -((Math.ceil((index + 1) / 7) || 1) - 1) * 42;
        }
      }
    },
    m() {
      this.$emit('changeMonth', { year: this.y, month: this.m });
    },
    dates() {
      this.$emit('changeDates', { dates: this.dates });
    },
  },
  mounted() {
    if (this.selectDate) {
      this.choose = this.selectDate;
      this.y = this.selectDate.split('-')[0];
      this.m = this.selectDate.split('-')[1];
    } else {
      this.choose = this.getToday().date;
    }
    this.toggle();
  },
  computed: {
    // 顶部星期栏
    weekDay() {
      return this.weektext
        .slice(this.weekstart)
        .concat(this.weektext.slice(0, this.weekstart));
    },
  },
  methods: {
    formatNum(num) {
      let res = Number(num);
      return res < 10 ? `0${res}` : res;
    },
    getToday() {
      let date = new Date();
      let y = date.getFullYear();
      let m = date.getMonth();
      let d = date.getDate();
      let week = new Date().getDay();
      let weekText = ['日', '一', '二', '三', '四', '五', '六'];
      let formatWeek = '星期' + weekText[week];
      let today = {
        date: y + '-' + this.formatNum(m + 1) + '-' + this.formatNum(d),
        week: formatWeek,
      };
      return today;
    },
    // 获取当前月份数据
    monthDay(y, month) {
      let dates = [];
      let m = Number(month);
      let firstDayOfMonth = new Date(y, m - 1, 1).getDay(); // 当月第一天星期几
      let lastDateOfMonth = new Date(y, m, 0).getDate(); // 当月最后一天
      let lastDayOfLastMonth = new Date(y, m - 1, 0).getDate(); // 上一月的最后一天
      let weekstart = this.weekstart == 7 ? 0 : this.weekstart;
      let startDay = (() => {
        // 周初有几天是上个月的
        if (firstDayOfMonth == weekstart) {
          return 0;
        } else if (firstDayOfMonth > weekstart) {
          return firstDayOfMonth - weekstart;
        } else {
          return 7 - weekstart + firstDayOfMonth;
        }
      })();
      let endDay = 7 - ((startDay + lastDateOfMonth) % 7); // 结束还有几天是下个月的
      for (let i = 1; i <= startDay; i++) {
        dates.push({
          date: this.formatNum(lastDayOfLastMonth - startDay + i),
          day: weekstart + i - 1 || 7,
          month: m - 1 >= 1 ? this.formatNum(m - 1) : 12,
          year: m - 1 >= 1 ? y : y - 1,
          isCurM: false,
          isRestDay: (weekstart + i - 1 || 7) > 5,
        });
      }
      for (let j = 1; j <= lastDateOfMonth; j++) {
        dates.push({
          date: this.formatNum(j),
          day: ((j % 7) + firstDayOfMonth - 1) % 7 || 7,
          month: this.formatNum(m),
          year: y,
          isCurM: true, //是否当前月份
          isRestDay: (((j % 7) + firstDayOfMonth - 1) % 7 || 7) > 5,
        });
      }
      for (let k = 1; k <= endDay; k++) {
        dates.push({
          date: this.formatNum(k),
          day: (lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7,
          month: m + 1 <= 12 ? this.formatNum(m + 1) : '01',
          year: m + 1 <= 12 ? y : y + 1,
          isCurM: false,
          isRestDay:
            ((lastDateOfMonth + startDay + weekstart + k - 1) % 7 || 7) > 5,
        });
      }
      // console.log(dates);
      return dates;
    },
    isFutureDay(y, m, d) {
      //是否未来日期
      let ymd = `${y}/${m}/${d}`;
      let formatDY = new Date(ymd.replace(/-/g, '/'));
      let showTime = formatDY.getTime();
      let curTime = new Date().getTime();
      if (showTime > curTime) {
        return true;
      } else {
        return false;
      }
    },
    // 标记日期
    isMarkDay(y, m, d) {
      let flag = false;
      for (let i = 0; i < this.markDays.length; i++) {
        let dy = `${y}-${m}-${d}`;
        if (this.markDays[i] == dy) {
          flag = true;
          break;
        }
      }
      return flag;
    },
    isToday(y, m, d) {
      let checkD = y + '-' + m + '-' + d;
      let today = this.getToday().date;
      if (checkD == today) {
        return true;
      } else {
        return false;
      }
    },
    isTodayChoose(year, month, day) {
      let checkD = year + '-' + month + '-' + day;
      let today = this.getToday().date;
      return this.choose == `${year}-${month}-${day}` && checkD == today;
    },
    isChoose(y, m, d) {
      let checkD = y + '-' + m + '-' + d;
      return this.choose == checkD;
    },
    // 展开收起
    toggle() {
      this.monthOpen = !this.monthOpen;
      if (this.monthOpen) {
        this.positionTop = 0;
      } else {
        let index = -1;
        this.dates.forEach((i, x) => {
          this.isChoose(i.year, i.month, i.date) && (index = x);
        });
        this.positionTop = -((Math.ceil((index + 1) / 7) || 1) - 1) * 42;
      }
    },
    // 点击回调
    selectOne(i) {
      let markDay = this.isMarkDay(i.year, i.month, i.date);
      let date = `${i.year}-${i.month}-${i.date}`;
      let selectD = new Date(date).getTime();
      let curTime = new Date().getTime();
      let week = new Date(date).getDay();
      let weekText = ['日', '一', '二', '三', '四', '五', '六'];
      let formatWeek = '星期' + weekText[week];
      let response = {
        date: date,
        week: formatWeek,
      };
      // if (!i.isCurM) {
      //   // console.log('不在当前月范围内');
      //   return false;
      // }
      this.choose = date;
      if (!i.isCurM) {
        this.y = i.year;
        this.m = i.month;
        this.dates = this.monthDay(this.y, this.m);
        console.log(this.y, this.m, this.choose, this.dates);
      }
      this.$emit('onDayClick', response);
      this.$emit('setDate', response);
      //   console.log(response);
    },
    //改变年月
    changYearMonth(y, m) {
      this.dates = this.monthDay(y, m);
      this.y = y;
      this.m = m;
    },
    changeMonth(type) {
      this.y = parseInt(this.y);
      this.m = parseInt(this.m);
      if (type == 'pre') {
        if (this.m + 1 == 2) {
          this.m = 12;
          this.y = parseInt(this.y) - 1;
        } else {
          this.m = this.m - 1;
        }
      } else {
        if (this.m + 1 == 13) {
          this.m = 1;
          this.y = this.y + 1;
        } else {
          this.m = this.m + 1;
        }
      }
      this.dates = this.monthDay(this.y, this.m);
      // this.$emit("changeMonth");
    },
  },
};
</script>

<style lang="scss" scoped>
.bottomLine {
  padding-top: 12px;
  padding-bottom: 12px;
  > div {
    width: 32px;
    height: 3px;
    background: #dadef0;
    border-radius: 2px;
  }
}
.nolm {
  color: #cfd4db !important;
}
.calendar-wrapper {
  user-select: none;
  padding: 20px 0;
  width: 90%;
  text-align: center;
  background-color: #fff;
  box-shadow: 0px 6px 10px 0px rgba(131, 134, 163, 0.12);
  border-radius: 20px;
  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    .yearMonth {
      font-size: 16px;
      line-height: 23px;
      color: #333843;
      margin: 0 32px;
    }
  }

  .week {
    display: flex;
    justify-content: space-around;
    width: 100%;
    align-items: center;
    height: 19px;
    line-height: 19px;
    font-size: 13px;
    font-weight: 600;
    margin-top: 20px;
    color: #989db3;
  }

  .content {
    position: relative;
    overflow: hidden;
    transition: height 0.4s ease;

    .days {
      transition: top 0, 3s;
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      position: relative;
      font-size: 14px;
      line-height: 19px;

      .item {
        position: relative;
        display: block;
        height: 42px;
        line-height: 42px;
        width: calc(100% / 7);

        .day {
          font-style: normal;
          display: inline-block;
          position: relative;
          vertical-align: middle;
          width: 40px;
          font-weight: 500;
          height: 40px;
          line-height: 40px;
          overflow: hidden;
          border-radius: 50%;
          cursor: pointer;

          &.choose {
            background-color: #9ea8ba;
            color: #fff;
          }
          &.todayChoose {
            background-color: #1a7af8 !important;
            color: #fff;
          }
        }

        .notSigned {
          font-style: normal;
          width: 8rpx;
          height: 8rpx;
          background: #fa7268;
          border-radius: 10rpx;
          position: absolute;
          left: 50%;
          bottom: 0;
          pointer-events: none;
        }
        .today {
          color: #1a7af8;
          background-color: #fff;
        }
        .markDayNoChoose {
          background: #1a7af8;
        }
        .markDayChoose {
          background: #fff;
        }
        .markDay {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          position: absolute;
          left: 16px;
          bottom: 4px;
          pointer-events: none;
        }
        .restDay {
          font-size: 12px;
          line-height: 12px;
          position: absolute;
          color: green;
          /* top: 0%; */
          right: 20%;
        }
      }
    }
  }

  .hide {
    height: 42px !important;
  }
  .arrowIcon {
    width: 50px;
    height: 23px;
  }
  // .weektoggle {
  //   width: 85px;
  //   height: 32px;
  //   position: relative;
  //   left: 50%;
  //   margin-left: -42px;
  //   bottom: -42px;
  //   &.down {
  //     transform: rotate(180deg);
  //     bottom: 0;
  //   }
  // }
}
</style>
