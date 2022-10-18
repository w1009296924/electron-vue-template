<template>
  <el-dialog
    :title="editFlag ? '修改快速入口' : '添加快速入口'"
    :close-on-click-modal="true"
    :visible.sync="dialogVisible"
    width="40%"
    top="40vh"
  >
    <el-input
      placeholder="请输入入口名称"
      v-model="entryName"
      style="width: 60%; margin-bottom: 20px; margin-left: 20%"
    >
      <template slot="prepend">入口名称</template>
    </el-input>

    <div class="entry-content-box">
      <el-select v-model="entryMode" placeholder="请选择">
        <el-option label="网址" value="web:"></el-option>
        <el-option label="文件或目录" value="app:"></el-option>
      </el-select>
      <el-input
        :placeholder="`请输入${
          entryMode == 'web:' ? '网址' : '文件或目录路径'
        }`"
        v-model="entryPath"
        class="input-with-select"
      >
        <el-select
          v-model="urlPre"
          slot="prepend"
          v-if="entryMode == 'web:'"
          placeholder="请选择"
        >
          <el-option label="http://" value="http://"></el-option>
          <el-option label="https://" value="https://"></el-option>
        </el-select>
        <el-button
          slot="append"
          :icon="editFlag ? 'el-icon-check' : 'el-icon-plus'"
          @click="addQuickEntry"
        ></el-button>
      </el-input>
    </div>
  </el-dialog>
</template>

<script>
import { writeSettingFile } from "@/utils/fileTool.js";
export default {
  name: "AddEntryDialog",
  props: {
    entryArray: { type: Array },
  },
  watch: {
    activeFirstPage: {
      handler: function () {
        this.investor = this.activeFirstPage
          ? this.investorList[0].investorNo
          : this.investorList.length > 1
          ? this.investorList[1].investorNo
          : "";
      },
    },
  },
  data() {
    return {
      dialogVisible: false,
      editFlag: false,
      entryName: "",
      entryMode: "web:",
      urlPre: "http://",
      entryPath: "",
      oldName: "",
    };
  },
  methods: {
    show(entry = null) {
      if (entry) {
        this.editFlag = true;
        this.oldName = entry.name;
        this.entryName = entry.name;
        this.entryMode = entry.url.substring(0, 4);
        if (this.entryMode == "web:") {
          const splitIndex = entry.url.substring(4).indexOf(":");
          if (splitIndex > 0) {
            this.urlPre = entry.url.substring(4).substring(0, splitIndex + 3);
            this.entryPath = entry.url.substring(4).substring(splitIndex + 3);
          } else {
            this.urlPre = "http://";
            this.entryPath = entry.url.substring(4);
          }
        }
      } else {
        this.editFlag = false;
        this.oldName = "";
        this.entryName = "";
        this.entryMode = "web:";
        this.entryPath = "";
      }
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    addQuickEntry() {
      if (!this.checkArgs()) return;
      if (this.editFlag) {
        let element = this.entryArray.find((item) => {
          return item.name == this.oldName;
        });
        element.name = this.entryName;
        element.url =
          this.entryMode +
          (this.entryMode == "web:" ? this.urlPre : "") +
          this.entryPath;
      } else {
        this.entryArray.push({
          name: this.entryName,
          iconPath:
            this.entryMode == "web:"
              ? require("@/assets/entry_Web.png")
              : require("@/assets/entry_归档.png"),
          url:
            this.entryMode +
            (this.entryMode == "web:" ? this.urlPre : "") +
            this.entryPath,
        });
      }
      writeSettingFile({ quickEntryArray: this.entryArray }, "quickEntry.ini");
      this.dialogVisible = false;
    },
    checkArgs() {
      if (this.entryName == "") {
        this.$message.error("入口名称不能为空，请重新输入！");
        return false;
      } else if (this.entryName == this.oldName) {
        return true;
      }
      for (let index = 0; index < this.entryArray.length; index++) {
        const element = this.entryArray[index];
        if (element.name == this.entryName) {
          this.$message.error("该入口名称已存在，请重新输入！");
          return false;
        }
      }

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep.el-select .el-input {
  width: 120px;
}
::v-deep.el-input-group__prepend .el-select .el-input {
  width: 90px;
}
::v-deep.input-with-select .el-input-group__prepend {
  background-color: #fff;
}

.entry-content-box {
  display: flex;
}
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
