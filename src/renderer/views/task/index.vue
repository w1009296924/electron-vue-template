<template>
  <div class="app-container">
    <div class="main-box">
      <div class="todo-card" :style="`width:642px;height:875px;`">
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
    </div>
  </div>
</template>

<script>
import TaskListBox from "./components/TaskListBox";
import { mapGetters } from "vuex";
export default {
  components: { TaskListBox },
  data() {
    return {};
  },
  computed: {
    ...mapGetters(["taskArray"]),
  },
};
</script>

<style lang="scss" scoped>
.todo-card {
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
</style>
