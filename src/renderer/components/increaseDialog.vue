<template>
  <el-dialog
    :title="editFlag ? '修改待办' : '新增待办'"
    :close-on-click-modal="false"
    :visible.sync="dialogVisible"
    width="30%"
  >
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
        />
      </div>
      <div v-if="taskArray" class="dialogLine" style="margin-bottom: 8px">
        <div class="dialogText">绑定任务</div>
        <el-select
          v-model="selectMisson"
          :disabled="editFlag"
          clearable
          style="margin: 0 8px; width: 224px"
          placeholder="请选择（可为空）"
        >
          <el-option
            v-for="(item, index) in taskArray"
            :key="index"
            :value="item.taskName"
          />
        </el-select>
      </div>
      <div class="dialogLine" style="margin-bottom: 8px">
        <div class="dialogText">待办人</div>
        <el-select
          v-model="investor"
          :disabled="editFlag"
          style="margin: 0 8px; width: 224px"
          placeholder="请选择"
        >
          <el-option
            v-for="item in investorList"
            :key="item.name"
            :label="item.label"
            :value="item.name"
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
      <el-button
        type="primary"
        @click="editFlag ? edit_Pending() : add_Pending()"
        >确 定</el-button
      >
    </span>
  </el-dialog>
</template>

<script>
import { formatDateTime2, subTrackTime } from "@/utils/validate.js";
import {
  addPending,
  addMission,
  modifyMission,
  modifyPendingInfo,
} from "@/utils/nativeRequest.js";
import { mapGetters } from "vuex";
import { DOC_DIR } from "@/utils/constans.js";
export default {
  name: "IncreaseDialog",
  props: {
    activeFirstPage: { type: Boolean },
  },
  watch: {
    activeFirstPage: {
      handler: function () {
        this.investor = this.activeFirstPage
          ? this.investorList[0].name
          : this.investorList.length > 1
          ? this.investorList[1].name
          : "";
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      editFlag: false,
      editMission: {},
      editIndex: 0,
      pendingTime: "",
      pengingSth: "",
      selectMisson: "",
      investor: "", //新增key
      investorList: [],
      remindSwitch: false,
      inputMin: 15,
    };
  },
  computed: {
    ...mapGetters(["taskArray", "missionArray", "grantedList"]),
  },
  created() {
    this.init();
  },
  watch: {
    grantedList: {
      handler() {
        this.investorList = [
          {
            permission: "新增",
            name: this.$store.state.user.name,
            label: "本人",
          },
        ];
        this.grantedList.forEach((item) => {
          if (item.permission == "新增") {
            this.investorList.push({
              permission: item.permission,
              name: item.name,
              label: item.name,
            });
          }
        });
      },
      immediate: true,
    },
  },
  methods: {
    init() {
      this.investor = this.$store.state.user.name;
      this.investorList = [
        {
          permission: "新增",
          name: this.$store.state.user.name,
          label: "本人",
        },
      ];
    },
    show(info = null) {
      this.editFlag = false;
      if (info) {
        this.pendingTime = info;
      }
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    showEdit(mission, pendingType) {
      this.editFlag = true;
      this.editMission = mission;
      this.editIndex = Boolean(pendingType)
        ? mission.children.findIndex((item) => {
            if (item.pendingType == pendingType) {
              return true;
            }
          })
        : 0;
      this.pendingTime =
        mission.children[this.editIndex].date.length > 10
          ? mission.children[this.editIndex].date
          : mission.children[this.editIndex].date + " 00:00:00";
      this.pengingSth = mission.missionNo
        ? mission.children[this.editIndex].pendingType
        : mission.missionName;
      this.selectMisson = mission.missionNo ? mission.missionName : "";
      this.remindSwitch = Boolean(
        mission.children[this.editIndex].remindSwitch
      );
      this.inputMin = mission.children[this.editIndex].remindTime
        ? (new Date(this.pendingTime).getTime() -
            new Date(mission.children[this.editIndex].remindTime).getTime()) /
          60000
        : 15;
      this.dialogVisible = true;
    },
    add_Pending() {
      if (!this.pendingTime) {
        this.$message({
          message: "请选择待办时间",
          type: "warning",
          offset: 180,
          duration: 1000,
        });
      } else if (!this.pengingSth) {
        this.$message({
          message: "请输入待办事项",
          type: "warning",
          offset: 180,
          duration: 1000,
        });
      } else {
        let pushObj = {};
        //绑定了任务,插入子待办
        if (this.selectMisson) {
          //找到任务对应的待办id
          const mission = this.missionArray.find((element) => {
            return element.missionName == this.selectMisson;
          });
          if (!mission) {
            this.$message({
              message:
                "已删除的任务可以删除归档任务文件夹下的Todo.txt后重新生成待办",
              type: "error",
              offset: 250,
              duration: 2500,
            });
            return;
          }
          pushObj = {
            id: this.generateId(),
            pendingType: this.pengingSth,
            date: formatDateTime2(this.pendingTime),
            status: false,
            remindSwitch: this.remindSwitch,
            remindTime: subTrackTime(this.pendingTime, this.inputMin),
          };
          //本人新增待办修改vuex和本地文件
          this.$store.dispatch("addPending", [mission.id, pushObj]);
          //新增子待办数据
          if (this.$store.state.grant.haveGrant) {
            console.log("上传服务端addPending");
            addPending(this.investor, mission.id, pushObj);
          }
        } else {
          //没绑定任务,插入Global.Txt
          pushObj = {
            id: this.generateId(),
            isBindMission: false,
            missionName: this.pengingSth,
            fileDir: DOC_DIR + "global\\Todo.txt",
            status: false,
            children: [
              {
                id: this.generateId(),
                pendingType: "",
                date: formatDateTime2(this.pendingTime),
                status: false,
                remindSwitch: this.remindSwitch,
                remindTime: subTrackTime(this.pendingTime, this.inputMin),
              },
            ],
          };
          //本人新增待办修改vuex和本地文件
          this.$store.dispatch("addMission", [pushObj, true]);
          //新增待办数据上传服务端,新增全局待办事项
          if (this.$store.state.grant.haveGrant) {
            console.log("上传服务端addMission --增加全局待办");
            addMission(this.investor, pushObj);
          }
        }
        this.dialogVisible = false;
      }
    },
    edit_Pending() {
      this.editMission.children[this.editIndex].date = formatDateTime2(
        this.pendingTime
      );
      if (this.editMission.missionNo) {
        //绑定任务的待办 修改待办名称
        this.editMission.children[this.editIndex].pendingType = this.pengingSth;
      } else {
        //全局待办修改待办名称
        this.editMission.missionName = this.pengingSth;
        this.$store.dispatch("modifyMission", [
          this.editMission.id,
          { missionName: this.pengingSth },
        ]);
      }
      this.editMission.children[this.editIndex].remindSwitch =
        this.remindSwitch;
      this.editMission.children[this.editIndex].remindTime = subTrackTime(
        this.pendingTime,
        this.inputMin
      );
      this.$store.dispatch("modifyPending", [
        this.editMission.children[this.editIndex].id,
        this.editMission.children[this.editIndex],
        this.editMission.id,
      ]);
      // modifyPendingInfo 修改待办信息  modifyMission 修改任务-全局待办
      if (this.$store.state.grant.haveGrant) {
        console.log(
          "上传服务端 修改待办信息",
          this.editMission.missionNo ? "modifyPendingInfo" : "modifyMission"
        );
        this.editMission.missionNo
          ? modifyPendingInfo(
              this.editMission.children[this.editIndex].id,
              this.editMission.children[this.editIndex]
            )
          : modifyMission(this.editMission.id, this.editMission);
      }
      this.$emit("freshFirstLine");
      this.dialogVisible = false;
    },
    //生成13+16位ID
    generateId() {
      return `${new Date().getTime()}${("" + Math.random()).slice(2)}`;
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
