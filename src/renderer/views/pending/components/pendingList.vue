<template>
<div class="container">
  <div class="date">{{detail.date}}</div>
  <div class="missionName">
    <i v-if="detail.children" class="el-icon-arrow-right" :class="[clickFlag?'rightArrow':'downArrow']" @click="expandList" />
    {{detail.missionName}}
  </div>
  <div class="pendingName">{{detail.pendingName}}</div>
  <el-checkbox v-model="checked" class="checkbox" @change="change" />
</div>
</template>

<script>
export default {
  name: "PendingList",
  props: {
    detail: {
      type: Object,
      default: {},
    }
  },
  data() {
    return {
      clickFlag:false,
      checked:false,
    }
  },
  methods: {
    expandList() {
      this.clickFlag = !this.clickFlag;
    },
    change() {
      console.log('change');
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  align-items: center;
  background: #FFE9E8;
  margin-top: 4px;
  border-radius: 4px;
  height: 48px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0,0,0,0.65);
  letter-spacing: 0;
  font-weight: 400;
}
.date {
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #F3F9FF;
}
.el-icon-arrow-right {
  cursor: pointer;
  font-size: 15px;
  margin-right: 5px;
}
.missionName {
  width: 400px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 16px;
  height: 48px;
  line-height: 48px;
}
.pendingName {
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #F3F9FF;
}
.checkbox{
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
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
</style>
