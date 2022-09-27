<template>
<el-dialog title="系统设置" :modal="false" :close-on-click-modal="false" :append-to-body="true" :visible.sync="dialogVisible" width="60%">
  <div class="dialogContent">
    <div class="line" style="margin-bottom:20px">归档目录：
      <el-input placeholder="请选择" readonly style="height:32px;width:180px;margin-right:16px;" v-model="fileDirectory" />
      <el-button style="padding:5px 8px;color:#005BD2" size="mini" @click="btnChange">浏览</el-button>
      <input type="file" id="file" hidden @change="fileChange" webkitdirectory="" directory="">
    </div>
    <div>
      <div class="line" style="margin-bottom:20px">自定义待办规则：</div>
      <el-table :data="ruleList" border style="width:590px;margin-left: 88px;">
        <el-table-column fixed prop="pendingName" label="待办名称" width="150">
          <template slot-scope="scope">
            <el-input size="mini" v-if="scope.row.isOK" v-model="scope.row.pendingName" style="width:100%;height:100%"></el-input>
            <span size="mini" v-else>{{scope.row.pendingName}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="rule" label="生成规则" width="320">
          <template slot-scope="scope">
            <div v-if="scope.row.isOK" class="ruleInfo">
              <el-select v-model="status" style="width:120px;" placeholder="请选择">
                <el-option v-for="item in statusList" :key="item.value" :value="item.value" />
              </el-select>
              <el-select v-model="isBefore" style="width:65px;">
                <el-option label="前" :value="true" />
                <el-option label="后" :value="false" />
              </el-select>
              <el-input-number v-model="days" style="width:90px;" controls-position="right" :max="30" :min="0" />天
            </div>
            <span size="mini" v-else>{{scope.row.rule}}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="text" size="small" @click="editclick(scope.row,scope.$index)">{{scope.row.isOK?'保存':'编辑'}}</el-button>
            <el-button type="text" size="small" @click.native.prevent="deleteRow(scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <el-button style="padding:9px 16px;color:#005BD2;margin:16px 0 32px 334px;" size="small" @click="increaseRule">新增</el-button>
    </div>
    <div class="line" style="margin-bottom:20px">待办授权：<div class="subText">对用户
        <el-input placeholder="请输入" style="height:32px;width:100px;margin:0 8px;" v-model="pengdingUser" />授予
        <el-select v-model="auth" style="width:80px;margin:0 8px;" placeholder="请选择">
          <el-option v-for="item in authList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>权限。</div>
    </div>
    <div class="line" style="margin-bottom:20px">待办提醒：<div class="subText">每天自动提醒待办事项
        <el-switch v-model="remindDaysSwitch" style="margin:0 76px 0 12px" />提醒时间
        <el-time-select v-model="remindDaysTime" align="center" style="width:120px;margin-left:8px" :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '21:30'
        }" placeholder="选择时间">
        </el-time-select>
      </div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="hide">取 消</el-button>
    <el-button type="primary" @click="saveSettings">保 存</el-button>
  </span>
</el-dialog>
</template>

<script>
import {
  ipcRenderer
} from 'electron';
import fs from 'fs';
import { path, savePath, defaultVal } from '@/utils/constans.js'
import fileTool from "@/utils/fileTool.js";
import { init } from 'events';
export default {
  name: "Settings",
  data() {
    return {
      settings: {},
      dialogVisible: false,
      fileDirectory: savePath,
      pengdingUser: '',
      auth: 'readonly',
      authList: [{
        label: '只读',
        value: 'readonly'
      }, {
        label: '新增',
        value: 'insert'
      }],
      remindDaysSwitch: true,
      remindDaysTime: '',
      status: '',
      statusList: [{
        value: '任务启动'
      }, {
        value: '提交内测'
      }, {
        value: '提交业测'
      }, {
        value: '投产'
      }],
      isBefore: true,
      days: 3,
      ruleList: [{
        pendingName: '提交代码审核',
        rule: '提内测前3天'
      }, {
        pendingName: '上传说明书、需规',
        rule: '提内测前0天'
      }]
    }
  },
  created() {
    //判断有无文件夹,没有则创建文件夹
    fs.stat(path, (error) => {
      if (error) {
        fs.mkdir(path,function(){});
      }
    });
    //判断有无归档目录
    fs.stat(savePath, (error) => {
      if (error) {
        //创建默认归档目录
        fs.mkdir(savePath,function(){});
      }
    });
    //判断有无配置文件,没有则创建配置文件
    fs.stat(`${path}\\settings.ini`, (error) => {
      if (error) {
        fileTool.writeSettingFile(defaultVal);
      }
    });
    setTimeout(()=>{//生成配置文件为异步方法,会先执行init导致报错
      this.init();
    },1000);
  },
  methods: {
    init() {
      const data = fileTool.readSettingFile();
      this.settings = data;
      this.fileDirectory = data.settings.fileDirectory,
      this.ruleList = data.settings.ruleList,
      this.pengdingUser = data.settings.pengdingUser,
      this.auth = data.settings.auth,
      this.remindDaysSwitch = data.settings.remindDaysSwitch,
      this.remindDaysTime = data.settings.remindDaysTime
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
          message: '请先输入待办规则信息',
          type: 'warning',
          offset: 280
        });
        return;
      }
      this.dialogVisible = false;
      this.settings.settings = {
        fileDirectory: this.fileDirectory,
        ruleList: this.ruleList,
        pengdingUser: this.pengdingUser,
        auth: this.auth,
        remindDaysSwitch: this.remindDaysSwitch,
        remindDaysTime: this.remindDaysTime
      };
      fileTool.writeSettingFile(this.settings);
    },
    fileChange(e) {
      try {
        const fu = document.getElementById('file');
        if (fu == null) return
        this.fileDirectory = fu.files[0].path;
      } catch (error) {
        console.debug('choice file err:', error)
      }
    },
    btnChange() {
      ipcRenderer.send('openDirectory');
      ipcRenderer.on('selectedItem', this.getPath);
    },
    getPath(e, path) {
      if (path == null) {
        alert('请选择一个文件/文件夹');
      } else {
        this.fileDirectory = path;
      }
    },
    increaseRule() {
      if (this.ruleList[this.ruleList.length - 1].isOK) {
        this.$message({
          message: '请先输入待办规则信息',
          type: 'warning',
          offset: 280
        });
      } else {
        this.ruleList.push({});
        this.$set(this.ruleList[this.ruleList.length - 1], 'isOK', true);
      }
    },
    deleteRow(index) {
      this.ruleList.splice(index, 1);
    },
    editclick(row, index) {
      if (row.isOK) {
        if (!this.ruleList[index].pendingName) {
          this.$message({
            message: '请先输入待办名称',
            type: 'warning',
            offset: 280
          });
          return;
        } else if (!this.status) {
          this.$message({
            message: '请先选择待办状态',
            type: 'warning',
            offset: 280
          });
          return;
        } else {
          this.ruleList[index].rule = `${this.status}${this.isBefore?'前':'后'}${this.days}天`;
          this.$set(row, 'isOK', false);
        }
      } else {
        this.$set(row, 'isOK', true);
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
  background-color: #F3F9FF;
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
  background: #749EE5;
}

::v-deep .el-dialog__header {
  border-bottom: 1px solid #E4E7ED;
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
  color: #FFFFFF;
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
  border-top: 1px solid #E4E7ED;
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
