<template>
  <div class="app-container">
    <div class="main-box">
      <HomeCard width="728" height="420" title="近期待办"></HomeCard>
      <HomeCard width="544" height="420" title="工时日历"></HomeCard>
      <HomeCard width="728" height="433" title="便签"></HomeCard>
      <HomeCard width="544" height="433" title="快速入口">
        <template v-slot:content>
          <draggable
            v-model="quickEntryArray"
            delay="50"
            animation="300"
            filter=".forbid"
            ghostClass="ghost"
            :move="onMove"
          >
            <transition-group class="quick-entrys">
              <qucik-entry
                v-for="element in quickEntryArray"
                :key="element.name"
                :name="element.name"
                :iconPath="element.iconPath"
                :url="element.url"
                :class="{ forbid: element.name == '添加' }"
              />
            </transition-group>
          </draggable>
        </template>
      </HomeCard>
    </div>
  </div>
</template>
<script>
import HomeCard from "./components/HomeCard";
import QucikEntry from "./components/QuickEntry";
import draggable from "vuedraggable";
export default {
  components: { HomeCard, QucikEntry, draggable },
  data() {
    return {
      quickEntryArray: [
        {
          name: "归档目录",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "百度",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "app:D:/VSCodePro/electron-vue-template/src/renderer/assets/user.png",
        },
        {
          name: "Fdev",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "飞云",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "IPMP",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "web:https://www.baidu.com",
        },
        {
          name: "添加",
          iconPath: require("@/assets/entry_飞云.png"),
          url: "add",
        },
      ],
    };
  },
  created() {
    console.log("created");
  },
  methods: {
    onMove(e) {
      if (e.relatedContext.element.name == "添加") return false;
      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.main-box {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}
.quick-entrys {
  display: flex;
  flex-wrap: wrap;
  row-gap: 48px;
  column-gap: 84px;
  padding: 47px 56px;
  .ghost {
    opacity: 0;
  }
}
</style>
