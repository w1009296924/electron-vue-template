<template>
<div class="tools-container">
    <ToolTitle toolName="图片粘贴" />
    <div class="set-copyImgSwitch">
        <div class="tabLine">
            图片粘贴
            <el-switch v-model="copyImgSwitch" style="margin-left:16px" />
            <el-popover
              placement="right-start"
              width="560"
              trigger="hover"
              content="开启本功能后，从新call浦或直接复制图片至word文档中可直接设定为目标大小哦～">
              <i slot="reference" class="el-icon-warning-outline" style="margin-left:8px" />
            </el-popover>
        </div>
        <div class="tabLine">
            等比缩放
            <el-switch v-model="equalRatioSwitch" style="margin-left:16px" />
            <el-popover
              placement="right-start"
              width="260"
              trigger="hover"
              content="开启后，仅需填写高度或宽度一项">
              <i slot="reference" class="el-icon-warning-outline" style="margin-left:8px" />
            </el-popover>
        </div>
        <div class="tabLine">
            目标高度
            <el-input-number 
              v-model="aimHeight" 
              controls-position="right" 
              style="width:90px;margin-left:16px"
              :max="30"
              :min="1"
              @change="handleChange" 
            />
            <span class="append-text">厘米</span>
        </div>
        <div class="tabLine">
            目标宽度
            <el-input-number 
              v-model="aimWidth" 
              controls-position="right" 
              style="width:90px;margin-left:16px"
              :max="30"
              :min="1"
              @change="handleChange" 
            />
            <span class="append-text">厘米</span>
        </div>
    </div>
</div>
</template>

<script>
import {
    mapGetters
} from "vuex";
import ToolTitle from "../components/toolTitle"
export default {
    name: "copyImg",
    components: {
        ToolTitle
    },
    data() {
        return {
          copyImgSwitch: false,
          equalRatioSwitch: true,
          aimHeight: 10,
          aimWidth: 10,
        };
    },
    computed: {
        ...mapGetters(["name", "roles"]),
    },
};
</script>

<style lang="scss" scoped>
.tools-container {
    margin: 28px;
    padding: 24px;
    border: 2px;
    background-color: #ffffff;
}

.set-copyImgSwitch {
    width: 100%;
    height: 244px;
    background: #f3f9ff;
    border-radius: 4px;
    margin-top: 16px;
    padding: 32px 24px;
}
.tabLine {
  display: flex;
  align-items: center;
  margin: 10px 0;
  line-height: 32px;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: rgba(0,0,0,0.65);
  letter-spacing: 0;
  font-weight: 400;
}
.inputSize {
  height:32px;
  width:60px;
  margin-left:16px;
}
.append-text {
  margin-left: 8px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0,0,0,0.45);
  letter-spacing: 0;
  font-weight: 400;
}
</style>
