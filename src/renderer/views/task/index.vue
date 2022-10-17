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
                return item.state == 'develop';
              })
            "
            @clickTask="clickTask"
          >
          </task-list-box>
          <task-list-box
            title="sit"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'sit';
              })
            "
            @clickTask="clickTask"
          >
          </task-list-box>
          <task-list-box
            title="uat"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'uat';
              })
            "
            @clickTask="clickTask"
          >
          </task-list-box>
          <task-list-box
            title="rel"
            :taskArray="
              taskArray.filter((item) => {
                return item.state == 'rel';
              })
            "
            @clickTask="clickTask"
          >
          </task-list-box>
        </div>
      </div>
      <div class="task-detail-box">
        <div class="title">
          <div class="title-line"></div>
          <div class="title-text">任务详情面板</div>
        </div>
        <div v-if="nowTask" class="task-detail-content-box" v-loading="loading">
          <div class="task-info">
            <div
              v-for="(item, key) in taskInfoMap"
              :key="key"
              class="task-info-item"
            >
              <div v-if="item != '任务名'" class="task-info-item-label">
                {{ item }}
              </div>
              <el-tooltip
                class="item"
                effect="light"
                :content="nowTask[key]"
                placement="bottom-end"
                :open-delay="500"
                :enterable="false"
                :disabled="item !== '任务名'"
              >
                <div
                  v-if="item != '工作量（人月）'"
                  class="task-info-item-value"
                  :class="[
                    item == '任务名' ? 'first' : '',
                    key.substr(-4) == 'Time' ? 'left-time' : '',
                  ]"
                  @click="clickText"
                  @mouseenter="enterText"
                  @mouseleave="leaveText"
                >
                  {{ nowTask[key] }}
                </div>
                <div v-else class="input-box">
                  <el-input
                    v-model="nowTask.workload"
                    maxlength="4"
                    size="mini"
                    placeholder="0"
                    @input="editInput"
                    @blur="checkInput"
                  ></el-input>
                </div>
              </el-tooltip>

              <div
                v-if="key.substr(-4) == 'Time'"
                class="task-info-item-value"
                :class="{ 'empty-time': !nowTask[key + 'Real'] }"
                @click="clickText"
                @mouseenter="enterText"
                @mouseleave="leaveText"
              >
                {{ nowTask[key + "Real"] }}
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
        <div v-else class="task-detail-content-box" v-loading="loading">
          <div class="no-task-tip">
            <img
              :src="require('@/assets/暂无相关信息.png')"
              :draggable="false"
            />
            -请选择一个任务-
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { setWorkLoad } from "@/utils/fileTool.js";
import TaskListBox from "./components/TaskListBox";
import WorkSpace from "./components/WorkSpace";
import TodoSpace from "./components/TodoSpace";
import { mapGetters } from "vuex";
export default {
  components: { TaskListBox, WorkSpace, TodoSpace },
  data() {
    return {
      showCopy: false,
      loading: false,
      copyStyle: "",
      taskInfoMap: {
        taskName: "任务名",
        demandNo: "需求编号",
        application: "涉及应用",
        branch: "开发分支",
        fdevUnit: "研发单元（FDEV单元）",
        ipmpUnit: "IPMP实施单元",
        startTime: "启动日期（计划/实际）",
        sitTime: "提交内测日期（计划实际）",
        uatTime: "提交业测日期（计划/实际）",
        uatFinishTime: "用户测试完成日期（计划/实际）",
        fireTime: "投产日期（计划/实际）",
        workload: "工作量（人月）",
      },
    };
  },
  computed: {
    ...mapGetters(["taskArray", "nowTask"]),
    // nowTask: {
    //   get() {
    //     return this.taskArray.find((item) => {
    //       return item.selected;
    //     });
    //   },
    // },
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
    clickTask() {
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
      }, 500);
    },
    editInput(value) {
      this.nowTask.workload =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,1})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },
    checkInput() {
      this.nowTask.workload = ("" + this.nowTask.workload) // 第一步：转成字符串
        .replace(/\.$/g, ""); // 第二步：把最后一位是小数点去掉
      setWorkLoad(this.nowTask.fileDir, this.nowTask.workload);
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
          padding: 0 20px;
          width: 100%;
          height: 40px;
          border: 1px solid #b2cef4;
          display: flex;
          align-items: center;
          justify-content: space-between;
          &:first-child {
            margin-top: 0;
            justify-content: center;
          }
          .task-info-item-label {
            width: 38%;
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
              max-width: 100%;
            }
            &.left-time {
              margin-left: 20%;
            }
            &.empty-time {
              height: 0;
              width: 88.69px;
            }
            &:hover {
              background-color: #edf5ff;
            }
            &.click {
              background-color: #b3d2f9 !important;
            }
          }
          .input-box {
            width: 50px;
            ::v-deep.el-input__inner {
              text-align: center;
              padding: 0 10px;
            }
          }
        }
      }
      .el-icon-document-copy {
        position: absolute;
        z-index: 1006;
      }
      .no-task-tip {
        width: 100%;
        margin-top: 70px;
        display: flex;
        flex-direction: column;
        align-items: center;
        font-family: PingFangSC-Regular;
        font-size: 16px;
        color: rgba(0, 0, 0, 0.45);
        letter-spacing: 0;
        font-weight: 400;
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
  overflow-y: overlay;
  &:has(div) {
    background: red;
    overflow-y: none;
  }
}

::v-deep .el-loading-spinner {
  transform: translateY(-70px);
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
