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
            <el-image :src="userImage" class="avatar" draggable="false">
              <div slot="error" class="image-slot">
                <i class="el-icon-picture-outline"></i>
              </div>
            </el-image>
            <div class="el-dropdown-link">
              {{ name }}
            </div>
          </div>
          <el-dropdown-menu slot="dropdown">
            <router-link to="/">
              <el-dropdown-item>返回首页</el-dropdown-item>
            </router-link>
            <el-dropdown-item
              @click.native="showSettings"
              style="text-align: center"
              >设&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;置</el-dropdown-item
            >
            <el-dropdown-item @click.native="logout">
              <span>切换账号</span>
            </el-dropdown-item>
            <el-dropdown-item @click.native="logout">
              <span>退出登录</span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </el-dropdown>
      </div>
      <Settings ref="settings" />
      <sidebar-item
        v-for="route in permission_routes"
        :key="route.name"
        :item="route"
        :base-path="route.path"
        :collapse="isCollapse"
      ></sidebar-item>
      <div class="selected-bar" :style="barDy">
        <span class="bar-left"></span>
        <span class="bar-right"></span>
      </div>
    </el-menu>
  </scroll-bar>
</template>

<script>
import { mapGetters } from "vuex";
import SidebarItem from "./SidebarItem";
import Settings from "./settings";
import ScrollBar from "@/components/ScrollBar";
import Logo from "./logo";

export default {
  components: { SidebarItem, ScrollBar, Logo, Settings },
  data: () => ({
    userImage: require("@/assets/userW.png"),
    name: "又又不leng",
    routeMap: [],
    settings: false,
    isCollapse: true,
  }),
  computed: {
    // ...mapGetters(["sidebar", "permission_routes"]),
    ...mapGetters(["permission_routes"]),
    // isCollapse() {
    //   console.log(this.$store.getters);
    //   return !this.sidebar.opened;
    // },
    barDy() {
      console.log(this.$route.path);
      let index;
      for (index = 0; index < this.routeMap.length; index++) {
        if (this.$route.path.indexOf(this.routeMap[index].path + "/") === 0) {
          break;
        }
        if (index == this.routeMap.length - 1) {
          index = -1;
          break;
        }
      }
      console.log(index);
      return index == -1 ? "display:none;" : `top:${144 + 94 * index}px;`;
    },
  },
  mounted() {
    this.routeMap = require("@/router/constantRouterMap").default;
  },
  methods: {
    showSettings() {
      console.log(1111111);
      this.$refs.settings.show();
    },
    logout() {
      this.$store.dispatch("LogOut").then(() => {
        this.$message({
          message: "退出成功",
          type: "success",
        });
        this.$router.push("/login");
      });
    },
  },
};
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.scroll-container {
  user-select: none;
  ::v-deep a {
    -webkit-user-drag: none;
  }
}
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
.account {
  display: flex;
  justify-content: center;
  margin-top: 32px;
  user-select: none;
  margin-bottom: 24px;
  .account-inner {
    display: flex;
    flex-direction: column;
    align-items: center;
    cursor: pointer;
    .avatar {
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
.selected-bar {
  height: 94px;
  width: 8px;
  position: absolute;
  left: 92px;
  transition: all 0.15s ease-in-out;
  .bar-left {
    position: absolute;
    height: 94px;
    width: 4px;
    background: #bfd7f6;
    border-radius: 4px 0 0 4px;
  }
  .bar-right {
    position: absolute;
    left: 4px;
    height: 94px;
    width: 4px;
    background: #5380dc;
    border-radius: 2px 0 0 2px;
  }
}
</style>
