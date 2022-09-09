<template>
  <div class="note-card">
    <Tinymce
      :height="350"
      :width="254"
      :toolbar="toolbar"
      v-model="currentValue"
    />
    <div
      class="delete-note"
      :class="{ enable: enabled }"
      @mousedown="enabled = true"
      @mouseup="enabled = false"
      @mouseleave="enabled = false"
      @click="deleteNote"
    >
      <!-- <img :src="require('@/assets/delete.png')" alt="" /> -->
      <svg-icon icon-class="delete"></svg-icon>
    </div>
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
export default {
  name: "note",
  components: { Tinymce },
  props: {
    value: {
      type: String,
      default: "",
    },
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
    return {
      enabled: false,
      currentValue: this.value,
      toolbar:
        "forecolor backcolor bold italic underline | fontname fontsize bullist numlist strikethrough | insertdatetime emoticons hr charmap removeformat",
    };
  },
  watch: {
    currentValue(val) {
      this.$emit("input", val);
    },
  },
  methods: {
    deleteNote() {
      this.$emit("deleteNote", 1);
    },
  },
};
</script>

<style lang="scss" scoped>
.note-card {
  position: relative;
}
.delete-note {
  height: 30px;
  width: 34px;
  position: absolute;
  bottom: 12px;
  left: 209px;
  z-index: 1005;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 3px;
  // user-select: none;
  .svg-icon {
    width: 20px;
    height: 22.5px;
  }
  &:hover {
    background-color: #cce2fa;
  }
  &.enable:hover {
    background-color: #a6ccf7;
  }
}
</style>
