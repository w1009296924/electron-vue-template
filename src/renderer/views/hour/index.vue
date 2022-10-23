<template>
  <div class="app-container">
    <div class="hour-container">
      <div class="hour-title">
        选择填报类型
        <el-radio
          v-model="hourType"
          style="margin-left: 32px; margin-right: 24px !important"
          label="1"
          >项目工时</el-radio
        >
        <el-radio v-model="hourType" label="2">非项目工时</el-radio>
      </div>
      <div class="hour-select">
        <button @click="login">login</button>
        <button @click="page">page</button>
        <button @click="add">add</button>
        <button @click="reject">reject</button>
        <!-- 项目工时 -->
        <div v-if="hourType == '1'">
          <div class="flexCenter" style="margin-bottom: 20px">
            实施单元
            <el-select
              v-model="unit"
              :disabled="smartChoose"
              style="margin: 0 8px; width: 224px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in ipmp_tasks"
                :key="item.implUnitNo"
                :label="item.implContent"
                :value="item.implUnitNo"
              >
                <span
                  style="
                    float: left;
                    color: #8492a6;
                    font-size: 13px;
                    margin-right: 20px;
                  "
                  >{{ item.value }}</span
                >
                <span style="float: right">{{ item.label }}</span>
              </el-option>
            </el-select>
            <!-- <i slot="reference" class="el-icon-refresh-right" :class="{'rotate' : rotate}" @click="refreshUnit" /> -->
          </div>
          <div
            class="flexCenter"
            style="margin-bottom: 20px; line-height: 32px"
          >
            剩余可填报工作量: {{ unit }}
          </div>
          <div class="flexCenter" style="margin-bottom: 20px">
            填报日期
            <el-date-picker
              v-model="date"
              align="center"
              type="date"
              style="margin-left: 8px"
              placeholder="选择日期"
              @change="selectFillDate"
            />
          </div>
          <div class="flexCenter" style="margin-bottom: 20px">
            填报工时
            <el-input-number
              v-model="inputHour"
              controls-position="right"
              style="width: 88px; margin: 0 8px"
              :min="1"
              :max="14"
            />
            小时
          </div>
          <div class="flexCenter">
            <el-popover
              :placement="'top-start'"
              width="250"
              trigger="hover"
              content="开启智能填报后会默认填报剩余工时最多的实施单元。"
            >
              <div slot="reference">智能填报</div>
            </el-popover>
            <el-select
              v-model="smartChoose"
              style="margin-left: 8px"
              @change="checkSmarkChoose"
            >
              <el-option
                v-for="item in smartChooses"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
        </div>
        <!-- 非项目工时 -->
        <div v-else>
          <div class="flexCenter" style="margin-bottom: 20px">
            工作类型
            <el-select
              v-model="type"
              style="margin: 0 8px; width: 224px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in typeList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flexCenter" style="margin-bottom: 20px">
            工作类别
            <el-select
              v-model="category"
              style="margin: 0 8px; width: 224px"
              placeholder="请选择"
            >
              <el-option
                v-for="item in categoryList"
                :key="item.value"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
          </div>
          <div class="flexCenter" style="margin-bottom: 20px">
            工作内容
            <el-input
              v-model="jobContent"
              style="margin: 0 8px; width: 224px"
              placeholder="请输入内容"
            />
          </div>
          <div class="flexCenter" style="margin-bottom: 20px">
            填报日期
            <el-date-picker
              v-model="date"
              align="center"
              type="date"
              style="margin-left: 8px"
              placeholder="选择日期"
            />
          </div>
          <div class="flexCenter">
            填报工时
            <el-input-number
              v-model="inputHour"
              controls-position="right"
              style="width: 88px; margin: 0 8px"
              :min="1"
              :max="14"
            />
            小时
          </div>
        </div>
      </div>
      <div class="auto-commit">
        自动填报
        <el-switch v-model="autoCommit" style="margin: 0 32px 0 8px" />
        自动填报时间
        <el-time-select
          v-model="autoCommitTime"
          align="center"
          :picker-options="{
            start: '08:30',
            step: '00:15',
            end: '18:30',
          }"
          placeholder="选择时间"
        >
        </el-time-select>
      </div>
      <div class="buttonGroup">
        <div
          class="abutton"
          :class="[canCommit ? 'commit' : 'rollback']"
          @click="commitOrBack"
        >
          {{ canCommit ? '填报工时' : '回退工时' }}
        </div>
        <div class="abutton refill" @click="refill">补填工时</div>
      </div>
    </div>
    <div class="debug">
      {{ info }}
      info2:
      {{ info2 }}
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';
import fileTool from '@/utils/fileTool.js';
import { dateFormat } from '@/utils/utils.js';
import { loginIPMP, getIPMPPage, fillHour, rejectHour } from '@/utils/ipmp.js';
export default {
  name: 'hour',
  data() {
    return {
      info: '',
      info2: '',
      settings: {},
      hourType: '1',
      unitList: [
        {
          value:
            '实施单元213-123UNKJ-2022-1234-代金券哦我我打算的弄啊-啊实打实是哒是法规处是给的原始股大Vu是去外地是武器二不请我大所大所大所奥术大师大所多撒大声地',
          label: '103',
        },
        {
          value:
            '实施单元213-123UNKJ-2022-12334-代金券哦我我打算的弄啊-啊实打实撒大声地',
          label: '1.03',
        },
        {
          value:
            '实施单元213-123UNKJ-2022-1214-代金券哦我我打算的弄啊-啊实打实撒大声地',
          label: '10.3',
        },
        {
          value:
            '实施单元213-123UNKJ-2022-1224-代金券哦我我打算的弄啊-啊实打实撒大声地',
          label: '5.03',
        },
        {
          value:
            '实施单元213-123UNKJ-2022-12378-代金券哦我我打算的弄啊-啊实打实撒大声地',
          label: '2.03',
        },
        {
          value:
            '实施单元213-123UNKJ-2022-1284-代金券哦我我打算的弄啊-啊实打实撒大声地',
          label: '0.03',
        },
      ],
      unit: '',
      rotate: false,
      date: new Date(),
      inputHour: 8,
      smartChooses: [
        {
          label: '是',
          value: true,
        },
        {
          label: '否',
          value: false,
        },
      ],
      smartChoose: false,
      type: '',
      typeList: [
        {
          label: '综合事务',
          value: '1',
        },
        {
          label: '成长提升',
          value: '2',
        },
        {
          label: '项目服务',
          value: '3',
        },
        {
          label: '专项任务',
          value: '4',
        },
        {
          label: '预研工作',
          value: '5',
        },
      ],
      category: '',
      categoryList: [
        {
          label: '管理保障',
          value: '1',
        },
        {
          label: '运维保障',
          value: '2',
        },
        {
          label: '研发支撑',
          value: '3',
        },
        {
          label: '自我提升',
          value: '4',
        },
      ],
      jobContent: '',
      autoCommit: false,
      autoCommitTime: '',
      canCommit: true,
      username: '',
      userpwd: '',
      ipmp_id: '',
      ipmp_manhourId: '',
      ipmp_tasks: [],
    };
  },
  computed: {
    ...mapGetters(['name', 'roles']),
  },
  created() {
    this.username = 'wenty';
    this.userpwd = '140454jJ';
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      //从本地配置中读取上次配置
      this.settings = fileTool.readSettingFile();
      this.hourType = this.settings.hour.hourType;
      this.unit = this.settings.hour.unit;
      this.smartChoose = this.settings.hour.smartChoose;
      this.type = this.settings.hour.type;
      this.category = this.settings.hour.category;
      this.jobContent = this.settings.hour.jobContent;
      this.autoCommit = this.settings.hour.autoCommit;
      this.autoCommitTime = this.settings.hour.autoCommitTime;
    },
    refreshUnit() {
      if (!this.rotate) {
        this.rotate = true;
        setTimeout(() => {
          this.rotate = false;
        }, 1500);
      }
    },
    //智能填报开启后，自动选择剩余工作量最多的实施单元
    checkSmarkChoose() {
      if (this.smartChoose) {
        this.unit = this.unitList[0].label;
      }
    },
    commitOrBack() {
      //保存本次填报配置至本地
      this.settings.hour = {
        hourType: this.hourType,
        unit: this.unit,
        smartChoose: this.smartChoose,
        type: this.type,
        category: this.category,
        jobContent: this.jobContent,
        autoCommit: this.autoCommit,
        autoCommitTime: this.autoCommitTime,
      };
      fileTool.writeSettingFile(this.settings); //本地保存配置文件
      this.canCommit = !this.canCommit;
    },
    refill() {
      //todo 补填工时
      console.log('补填工时');
    },
    selectFillDate(date) {
      console.log(dateFormat('YYYY-mm-dd', date));
      this.page(date);
    },
    login() {
      loginIPMP(this.username, this.userpwd)
        .then((res) => {
          this.info = res;
          console.log(res);
        })
        .catch((e) => {
          this.info = e;
          console.log(e);
        });
    },
    page(date) {
      getIPMPPage({
        fillInDate: dateFormat('YYYY-mm-dd', date),
      })
        .then((res) => {
          this.ipmp_tasks = [];
          this.info = res;
          let jsonObj = JSON.parse(res);
          let detailDtoList = jsonObj.data.manhourDetailDtoList;
          for (let i = 0; i < detailDtoList.length; i++) {
            const element = detailDtoList[i];
            if (element.id) {
              this.ipmp_id = element.id;
              this.ipmp_manhourId = element.manhourId;
            }
            if (element.prjId) {
              element.label;
              this.ipmp_tasks.push(element);
            }
          }
          console.log(res);
        })
        .catch((e) => {
          this.info = e;
          console.log(e);
        });
    },
    add() {
      let params = this.getIPMPParams();
      this.info2 = params;
      console.log(params);
      fillHour(params)
        .then((res) => {
          this.info = res;
          console.log(res);
        })
        .catch((e) => {
          this.info = e;
          console.log(e);
        });
    },
    reject() {
      let params = { ids: ['' + this.ipmp_id] };
      rejectHour(params)
        .then((res) => {
          this.info = res;
          this.info2 = this.ipmp_id;
          console.log(res);
        })
        .catch((e) => {
          this.info = e;
          this.info2 = this.ipmp_id;
          console.log(e);
        });
    },
    getIPMPParams() {
      let obj;
      if (1 + 1 > 2) {
        //改为任务项为空或设置非项目工时优先
        //非项目工时
      } else {
        //项目工时
        obj = JSON.parse(
          '{"applicant":null,"fillInDate":null,' +
            '"oneType":[],"threeType":[],"everyoneType":[{"id":null,' +
            '"manhourId":null,"prjId":null,"prjNo":null,"manhourType":"manhour.type' +
            '.03","prjManager":null,"taskId":"8f9331e4d5bd4721","projectRank":null,' +
            '"implUnitNo":null,"workType":"manhour.work.41","workingHours":0,' +
            '"workContent":null,"principal":null,"rejectOpinion":null,"systemId":null,' +
            '"status":"manhour.status.02","taskPlanProcess":null,"prjName":null,"taskName":"成长提升",' +
            '"convert":null,"flagId":"8f9331e4d5bd4721","flagStatus":null,"fillDate":null,' +
            '"fromProjectId":null,"fromTaskId":null,"fromImplementNo":null,"fromManhourType":null,' +
            '"ipmpFlag":null,"manhourSpecialId":null,"implUnitContents":null,' +
            '"manhourSpecialReason":null,"remarks":null,"allManager":null,"updateTime":null,' +
            '"updateBy":null,"manager":null,"assiatant":null,"wbstaskManger":null,' +
            '"implunitManger":null,"implunitCompanyManger":null,"othdemandManger":null,' +
            '"othdemandCompanyManger":null,"prjCenterDept":null,"prjRoomDept":null,"prjLineTeam":null,' +
            '"workTypeName":null,"principalName":null,"projectRankName":"","prjManagerName":"",' +
            '"memberId":null,"userId":null,"companyFullName":"开发服务中心","companyId":"01.01' +
            '.04.01.","memberName":null,"staffType":"0","fromProjectName":null,' +
            '"fillInDate":null,"fillInMonth":null,"statusName":"已退回",' +
            '"manhourTypeName":"非项目类工时","manhourTypeValue":null,"isManager":null,"implContent":null,' +
            '"systemName":null,"prjNoName":null,"productFlag":null,"acturalProductDate":null,' +
            '"resourceType":"行内","unitList":null,"manhourTypeId":null,"centerRoomId":null,' +
            '"roomDept":"01.01.04.01.02.","lineTeam":"01.01.04.01.02.01.","roomDeptName":"应用开发服务分中心' +
            '(武汉)","lineTeamName":"武汉开发","prjFirstDept":null,"forbidStatus":null,' +
            '"projectStatus":null,"prjStatus":null,"implStatus":null,"modifyFlag":false,' +
            '"workHours":null,"downloadType":null,"startDate":null,"endDate":null,"prjIdList":null,' +
            '"manHourNature":null,"manHourNatureValue":"正常工时","manhourSpecialReasonValue":"",' +
            '"submitTime":null,"disTaskName":null,"manhourStatus":"manhour.status.02","taskNo":null,' +
            '"taskDescription":null,"recentlyWorkContents":["参加培训","参加培训","参加培训","参加培训","参加培训"],' +
            '"order":1,"dict":[{"code":"manhour.work.14","codename":"项目管理"},{"code":"manhour' +
            '.work.15","codename":"商务采购"},{"code":"manhour.work.17","codename":"统计工作"},' +
            '{"code":"manhour.work.20","codename":"日常培训"},{"code":"manhour.work.32",' +
            '"codename":"咨询实施"}]},{"id":null,"manhourId":null,"prjId":null,"prjNo":null,' +
            '"manhourType":"manhour.type.03","prjManager":null,"taskId":"3dfe5581547548c4",' +
            '"projectRank":null,"implUnitNo":null,"workType":null,"workingHours":0,' +
            '"workContent":null,"principal":null,"rejectOpinion":null,"systemId":null,"status":null,' +
            '"taskPlanProcess":null,"prjName":null,"taskName":"综合事务","convert":null,' +
            '"flagId":"3dfe5581547548c4","flagStatus":null,"fillDate":null,"fromProjectId":null,' +
            '"fromTaskId":null,"fromImplementNo":null,"fromManhourType":null,"ipmpFlag":null,' +
            '"manhourSpecialId":null,"implUnitContents":null,"manhourSpecialReason":null,' +
            '"remarks":null,"allManager":null,"updateTime":null,"updateBy":null,"manager":null,' +
            '"assiatant":null,"wbstaskManger":null,"implunitManger":null,"implunitCompanyManger":null,' +
            '"othdemandManger":null,"othdemandCompanyManger":null,"prjCenterDept":null,' +
            '"prjRoomDept":null,"prjLineTeam":null,"workTypeName":"","principalName":null,' +
            '"projectRankName":"","prjManagerName":"","memberId":null,"userId":null,' +
            '"companyFullName":"","companyId":null,"memberName":null,"staffType":null,' +
            '"fromProjectName":null,"fillInDate":null,"fillInMonth":null,"statusName":"",' +
            '"manhourTypeName":"非项目类工时","manhourTypeValue":null,"isManager":null,"implContent":null,' +
            '"systemName":null,"prjNoName":null,"productFlag":null,"acturalProductDate":null,' +
            '"resourceType":"外协","unitList":null,"manhourTypeId":null,"centerRoomId":null,' +
            '"roomDept":null,"lineTeam":null,"roomDeptName":"","lineTeamName":"",' +
            '"prjFirstDept":null,"forbidStatus":null,"projectStatus":null,"prjStatus":null,' +
            '"implStatus":null,"modifyFlag":false,"workHours":null,"downloadType":null,' +
            '"startDate":null,"endDate":null,"prjIdList":null,"manHourNature":null,' +
            '"manHourNatureValue":"正常工时","manhourSpecialReasonValue":"","submitTime":null,' +
            '"disTaskName":null,"manhourStatus":null,"taskNo":null,"taskDescription":"上述未提及的工作类型",' +
            '"recentlyWorkContents":[],"order":0,"dict":[{"code":"manhour.work.14",' +
            '"codename":"项目管理"},{"code":"manhour.work.15","codename":"商务采购"},{"code":"manhour' +
            '.work.17","codename":"统计工作"},{"code":"manhour.work.20","codename":"日常培训"},' +
            '{"code":"manhour.work.32","codename":"咨询实施"}]},{"id":null,"manhourId":null,' +
            '"prjId":null,"prjNo":null,"manhourType":"manhour.type.03","prjManager":null,' +
            '"taskId":"5035c044fc8f40e6","projectRank":null,"implUnitNo":null,"workType":null,' +
            '"workingHours":0,"workContent":null,"principal":null,"rejectOpinion":null,' +
            '"systemId":null,"status":null,"taskPlanProcess":null,"prjName":null,"taskName":"专项工作",' +
            '"convert":null,"flagId":"5035c044fc8f40e6","flagStatus":null,"fillDate":null,' +
            '"fromProjectId":null,"fromTaskId":null,"fromImplementNo":null,"fromManhourType":null,' +
            '"ipmpFlag":null,"manhourSpecialId":null,"implUnitContents":null,' +
            '"manhourSpecialReason":null,"remarks":null,"allManager":null,"updateTime":null,' +
            '"updateBy":null,"manager":null,"assiatant":null,"wbstaskManger":null,' +
            '"implunitManger":null,"implunitCompanyManger":null,"othdemandManger":null,' +
            '"othdemandCompanyManger":null,"prjCenterDept":null,"prjRoomDept":null,"prjLineTeam":null,' +
            '"workTypeName":"","principalName":null,"projectRankName":"","prjManagerName":"",' +
            '"memberId":null,"userId":null,"companyFullName":"","companyId":null,' +
            '"memberName":null,"staffType":null,"fromProjectName":null,"fillInDate":null,' +
            '"fillInMonth":null,"statusName":"","manhourTypeName":"非项目类工时","manhourTypeValue":null,' +
            '"isManager":null,"implContent":null,"systemName":null,"prjNoName":null,' +
            '"productFlag":null,"acturalProductDate":null,"resourceType":"外协","unitList":null,' +
            '"manhourTypeId":null,"centerRoomId":null,"roomDept":null,"lineTeam":null,' +
            '"roomDeptName":"","lineTeamName":"","prjFirstDept":null,"forbidStatus":null,' +
            '"projectStatus":null,"prjStatus":null,"implStatus":null,"modifyFlag":false,' +
            '"workHours":null,"downloadType":null,"startDate":null,"endDate":null,"prjIdList":null,' +
            '"manHourNature":null,"manHourNatureValue":"正常工时","manhourSpecialReasonValue":"",' +
            '"submitTime":null,"disTaskName":null,"manhourStatus":null,"taskNo":null,' +
            '"taskDescription":null,"recentlyWorkContents":[],"order":0,"dict":[{"code":"manhour' +
            '.work.14","codename":"项目管理"},{"code":"manhour.work.15","codename":"商务采购"},' +
            '{"code":"manhour.work.17","codename":"统计工作"},{"code":"manhour.work.20",' +
            '"codename":"日常培训"},{"code":"manhour.work.32","codename":"咨询实施"}]},{"id":null,' +
            '"manhourId":null,"prjId":null,"prjNo":null,"manhourType":"manhour.type.03",' +
            '"prjManager":null,"taskId":"abf67b51332e4f80","projectRank":null,"implUnitNo":null,' +
            '"workType":null,"workingHours":0,"workContent":null,"principal":null,' +
            '"rejectOpinion":null,"systemId":null,"status":null,"taskPlanProcess":null,' +
            '"prjName":null,"taskName":"项目服务","convert":null,"flagId":"abf67b51332e4f80",' +
            '"flagStatus":null,"fillDate":null,"fromProjectId":null,"fromTaskId":null,' +
            '"fromImplementNo":null,"fromManhourType":null,"ipmpFlag":null,"manhourSpecialId":null,' +
            '"implUnitContents":null,"manhourSpecialReason":null,"remarks":null,"allManager":null,' +
            '"updateTime":null,"updateBy":null,"manager":null,"assiatant":null,"wbstaskManger":null,' +
            '"implunitManger":null,"implunitCompanyManger":null,"othdemandManger":null,' +
            '"othdemandCompanyManger":null,"prjCenterDept":null,"prjRoomDept":null,"prjLineTeam":null,' +
            '"workTypeName":"","principalName":null,"projectRankName":"","prjManagerName":"",' +
            '"memberId":null,"userId":null,"companyFullName":"","companyId":null,' +
            '"memberName":null,"staffType":null,"fromProjectName":null,"fillInDate":null,' +
            '"fillInMonth":null,"statusName":"","manhourTypeName":"非项目类工时","manhourTypeValue":null,' +
            '"isManager":null,"implContent":null,"systemName":null,"prjNoName":null,' +
            '"productFlag":null,"acturalProductDate":null,"resourceType":"外协","unitList":null,' +
            '"manhourTypeId":null,"centerRoomId":null,"roomDept":null,"lineTeam":null,' +
            '"roomDeptName":"","lineTeamName":"","prjFirstDept":null,"forbidStatus":null,' +
            '"projectStatus":null,"prjStatus":null,"implStatus":null,"modifyFlag":false,' +
            '"workHours":null,"downloadType":null,"startDate":null,"endDate":null,"prjIdList":null,' +
            '"manHourNature":null,"manHourNatureValue":"正常工时","manhourSpecialReasonValue":"",' +
            '"submitTime":null,"disTaskName":null,"manhourStatus":null,"taskNo":null,' +
            '"taskDescription":null,"recentlyWorkContents":[],"order":0,"dict":[{"code":"manhour' +
            '.work.14","codename":"项目管理"},{"code":"manhour.work.15","codename":"商务采购"},' +
            '{"code":"manhour.work.17","codename":"统计工作"},{"code":"manhour.work.20",' +
            '"codename":"日常培训"},{"code":"manhour.work.32","codename":"咨询实施"}]},{"id":null,' +
            '"manhourId":null,"prjId":null,"prjNo":null,"manhourType":"manhour.type.03",' +
            '"prjManager":null,"taskId":"efd7efbaaf564a1e","projectRank":null,"implUnitNo":null,' +
            '"workType":null,"workingHours":0,"workContent":null,"principal":null,' +
            '"rejectOpinion":null,"systemId":null,"status":null,"taskPlanProcess":null,' +
            '"prjName":null,"taskName":"预研工作","convert":null,"flagId":"efd7efbaaf564a1e",' +
            '"flagStatus":null,"fillDate":null,"fromProjectId":null,"fromTaskId":null,' +
            '"fromImplementNo":null,"fromManhourType":null,"ipmpFlag":null,"manhourSpecialId":null,' +
            '"implUnitContents":null,"manhourSpecialReason":null,"remarks":null,"allManager":null,' +
            '"updateTime":null,"updateBy":null,"manager":null,"assiatant":null,"wbstaskManger":null,' +
            '"implunitManger":null,"implunitCompanyManger":null,"othdemandManger":null,' +
            '"othdemandCompanyManger":null,"prjCenterDept":null,"prjRoomDept":null,"prjLineTeam":null,' +
            '"workTypeName":"","principalName":null,"projectRankName":"","prjManagerName":"",' +
            '"memberId":null,"userId":null,"companyFullName":"","companyId":null,' +
            '"memberName":null,"staffType":null,"fromProjectName":null,"fillInDate":null,' +
            '"fillInMonth":null,"statusName":"","manhourTypeName":"非项目类工时","manhourTypeValue":null,' +
            '"isManager":null,"implContent":null,"systemName":null,"prjNoName":null,' +
            '"productFlag":null,"acturalProductDate":null,"resourceType":"外协","unitList":null,' +
            '"manhourTypeId":null,"centerRoomId":null,"roomDept":null,"lineTeam":null,' +
            '"roomDeptName":"","lineTeamName":"","prjFirstDept":null,"forbidStatus":null,' +
            '"projectStatus":null,"prjStatus":null,"implStatus":null,"modifyFlag":false,' +
            '"workHours":null,"downloadType":null,"startDate":null,"endDate":null,"prjIdList":null,' +
            '"manHourNature":null,"manHourNatureValue":"正常工时","manhourSpecialReasonValue":"",' +
            '"submitTime":null,"disTaskName":null,"manhourStatus":null,"taskNo":null,' +
            '"taskDescription":null,"recentlyWorkContents":[],"order":0,"dict":[{"code":"manhour' +
            '.work.14","codename":"项目管理"},{"code":"manhour.work.15","codename":"商务采购"},' +
            '{"code":"manhour.work.17","codename":"统计工作"},{"code":"manhour.work.20",' +
            '"codename":"日常培训"},{"code":"manhour.work.32","codename":"咨询实施"}]}],"delIdList":[]}'
        );
        let threeTypeObjArr = JSON.parse(
          '[{"code":"","codename":""},{"code":"manhour.work.02",' +
            '"codename":"需求分析"},{"code":"manhour.work.03","codename":"需求开发"},{"code":"manhour.work' +
            '.04","codename":"需求设计"},{"code":"manhour.work.05","codename":"需求投产"},{"code":"manhour' +
            '.work.06","codename":"内部测试"},{"code":"manhour.work.07","codename":"业务测试"},' +
            '{"code":"manhour.work.08","codename":"安全测试"},{"code":"manhour.work.09",' +
            '"codename":"性能测试"},{"code":"manhour.work.10","codename":"需求讨论"},{"code":"manhour.work' +
            '.11","codename":"投产准备"},{"code":"manhour.work.12","codename":"接口联调"},{"code":"manhour' +
            '.work.13","codename":"代码评审"},{"code":"manhour.work.14","codename":"项目管理"},' +
            '{"code":"manhour.work.15","codename":"商务采购"},{"code":"manhour.work.16",' +
            '"codename":"日常运维"},{"code":"manhour.work.17","codename":"统计工作"},{"code":"manhour.work' +
            '.18","codename":"生产问题排查"},{"code":"manhour.work.19","codename":"POC测试"},' +
            '{"code":"manhour.work.20","codename":"日常培训"},{"code":"manhour.work.21",' +
            '"codename":"专项问题修复"}]'
        );
        obj.applicant = this.username;
        obj.fillInDate = dateFormat('YYYY-mm-dd', this.date);
        obj.everyoneType = null;
        let bestTask = this.ipmp_tasks[0];
        // let bestTask = JSON.parse(
        //   '{"id":"3c0c410e81484fc6","manhourId":"595ee37db2c543df","prjId":"d2ebb5add7f4401b","prjNo":"22-T139","manhourType":"manhour.type.02","prjManager":"lisq5","taskId":null,"projectRank":null,"implUnitNo":"实施单元2022网络金融148-021","workType":"manhour.work.03","workingHours":"8","workContent":"参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发","principal":null,"rejectOpinion":null,"systemId":null,"status":"manhour.status.02","taskPlanProcess":null,"prjName":"个人手机银行系统2022维护任务集","taskName":null,"convert":8.0,"flagId":"实施单元2022网络金融148-021","flagStatus":null,"fillDate":null,"fromProjectId":null,"fromTaskId":null,"fromImplementNo":null,"fromManhourType":null,"ipmpFlag":"manhour.mtprj.type.02","manhourSpecialId":null,"implUnitContents":null,"manhourSpecialReason":null,"remarks":null,"allManager":null,"updateTime":null,"updateBy":null,"manager":null,"assiatant":null,"wbstaskManger":null,"implunitManger":null,"implunitCompanyManger":null,"othdemandManger":null,"othdemandCompanyManger":null,"prjCenterDept":null,"prjRoomDept":null,"prjLineTeam":null,"outsourceType":null,"workTypeName":"需求开发","principalName":null,"projectRankName":"","prjManagerName":"李斯祺","memberId":"wenty","userId":"wenty","companyFullName":"开发服务中心","companyId":"01.01.04.01.","memberName":"文天阳","staffType":"0","fromProjectName":null,"fillInDate":"2022-10-21","fillInMonth":null,"statusName":"已退回","manhourTypeName":"实施单元工时","manhourTypeValue":null,"isManager":null,"implContent":"开发中-实施单元2022网络金融148-021-dzqdUT-WLJR-2022-0707手机银行业务印章规范接入电子印章系统需求（手机第二批）","systemName":null,"prjNoName":null,"productFlag":"false","acturalProductDate":null,"resourceType":"行内","unitList":null,"manhourTypeId":null,"centerRoomId":null,"roomDept":"01.01.04.01.02.","lineTeam":"01.01.04.01.02.03.","roomDeptName":"应用开发服务分中心(武汉)","lineTeamName":"武汉研发A2团队","prjFirstDept":null,"forbidStatus":null,"projectStatus":null,"prjStatus":"mtprj.status.01","implStatus":null,"modifyFlag":false,"workHours":null,"downloadType":null,"startDate":null,"endDate":null,"prjIdList":null,"manHourNature":null,"manHourNatureValue":"正常工时","manhourSpecialReasonValue":"","submitTime":null,"disTaskName":null,"manhourStatus":"manhour.status.02","taskNo":null,"taskDescription":null,"recentlyWorkContents":["参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发","参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发","参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发","参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发","参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发"],"order":1}'
        // );
        bestTask.workType = 'manhour.work.03'; //需求开发
        bestTask.workingHours = '' + this.inputHour;
        bestTask.workContent =
          '参加UT-WLJR-2022-0707-手机银行业务印章规范接入电子印章系统需求（手机信用卡）开发';
        bestTask.dict = threeTypeObjArr;
        obj.threeType = [bestTask];
      }
      return obj;
    },
  },
};
</script>

