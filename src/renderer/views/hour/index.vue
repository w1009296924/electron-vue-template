<template>
<div class="app-container">
  <div class="hour-container">
    <div class="hour-title">
      选择填报类型
      <el-radio v-model="hourType" style="margin-left: 32px;margin-right: 24px !important;" label="1">项目工时</el-radio>
      <el-radio v-model="hourType" label="2">非项目工时</el-radio>
    </div>
    <div class="hour-select">
      <!-- 项目工时 -->
      <div v-if="hourType=='1'">
        <div class="flexCenter" style="margin-bottom:20px">
          实施单元
          <el-select v-model="unit" :disabled="smartChoose" style="margin: 0 8px;width:224px" placeholder="请选择">
            <el-option v-for="item in unitList" :key="item.value" :label="item.value" :value="item.label">
              <span style="float: left; color: #8492a6; font-size: 13px; margin-right: 20px;">{{ item.value }}</span>
              <span style="float: right">{{ item.label }}</span>
            </el-option>
          </el-select>
          <!-- <i slot="reference" class="el-icon-refresh-right" :class="{'rotate' : rotate}" @click="refreshUnit" /> -->
        </div>
        <div class="flexCenter" style="margin-bottom:20px;line-height: 32px;">
          剩余可填报工作量: {{ unit }}
        </div>
        <div class="flexCenter" style="margin-bottom:20px">
          填报日期
          <el-date-picker v-model="date" align="center" type="date" style="margin-left:8px" placeholder="选择日期" />
        </div>
        <div class="flexCenter" style="margin-bottom:20px">
          填报工时
          <el-input-number v-model="inputHour" controls-position="right" style="width:88px;margin:0 8px;" :min="1" :max="14" />
          小时
        </div>
        <div class="flexCenter">
          <el-popover :placement="'top-start'" width="250" trigger="hover" content="开启智能填报后会默认填报剩余工时最多的实施单元。">
            <div slot="reference">智能填报</div>
          </el-popover>
          <el-select v-model="smartChoose" style="margin-left:8px" @change="checkSmarkChoose">
            <el-option v-for="item in smartChooses" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
      </div>
      <!-- 非项目工时 -->
      <div v-else>
        <div class="flexCenter" style="margin-bottom:20px">
          工作类型
          <el-select v-model="type" style="margin: 0 8px;width:224px" placeholder="请选择">
            <el-option v-for="item in typeList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="flexCenter" style="margin-bottom:20px">
          工作类别
          <el-select v-model="category" style="margin: 0 8px;width:224px" placeholder="请选择">
            <el-option v-for="item in categoryList" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </div>
        <div class="flexCenter" style="margin-bottom:20px">
          工作内容
          <el-input v-model="jobContent" style="margin: 0 8px;width:224px" placeholder="请输入内容" />
        </div>
        <div class="flexCenter" style="margin-bottom:20px">
          填报日期
          <el-date-picker v-model="date" align="center" type="date" style="margin-left:8px" placeholder="选择日期" />
        </div>
        <div class="flexCenter">
          填报工时
          <el-input-number v-model="inputHour" controls-position="right" style="width:88px;margin:0 8px;" :min="1" :max="14" />
          小时
        </div>
      </div>
    </div>
    <div class="auto-commit">
      自动填报
      <el-switch v-model="autoCommit" style="margin:0 32px 0 8px" />
      自动填报时间
      <el-time-select v-model="autoCommitTime" align="center" :picker-options="{
        start: '08:30',
        step: '00:15',
        end: '18:30'
      }" placeholder="选择时间">
      </el-time-select>
    </div>
    <div class="buttonGroup">
      <div class="abutton" :class="[canCommit?'commit':'rollback']" @click="commitOrBack">
        {{ canCommit?'填报工时':'回退工时'}}
      </div>
      <div class="abutton refill" @click="refill">
        补填工时
      </div>
    </div>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import fileTool from "@/utils/fileTool.js";
