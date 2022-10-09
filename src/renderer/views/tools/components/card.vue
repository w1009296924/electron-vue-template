<template>
<div class="tool-box" @click="clickTool">
  <img draggable="false" class="tool-icon" :src="iconPath" />
  <div class="tool-name">{{ name }}</div>
</div>
</template>

<script>
export default {
  name: "Card",
  props: {
    name: {
      type: String,
      default: "",
    },
    iconPath: {
      type: String,
      default: "",
    },
    url: {
      type: String,
      default: "",
    },
  },
  methods: {
    clickTool() {
      this.$router.push({
        name: this.url
      });
    },
  },
};
</script>

<style lang="scss" scoped>
.tool-box {
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  cursor: pointer;
  width: 140px;
  height: 140px;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  padding: 10px;
  align-items: center;
  margin-right: 31px;

  .tool-icon {
    width: 100px;
    height: 100px;
  }

  .tool-name {
    font-family: PingFangSC-Regular;
    font-size: 20px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 400;
  }
}

.tool-box:hover {
  background-color: #ecf5ff;
}
</style>
