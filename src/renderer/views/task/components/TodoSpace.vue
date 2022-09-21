<template>
  <div class="todo-card">
    <div class="title">
      <i class="el-icon-finished"></i>
      <div class="title-text">待办列表</div>
    </div>
    <div class="todo-space-content-box">
      <PendingList
        v-for="item of missionArray"
        :key="item.missionName"
        :todo="item"
        :showTaskName="false"
      />
    </div>
  </div>
</template>

<script>
import PendingList from "@/components/PendingList";
import { mapGetters } from "vuex";
export default {
  name: "task-list-box",
  components: { PendingList },
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
  computed: {
    ...mapGetters(["missionArray"]),
  },
};
</script>

<style lang="scss" scoped>
.todo-card {
  background: #f3f9ff;
  border-radius: 8px;
  width: 0;
  flex: 1;
  height: 303px;
}
.title {
  margin-top: 16px;
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
    font-size: 16px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 500;
  }
}
.todo-space-content-box {
  padding: 0 10px 2px 10px;
  margin-top: 8px;
  height: calc(100% - 67px);
  overflow-y: overlay;
  &::-webkit-scrollbar {
    width: 6px;
  }
}
</style>
