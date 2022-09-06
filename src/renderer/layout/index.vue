<template>
  <div class="app-wrapper" :class="IsUseSysTitle?'UseSysTitle':'NoUseSysTitle'">
    <div :class="classObj">
      <navbar></navbar>
      <div class="hide-shadow"></div>
      <div class="container-set">
        <sidebar class="sidebar-container" :class="IsUseSysTitle?'UseSysTitle':'NoUseSysTitle'"></sidebar>
          <div class="main-container">
            <app-main></app-main>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import { Sidebar, AppMain, Navbar } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";

export default {
  name: "layout",
  components: {
    Sidebar,
    AppMain,
    Navbar
  },
  mixins: [ResizeMixin],
  data: () => ({
    IsUseSysTitle: require("./../../../config").IsUseSysTitle
  }),
  computed: {
    sidebar() {
      return this.$store.state.app.sidebar;
    },
    device() {
      return this.$store.state.app.device;
    },
    classObj() {
      return {
        hideSidebar: !this.sidebar.opened,
        openSidebar: this.sidebar.opened
      };
    }
  }
};
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
@import "@/styles/mixin.scss";
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
  .container-set {
    position: relative;
    padding-top: 48px;
  }
}
.UseSysTitle{
  top:0px;
}
.NoUseSysTitle{
  top:38px
}
.shadow-container{
  margin-left: 100px;
  min-height: calc(100vh - 48px);
  max-height: calc(100vh - 48px);
  overflow-y: hidden;
  box-shadow: inset 16px 16px 16px -16px rgba(83, 129, 220, 0.171);
}
.hide-shadow{
  position: fixed;
  height: 48px;
  width: 16px;
  left: 100px;
  background-color: #ffffff;
  z-index: 1003;
}
</style>
