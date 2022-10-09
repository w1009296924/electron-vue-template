<template>
  <div class="todo-main-box" :class="backgroudcolor">
    <div class="todo-main-line" :class="{ smallMode: !showTaskName }">
      <div
        class="todo-date"
        :class="{ 'small-date': firstDetail.date.length > 10 }"
      >
        <el-popover v-if="firstDetail.remindSwitch" placement="top-start" width="240" trigger="hover" :content="`提醒时间:${firstDetail.remindTime}`">
          <i slot="reference" class="el-icon-alarm-clock"/>
        </el-popover>
        {{ firstDetail.date.substr(5) }}
      </div>
      <div v-if="showTaskName" class="todo-name">
        <div class="arrow-box">
          <div
            class="arrow-inner"
            v-if="todo.children.length > 1"
            @click="expandList"
          >
            <i
              class="el-icon-arrow-right"
              :class="[clickFlag ? 'rightArrow' : 'downArrow']"
            />
          </div>
        </div>
        <div class="text-box">
          <div :class="[clickFlag ? '' : 'ellipsis']">
            {{ todo.missionName }}
          </div>
        </div>
      </div>
      <div v-if="firstDetail.pendingType" class="todo-type">
        <div class="ellipsis">
          {{ firstDetail.pendingType }}
        </div>
      </div>
      <div class="todo-check">
        <el-checkbox
          :disabled="!showCheck"
          v-model="firstDetail.status"
          class="checkbox"
          @change="changeChildren($event, 0)"
        />
      </div>
    </div>
    <div v-if="clickFlag" class="todo-children-box">
      <div
        v-for="(item, index) of todo.children"
        :key="index"
        v-if="index != 0"
        class="todo-main-line"
      >
        <div
          class="todo-date"
          :class="{ 'small-date': item.date.length > 10 }"
        >
          <el-popover v-if="item.remindSwitch" placement="top-start" width="240" trigger="hover" :content="`提醒时间:${item.remindTime}`">
            <i slot="reference" class="el-icon-alarm-clock"/>
          </el-popover>
          {{ item.date.substr(5) }}
        </div>
        <div class="todo-name"></div>
        <div class="todo-type">
          {{ item.pendingType }}
        </div>
        <div class="todo-check">
          <el-checkbox
            :disabled="!showCheck"
            v-model="item.status"
            class="checkbox"
            @change="changeChildren($event, 0)"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PendingList",
  props: {
    todo: { type: Object },
    parent: {
      type: Object,
    },
    showCheck: { type: Boolean, default: true },
    showTaskName: { type: Boolean, default: true },
  },
  data() {
    return {
      clickFlag: false,
      firstDetail: {},
      today: new Date(),
      hasDone: false,
    };
  },
  computed: {
    //灰色+删除线-已完成 红色-过期  绿色-5天 蓝色-0~5天
    backgroudcolor() {
      return this.hasDone
        ? "gray"
        : new Date(this.firstDetail.date) < this.today
        ? "red"
        : this.getDaysBetween(new Date(this.firstDetail.date), this.today) > 5
        ? "green"
        : "blue";
    },
  },
  created() {
    this.freshFirstLine();
  },
  methods: {
    freshFirstLine() {
      if (this.todo.children && this.todo.children.length > 0) {
        this.firstDetail = this.todo.children[0];
        this.hasDone = this.firstDetail.status;
        if (this.hasDone) this.clickFlag = false; //全部事项完成收起
      } else {
        this.firstDetail = this.todo;
        this.hasDone = this.firstDetail.status;
        this.clickFlag = false;
      }
    },
    expandList() {
      this.clickFlag = !this.clickFlag;
    },
    changeChildren(value, index) {
      console.log(value);
      setTimeout(() => {
        this.$store.dispatch("setMissionData", [
          this.parent || this.todo,
          { children: [] },
        ]);
        this.freshFirstLine();
        this.$emit("refresh");
      }, 500);
    },
    getDaysBetween(date1, date2) {
      let startDate = Date.parse(date1);
      let endDate = Date.parse(date2);
      return (startDate - endDate) / (24 * 60 * 60 * 1000);
    },
  },
};
</script>

<style lang="scss" scoped>
.todo-main-box {
  width: 100%;
  border-radius: 4px;
  margin-top: 4px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  transition: all 0.2s ease-in-out;
  box-shadow: 1px 1px 1px 1px #eeeeee;
  .todo-main-line {
    display: flex;
    align-items: center;
    height: 48px;
    line-height: 24px;
    &.smallMode {
      height: 38px;
    }
    > * {
      padding: 0 10px;
      height: 100%;
      display: flex;
      align-items: center;
    }
    .todo-date {
      justify-content: center;
      text-align: center;
      width: 90px;
      border-right: 1px solid #f3f9ff;
      &.small-date {
        font-size: 13px;
        line-height: 16px;
      }
      .el-icon-alarm-clock{
        cursor: pointer;
        font-size: 16px;
      }
    }
    .todo-name {
      width: 0;
      flex: 1;
      border-right: 1px solid #f3f9ff;
      // align-items: flex-start !important;
      .arrow-box {
        min-width: 20px;
        height: 100%;
        display: flex;
        align-items: center;
        padding: 0;
        margin-right: 5px;
        .arrow-inner {
          display: flex;
          align-items: center;
          width: 100%;
          height: 100%;
          padding: 0;
          cursor: pointer;
        }
        .el-icon-arrow-right {
          font-size: 15px;
          margin-right: 5px;
        }
      }
      .text-box {
        display: flex;
        align-items: flex-start;
        height: 24px;
        line-height: 24px;
        flex: 1;
        width: 0;
      }
    }
    .todo-type {
      width: 135px;
      border-right: 1px solid #f3f9ff;
    }
    .todo-check {
      justify-content: center;
      width: 46px;
    }
  }
}
.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.rightArrow {
  transition: 0.2s;
  transform-origin: center;
  transform: rotate(90deg);
}

.downArrow {
  transition: 0.2s;
  transform-origin: center;
  transform: rotate(0deg);
}
.red {
  background: #ffe9e8;
}

.green {
  background: #e8fff0;
}

.blue {
  background: #d9e8fb;
}
.gray {
  opacity: 0.7;
  text-decoration: line-through; //删除线
}
</style>
