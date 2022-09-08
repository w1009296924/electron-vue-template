<template>
<div class="tools-container">
  <ToolTitle toolName="工作量统计" toolNotice="本数据参考自研发单元数据，可按实际情况进行修改。" />
  <div class="set-timeRage">
    时间范围
    <el-date-picker
      v-model="dataRange"
      ref="picker"
      type="daterange"
      style="margin:0 32px 0 16px"
      :picker-options="pickerOptions"
      range-separator="至"
      start-placeholder="开始日期"
      end-placeholder="结束日期" />
    <div class="button-query" @click="query">查询</div>
  </div>
  <div class="showMessage">
    <div>工作量: {{ workLoads }}</div>
    <div class="missionList">投产需求: </div>
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column fixed prop="date" label="投产日期" width="150" />
      <el-table-column prop="missionNo" label="需求编号" width="300" />
      <el-table-column prop="missionName" label="需求名称" width="500" />
      <el-table-column prop="workLoad" label="工作量" width="150">
        <template slot-scope="scope">
          <el-input ref="gain" size="mini" v-if="scope.row.isOK" @keyup.native.enter="enterClick(scope)" v-model="scope.row.workLoad" style="width:100%;hight:100%" />
          <span size="mini" v-else>{{scope.row.workLoad}}</span>
        </template>
      </el-table-column>
      <el-table-column label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="handleClick(scope.row)">{{ scope.row.isOK?'确认':'修改' }}</el-button>
          <el-button type="text" size="small" @click="deleteRow(scope.$index, tableData)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
  </div>
</div>
</template>

<script>
import {
  mapGetters
} from "vuex";
import ToolTitle from "../components/toolTitle"
export default {
  name: "countWorkTime",
  components: {
    ToolTitle
  },
  data() {
    return {
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      dataRange: '', //时间选择范围
      workLoads: '', //统计的工作量
      tableData: [{
        date: '2016-05-02',
        missionNo: 'UT-WLJR-2022-0575',
        missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
        workLoad: '0.5',
        isDelete: false
      }, {
        date: '2016-05-02',
        missionNo: 'UT-WLJR-2022-0575',
        missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
        workLoad: '0.3',
        isDelete: false
      }, {
        date: '2016-05-02',
        missionNo: 'UT-WLJR-2022-0575',
        missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
        workLoad: '0.8',
        isDelete: false
      }, {
        date: '2016-05-02',
        missionNo: 'UT-WLJR-2022-0575',
        missionName: 'UT-WLJR-2022-0575-手机银行财富待办微信通知及场景化开通提醒业务需求(结构性)-mspmk-cli-structdeposits',
        workLoad: '0.1',
        isDelete: false
      }]
    };
  },
  mounted() {
    //从本地配置中读取上次选择的时间范围
    this.dataRange = [new Date(), new Date()];
    this.workLoads = 3.5;
  },
  computed: {
    ...mapGetters(["name", "roles"]),
  },
  methods: {
    //todo 查询统计数据
    async query() {
      // this.tableData = await queryWorkLoad().data;
      this.workLoads = 4.2;
    },
    handleClick(row) {
      this.$set(row, 'isOK', !row.isOK);
      //TODO 修改数据
    },
    deleteRow(index, rows) {
      this.$confirm('此操作将永久删除该记录, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        rows.splice(index, 1);
        rows[index].isDelete = true;
        //todo 删除数据
        this.$message({
          type: 'success',
          message: '删除成功!'
        });
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '已取消删除'
        });
      });
    },
    enterClick({
      row,
      column
    }) {
      if (column.label === '工作量') {
        this.$set(row, 'isOK', false);
      }
    },
  }
};
</script>

<style lang="scss" scoped>
.tools-container {
  margin: 28px;
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
  background: #F3F9FF;
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
  color: #FFFFFF;
  line-height: 22px;
  font-weight: 400;
  background: #005BD2;
  border-radius: 2px;
}

.showMessage {
  width: 100%;
  height: 680px;
  background: #F3F9FF;
  border-radius: 4px;
  padding: 32px 24px;
  overflow-y: scroll;
}

.missionList {
  margin: 20px 0 12px;
}

.test {
  height: 800px;
}
</style>
