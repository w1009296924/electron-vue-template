<template>
  <div class="app-container">
    <div class="tools-container">
      <ToolTitle toolName="工作量统计" />
      <div class="set-timeRage">
        时间范围
        <el-date-picker
          v-model="dateRange"
          ref="picker"
          type="daterange"
          align="center"
          style="margin: 0 32px 0 16px"
          :picker-options="pickerOptions"
          range-separator="至"
          start-placeholder="开始日期"
          end-placeholder="结束日期"
        />
        <div class="button-query" @click="query">查询</div>
      </div>
      <div class="maxHeight">
        <div class="showMessage">
          <div>工作量: {{ workloads }}</div>
          <div class="missionList">投产需求:</div>
          <el-table :data="tableData" border style="width: 100%">
            <el-table-column fixed prop="date" label="投产日期" width="200" />
            <el-table-column prop="missionNo" label="需求编号" width="300" />
            <el-table-column prop="missionName" label="需求名称" width="450" />
            <el-table-column prop="workload" label="工作量" width="120">
              <template slot-scope="scope">
                <el-input
                  ref="gain"
                  size="mini"
                  @input="editInput($event, scope.row)"
                  @blur="editWorkloadSave(scope.row, scope.$index)"
                  v-model="scope.row.workload"
                  style="width: 100%; hight: 100%"
                />
                <!-- <span
                  v-if="scope.row.isOK"
                  v-else
                  size="mini"
                  @click="editWorkload(scope.row, scope.$index)"
                  >{{ scope.row.workload }}</span
                > -->
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="deleteRow(scope.$index, tableData)"
                  >本次排除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
          <div v-show="otherTableData.length > 0">
            <div style="margin: 12px 0">
              以下为预计投产但无实际投产日期的需求
            </div>
            <el-table :data="otherTableData" border style="width: 100%">
              <el-table-column
                fixed
                prop="date"
                label="预计投产日期"
                width="200"
              />
              <el-table-column prop="missionNo" label="需求编号" width="280" />
              <el-table-column
                prop="missionName"
                label="需求名称"
                width="450"
              />
              <el-table-column prop="workload" label="工作量" width="120">
                <template slot-scope="scope">
                  <el-input
                    ref="gain"
                    size="mini"
                    @input="editInput($event, scope.row)"
                    @blur="editWorkloadSave(scope.row, scope.$index)"
                    v-model="scope.row.workload"
                    style="width: 100%; hight: 100%"
                  />
                </template>
              </el-table-column>
              <el-table-column label="操作">
                <template slot-scope="scope">
                  <el-button
                    type="text"
                    size="small"
                    @click="showTimeDialog(scope.$index, otherTableData)"
                    >已投产</el-button
                  >
                  <el-button
                    type="text"
                    size="small"
                    @click="addCount(scope.$index, otherTableData)"
                    >加入统计</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>
      </div>
    </div>
    <el-dialog
      title="已投产"
      :modal="false"
      :append-to-body="true"
      :visible.sync="dialogVisible"
      width="60%"
    >
      <div class="dialogContent">
        预计投产日期:{{ String(selectMission.date).replaceAll("/", "-") }}
        <div style="display: inline-block; margin-left: 40px">
          实际投产日期:<el-date-picker
            v-model="fireDate"
            type="date"
            align="center"
            placeholder="选择日期"
            style="margin-left: 16px"
          >
          </el-date-picker>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="isFired">保 存</el-button>
      </span></el-dialog
    >
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import fileTool from "@/utils/fileTool.js";
import { formatDateTime } from "@/utils/validate.js";
import { DOC_DIR } from "@/utils/constans";
import ToolTitle from "../components/toolTitle";
const fs = require("fs");
const path = require("path");
export default {
  name: "countWorkTime",
  components: {
    ToolTitle,
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [
          {
            text: "最近一周",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近一个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
              picker.$emit("pick", [start, end]);
            },
          },
          {
            text: "最近三个月",
            onClick(picker) {
              const end = new Date();
              const start = new Date();
              start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
              picker.$emit("pick", [start, end]);
            },
          },
        ],
      },
      dateRange: "", //时间选择范围
      settings: {},
      workloads: "", //统计的工作量
      tableData: [],
      otherTableData: [],
      dialogVisible: false,
      selectMission: {},
      selectIndex: 0,
      fireDate: "",
    };
  },
  computed: {
    ...mapGetters(["taskArray"]),
  },
  mounted() {
    //从本地配置中读取上次选择的时间范围
    this.settings = fileTool.readSettingFile();
    this.dateRange = this.settings.tools.dateRange
      ? this.settings.tools.dateRange
      : [new Date(), new Date()];
    this.workloads = "";
  },
  methods: {
    async query() {
      if (!this.dateRange) {
        this.$message({
          type: "warning",
          message: "请选择时间范围!",
          offset: 280,
        });
        return;
      }
      //将时间范围记录本地
      this.settings.tools.dateRange = this.dateRange;
      fileTool.writeSettingFile(this.settings);
      //遍历本地文件,如果fireTimeReal在选择范围内的,记入tableData
      //如果fireTimeReal为空,但fireTime在范围内的,记入otherTableData
      //读取全部目录
      this.tableData = [];
      this.otherTableData = [];
      this.workloads = 0;
      const dateDir = fs.readdirSync(DOC_DIR);
      dateDir.forEach((filename) => {
        if (filename != "global") {
          const file = fs.readdirSync(path.join(DOC_DIR, filename));
          file.forEach((item) => {
            fs.readFile(
              path.join(DOC_DIR, filename, item, "mission.txt"),
              "utf-8",
              (err, data) => {
                const taskObj = JSON.parse(data);
                if (taskObj.fireTimeReal) {
                  if (
                    this.isBetweenDate(taskObj.fireTimeReal, this.dateRange)
                  ) {
                    this.tableData.push({
                      fileDir: taskObj.fileDir,
                      date: taskObj.fireTimeReal,
                      missionNo: taskObj.demandNo,
                      missionName: taskObj.taskName,
                      workload: taskObj.workload,
                    });
                    this.workloads =
                      (this.workloads * 1000 + taskObj.workload * 1000) / 1000;
                  }
                } else {
                  if (this.isBetweenDate(taskObj.fireTime, this.dateRange)) {
                    this.otherTableData.push({
                      fileDir: taskObj.fileDir,
                      date: taskObj.fireTime,
                      missionNo: taskObj.demandNo,
                      missionName: taskObj.taskName,
                      workload: taskObj.workload,
                    });
                  }
                }
              }
            );
          });
          this.tableData = this.tableData.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
          this.otherTableData = this.otherTableData.sort((a, b) => {
            return new Date(a.date) - new Date(b.date);
          });
        }
      });
    },
    deleteRow(index, rows) {
      this.workloads =
        (this.workloads * 1000 - rows[index].workload * 1000) / 1000;
      rows.splice(index, 1);
    },
    showTimeDialog(index, rows) {
      this.fireDate = "";
      this.selectIndex = index;
      this.selectMission = rows[index];
      this.dialogVisible = true;
    },
    isFired() {
      fileTool.setfireTimeReal(
        this.selectMission,
        formatDateTime(this.fireDate).replaceAll("-", "/")
      );
      this.otherTableData[this.selectIndex].date = formatDateTime(
        this.fireDate
      );
      this.addCount(this.selectIndex, this.otherTableData);
      this.dialogVisible = false;
    },
    addCount(index, rows) {
      this.tableData.push(rows[index]);
      this.workloads =
        (this.workloads * 1000 + rows[index].workload * 1000) / 1000;
      rows.splice(index, 1);
    },
    enterClick({ row, column }) {
      if (column.label === "工作量") {
        this.$set(row, "isOK", false);
      }
    },
    editWorkload(row, index) {
      this.$set(row, "isOK", true);
    },
    editInput(value, row) {
      row.workload =
        ("" + value) // 第一步：转成字符串
          .replace(/[^\d^\.]+/g, "") // 第二步：把不是数字，不是小数点的过滤掉
          .replace(/^0+(\d)/, "$1") // 第三步：第一位0开头，0后面为数字，则过滤掉，取后面的数字
          .replace(/^\./, "0.") // 第四步：如果输入的第一位为小数点，则替换成 0. 实现自动补全
          .match(/^\d*(\.?\d{0,1})/g)[0] || ""; // 第五步：最终匹配得到结果 以数字开头，只有一个小数点，而且小数点后面只能有0到2位小数
    },
    editWorkloadSave(row, index) {
      //如果vuex里面有,更新vuex
      let taskIdx = this.taskArray.findIndex((item) => {
        if (item.taskName == row.missionName) {
          return true;
        }
      });
      row.workload = ("" + row.workload) // 第一步：转成字符串
        .replace(/\.$/g, ""); // 第二步：把最后一位是小数点去掉
      if (taskIdx != -1) this.taskArray[taskIdx].workload = row.workload;
      this.$set(row, "isOK", false);
      fileTool.setWorkload(row.fileDir, row.workload);
    },
    isBetweenDate(date, dateRange) {
      const dateObj = new Date(date);
      return (
        dateObj >= new Date(dateRange[0]) && dateObj <= new Date(dateRange[1])
      );
    },
  },
};
</script>

<style lang="scss" scoped>
.tools-container {
  height: 875px;
  padding: 24px;
  border: 2px;
  background-color: #ffffff;
  font-family: PingFangSC-Regular;
  font-size: 20px;
  color: rgba(0, 0, 0, 0.65);
  letter-spacing: 0;
  font-weight: 400;
}

.set-timeRage {
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  background: #f3f9ff;
  border-radius: 4px;
  margin: 16px 0;
  padding: 32px 24px;
}

::v-deep .el-range-separator {
  padding: 0;
}

.button-query {
  display: inline-block;
  cursor: pointer;
  height: 32px;
  width: 60px;
  padding: 5px 16px;
  font-family: PingFangSC-Regular;
  font-size: 14px;
  color: #ffffff;
  line-height: 22px;
  font-weight: 400;
  background: #005bd2;
  border-radius: 2px;
}
.maxHeight {
  height: 700px;
  overflow-y: scroll;
}
.showMessage {
  width: 100%;
  background: #f3f9ff;
  border-radius: 4px;
  padding: 32px 24px;
}

.missionList {
  margin: 20px 0 12px;
}

.test {
  height: 800px;
}
</style>