<style lang="scss" scoped>
.hour-container {
  height: 875px;
  padding: 40px;
  border: 2px;
  background-color: #ffffff;
}

.hour-title {
  display: flex;
  align-items: center;
  font-family: PingFangSC-Regular;
  line-height: 28px;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.hour-select {
  width: 100%;
  background: #f3f9ff;
  border-radius: 4px;
  margin-top: 22px;
  padding: 24px 16px;
  font-family: PingFangSC-Regular;
  font-size: 16px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.el-icon-refresh-right {
  cursor: pointer;
  font-size: 20px;
}
.debug {
  user-select: all;
}

.flexCenter {
  display: flex;
  align-items: center;
}

.auto-commit {
  margin: 18px 0 50px;
}

.abutton {
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 88px;
  height: 32px;
  border-radius: 2px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 22px;
  font-weight: 400;
}

.buttonGroup {
  display: flex;
  margin-left: 58px;
}

.commit {
  background-color: #005bd2;
}

.rollback {
  background-color: #ff3e52;
}

.refill {
  background-color: #ffffff;
  border: 1px solid #005bd2;
  color: #005bd2;
  margin-left: 24px;
}

.rotate {
  animation: turn 1.5s linear infinite;
}
::v-deep .el-input__inner {
  height: 32px;
  line-height: 32px;
}

::v-deep .el-input-number {
  line-height: 30px;
}
::v-deep .el-input-number__increase {
  line-height: 16px !important;
}
::v-deep .el-input-number__decrease {
  line-height: 16px !important;
}
::v-deep .el-input__icon {
  line-height: 32px;
}
@keyframes turn {
  0% {
    -webkit-transform: rotate(0deg);
  }

  100% {
    -webkit-transform: rotate(360deg);
  }
}
</style>
