<template>
<div class="titleBox">
  <div class="flex">
    <div class="blueBlock" />
    <div class="tool-title">{{toolName}}</div>
    <el-popover v-if="toolNotice" placement="right-start" width="260" trigger="hover" :content="toolNotice">
      <i slot="reference" class="el-icon-warning-outline" style="margin:4px 0 0 8px" />
    </el-popover>
  </div>
  <div class="button" @click="goBack">返回</div>
</div>
</template>

<script>
export default {
  name: "ToolTitle",
  props: {
    toolName: {
      type: String,
      default: "",
    },
    toolNotice: {
      type: String,
      default: "",
    }
  },
  methods: {
    goBack() {
      this.$router.go(-1);
    }
  }
};
</script>

<style lang="scss" scoped>
.titleBox {
  cursor: pointer;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.flex {
  display: flex;
  align-items: center;
  justify-content: center;
}

.blueBlock {
  line-height: 32px;
  height: 20px;
  width: 4px;
  background: #5380DC;
  border-radius: 2px 0 0 2px;
}

.tool-title {
  line-height: 32px;
  margin-left: 8px;
  font-family: PingFangSC-Medium;
  font-size: 24px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  // font-weight: 500;
  font-weight: bold;
}

.button {
  font-family: PingFangSC-Regular;
  font-size: 14px;
  padding: 5px 16px;
  color: #005BD2;
  line-height: 22px;
  font-weight: 400;
  border: 1px solid #005BD2;
  border-radius: 2px;
}
</style>
