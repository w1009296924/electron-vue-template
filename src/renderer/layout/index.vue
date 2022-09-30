<template>
  <div class="app-wrapper" :class="IsUseSysTitle?'UseSysTitle':'NoUseSysTitle'">
    <div :class="classObj">
      <navbar></navbar>
      <div class="hide-shadow"></div>
      <div class="container-set">
        <sidebar v-if="settings" class="sidebar-container" :class="IsUseSysTitle?'UseSysTitle':'NoUseSysTitle'"></sidebar>
          <div class="main-container">
            <app-main></app-main>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import fs from "fs";
import { Sidebar, AppMain, Navbar } from "./components";
import ResizeMixin from "./mixin/ResizeHandler";
import { CONFIG_DIR, DOC_DIR, DEFAULT_VAL, BASE_PENDINGRULE } from "@/utils/constans.js";
import fileTool from "@/utils/fileTool.js";
import { mapGetters } from "vuex";
import { formatDateTime, subTrackTime } from "@/utils/validate.js";
import { settings } from "cluster";


export default {
  name: "layout",
  components: {
    Sidebar,
    AppMain,
    Navbar
  },
  mixins: [ResizeMixin],
  data: () => ({
    IsUseSysTitle: require("./../../../config").IsUseSysTitle,
    settings:null,
  }),
  computed: {
    ...mapGetters(["taskArray", "nowTask"]),
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
  },
  created(){
    this.init();
    //获取任务 生成任务文件夹 加载进vuex
    this.taskArray.forEach((item,index) => {
      //判断有无该任务文件夹,没有则创建文件夹
      fs.stat(this.getDemandPath(item), (error) => {
        if (error) {
          fs.mkdir(CONFIG_DIR, function () {});
        }
      });
    });
    //先生成年月的文件夹
    this.createDir(this.getSubDemandPath(this.taskArray[0]));
    //再生成任务文件夹
    this.createDir(this.getDemandPath(this.taskArray[0]));
    //生成本地待办文件 基础待办规则BASE_PENDINGRULE 自定义待办规则settings.ruleList
    let pendingChildren = [];
    BASE_PENDINGRULE.forEach(item => {
      if(item.missionType=='全部' || item.missionType==this.taskArray[0].demandNo.substring(0,4)){
        pendingChildren.push({
          id:'',
          pendingType:item.pendingName,
          date: this.getPendingDate(this.taskArray[0],item),
          status: false,
        })
      }
    });
    //todo settings加载不出来,改成watch后触发
    // console.log(this.settings);
    // this.settings.settings.ruleList.forEach(item => {
    //   if(item.missionType=='全部' || item.missionType==this.taskArray[0].demandNo.substring(0,4)){
    //     pendingChildren.push({
    //       id:'',
    //       pendingType:item.pendingName,
    //       date: this.getPendingDate(this.taskArray[0],item),
    //       status: false,
    //     })
    //   }
    // });
    
    const todoObj = {
      missionNo: this.taskArray[0].demandNo,
      missionName: this.taskArray[0].taskName,
      status: false,
      children: pendingChildren,
    }
    fs.stat(this.getDemandPath(this.taskArray[0])+'\\'+'Todo.txt', (error) => {
      if (error) {
        fs.writeFile(
          this.getDemandPath(this.taskArray[0])+'\\'+'Todo.txt',
          JSON.stringify(todoObj, null, 2),
          function () {}
        );
      }
    });
      //根据设置的授权列表和待办事项id判断是否上传数据库
  },
  methods:{
    async init() {
      //创建配置文件夹
      this.createDir(CONFIG_DIR);
      //创建归档目录
      this.createDir(DOC_DIR);
      //判断有无配置文件,没有则创建配置文件
      fs.stat(`${CONFIG_DIR}\\settings.ini`, async (error) => {
        if (error) {
          fileTool.writeSettingFile(DEFAULT_VAL);
          setTimeout(()=>{
            this.settings = fileTool.readSettingFile();
          },1000);
        } else{
           this.settings = await fileTool.readSettingFile()
        }
      });
    },
    initTaskArray() {

    },
    initMissionArray() {

    },
    //创建文件夹
    createDir(directory){
      fs.stat(directory, (error) => {
        if (error) {
          fs.mkdir(directory, function () {});
        }
      });
    },
    getPendingDate(task,rule){
      let time =  rule.compareTo == '任务启动' ? task.startTimeReal :
        rule.compareTo == '提交内测' ? task.sitTime :
        rule.compareTo == '提交业测' ? task.uatTime :
        task.fireTime;
      return subTrackTime(time,rule.timeInterval*60*24);
    },
    //获取归档目录上级的年月目录
    getSubDemandPath(task) {
      let strs = task.startTimeReal.split('/');
      return DOC_DIR +  strs[0] + '年' +strs[1] + '月';
    },
    //获取任务归档目录
    getDemandPath(task){
      return this.getSubDemandPath(task) + '\\' + task.taskName;
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
.main-container {
  height: 919px;
  user-select: none;
  background-color: #f6f9fc;
}
</style>
