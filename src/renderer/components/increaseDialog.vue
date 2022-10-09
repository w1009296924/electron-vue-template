<template>
  <el-dialog title="新增待办 " :close-on-click-modal="false" :visible.sync="dialogVisible" width="30%">
    <div class="dialogContent">
      <div class="dialogLine" style="margin-bottom: 8px">
        <div class="dialogText">待办时间</div>
        <el-date-picker
          v-model="pendingTime"
          align="center"
          style="margin: 0 8px; width: 224px"
          type="datetime"
          placeholder="选择日期时间"
        />
      </div>
      <div class="dialogLine" style="margin-bottom: 8px">
        <div class="dialogText">待办事项</div>
        <el-input
          v-model="pengingSth"
          style="margin: 0 8px; width: 224px"
          placeholder="请输入"
          @change="test"
        />
      </div>
      <div v-if="taskArray" class="dialogLine" style="margin-bottom: 8px">
        <div class="dialogText">绑定任务</div>
        <el-select v-model="selectMisson" clearable style="margin: 0 8px;width:224px" placeholder="请选择（可为空）">
          <el-option v-for="(item,index) in taskArray" :key="index" :value="item.taskName" />
        </el-select>
      </div>
      <div class="dialogLine" style="margin-bottom: 8px">
        <div class="dialogText">待办人</div>
        <el-select
          v-model="investor"
          style="margin: 0 8px; width: 224px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in investorList"
            :key="item.investorNo"
            :label="item.investorName"
            :value="item.investorNo"
          ></el-option>
        </el-select>
      </div>
      <div class="dialogLine">
        <div class="dialogText">提 醒</div>
        <el-switch v-model="remindSwitch" style="margin: 0 32px 0 8px" />
        <div class="smallText">
          开始前
          <el-input-number
            v-model="inputMin"
            controls-position="right"
            size=""
            style="width: 96px; margin: 0 8px"
            :min="1"
            :max="120"
          />分钟提醒我
        </div>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="dialogVisible = false">取 消</el-button>
      <el-button type="primary" @click="addPending">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { formatDateTime, subTrackTime } from "@/utils/validate.js";
import { mapGetters } from "vuex";
import { DOC_DIR } from "@/utils/constans.js";
export default {
  name: "IncreaseDialog",
  props:{
    activeFirstPage: { type: Boolean},
  },
  watch: {
    activeFirstPage: {
      handler:function () {
          this.investor = this.activeFirstPage ? this.investorList[0].investorNo:
            this.investorList.length > 1 ?
              this.investorList[1].investorNo :
              ''
      }
    }
  },
  data() {
    return {
      dialogVisible: false,
      pendingTime: "",
      pengingSth: "",
      selectMisson: "",
      investor: '000000', //新增key
      investorList: [
        {
          permission:'新增',
          investorNo: "000000",
          investorName: "本人",
        },
        {
          granted:'wenty',
          permission:'新增',
          investorNo:'12066391',
          investorName:'文天阳'
        },
      ],
      remindSwitch: false,
      inputMin: 15,
    };
  },
  computed: {
    ...mapGetters(["taskArray"]),
  },
  methods: {
    show(info = null) {
      if (info) {
        this.pendingTime = info;
      }
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    test() {},
    addPending() {
      if (!this.pendingTime) {
        this.$message({
          message: "请选择待办时间",
          type: "warning",
          offset: 180,
          duration:1000
        });
      } else if (!this.pengingSth) {
        this.$message({
          message: "请输入待办事项",
          type: "warning",
          offset: 180,
          duration:1000
        });
      } else {
        let pushObj = this.selectMisson ? 
        {
          isBindMission: true,
          missionName: this.selectMisson,
          status: false,
          children: [
            {
              id:"",
              pendingType: this.pengingSth,
              date: formatDateTime(this.pendingTime),
              status: false,
              remindSwitch:this.remindSwitch,
              remindTime:subTrackTime(this.pendingTime,this.inputMin)
            },
          ]
        }:
        {
          isBindMission: false,
          missionName: this.pengingSth,
          todoDir:DOC_DIR+'global\\Todo.txt' ,
          status: false,
          children: [
            {
              id:"",
              pendingType: "",
              date: formatDateTime(this.pendingTime),
              status: false,
              remindSwitch:this.remindSwitch,
              remindTime:subTrackTime(this.pendingTime,this.inputMin),
            },
          ]
        };
        this.$store.dispatch("addMissionData", [ pushObj, true ]);
        this.dialogVisible = false;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogLine {
  display: flex;
  align-items: center;
  line-height: 32px;
}

.dialogText {
  width: 56px;
  text-align: right;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.smallText {
  font-family: PingFangSC-Regular;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.45);
  letter-spacing: 0;
  font-weight: 400;
}
::v-deep .el-dialog__header {
  border-bottom: 1px solid #e4e7ed;
}

::v-deep .el-dialog__title {
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.85);
  line-height: 24px;
  font-weight: 700;
}
::v-deep .el-dialog__footer {
  border-top: 1px solid #e4e7ed;
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
::v-deep .el-input__icon {
  line-height: 32px;
}
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}
</style>
