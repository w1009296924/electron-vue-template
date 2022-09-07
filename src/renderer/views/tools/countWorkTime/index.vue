<template>
    <div class="tools-container">
      <ToolTitle toolName="工作量统计" toolNotice="aaaaaaasddddddddddddddddddddaaaaa" />
      <div class="set-timeRage">
        时间范围
        <el-date-picker
          v-model="value2"
          type="daterange"
          style="margin:0 32px 0 16px"
          :picker-options="pickerOptions"
          range-separator="-"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <div class="button-query" @click="query">查询</div>
      </div>
      <div class="showMessage">
        <div class="test">aaa</div>
      </div>
    </div>
  </template>
  
  <script>
  import { mapGetters } from "vuex";
  import ToolTitle from "../components/toolTitle"
  export default {
    name: "countWorkTime",
    components: { ToolTitle },
    data() {
      return {
      };
    },
    computed: {
      ...mapGetters(["name", "roles"]),
    },
    methods: {
      //todo
      query() {
        console.log('query');
      }
    }
  };
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.tools-container {
  margin: 28px;
  padding: 24px;
  border: 2px;
  background-color: #ffffff;
}
.set-timeRage {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #F3F9FF;
  border-radius: 4px;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: rgba(0,0,0,0.65);
  letter-spacing: 0;
  font-weight: 400;
  margin: 16px 0;
  padding: 32px 24px;
}
.button-query {
  display: inline-block;
  cursor:pointer;
  height: 32px;
  width: 60px;
  padding: 5px 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #FFFFFF;
  line-height: 22px;
  font-weight: 400;
  background: #005BD2;
  border-radius: 2px;
}
.showMessage {
  width: 100%;
  height: 600px;
  background: #F3F9FF;
  border-radius: 4px;
  padding: 32px 24px;
  overflow-y: scroll;
}
.test {
  height: 800px;
}
</style>
  