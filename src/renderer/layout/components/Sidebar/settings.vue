<template>
<el-dialog title="系统设置" :modal="false" :close-on-click-modal="false" :visible.sync="dialogVisible" width="70%">
  <div class="dialogContent">

  </div>
  <span slot="footer" class="dialog-footer">
    <el-button @click="hide">取 消</el-button>
    <el-button type="primary" @click="saveSettings">确 定</el-button>
  </span>
</el-dialog>
</template>

<script>
export default {
  name: "Settings",
  data() {
    return {
      dialogVisible: false,
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
    }
  },
};
</script>

<style lang="scss" scoped>
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
::v-deep .el-dialog__footer{
  border-top: 1px solid #E4E7ED;
}
</style>
