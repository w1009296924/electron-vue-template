<template>
<div class="container" v-if="detail.children&&firstDetail.date" >
  <div v-if="!isFromTask&&!isFromHome" class="left" :class="backgroudcolor">
    <div class="missionName" :class="{'ellipsis':!clickFlag}">
      <i v-if="detail.children[0].pendingType != '其他'" class="el-icon-arrow-right" :class="[clickFlag?'rightArrow':'downArrow']" @click="expandList" />
      {{detail.missionName}}
    </div>
  </div>
  <div v-if="isFromHome" class="left" :class="backgroudcolor">
    ssss
  </div>
  <div v-if="!clickFlag" class="right" :class="backgroudcolor">
    <div v-if="firstDetail.date" :class="[firstDetail.date.length==10?'date':'dateSmall']">{{firstDetail.date}}</div>
    <div class="pendingType">{{firstDetail.pendingType}}</div>
    <el-checkbox v-if="showCheck" v-model="firstDetail.status" class="checkbox" @change="changeChildren($event,0)" />
  </div>
  <div v-else :class="backgroudcolor">
    <div v-for="(item,index) of detail.children" v-if="!item.status" :key="index+'a'" class="children">
      <div class="date">{{item.date}}</div>
      <div class="pendingType">{{item.pendingType}}</div>
      <el-checkbox v-if="showCheck" v-model="item.status" class="checkbox" @change="changeChildren($event,index)" />
    </div>
    <div v-for="(item,index) of detail.children" v-if="item.status" :key="index+'b'" class="children">
      <div :class="[item.date.length==10?'date':'dateSmall']">{{item.date}}</div>
      <div class="pendingType">{{item.pendingType}}</div>
      <el-checkbox v-if="showCheck" v-model="item.status" class="checkbox" @change="changeChildren($event,index)" />
    </div>
  </div>
</div>
</template>

<script>
export default {
  name: "PendingList",
  props: {
    detail: {type: Object},
    showCheck: {type: Boolean,default: true},
    isFromTask: {type: Boolean,default: false},
    isFromHome: {type: Boolean,default: false},
  },
  data() {
    return {
      clickFlag: false,
      firstDetail: {},
      today: new Date(),
      doneFlag: false,
    }
  },
  computed: {
    //灰色+删除线-已完成 红色-过期  绿色-5天 蓝色-0~5天
    backgroudcolor() {
      return this.doneFlag ?'gray' : new Date(this.firstDetail.date) < this.today ? 'red' : this.getDaysBetween(new Date(this.firstDetail.date), this.today) > 5 ? 'green' : 'blue';
    }
  },
  mounted() {
    this.freshFirstLine();
  },
  methods: {
    freshFirstLine() {
      if (this.detail.children) {
        var index = this.detail.children.findIndex(item => !item.status);
        this.doneFlag = index == -1;
        if(this.doneFlag) this.clickFlag = false;//全部事项完成
        this.firstDetail = this.detail.children[index == -1 ? 0 : index];
      }
    },
    expandList() {
      this.clickFlag = !this.clickFlag;
    },
    changeChildren(value, index) {
      setTimeout(() => {
        this.freshFirstLine();
      }, 500)
    },
    getDaysBetween(date1, date2) {
      let startDate = Date.parse(date1);
      let endDate = Date.parse(date2);
      return (startDate - endDate) / (24 * 60 * 60 * 1000);
    }
  },
};
</script>

<style lang="scss" scoped>
.container {
  display: flex;
  margin-top: 4px;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.red {
  background: #FFE9E8;
}

.green {
  background: #E8FFF0;
}

.blue {
  background: #84becc;
}
.gray{
  opacity: 0.7;
  text-decoration:line-through;//删除线
}

.left {
  display: flex;
  align-items: flex-start;
}

.right {
  display: flex;
  align-items: center;
}

.children {
  display: flex;
  align-items: center;
  height: 48px;
}

.date {
  padding: 0 16px;
  height: 48px;
  line-height: 48px;
  border-right: 1px solid #F3F9FF;
  border-left: 1px solid #F3F9FF;
}

.dateSmall {
  display: flex;
  justify-content: center;
  width: 123px;
  padding: 0 16px;
  border-right: 1px solid #F3F9FF;
  border-left: 1px solid #F3F9FF;
}

.el-icon-arrow-right {
  cursor: pointer;
  font-size: 15px;
  margin-right: 5px;
}

.missionName {
  width: 600px;
  text-align: justify;
  padding: 13px 16px 0 16px;
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pendingType {
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 130px;
  height: 100%;
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
::v-deep .vue-contextmenu-listWrapper {
  padding-left: 0;
}
</style>
