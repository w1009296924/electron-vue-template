<template>
  <div class="app-container">
    <div class="tools-container">
      <ToolTitle toolName="健康提醒" />
      <div class="set-healthRemind">
        <div class="topLine">
          <div style="width: 100px; display: inline-block">健康提醒</div>
          <el-switch
            v-model="healthRemindSwitch"
            @change="healthRemindSwitchChange"
            style="margin-left: 16px"
          />
        </div>
        <div class="midLine">
          <div style="width: 100px; display: inline-block">提示气泡音</div>
          <el-switch
            v-model="voiceSwitch"
            @change="voiceSwitchChange"
            style="margin-left: 16px"
          />
        </div>
        <div class="midLine">
          间隔时间
          <el-input-number
            v-model="inputTime"
            style="width: 90px; margin-left: 16px"
            controls-position="right"
            :max="120"
            :min="5"
            @change="timeChange"
          />
          <span class="append-text">分钟</span>
        </div>
      </div>
      <!-- <div class="set-voice">
        <div class="midLine">
        自定义提示话术
          <el-input v-model="inputWord" style="width:500px;margin-left:16px" @change="wordChange" />
          <div class="append-text" style="margin:12px 0 0 158px">可用%代表设定的时间</div>
      </div>
      </div> -->
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import ToolTitle from "../components/toolTitle";
import fileTool from "@/utils/fileTool.js";
export default {
  name: "healthRemind",
  components: {
    ToolTitle,
  },
  data() {
    return {
      healthRemindSwitch: true, //健康提醒开关
      voiceSwitch: true, //提示音开关
      inputTime: 45, //提醒默认间隔
      inputWord: "您已经连续工作了%分钟了，休息一会吧~", //提醒默认话术
      settings: {},
    };
  },
  computed: {
    ...mapGetters(["name", "roles"]),
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //从本地配置中读取上次配置
      this.settings = fileTool.readSettingFile();
      this.healthRemindSwitch = this.settings.tools.healthRemindSwitch;
      this.voiceSwitch = this.settings.tools.voiceSwitch;
      this.inputTime = this.settings.tools.inputTime;
      this.inputWord = this.settings.tools.inputWord;
    },
    voiceSwitchChange() {
      this.settings.tools.voiceSwitch = this.voiceSwitch;
      fileTool.writeSettingFile(this.settings);
    },
    healthRemindSwitchChange() {
      this.settings.tools.healthRemindSwitch = this.healthRemindSwitch;
      fileTool.writeSettingFile(this.settings);
    },
    timeChange(args) {
      if (args > 120) {
        this.$message({
          message: "间隔时间最多为120分钟哦",
          type: "warning",
        });
        this.inputTime = 120;
      } else if (args < 5) {
        this.$message({
          message: "间隔时间最少为5分钟哦",
          type: "warning",
        });
        this.inputTime = 5;
      }
      this.settings.tools.inputTime = this.inputTime;
      fileTool.writeSettingFile(this.settings);
    },
    wordChange(args) {
      // if (!args) {
      //   this.$message({
      //     message: '请输入提示话术',
      //     type: 'warning'
      //   });
      //   this.inputWord = '您已经连续工作了%分钟了，休息一会吧~';
      // }
      this.settings.tools.inputWord = this.inputWord;
      fileTool.writeSettingFile(this.settings);
    },
  },
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
  height: 190px;
  background: #f3f9ff;
  border-radius: 4px;
  margin-top: 16px;
  padding: 32px 24px;
}

.set-voice {
  width: 100%;
  height: 176px;
  background: #f3f9ff;
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
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-input-number {
  line-height: 30px;
}
::v-deep .el-input-number__increase {
  line-height: 16px !important;
}
::v-deep .el-input-number__decrease {
  line-height: 16px !important;
}
</style>
