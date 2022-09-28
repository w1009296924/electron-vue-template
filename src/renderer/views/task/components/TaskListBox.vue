<template>
  <div class="task-list-box">
    <div class="task-header" @click="showList = !showList">
      <i class="el-icon-caret-right"></i>
      <div>{{ title }}（{{ taskArray.length }}）</div>
    </div>
    <transition name="list">
      <div class="task-item-box" v-show="showList">
        <div
          v-for="(item, index) in taskArray"
          :key="index"
          class="task-item"
          :class="{ selected: item == nowTask }"
          @click="selectTask(index)"
        >
          <i class="el-icon-caret-right"></i>
          <div class="ellipsis">{{ item.taskName }}</div>
        </div>
      </div></transition
    >
  </div>
</template>
<script>
import { mapGetters } from "vuex";
export default {
  name: "task-list-box",
  components: {},
  props: {
    title: {
      type: String,
      default: "",
    },
    taskArray: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return { showList: true };
  },
  computed: {
    ...mapGetters(["nowTask"]),
  },
  methods: {
    showTask() {},
    selectTask(index) {
      this.$emit("clickTask");
      setTimeout(() => {
        this.$store.commit("SET_NOWTASK", this.taskArray[index]);
      }, 200);
      // console.log(this.$store.getters.taskArray);
    },
  },
};
</script>

<style lang="scss" scoped>
.task-list-box {
  width: calc(100% - 48px);
  //   height: 54px;
  background-color: #f3f9ff;
  border-radius: 2px;
  padding: 4px 0;

  .task-header {
    height: 46px;
    display: flex;
    align-items: center;
    gap: 8px;
    padding-left: 16px;
    cursor: pointer;
    // font-family: PingFangSC-Medium;
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 600;
  }
  .task-item-box {
    padding: 0 20px 0 40px;
    margin-top: -2px;
    .task-item {
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
      height: 34px;
      padding: 6px 0;
      display: flex;
      align-items: center;
      gap: 8px;
      font-family: PingFangSC-Regular;
      font-size: 16px;
      color: rgba(0, 0, 0, 0.45);
      letter-spacing: 0;
      font-weight: 400;
      border-radius: 4px;
      border: 1px;
      cursor: pointer;
      border: 1px solid transparent;
      &:hover {
        border: 1px solid #b2cef4;
      }
      &.selected {
        // opacity: 0.4;
        background: #d9e8fb;
      }
      .ellipsis {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
    }
  }
}
.list-enter-active {
  transition: all 0.5s ease;
  max-height: 900px;
  // height: 300px;
}

.list-leave-active {
  transition: all 0.2s ease;
  max-height: 900px;
  // height: auto;
}

.list-enter,
.list-leave-to {
  // height: 0;
  max-height: 0;
  opacity: 0;
}
</style>
