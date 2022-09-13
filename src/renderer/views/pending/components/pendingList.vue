<template>
<div class="container">
  <div class="father">
    <div class="missionName">
      <i v-if="detail.children" class="el-icon-arrow-right" :class="[clickFlag?'rightArrow':'downArrow']" @click="expandList" />
      {{detail.missionName}}
    </div>
    <div class="date">{{detail.date}}</div>
    <div class="pendingName">{{detail.pendingName}}</div>
    <el-checkbox v-model="detail.status" class="checkbox" @change="change" />
  </div>
  <div v-if="detail.children&&clickFlag">
    <div v-for="(item,index) of detail.children" v-if="!item.status" :key="index" class="children">
      <div class="missionName"></div>
      <div class="date">{{item.date}}</div>
      <div class="pendingName">{{item.pendingName}}</div>
      <el-checkbox v-model="item.status" class="checkbox" @change="changeChildren($event,index)" />
    </div>
    <div v-for="(item,index) of detail.children" v-if="item.status" :key="index" class="children">
      <div class="missionName"></div>
      <div class="date">{{item.date}}</div>
      <div class="pendingName">{{item.pendingName}}</div>
      <el-checkbox v-model="item.status" class="checkbox" @change="changeChildren($event,index)" />
    </div>

  </div>
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
      clickFlag: false,
      checked: false,
      xxx: false
    }
  },
  methods: {
    expandList() {
      this.clickFlag = !this.clickFlag;
    },
    change(value) {
      console.log('change', value);
    },
    changeChildren(value, index) {
      console.log('children', index, ' is ', value);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  background: #FFE9E8;
  margin-top: 4px;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.father {
  display: flex;
  align-items: center;
}

.children {
  display: flex;
  align-items: center;
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
  width: 600px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  padding-left: 16px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #F3F9FF;
}

.pendingName {
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 130px;
  height: 48px;
  border-right: 1px solid #F3F9FF;
}

.checkbox {
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
