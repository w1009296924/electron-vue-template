<template>
  <div class="task-list-box">
    <div class="task-header" @click="showList = !showList">
      <i class="el-icon-caret-right"></i>
      <div>{{ title }}（{{ taskArray.length }}）</div>
    </div>
    <transition name="list">
      <div class="task-item-box" v-show="showList">
        <el-tooltip
          effect="light"
          :content="item.taskName"
          placement="right"
          :open-delay="500"
          :enterable="false"
          v-for="(item, index) in taskArray"
          :key="index"
        >
          <div
            class="task-item"
            :class="{ selected: item == nowTask }"
            @click="selectTask(index)"
          >
            <div class="item-point">
              <svg
                t="1665227579317"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2536"
                width="18"
                height="18"
              >
                <path
                  d="M512 512m-442.7 0a442.7 442.7 0 1 0 885.4 0 442.7 442.7 0 1 0-885.4 0Z"
                  fill="white"
                  p-id="2537"
                ></path>
                <path
                  d="M512 512m-263 0a263 263 0 1 0 526 0 263 263 0 1 0-526 0Z"
                  fill="#377FFC"
                  p-id="2538"
                ></path>
              </svg>
              <!-- <svg
                t="1665227486084"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2352"
                width="18"
                height="18"
              >
                <path
                  d="M480 480m-288 0a4.5 4.5 0 1 0 576 0 4.5 4.5 0 1 0-576 0Z"
                  p-id="2213"
                ></path>
                <path
                  d="M512 963.765a451.765 451.765 0 1 1 0-903.53 451.765 451.765 0 0 1 0 903.53z m0-56.47a395.294 395.294 0 1 0 0-790.59 395.294 395.294 0 0 0 0 790.59z"
                  fill="white"
                  p-id="2353"
                ></path>
              </svg> -->
              <!-- <svg
                t="1665223523064"
                class="icon"
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                p-id="2212"
                width="18"
                height="18"
                :fill="iconColor"
              >
                <path
                  d="M480 480m-288 0a4.5 4.5 0 1 0 576 0 4.5 4.5 0 1 0-576 0Z"
                  p-id="2213"
                ></path>
              </svg> -->
            </div>

            <div class="ellipsis">{{ item.taskName }}</div>
          </div>
        </el-tooltip>
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
    iconColor() {
      return "rgba(0, 0, 0, 0.45)";
    },
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
    padding: 0 20px 0 30px;
    margin-top: -2px;
    .task-item {
      transition: all 0.2s ease-in-out;
      box-sizing: border-box;
      height: 34px;
      padding: 6px 0;
      display: flex;
      align-items: center;
      gap: 4px;
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
      .item-point {
        margin-left: 4px;
        height: 18px;
        width: 18px;
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
