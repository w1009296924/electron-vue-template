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
    settings:{},
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
    this.$store.dispatch("initMissionData");
    this.init();
  },
  methods:{
    async init() {
      //创建配置文件夹
      this.createDir(CONFIG_DIR);
      //创建归档目录
      this.createDir(DOC_DIR);
      //创建非绑定任务的待办目录及文件
      this.createDir(DOC_DIR+'global');
      fs.stat(`${DOC_DIR}\\global\\Todo.txt`, error => {
        if (error) {
          fs.writeFile(`${DOC_DIR}global\\Todo.txt`,
            JSON.stringify({globalTodoList:[]}, null, 2),
            function(){}
          );
        }
      });
      //创建配置文件
      fs.stat(`${CONFIG_DIR}\\settings.ini`, error => {
        if (error) {
          fileTool.writeSettingFile(DEFAULT_VAL);
        } 
        setTimeout(()=>{
          fs.readFile(`${CONFIG_DIR}\\settings.ini`,"utf-8",(err,data) => {
            this.settings = JSON.parse(data);
            this.initMissionDir();
          });
        },1000);
      });
    },
    initMissionDir() {
      //获取任务 生成任务文件夹 加载进vuex todo
      this.taskArray.forEach((item,index) => {
        //判断有无该任务文件夹,没有则创建文件夹,有则读取todo文件加入vuex
        fs.stat(this.getDemandPath(item), (error) => {
          if (error) {
            //先生成年月的文件夹
            this.createDir(this.getSubDemandPath(item));
            //再生成任务文件夹
            this.createDir(this.getDemandPath(item));
            //生成本地待办文件 基础待办规则BASE_PENDINGRULE 自定义待办规则settings.ruleList
            let pendingChildren = [];
            BASE_PENDINGRULE.forEach(rule => {
              if(rule.missionType=='全部' || rule.missionType==item.demandNo.substring(0,4)){
                pendingChildren.push({
                  id:'',
                  pendingType:rule.pendingName,
                  date: this.getPendingDate(item,rule),
                  status: false,
                })
              }
            });
            this.settings.settings.ruleList.forEach(rule => {
              if(rule.missionType=='全部' || rule.missionType==item.demandNo.substring(0,4)){
                pendingChildren.push({
                  id:'',
                  pendingType:rule.pendingName,
                  date: this.getPendingDate(item,rule),
                  status: false,
                })
              }
            });
            const todoObj = {
              missionNo: item.demandNo,
              missionName: item.taskName,
              todoDir:this.getDemandPath(item)+'\\'+'Todo.txt',
              status: false,
              children: pendingChildren,
            }
            //待办加入vuex
            this.$store.dispatch("addMissionData", [todoObj]);
            fs.stat(this.getDemandPath(item)+'\\'+'Todo.txt', (error) => {
              if (error) {
                fs.writeFile(
                  this.getDemandPath(item)+'\\'+'Todo.txt',
                  JSON.stringify(todoObj, null, 2),
                  function () {}
                );
              }
            });
          } else {
            //任务待办加入vuex
            fs.readFile(this.getDemandPath(item)+'\\'+'Todo.txt',"utf-8",(err,data) => {
              this.$store.dispatch("addMissionData", [JSON.parse(data)]);
            });
          }
        });
      });
      //global里面的待办加入vuex
      fs.readFile(`${DOC_DIR}\\global\\Todo.txt`,"utf-8",(err,globalTodo) => {
        const globalTodoList = JSON.parse(globalTodo).globalTodoList;
        if(globalTodoList.length > 0) {
          globalTodoList.forEach(data => {
            this.$store.dispatch("addMissionData", [data]);
          });
        }
      });
        //根据设置的授权列表和待办事项id判断是否上传数据库
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
