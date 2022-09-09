<template>
<div class="app-container">
  <div class="tools-container">
    <ToolTitle toolName="健康提醒" />
    <div class="set-healthRemind">
      <div class="topLine">
        健康提醒
        <el-switch v-model="healthRemindSwitch" style="margin-left:16px" />
      </div>
      <div class="midLine">
        间隔时间
        <el-input-number v-model="inputTime" style="width:90px;margin-left:16px" controls-position="right" :max="120" :min="5" @change="timeChange" />
        <span class="append-text">分钟</span>
      </div>
    </div>
    <div class="set-voice">
      <div class="topLine">
        提示气泡音
        <el-switch v-model="voiceSwitch" style="margin-left:16px" />
      </div>
      <div class="midLine">
        自定义提示话术
        <el-input v-model="inputWord" style="width:500px;margin-left:16px" @change="wordChange" />
        <div class="append-text" style="margin:12px 0 0 158px">可用%代表设定的时间</div>
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import ToolTitle from "../components/toolTitle"
export default {
  name: "healthRemind",
  components: {
    ToolTitle
  },
  data() {
    return {
      healthRemindSwitch: true, //健康提醒开关
      voiceSwitch: true, //提示音开关
      inputTime: 45, //提醒默认间隔
      inputWord: '您已经连续工作了%分钟了，休息一会吧~' //提醒默认话术
    };
  },
  computed: {
    ...mapGetters(["name", "roles"]),
  },
  methods: {
    timeChange(args) {
      if (args > 120) {
        this.$message({
          message: '间隔时间最多为120分钟哦',
          type: 'warning'
        });
        this.inputTime = 120;
      } else if (args < 5) {
        this.$message({
          message: '间隔时间最少为5分钟哦',
          type: 'warning'
        });
        this.inputTime = 5;
      }
    },
    wordChange(args) {
      if (!args) {
        this.$message({
          message: '请输入提示话术',
          type: 'warning'
        });
        this.inputWord = '您已经连续工作了%分钟了，休息一会吧~';
      }
    }
  }
};
</script>

<style lang="scss" scoped>
.tools-container {
  height: 875px;
  padding: 24px;
  border: 2px;
  background-color: #ffffff;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.set-healthRemind {
  width: 100%;
  height: 144px;
  background: #F3F9FF;
  border-radius: 4px;
  margin-top: 16px;
  padding: 32px 24px;
}

.set-voice {
  width: 100%;
  height: 176px;
  background: #F3F9FF;
  border-radius: 4px;
  margin-top: 16px;
  padding: 32px 24px;
}

.midLine {
  margin: 22px 0 12px;
}

.append-text {
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
  font-weight: 400;
}
</style>
