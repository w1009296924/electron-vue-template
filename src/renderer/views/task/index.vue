<template>
  <div class="app-container">
    <div class="main-box">
      <div class="task-all-box">
        <div class="title">
          <div class="title-line"></div>
          <div class="title-text">任务列表</div>
        </div>
        <div class="content-box">
          <task-list-box
            title="开发中"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'dev';
              })
            "
          >
          </task-list-box>
          <task-list-box
            title="sit"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'sit';
              })
            "
          >
          </task-list-box>
          <task-list-box
            title="uat"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'uat';
              })
            "
          >
          </task-list-box>
          <task-list-box
            title="rel"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'rel';
              })
            "
          >
          </task-list-box>
        </div>
      </div>
      <div class="task-detail-box">
        <div class="title">
          <div class="title-line"></div>
          <div class="title-text">任务详情面板</div>
        </div>
        <div class="task-detail-content-box">
          <div class="task-info">
            <div v-for="item in taskInfoMap" :key="item" class="task-info-item">
              <div v-if="item != '任务名'" class="task-info-item-label">
                {{ item }}
              </div>
              <div
                v-if="item != '任务名'"
                class="task-info-item-value"
                @click="clickText"
                @mouseenter="enterText"
                @mouseleave="leaveText"
              >
                {{ nowTask }}
              </div>
              <div
                v-else
                class="task-info-item-value first"
                @click="clickText"
                @mouseenter="enterText"
                @mouseleave="leaveText"
              >
                {{ nowTask }}
              </div>
            </div>
          </div>
          <transition name="copyIcon">
            <i
              v-show="showCopy"
              class="el-icon-document-copy"
              :style="copyStyle"
            ></i
          ></transition>
          <WorkSpace></WorkSpace>
          <TodoSpace></TodoSpace>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import TaskListBox from "./components/TaskListBox";
import WorkSpace from "./components/WorkSpace";
import TodoSpace from "./components/TodoSpace";
import { mapGetters } from "vuex";
export default {
  components: { TaskListBox, WorkSpace, TodoSpace },
  data() {
    return {
      showCopy: false,
      copyStyle: "",
      taskInfoMap: {
        name: "任务名",
        demand: "需求编号",
        application: "涉及应用",
        branch: "开发分支",
        fdevUnit: "研发单元（FDEV单元）",
        ipmpUnit: "IPMP实施单元",
        startTime: "启动日期（计划/实际）",
        sitTime: "提交内测日期（计划实际）",
        uatTime: "提交业测日期（计划/实际）",
        uatFinishTime: "用户测试完成日期（计划/实际）",
        fireTime: "投产日期（计划/实际）",
        workload: "工作量",
      },
    };
  },
  computed: {
    ...mapGetters(["taskArray"]),
    nowTask: {
      get() {
        return this.taskArray.find((item) => {
          return item.selected;
        });
      },
    },
  },
  methods: {
    enterText(e) {
      this.showCopy = true;
      const element = e.target;
      this.copyStyle = `left:${
        element.offsetLeft + element.offsetWidth
      }px;top:${element.offsetTop + 5}px;`;
    },
    leaveText() {
      this.showCopy = false;
    },
    clickText(e) {
      const element = e.target;
      element.classList.add("click");
      const { clipboard } = require("electron");
      clipboard.writeText(element.innerText);
      setTimeout(() => {
        element.classList.remove("click");
      }, 200);
    },
  },
};
</script>

<style lang="scss" scoped>
.main-box {
  display: flex;
  gap: 12px;
  .task-detail-box {
    width: 642px;
    height: 875px;
    background: #fff;
    border-radius: 8px;
    padding-top: 24px;
    .task-detail-content-box {
      width: 100%;
      margin-top: 16px;
      padding: 0 24px 24px 24px;
      position: relative;
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      .task-info {
        width: 100%;
        .task-info-item {
          margin-top: -1px;
          width: 100%;
          height: 40px;
          border: 1px solid #b2cef4;
          display: flex;
          align-items: center;
          &:first-child {
            margin-top: 0;
            justify-content: center;
          }
          .task-info-item-label {
            width: 38%;
            padding-left: 24px;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 22px;
            font-weight: 400;
            white-space: nowrap;
            overflow: hidden;
          }
          .task-info-item-value {
            // background-color: #b2cef4;
            max-width: 61%;
            padding: 0 1%;
            border-radius: 5px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
            font-family: PingFangSC-Regular;
            font-size: 14px;
            color: rgba(0, 0, 0, 0.65);
            line-height: 28px;
            font-weight: 400;
            transition: all 0.2s ease-in-out;
            // cursor: url("D:/VSCodePro/electron-vue-template/src/renderer/assets/hour.png"),
            //   default;
            &.first {
              max-width: 90%;
            }
            &:hover {
              background-color: #edf5ff;
            }
            &.click {
              background-color: #b3d2f9 !important;
            }
          }
        }
      }
      .el-icon-document-copy {
        position: absolute;
        z-index: 1006;
      }
    }
  }
}
.task-all-box {
  width: 642px;
  height: 875px;
  background: #fff;
  border-radius: 8px;
  padding-top: 24px;
}
.title {
  margin-left: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
  .title-line {
    height: 20px;
    width: 4px;
    background: #5380dc;
    border-radius: 2px 0 0 2px;
  }
  .title-text {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 500;
    line-height: 32px;
  }
}

.content-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
  max-height: calc(100% - 64px);
  overflow-y: auto;
  &:has(div) {
    background: red;
    overflow-y: none;
  }
}

.content-box:has(div) {
  background: red;
  overflow-y: none;
}

.copyIcon-enter-active,
.copyIcon-leave-active {
  transition: all 0.1s ease;
}

.copyIcon-enter,
.copyIcon-leave-to {
  opacity: 0;
}
</style>
