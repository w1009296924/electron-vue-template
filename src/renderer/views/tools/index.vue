<template>
  <div class="app-container">
    <div class="tools-container">
      <Card
        v-for="(item, index) of toolsArray"
        :key="index"
        :name="item.name"
        :iconPath="item.iconPath"
        :url="item.url"
      />
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import Card from "./components/card";
export default {
  name: "tools",
  components: {
    Card,
  },
  data() {
    return {
      toolsArray: [
        {
          name: "健康提醒",
          iconPath: require("@/assets/healthRemind.png"),
          url: "healthRemind",
        },
        {
          name: "图片粘贴",
          iconPath: require("@/assets/copyImg.png"),
          url: "copyImg",
        },
        {
          name: "工作量统计",
          iconPath: require("@/assets/countWorkTime.png"),
          url: "countWorkTime",
        },
        {
          name: "文字提取",
          iconPath: require("@/assets/textExtraction.png"),
          url: "textExtraction",
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["name", "roles"]),
  },
};
</script>

<style lang="scss" scoped>
.tools-container {
  display: flex;
  height: 875px;
  padding: 40px;
  border: 2px;
  background-color: #ffffff;
}
</style>