export default {
  name: "hour",
  data() {
    return {
      settings:{},
      hourType: "1",
      unitList: [{
        value: '实施单元213-123UNKJ-2022-1234-代金券哦我我打算的弄啊-啊实打实是哒是法规处是给的原始股大Vu是去外地是武器二不请我大所大所大所奥术大师大所多撒大声地',
        label: '103'
      }, {
        value: '实施单元213-123UNKJ-2022-12334-代金券哦我我打算的弄啊-啊实打实撒大声地',
        label: '1.03'
      }, {
        value: '实施单元213-123UNKJ-2022-1214-代金券哦我我打算的弄啊-啊实打实撒大声地',
        label: '10.3'
      }, {
        value: '实施单元213-123UNKJ-2022-1224-代金券哦我我打算的弄啊-啊实打实撒大声地',
        label: '5.03'
      }, {
        value: '实施单元213-123UNKJ-2022-12378-代金券哦我我打算的弄啊-啊实打实撒大声地',
        label: '2.03'
      }, {
        value: '实施单元213-123UNKJ-2022-1284-代金券哦我我打算的弄啊-啊实打实撒大声地',
        label: '0.03'
      }],
      unit: '',
      rotate: false,
      date: new Date(),
      inputHour: 8,
      smartChooses: [{
        label: '是',
        value: true
      }, {
        label: '否',
        value: false
      }],
      smartChoose: false,
      type: '',
      typeList: [{
        label: '综合事务',
        value: '1'
      }, {
        label: '成长提升',
        value: '2'
      }, {
        label: '项目服务',
        value: '3'
      }, {
        label: '专项任务',
        value: '4'
      }, {
        label: '预研工作',
        value: '5'
      }],
      category: '',
      categoryList: [{
        label: '管理保障',
        value: '1'
      }, {
        label: '运维保障',
        value: '2'
      }, {
        label: '研发支撑',
        value: '3'
      }, {
        label: '自我提升',
        value: '4'
      }],
      jobContent: '',
      autoCommit: false,
      autoCommitTime: '',
      canCommit: true
    };
  },
  computed: {
    ...mapGetters(["name", "roles"]),
  },
  mounted(){
    this.init();
  },
  methods: {
    init(){
      //从本地配置中读取上次配置
      this.settings = fileTool.readSettingFile();
      this.hourType = this.settings.hour.hourType;
      this.unit = this.settings.hour.unit;
      this.smartChoose = this.settings.hour.smartChoose;
      this.type = this.settings.hour.type;
      this.category = this.settings.hour.category;
      this.jobContent = this.settings.hour.jobContent;
      this.autoCommit = this.settings.hour.autoCommit;
      this.autoCommitTime = this.settings.hour.autoCommitTime;
    },
    refreshUnit() {
      if (!this.rotate) {
        this.rotate = true;
        setTimeout(() => {
          this.rotate = false;
        }, 1500);
      }
    },
    //智能填报开启后，自动选择剩余工作量最多的实施单元
    checkSmarkChoose() {
      if (this.smartChoose) {
        this.unit = this.unitList[0].label;
      }
    },
    commitOrBack() {
      //保存本次填报配置至本地
      this.settings.hour = {
        hourType:this.hourType,
        unit:this.unit,
        smartChoose:this.smartChoose,
        type:this.type,
        category:this.category,
        jobContent:this.jobContent,
        autoCommit:this.autoCommit,
        autoCommitTime:this.autoCommitTime
      }
      fileTool.writeSettingFile(this.settings);//本地保存配置文件
      this.canCommit = !this.canCommit;
    },
    refill() {
      //todo 补填工时
      console.log('补填工时');
    }
  }
};
</script>

<style lang="scss" scoped>
.hour-container {
  height: 875px;
  padding: 40px;
  border: 2px;
  background-color: #ffffff;
}

.hour-title {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  line-height: 28px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.hour-select {
  width: 100%;
  background: #F3F9FF;
  border-radius: 4px;
  margin-top: 22px;
  padding: 24px 16px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.el-icon-refresh-right {
  cursor: pointer;
  font-size: 20px;
}

.flexCenter {
  display: flex;
  align-items: center;
}

.auto-commit {
  margin: 18px 0 50px;
}

.abutton {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 32px;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 22px;
  font-weight: 400;
}

.buttonGroup {
  display: flex;
  margin-left: 58px;
}

.commit {
  background-color: #005BD2;
}

.rollback {
  background-color: #FF3E52;
}

.refill {
  background-color: #FFFFFF;
  border: 1px solid #005BD2;
  color: #005BD2;
  margin-left: 24px;
}

.rotate {
  animation: turn 1.5s linear infinite;
}
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-input-number {
  line-height: 30px;
}
::v-deep .el-input-number__increase{
  line-height: 16px !important;
}
::v-deep .el-input-number__decrease{
  line-height: 16px !important;
}
::v-deep .el-input__icon {
  line-height: 32px;
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
