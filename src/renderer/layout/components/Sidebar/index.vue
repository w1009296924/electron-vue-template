<template>
  <scroll-bar>
    <el-menu
      mode="vertical"
      :show-timeout="200"
      :default-active="$route.path"
      :collapse="isCollapse"
    >
      <!-- <Logo :collapse="isCollapse" /> -->
      <div class="account">
          <el-dropdown trigger="click">
            <div class="account-inner">
              <el-image :src="userImage" class="avatar">
                <div slot="error" class="image-slot">
                  <i class="el-icon-picture-outline"></i>
                </div>
              </el-image>
              <div class="el-dropdown-link">
               {{name}}
              </div>
            </div>
            <el-dropdown-menu slot="dropdown">
              <router-link to="/">
                <el-dropdown-item>返回首页</el-dropdown-item>
              </router-link>
              <el-dropdown-item @click.native="logout">
                <span>切换账号</span>
              </el-dropdown-item>
              <el-dropdown-item @click.native="logout">
                <span>退出登录</span>
              </el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </div>
      <sidebar-item
        v-for="route in permission_routes"
        :key="route.name"
        :item="route"
        :base-path="route.path"
        :collapse="isCollapse"
      ></sidebar-item>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import ScrollBar from "@/components/ScrollBar";
import Logo from "./logo";

export default {
  components: { SidebarItem, ScrollBar, Logo },
  data: () => ({
    userImage: require("@/assets/userW.png"),
    name:'又又不leng'
  }),
  computed: {
    ...mapGetters(["sidebar", "permission_routes"]),
    isCollapse() {
      console.log(this.$store.getters);
      return !this.sidebar.opened;
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.title {
  text-align: center;
  line-height: 64px;
  height: 64px;
  font-size: 14px;
  font-weight: bold;
  color: #333333;
  background-color: #ffffff;
  padding: 0 20px;
  .logo-set {
    width: 21px;
    height: 21px;
  }
}
.minititle {
  padding: 0 10px;
  transition: padding 0.28s;
  overflow: hidden;
  width: 180px;
}
.account{
  display: flex;
  justify-content: center;
  margin-top: 32px;
  user-select: none;
  margin-bottom: 24px;
  .account-inner{
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .avatar{
      width: 64px;
    }
    ::v-deep .el-dropdown-link {
      margin-top: 4px;
      font-family: PingFangSC-Regular;
      font-size: 14px;
      line-height: 20px;
      color: rgba(0, 0, 0, 0.65);
      letter-spacing: 0;
      font-weight: 400;
    }
  }
}
</style>