<template>
  <el-dialog title="新增待办 " :visible.sync="dialogVisible" width="30%">
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
      <!-- <div class="dialogLine" style="margin-bottom: 8px">
          <div class="dialogText">需求编号</div>
          <el-select v-model="missionNo" style="margin: 0 8px;width:224px" placeholder="请选择（可为空）">
            <el-option v-for="item in missionList" :key="item.missionNo" :label="item.missionName" :value="item.missionNo" ></el-option>
          </el-select>
        </div> -->
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
import { formatDateTime } from "@/utils/validate.js";
export default {
  name: "IncreaseDialog",
  data() {
    return {
      dialogVisible: false,
      pendingTime: "",
      pengingSth: "",
      missionNo: "",
      missionList: [
        {
          missionNo: "UT-WLJR-2022-0575",
          missionName: "测试4",
        },
        {
          missionNo: "UT-WLJR-2022-0525",
          missionName: "测试3",
        },
        {
          missionNo: "UT-WLJR-2022-0505",
          missionName: "测试2",
        },
        {
          missionNo: "KEJI-2022-0575",
          missionName: "测试1",
        },
      ],
      investor: "12066391", //新增key
      investorList: [
        {
          investorNo: "12066391",
          investorName: "本人",
        },
        {
          investorNo: "12066390",
          investorName: "李亚威",
        },
      ],
      remindSwitch: false,
      inputMin: 15,
    };
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
      console.log(this.pendingTime);
      if (!this.pendingTime) {
        this.$message({
          message: "请选择待办时间",
          type: "warning",
        });
      } else if (!this.pengingSth) {
        this.$message({
          message: "请输入待办事项",
          type: "warning",
        });
      } else {
        let pushObj = {
          missionName: this.pengingSth,
          status: false,
          children: [
            {
              pendingType: "",
              date: formatDateTime(this.pendingTime),
              status: false,
            },
          ],
        };
        this.$store.dispatch("addMissionData", pushObj);
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
