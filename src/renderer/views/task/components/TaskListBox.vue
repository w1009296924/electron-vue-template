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
                  :fill="iconColor(item)"
                  p-id="2538"
                ></path>
              </svg>
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
    ...mapGetters(["missionArray", "nowTask"]),
    iconColor() {
      return function (task) {
        let mi =
          this.missionArray.find((item) => {
            return item.missionName == task.taskName;
          }) || {};
        if (mi.children && mi.children.length > 0 && !mi.children[0].status) {
          const offDay = this.getDaysBetween(mi.children[0].date, new Date());
          if (offDay <= 1) {
            return "#ff4949"; //红色
          } else if (offDay <= 3) {
            return "#ffc129"; //橙色
          } else if (offDay <= 5) {
            return "#377FFC"; //蓝色
          }
        }
        return "#2bcd24"; //绿色
      };
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
    getDaysBetween(date1, date2) {
      let startDate = Date.parse(date1);
      let endDate = Date.parse(date2);
      return (startDate - endDate) / (24 * 60 * 60 * 1000);
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
        svg {
          border-radius: 50%;
          box-shadow: inset 0 0 1px 2px #0000000f;
        }
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
