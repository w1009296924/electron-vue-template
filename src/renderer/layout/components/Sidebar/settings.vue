<template>
<el-dialog title="系统设置" :modal="false" :close-on-click-modal="false" :visible.sync="dialogVisible" width="80%">
  <div class="dialogContent">
    <div class="line" style="margin-bottom:20px">归档目录：
      <el-input placeholder="请选择" readonly style="height:32px;width:180px;margin-right:16px;" v-model="fileDirectory" />
      <el-button style="padding:5px 8px;color:#005BD2" size="mini" @click="btnChange">浏览</el-button>
      <input type="file" id="file" hidden @change="fileChange" webkitdirectory="" directory="">
    </div>
    <div class="line" style="margin-bottom:20px">自定义待办规则：</div>
    <div class="line" style="margin-bottom:20px">待办授权：<div class="subText">对用户
        <el-input placeholder="请输入" style="height:32px;width:100px;margin:0 8px;" v-model="pengdingUser" />授予
        <el-select v-model="auth" style="width:80px;margin:0 8px;" placeholder="请选择">
          <el-option v-for="item in authList" :key="item.value" :label="item.label" :value="item.value" />
        </el-select>权限。</div>
    </div>
    <div class="line" style="margin-bottom:20px">待办提醒：<div class="subText">每天自动提醒待办事项
      <el-switch v-model="remindDaysSwitch" style="margin:0 76px 0 12px" />提醒时间
      <el-time-select
        v-model="remindDaysTime"
        style="width:120px;margin-left:8px"
        :picker-options="{
          start: '08:30',
          step: '00:15',
          end: '21:30'
        }"
        placeholder="选择时间">
      </el-time-select></div>
    </div>
  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="hide">取 消</el-button>
    <el-button type="primary" @click="saveSettings">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
import {
  ipcRenderer
} from 'electron';
export default {
  name: "Settings",
  data() {
    return {
      dialogVisible: false,
      fileDirectory: 'D:\\',
      pengdingUser:'',
      auth:'readonly',
      authList:[{label:'只读',value:'readonly'},{label:'新增',value:'insert'}],
      remindDaysSwitch:true,
      remindDaysTime:''
    }
  },
  methods: {
    show() {
      this.dialogVisible = true;
    },
    hide() {
      this.dialogVisible = false;
    },
    saveSettings() {
      this.dialogVisible = false;
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
    getPath(e,path) {
      if (path == null) {
        alert('请选择一个文件/文件夹');
      } else {
        this.fileDirectory = path;
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.dialogContent {
  height: 458px;
  padding: 24px 0 32px 24px;
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

::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-dialog__body {
  padding: 20px 24px;
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
::v-deep .el-input__suffix{
  display: flex;
  align-items: center;
}
::v-deep .el-input__icon {
  line-height: 32px;
}

::v-deep .el-dialog__footer {
  border-top: 1px solid #E4E7ED;
}
</style>
