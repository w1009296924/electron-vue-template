<template>
  <div class="todo-main-box" id="a" :class="backgroudcolor">
    <div
      class="todo-main-line"
      :class="{ smallMode: !showTaskName }"
      @contextmenu.prevent="openMenu([$event, todo])"
    >
      <div
        class="todo-date"
        :class="{ 'small-date': firstLine.date.length > 10 }"
      >
        <el-popover
          v-if="firstLine.remindSwitch"
          placement="top-start"
          width="240"
          trigger="hover"
          :content="`提醒时间:${firstLine.remindTime}`"
        >
          <i slot="reference" class="el-icon-alarm-clock" />
        </el-popover>
        {{ firstLine.date.substr(5) }}
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
          <el-tooltip
            effect="light"
            :content="todo.missionName"
            placement="right"
            :open-delay="500"
            :enterable="true"
          >
            <div :class="[clickFlag ? '' : 'ellipsis']">
              {{ todo.missionName }}
            </div>
          </el-tooltip>
        </div>
      </div>
      <div
        v-if="firstLine.pendingType"
        class="todo-type"
        @contextmenu.prevent.stop="
          openMenu([$event, clickFlag ? firstLine : todo])
        "
      >
        <div class="ellipsis">
          {{ firstLine.pendingType }}
        </div>
      </div>
      <div class="todo-check">
        <el-checkbox
          :disabled="!showCheck"
          v-model="firstLine.status"
          class="checkbox"
          @change="changeChildren($event, firstLine)"
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
        <div class="todo-date" :class="{ 'small-date': item.date.length > 10 }">
          <el-popover
            v-if="item.remindSwitch"
            placement="top-start"
            width="240"
            trigger="hover"
            :content="`提醒时间:${item.remindTime}`"
          >
            <i slot="reference" class="el-icon-alarm-clock" />
          </el-popover>
          {{ item.date.substr(5) }}
        </div>
        <div class="todo-name"></div>
        <div class="todo-type" @contextmenu.prevent="openMenu([$event, item])">
          {{ item.pendingType }}
        </div>
        <div class="todo-check">
          <el-checkbox
            :disabled="!showCheck"
            v-model="item.status"
            class="checkbox"
            @change="changeChildren($event, item)"
          />
        </div>
      </div>
    </div>
    <transition name="fade">
      <div
        v-show="todoMenuVisible"
        class="context-menu"
        :style="`left:${menuLeft}px;top:${menuTop}px;`"
      >
        <div class="context-menu-item" @click="editTodo()">编辑待办</div>
        <div class="context-menu-item" @click="deleteTodo()">删除待办</div>
      </div></transition
    >
    <IncreaseDialog ref="addTodoList"></IncreaseDialog>
  </div>
</template>

<script>
import IncreaseDialog from "@/components/IncreaseDialog";
import { mapGetters } from "vuex";
export default {
  name: "PendingList",
  props: {
    todo: { type: Object },
    parent: {
      type: Object,
    },
    showCheck: { type: Boolean, default: true },
    showTaskName: { type: Boolean, default: true },
    showRightClickMenu: { type: Boolean, default: true },
  },
  components: {
    IncreaseDialog,
  },
  data() {
    return {
      clickFlag: false,
      today: new Date(),
      hasDone: false,
      menuLeft: 0,
      menuTop: 0,
      todoMenuVisible: false,
      nowItem: null,
    };
  },
  computed: {
    ...mapGetters(["lastUpdateMission"]),
    hasDoneC() {
      return this.firstLine.status;
    },
    firstLine() {
      return this.parent ? this.todo : this.todo.children[0];
    },
    //灰色+删除线-已完成 红色-过期  绿色-5天 蓝色-0~5天
    backgroudcolor() {
      return this.hasDone
        ? "gray"
        : new Date(this.firstLine.date) < this.today
        ? "red"
        : this.getDaysBetween(new Date(this.firstLine.date), this.today) > 5
        ? "green"
        : "blue";
    },
  },
  watch: {
    hasDoneC(val) {
      console.log(val);
      clearInterval(this.timer);
      this.timer = setTimeout(() => {
        this.clickFlag = !this.firstLine?.status && this.clickFlag;
        this.hasDone = val;
      }, 500);
    },
  },
  created() {
    this.hasDone = this.hasDoneC;
  },
  methods: {
    expandList() {
      this.clickFlag = !this.clickFlag;
    },
    changeChildren(value, item) {
      console.log(value);
      setTimeout(() => {
        this.$store.dispatch("modifyPending", [
          item.id,
          item,
          (this.parent || this.todo).id,
        ]);
        this.$emit("refresh");
      }, 500);
    },
    getDaysBetween(date1, date2) {
      let startDate = Date.parse(date1);
      let endDate = Date.parse(date2);
      return (startDate - endDate) / (24 * 60 * 60 * 1000);
    },
    openMenu([e, item]) {
      console.log(e);
      console.log(item);
      document.getElementById("a").click();
      this.nowItem = item;
      this.menuLeft = e.layerX;
      this.menuTop = e.layerY;
      //授权待办不展示右键菜单
      if (this.showRightClickMenu) this.todoMenuVisible = true;
      document.body.addEventListener("click", this.closeMenu);
    },
    closeMenu() {
      this.todoMenuVisible = false;
      document.body.removeEventListener("click", this.closeMenu);
    },
    deleteTodo() {
      console.log(this.nowItem.pendingType);
      if (this.nowItem.children) {
        this.$store.dispatch("deleteMission", this.todo.id);
      } else {
        this.$store.dispatch("deletePending", [
          (this.parent || this.todo).id,
          this.nowItem.id,
        ]);
      }
      //TODO 判断是否需要发删除待办交易
    },
    editTodo() {
      this.$refs.addTodoList.showEdit(
        this.parent || this.todo,
        this.nowItem.pendingType
      );
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
      .el-icon-alarm-clock {
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
      .ellipsis {
        width: 115px;
      }
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
</style>
