<template>
  <div>
    <!-- <transition-group class="mission-box" name="todo-trans" tag="div">
      <div v-for="item of missionArray" :key="item.id">
        <PendingList :todo="item" /></div
    ></transition-group> -->
    <button @click="clicsss">ss</button>
    {{ missionArray }}
  </div>
</template>

<script>
import PendingList from "@/components/PendingList";
import { mapGetters } from "vuex";
export default {
  components: {
    PendingList,
  },
  computed: {
    ...mapGetters(["missionArray"]),
  },
  activated() {
    // this.missionArray = this.$store.state.missionArray;
    console.log(this.missionArray);
  },
  methods: {
    clicsss() {
      console.log(this.missionArray);
    },
  },
};
</script>

<style lang="scss" scoped>
.mission-box {
  padding: 0 14px 2px 14px;
  margin-top: 10px;
  height: calc(100% - 76px);
  overflow-y: overlay;
}
.todo-trans-move {
  transition: transform 0.4s ease;
}
</style>
