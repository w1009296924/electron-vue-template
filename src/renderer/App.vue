<template>
  <div id="app">
    <c-header></c-header>
    <transition name="fade" mode="out-in">
      <router-view></router-view>
    </transition>
  </div>
</template>

<script>
import CHeader from './components/title';
import '@/assets/font.css';
export default {
  components: { CHeader },
  mounted() {
    this.$store.commit('INIT_MISSIONARRAY');
  },
};
</script>

<style>
/* CSS */
* {
  /* font-family: PingFangSC-Regular;
  font-weight: 400; */
}

body .el-tooltip__popper.is-dark {
  display: none;
}
</style>
