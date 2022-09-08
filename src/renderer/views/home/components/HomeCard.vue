<template>
  <div class="todo-card" :style="`width:${width}px;height:${height}px;`">
    <div class="title">
      <div class="title-line"></div>
      <div class="title-text">{{ title }}</div>
    </div>
    <slot></slot>
  </div>
</template>
<script>
export default {
  name: "home-card",
  components: {},
  props: {
    width: {
      type: String,
      default: "728",
    },
    height: {
      type: String,
      default: "420",
    },
    title: {
      type: String,
      default: "",
    },
  },
  data() {
    return {};
  },
  methods: {},
};
</script>

<style lang="scss" scoped>
.todo-card {
  background: #f3f9ff;
  border-radius: 8px;
}
.title {
  margin-top: 16px;
  margin-left: 24px;
  display: flex;
  gap: 8px;
  align-items: center;
  .title-line {
    height: 20px;
    width: 4px;
    background: #5380dc;
    border-radius: 2px 0 0 2px;
  }
  .title-text {
    font-family: PingFangSC-Medium;
    font-size: 24px;
    color: rgba(0, 0, 0, 0.65);
    letter-spacing: 0;
    font-weight: 500;
    line-height: 32px;
  }
}
</style>
