<template>
  <el-dialog
    title="系统设置"
    :modal="false"
    :close-on-click-modal="false"
    :append-to-body="true"
    :visible.sync="dialogVisible"
    width="60%"
  >
    <div class="dialogContent">
      <div class="line" style="margin-bottom: 20px">
        归档目录：
        <el-input
          placeholder="请选择"
          readonly
          style="height: 32px; width: 180px; margin-right: 16px"
          v-model="fileDirectory"
        />
        <el-button
          style="padding: 5px 8px; color: #005bd2"
          size="mini"
          @click="btnChange"
          >浏览</el-button
        >
        <input
          type="file"
          id="file"
          hidden
          @change="fileChange"
          webkitdirectory=""
          directory=""
        />
      </div>
      <div class="line" style="margin-bottom: 20px">
        待办提醒：
        <div class="subText">
          每天自动提醒待办事项
          <el-switch
            v-model="remindDaysSwitch"
            style="margin: 0 76px 0 12px"
          />提醒时间
          <el-time-select
            v-model="remindDaysTime"
            align="center"
            style="width: 120px; margin-left: 8px"
            :picker-options="{
              start: '08:30',
              step: '00:15',
              end: '21:30',
            }"
            placeholder="选择时间"
          >
          </el-time-select>
        </div>
      </div>
      <div>
        <div class="line" style="margin-bottom: 20px">自定义待办规则：</div>
        <el-table
          :data="ruleList"
          border
          style="width: 590px; margin-left: 88px"
        >
          <el-table-column
            fixed
            prop="pendingName"
            label="待办名称"
            width="150"
          >
            <template slot-scope="scope">
              <el-input
                size="mini"
                v-if="scope.row.isOK"
                v-model="scope.row.pendingName"
                style="width: 100%; height: 100%"
              ></el-input>
              <span size="mini" v-else>{{ scope.row.pendingName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="rule" label="生成规则" width="320">
            <template slot-scope="scope">
              <div v-if="scope.row.isOK" class="ruleInfo">
                <el-select
                  v-model="status"
                  style="width: 120px"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in statusList"
                    :key="item.value"
                    :value="item.value"
                  />
                </el-select>
                <el-select v-model="isBefore" style="width: 65px">
                  <el-option label="前" :value="true" />
                  <el-option label="后" :value="false" />
                </el-select>
                <el-input-number
                  v-model="days"
                  style="width: 90px"
                  controls-position="right"
                  :max="30"
                  :min="0"
                />天
              </div>
              <span size="mini" v-else>{{ scope.row.rule }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="pendingEditclick(scope.row, scope.$index)"
                >{{ scope.row.isOK ? "保存" : "编辑" }}</el-button
              >
              <el-button
                type="text"
                size="small"
                @click.native.prevent="pendingDeleteRow(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button
          style="padding: 9px 16px; color: #005bd2; margin: 16px 0 32px 334px"
          size="small"
          @click="increaseRule"
          >新增</el-button
        >
      </div>
      <div>
        <div class="line" style="margin-bottom: 20px">待办授权：</div>
        <el-table
          :data="grantList"
          border
          style="width: 421px; margin-left: 88px"
        >
          <el-table-column fixed prop="grant" label="授权对象" width="150">
            <template slot-scope="scope">
              <el-input
                size="mini"
                placeholder="请输入邮箱前缀"
                v-if="scope.row.isOK"
                v-model="scope.row.grant"
                style="width: 100%; height: 100%"
              ></el-input>
              <span size="mini" v-else>{{ scope.row.grant }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="permission" label="授予权限" width="150">
            <template slot-scope="scope">
              <div v-if="scope.row.isOK" class="ruleInfo">
                <el-select
                  v-model="scope.row.permission"
                  style="width: 120px"
                  placeholder="请选择"
                >
                  <el-option
                    v-for="item in permissionList"
                    :key="item.value"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <span size="mini" v-else>{{ scope.row.permission }}</span>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="grantEditclick(scope.row, scope.$index)"
                >{{ scope.row.isOK ? "保存" : "编辑" }}</el-button
              >
              <el-button
                type="text"
                size="small"
                @click.native.prevent="grantDeleteRow(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column>
        </el-table>
        <el-button
          style="padding: 9px 16px; color: #005bd2; margin: 16px 0 32px 334px"
          size="small"
          @click="increaseGrantList"
          >新增</el-button
        >
      </div>
      <div v-if="grantedList.length > 0">
        <div class="line" style="margin-bottom: 20px">我的授权列表:</div>
        <el-table
          :data="grantedList"
          border
          style="width: 421px; margin-left: 88px"
        >
          <el-table-column fixed prop="grant" label="授权对象" width="210">
            <template slot-scope="scope">
              <span size="mini">{{ scope.row.investorName }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="permission" label="获得权限" width="210">
            <template slot-scope="scope">
              <span size="mini">{{ scope.row.permission }}</span>
            </template>
          </el-table-column>
          <!-- <el-table-column label="操作" width="120">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click.native.prevent="grantedDeleteRow(scope.$index)"
                >删除</el-button
              >
            </template>
          </el-table-column> -->
        </el-table>
      </div>
    </div>
    <span slot="footer" class="dialog-footer">
      <el-button @click="hide">取 消</el-button>
      <el-button type="primary" @click="saveSettings">保 存</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { ipcRenderer } from "electron";
import fileTool from "@/utils/fileTool.js";
import { initData } from "@/utils/init.js";
export default {
  name: "Settings",
  data() {
    return {
      settings: {},
      doc_dir: "",
      dialogVisible: false,
      fileDirectory: "",
      grantList: [],
      permission: "readonly",
      permissionList: [
        {
          value: "只读",
        },
        {
          value: "新增",
        },
      ],
      remindDaysSwitch: true,
      remindDaysTime: "",
      status: "",
      statusList: [
        {
          value: "任务启动",
        },
        {
          value: "提交内测",
        },
        {
          value: "提交业测",
        },
        {
          value: "投产",
        },
      ],
      isBefore: true,
      days: 3,
      ruleList: [
        {
          pendingName: "提交代码审核",
          rule: "提交内测前3天",
          compareTo: "提交内测",
          beforeDays: 3,
          missionType: "全部",
        },
        {
          pendingName: "上传说明书、需规",
          rule: "提交内测前0天",
          compareTo: "提交内测",
          beforeDays: 0,
          missionType: "全部",
        },
      ],
      grantedList: [],
    };
  },
  created() {
    this.init();
  },
  methods: {
    async init() {
      const data = fileTool.readSettingFile();
      this.settings = data;
      this.doc_dir = data.settings.fileDirectory;
      (this.fileDirectory = data.settings.fileDirectory),
        (this.ruleList = data.settings.ruleList),
        (this.grantList = data.settings.grantList),
        (this.remindDaysSwitch = data.settings.remindDaysSwitch),
        (this.remindDaysTime = data.settings.remindDaysTime);
      //从数据库获取授予了权限的人名单 queryGrantedUserList
      // this.grantedList = await queryGrantedUserList(this.$store.state.user.userNo);
      this.grantedList = [
        {
          granted: "liyw11",
          permission: "只读",
          investorNo: "12066390",
          investorName: "李亚威",
        },
        {
          granted: "wenty",
          permission: "新增",
          investorNo: "12066391",
          investorName: "文天阳",
        },
        {
          granted: "wenty",
          permission: "新增",
          investorNo: "12066392",
          investorName: "王双",
        },
      ];
    },
    show() {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    saveSettings() {
      if (this.ruleList[this.ruleList.length - 1].isOK) {
        this.$message({
          message: "请先输入待办规则信息",
          type: "warning",
          offset: 280,
        });
        return;
      }
      this.dialogVisible = false;
      this.settings.settings = {
        fileDirectory: this.fileDirectory,
        ruleList: this.ruleList,
        grantList: this.grantList,
        remindDaysSwitch: this.remindDaysSwitch,
        remindDaysTime: this.remindDaysTime,
      };
      fileTool.writeSettingFile(this.settings); //本地保存配置文件
      if (this.doc_dir != this.fileDirectory) {
        initData();
        location.reload();
      }
      //todo 授权列表grantList 存入数据库中
      //入参 本人用户名 this.$store.state.user.name,授予权限人列表grantList[grant:授予对象,permission:授予权限(只读/新增)]
      //编号 12066390 姓名 李亚威
    },
    fileChange(e) {
      try {
        const fu = document.getElementById("file");
        if (fu == null) return;
        this.fileDirectory = fu.files[0].path;
      } catch (error) {
        console.debug("choice file err:", error);
      }
    },
    btnChange() {
      ipcRenderer.send("openDirectory");
      ipcRenderer.on("selectedItem", this.getPath);
    },
    getPath(e, path) {
      if (path == null) {
        alert("请选择一个文件/文件夹");
      } else {
        this.fileDirectory = path;
      }
    },
    increaseRule() {
      if (this.ruleList[this.ruleList.length - 1].isOK) {
        this.$message({
          message: "请先输入待办规则信息",
          type: "warning",
          offset: 280,
        });
      } else {
        this.ruleList.push({});
        this.$set(this.ruleList[this.ruleList.length - 1], "isOK", true);
      }
    },
    pendingDeleteRow(index) {
      this.ruleList.splice(index, 1);
    },
    pendingEditclick(row, index) {
      if (row.isOK) {
        if (!this.ruleList[index].pendingName) {
          this.$message({
            message: "请先输入待办名称",
            type: "warning",
            offset: 280,
          });
          return;
        } else if (!this.status) {
          this.$message({
            message: "请先选择待办状态",
            type: "warning",
            offset: 280,
          });
          return;
        } else {
          this.ruleList[index].compareTo = this.status;
          this.ruleList[index].beforeDays =
            (this.isBefore ? -1 : 1) * this.days;
          this.ruleList[index].rule = `${this.status}${
            this.isBefore ? "前" : "后"
          }${this.days}天`;
          this.$set(row, "isOK", false);
        }
      } else {
        this.$set(row, "isOK", true);
      }
    },
    increaseGrantList() {
      if (
        this.grantList.length > 0 &&
        this.grantList[this.grantList.length - 1].isOK
      ) {
        this.$message({
          message: "请先输入授权对象",
          type: "warning",
          offset: 280,
        });
      } else {
        this.grantList.push({ permission: "只读" });
        this.$set(this.grantList[this.grantList.length - 1], "isOK", true);
      }
    },
    grantDeleteRow(index) {
      this.grantList.splice(index, 1);
    },
    grantEditclick(row, index) {
      if (row.isOK) {
        if (!this.grantList[index].grant) {
          this.$message({
            message: "请先输入授权对象",
            type: "warning",
            offset: 280,
          });
          return;
        } else {
          this.$set(row, "isOK", false);
        }
      } else {
        this.$set(row, "isOK", true);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogContent {
  height: 458px;
  padding: 24px 0 32px 24px;
  overflow: scroll;
  background-color: #f3f9ff;
}

.line {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Medium;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 600;
  height: 32px;
}

.subText {
  display: flex;
  align-items: center;
  height: 32px;
  font-family: PingFangSC-Regular;
  font-weight: 500;
}

.ruleInfo {
  display: flex;
  align-items: center;
}

::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-dialog__body {
  padding: 20px 24px;
}

::v-deep .el-table th.el-table__cell {
  background: #749ee5;
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

::v-deep .el-table thead {
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #ffffff;
  line-height: 22px;
  font-weight: 500;
}

::v-deep .el-input__suffix {
  display: flex;
  align-items: center;
}

::v-deep .el-input__icon {
  line-height: 32px;
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
</style>
