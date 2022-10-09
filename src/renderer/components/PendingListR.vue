<template>
  <div
    class="container"
    v-if="detail.children && firstDetail.date"
    :class="[showTaskName ? 'nomalMode' : 'smallMode']"
  >
    <div v-if="showTaskName" class="left" :class="backgroudcolor">
      <div class="missionName">
        <div class="icon-box">
          <i
            v-if="detail.children.length > 1"
            class="el-icon-arrow-right"
            :class="[clickFlag ? 'rightArrow' : 'downArrow']"
            @click="expandList"
          />
        </div>
        <div class="text-box" :class="{ ellipsis: !clickFlag }">
          {{ detail.missionName }}
        </div>
      </div>
    </div>
    <div v-if="!clickFlag" class="right" :class="backgroudcolor">
      <div
        v-if="firstDetail.date"
        :class="[firstDetail.date.length == 10 ? 'date' : 'dateSmall']"
      >
        {{ firstDetail.date.substr(5) }}
      </div>
      <div v-if="showTaskName" class="blank"></div>
      <div class="pendingType" :class="{ border: firstDetail.pendingType }">
        {{ firstDetail.pendingType }}
      </div>
      <el-checkbox
        v-if="showCheck"
        v-model="firstDetail.status"
        class="checkbox"
        @change="changeChildren($event, 0)"
      />
    </div>
    <div v-else class="right-children" :class="backgroudcolor">
      <div
        v-for="(item, index) of detail.children"
        v-if="!item.status"
        :key="index + 'a'"
        class="children"
      >
        <div class="date">{{ item.date.substr(5) }}</div>
        <div v-if="showTaskName" class="blank"></div>
        <div class="pendingType border">{{ item.pendingType }}</div>
        <el-checkbox
          v-if="showCheck"
          v-model="item.status"
          class="checkbox"
          @change="changeChildren($event, index)"
        />
      </div>
      <div
        v-for="(item, index) of detail.children"
        v-if="item.status"
        :key="index + 'b'"
        class="children"
      >
        <div :class="[item.date.length == 10 ? 'date' : 'dateSmall']">
          {{ item.date.substr(5) }}
        </div>
        <div v-if="showTaskName" class="blank"></div>
        <div class="pendingType border">{{ item.pendingType }}</div>
        <el-checkbox
          v-if="showCheck"
          v-model="item.status"
          class="checkbox"
          @change="changeChildren($event, index)"
        />
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "PendingList",
  props: {
    detail: { type: Object },
    showCheck: { type: Boolean, default: true },
    showTaskName: { type: Boolean, default: true },
  },
  data() {
    return {
      clickFlag: false,
      firstDetail: {},
      today: new Date(),
      hasDone: false,
    };
  },
  computed: {
    //灰色+删除线-已完成 红色-过期  绿色-5天 蓝色-0~5天
    backgroudcolor() {
      return this.hasDone
        ? "gray"
        : new Date(this.firstDetail.date) < this.today
        ? "red"
        : this.getDaysBetween(new Date(this.firstDetail.date), this.today) > 5
        ? "green"
        : "blue";
    },
  },
  mounted() {
    this.freshFirstLine();
  },
  methods: {
    freshFirstLine() {
      this.firstDetail = this.detail.children[0];
      this.hasDone = this.firstDetail.status;
    },
    expandList() {
      this.clickFlag = !this.clickFlag;
    },
    changeChildren(value, index) {
      console.log(value);
      setTimeout(() => {
        this.$store.dispatch("setMissionData", [this.detail, { children: [] }]);
        this.freshFirstLine();
      }, 500);
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
.container {
  position: relative;
  display: flex;
  margin-top: 4px;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
  div {
    transition: all 0.2s ease-in-out;
  }
}
.red {
  background: #ffe9e8;
}

.green {
  background: #e8fff0;
}

.blue {
  background: #d9e8fb;
}
.gray {
  opacity: 0.7;
  text-decoration: line-through; //删除线
}

.left {
  display: flex;
  width: calc(100% - 272px);
  position: absolute;
  left: 90px;
}
.blank {
  width: calc(100% - 271px);
  height: 48px;
}

.right {
  width: 100%;
  display: flex;
  align-items: center;
}
.right-children {
  width: 100%;
}
.children {
  width: 100%;
  display: flex;
  align-items: center;
  height: 48px;
}

.date {
  padding: 0 16px;
  width: 90px;
  height: 48px;
  line-height: 48px;
  text-align: center;
  border-right: 1px solid #f3f9ff;
}

.dateSmall {
  display: flex;
  justify-content: center;
  text-align: center;
  width: 90px;
  height: auto;
  line-height: initial;
  padding: 0 16px;
  border-right: 1px solid #f3f9ff;
  border-left: 1px solid #f3f9ff;
}

.el-icon-arrow-right {
  cursor: pointer;
  font-size: 15px;
  margin-right: 5px;
}

.missionName {
  display: flex;
  width: 100%;
  padding: 13px 16px 0 16px;
  .icon-box {
    min-width: 24px;
    width: 24px;
  }
  text-box {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.ellipsis {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.pendingType {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 0 16px;
  width: 130px;
  height: 100%;
  border-right: 1px solid #f3f9ff;
}
.border {
  border-left: 1px solid #f3f9ff;
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
.nomalMode {
  // height: 48px;
  // line-height: 48px;
}
.smallMode {
  height: 38px;
  line-height: 38px;
}
::v-deep .vue-contextmenu-listWrapper {
  padding-left: 0;
}
</style>
