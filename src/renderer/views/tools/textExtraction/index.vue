<template>
  <div class="app-container">
    <div class="tools-container">
      <ToolTitle toolName="文字提取" />
      <div></div>
    </div>
  </div>
</template>

<script>
import ToolTitle from "../components/toolTitle";
export default {
  name: "textExtraction",
  components: {
    ToolTitle,
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {},
};
</script>

<style lang="scss" scoped>
.tools-container {
  height: 875px;
  padding: 24px;
  border: 2px;
  background-color: #ffffff;
}
</style>
