<template>
  <div class="todo-card">
    <Tinymce :height="350" :width="254" :toolbar="toolbar" />
  </div>
</template>
<script>
import Tinymce from "@/components/Tinymce";
export default {
  name: "note",
  components: { Tinymce },
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
    return {
      toolbar:
        "forecolor backcolor bold italic underline | fontname fontsize bullist numlist strikethrough | insertdatetime emoticons hr charmap removeformat",
    };
  },
  methods: {},
};
</script>

<style lang="scss" scoped></style>
