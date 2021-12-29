<template>
  <div id="app">

    <el-card class="box-card">
      <el-row :gutter="10" style="padding-top: 20px;padding-bottom: 20px; ">
        <el-col :md="6" style="margin-left:0;margin-right:0" class="flex1">
          <el-popover
            placement="bottom-start"
            title=""
            width="600"
            trigger="manual"
            v-model="visible1">

            <el-row :gutter="10" style="width: 600px;" class="center1">
              <el-col :md="10" style="width: 600px;">
                <div  style="width: 600px;height: 500px">
                  <div style="width: 600px;height: 500px;" class="bigBackground"></div>
                  <!--    标题、上月、下月-->
                  <div class="width-100-per layout-side" style="height: 10%;">
                    <div class="cursor-pointer layout-center leftRightBtn" @click="prevMonth" style="font-size: 30px">&lt;</div>
                    <div class="height-100-per layout-center-top width-40-per">
                      <div class="layout-center">
                        <span style="font-weight: bold;padding-top: 8px;font-size: 20px">{{`${newDate.split('-')[0]}年${newDate.split('-')[1]}月`}}</span>
                      </div>
                    </div>
                    <div class="cursor-pointer layout-center leftRightBtn" @click="nextMonth" style="font-size: 30px">&gt;</div>
                  </div>
                  <!--    日期表-->
                  <div class="width-100-per layout-left-top padding-10-px" style="height: calc(100% - 10%)">
                    <!--      星期-->
                    <div class="width-100-per layout-left-top" style="height: 10%">
                      <div style="width: calc(100% / 7);" class="layout-center" v-for="(i,index) in weekArr" :key="index + i">{{i}}
                      </div>
                    </div>
                    <!--      日期-->
                    <div class="width-100-per layout-left-top" style="height: 90%">
                      <template v-for="(i,index) in dateArr">
                        <div class="layout-center tableCol" :style="{height: 'calc(100% / '+maxTableRow+')'}" :key="index"
                             :class="{'topBorderNone':index<7,'rightBorderNone':(index+8)%7===0}" @click="getOneDayPlan(i)? OneDayPlanDialogVisible = true : OneDayPlanDialogVisible = false">
                          <!--小圆圈背景 -->
                          <div v-if="!showDayStatus(i)" class="miniBackground"></div>
                          <!--   判断是否需要设置非本月日期的背景 -->
                          <div v-if="showDayStatus(i)" class="checkBadge" ></div>
                          <!--                  签过到的日期-->
                          <div v-else  :class="clockInYesMethod(i)" style=""></div>
                          <div :title="i" class="width-100-per height-100-per layout-center " :class="[{'checked':i===thisDate}]" style="cursor:pointer;position: relative">
                            <span style="font-size: 20px;"  >{{i === '' ? '' : Number(i.split('-')[2])}}</span>
                          </div>
                        </div>
                      </template>
                      <el-dialog
                        title="当日规划"
                        :visible.sync="OneDayPlanDialogVisible"
                        :modal-append-to-body='false'
                        width="50%"
                      >
                    <span>
                      <mission-planning-one-day-plan
                        ref="OneDayPlanDialog"
                      ></mission-planning-one-day-plan>
                    </span>
                        <span slot="footer" class="dialog-footer">
                  <el-button type="primary" @click="OneDayPlanDialogVisible =false;">确 定</el-button>
                  </span>
                      </el-dialog>
                    </div>
                  </div>
                </div>
              </el-col>
            </el-row>

            <el-button type="primary" slot="reference" @click="visible1 = !visible1" class="clickInButton">回忆往昔</el-button>
          </el-popover>
        </el-col>

        <el-col :md="6" style="margin-left:0;margin-right:0;float: right" class="">
          <el-button type="primary" @click="dialogVisible = true" class="clickInButton">每日规划</el-button>
        </el-col>
        <el-dialog
          title="每日规划"
          :visible.sync="dialogVisible"
          :modal-append-to-body='false'
          width="70%"
          >
            <span>
              <!--                :before-close="handleClose"-->
              <mission-planning
                @pushTrueMission="pushTrueMission"
                @withdrawMission="withdrawMission"
              ></mission-planning>
            </span>
          <span slot="footer" class="dialog-footer">

              <el-tooltip  class="item" effect="dark" content="暂时提交以免刷新网页后丢失，最终提交需要再点击打卡" placement="top">
                <el-button style="width: 70px;height: 40px" type="primary" @click="dialogVisible =false;putPlanToRedis()">确 定</el-button>
              </el-tooltip>
            </span>
        </el-dialog>
      </el-row>

      <el-row :gutter="10" style="padding-top: 10px;padding-bottom: 10px; ">
        <el-col :md="6" style="margin-left:0;margin-right:100px" class="flex1">
          <el-popover
            placement="bottom-start"
            title="所有人的打卡排名"
            width="550"
            trigger="manual"
            v-model="visible2">

            <div class="block">
              <span class="demonstration">选择月份进行查询</span>
              <el-date-picker
                v-model="monthValue"
                align="center"
                type="month"
                @change="getAllUserClockInCounts($event)"
                value-format="yyyy-MM-dd"
                placeholder="选择月">
              </el-date-picker>
            </div>

            <div v-for="(item,index) in allUserClockInCountsArr" >
              <el-progress-clock-in
                :percentage="item.counts"
                :percentageAllDate="percentageAllDate"
                :status="index"
                :uname="item.nickName"
              style="margin: 7px 0">
              </el-progress-clock-in>
            </div>
<!--            {{showCurrentMonthAllUserClockInCounts()}}-->
            <el-button type="primary" slot="reference"
                       @click="visible2 = !visible2;isOpenOperatorMethod(new Date(new Date().getFullYear(),new Date().getMonth(),1))"
                       class="clickInButton">日积月累</el-button>
          </el-popover>
        </el-col>
        <el-col  :md="6" style="margin-left:100px;margin-right:0;float: right" >
  <!--              <dialog :dialog-visible="dialogVisible"></dialog>-->
          <el-button type="primary" @click="submitContent()" class="clickInButton">今日打卡</el-button>
        </el-col>

      </el-row>
      <el-popover
        placement="bottom-start"
        title="---学习记录---"
        width="550"
        trigger="manual"
        v-model="visible3">
<!--        <my-datepicker
          :date="startTime"
          :option="option"
          :limit="limit"
          id="select_date"
          date/>-->

          <el-progress-clock-in3
            ref="son"
            style="margin: 7px 0">
          </el-progress-clock-in3>
<!--        :learningRecords="oneDayStudyRecords.learningRecords"-->
<!--        :learningDurationTime="oneDayStudyRecords.learningDurationTime"-->
<!--        :createDate="oneDayStudyRecords.createDate"-->
<!--        :key="oneDayStudyRecords.id"-->

      </el-popover>
      <img  src="http://static.ytte.top/WebSite.png" class="avatar-clock-in" @click="visible3 = !visible3;getStudyRecords();">
    </el-card>

    <el-row :gutter="10" style="min-width: 500px;max-width: 600px">
      <div v-if="loadingPage">
        <pagination
        :allClockInDataArr="allClockInArr">
        </pagination>
      </div>
    </el-row>

  </div>

</template>

<script>
// import myDatepicker from 'vue-datepicker/vue-datepicker-es6.vue';
import moment from 'moment'
import {
  getAllClockIn,
  pushClockInContent,
  getIndividualClockIn,
  getOneDayPlan,
  putPlanToRedis,
  queryPlanCache,
  getAllUserTheMonthClockInCounts,
  getCurrentMonthAllUserClockInCounts, getOneDayStudyRecords
} from '@/api/clockin'
import Pagination  from '@/components/pagination/Pagination'
import Dialog from '@/components/clockIn/missionPlanning/Dialog';
import MissionPlanning from '@/components/clockIn/missionPlanning/MissionPlanning';
import MissionPlanningOneDayPlan from '@/components/clockIn/missionPlanning/MissionPlanningOneDayPlan'
import elProgressClockIn from '@/components/clockIn/elProgressClockIn';
import {getCountDays} from "@/utils/time";
import ElProgressClockIn3 from "@/components/clockIn/ElProgressClockIn3";

export default {
  name: "ClockIn",
  components: {
    Pagination,
    Dialog,
    MissionPlanning,
    MissionPlanningOneDayPlan,
    elProgressClockIn,
    ElProgressClockIn3,
    // myDatepicker
  },

  data() {
    return {
      percentageAllDate: 0,
      monthValue: '',
      currentMonthDays: 0,
      isOpenOperator: true,
      progressStatus:[" ","success","warning","exception"],
      allUserClockInCountsArr: [{
        nickName:"",
        counts: 0
      }],

      stamp: {
        nickName: '',
        counts: 0
      },
      isClock: true,
      visible1: false, //按钮弹窗
      visible2: false, //按钮弹窗
      visible3: false, //按钮弹窗
      isDisabled: 'disabled',
      userId: this.$store.state.id,
      dialogVisible: false,
      OneDayPlanDialogVisible : false,

      allClockInArr: [],
      loadingPage: false,
      isChecked: false,
      thisDate: moment().format('YYYY-MM-DD'),//当前时间
      thisMonthDays: '',//当月天数
      thisDateWeek: '',//当月第一天是星期几
      newDate: '',//标题展示时间
      dateArr: [],//日期数组，有则填日期，无则填‘’
      weekArr: ['日','一', '二', '三', '四', '五', '六'],
      checkArr: [],//已经打过卡的数组，由后端返回，这里写死
      content: [],//个人打卡内容
      contentCache: [],
      oneDayTimeArr: [],
      maxTableRow: 0,//列固定7列，这是当月最大行数
      // taskIndex:0,
    }
  },
  mounted() {
    this.calendarTable(this.thisDate);

  },

  created() {
    this.getIndividualClockInMethod();
  },
  computed: {

    //判断当天状态
    showDayStatus() {
      const that = this;
      return function (value) {
        if (!value){
          let flag = false;
          for (let ca of that.checkArr) {
            if ((ca).indexOf(value)>-1) {
              flag = true
            }
          }
          return flag
        }
      }
    },
    clockInYesMethod:function () {
      const that = this;
      that.isChecked = false;
      return function (value) {
        if (value !== null) {
          for (let ca of that.checkArr) {
            if ((ca).indexOf(value) > -1) {
              /*              that.isChecked = true;*/
              return 'clockInYes';
            }
          }return '11';
        }return '11';
      }
    },
  },
  methods: {
    getStudyRecords() {
      if (this.isClock) {
        this.$nextTick(() => {
          this.isClock = false;
          this.$refs.son.getOneDayStudyRecords(this.dealTime(3));
          this.$refs.son.initMonthsStudyRecords();
        })
      } else {
        this.isClock = true;
      }
    },

    //  今天昨天明天时间处理 v==3为昨天。v==6为今天。v==9为明天
    dealTime(v){
      let b = 24*60*60*1000   //一天的时间
      let day = new Date();  //当天的时间

      v === 3 ? day.setTime(day.getTime()-b) : v === 6 ?
        day.setTime(day.getTime()) : day.setTime(day.getTime() + b);

      let dayMon=(day.getMonth() + 1) >= 10 ? day.getMonth()+1 : '0' + (day.getMonth() + 1)
      let dayDat=(day.getDate() + 1) >= 10 ? day.getDate() : '0' + (day.getDate())

      let s = day.getFullYear() + "-" + dayMon + "-" + dayDat;
      return s;
    },
    showCurrentMonthAllUserClockInCounts() {
      this.currentMonthDays = getCountDays();
      let myDate = new Date();
      let currentMonthCurrentDay= myDate.getDate();
      getCurrentMonthAllUserClockInCounts((data) => {

      });
      return this.currentMonthDays
    },
    percentageSinceBegin(value) {
      let chooseYear = new Date(value).getFullYear();
      let chooseMonth = new Date(value).getMonth()+1;

      let thisYear =new Date().getFullYear();
      let thisMonth = new Date().getMonth()+1;

      let nDays;
      if (chooseYear < thisYear ) {
        nDays = new Date(chooseYear, chooseMonth, 0).getDate();
      } else if (chooseYear > thisYear ) {
        nDays = 0;
      }else if (chooseYear === thisYear ) {
        if (chooseMonth < thisMonth) {
          nDays = new Date(chooseYear, chooseMonth, 0).getDate();
        } else if (chooseMonth > thisMonth) {
          nDays = 0;
        } else if (chooseMonth === thisMonth) {
          nDays = new Date().getDate();
        }
      }
      this.percentageAllDate = nDays;
      return nDays;
    },
    isOpenOperatorMethod(value) {
      let that = this;
      //阻止日积月累按钮第二次点击重复发送后端请求
      if (!that.isOpenOperator) {
        that.isOpenOperator = true;
        return null;
      } else {
        that.isOpenOperator = false;
      }
      this.getAllUserClockInCounts(value);
    },
    getAllUserClockInCounts(value) {
      let that = this;

      let chooseYear =new Date(value).getFullYear();
      let chooseMonth = new Date(value).getMonth()+1;
      let chooseDay = 1;

      if (chooseMonth >= 12) {
        chooseYear += 1;
        chooseMonth = 1;
      } else {
        chooseMonth += 1;
      }

      let monthEnd;
      if (chooseMonth < 10) {
        monthEnd = chooseYear + "-0" + chooseMonth + "-0" + chooseDay;
      } else {
        monthEnd = chooseYear + "-" + chooseMonth + "-0" + chooseDay;
      }

      getAllUserTheMonthClockInCounts(value,monthEnd).then(data => {
        if (data.success) {
          that.allUserClockInCountsArr=data.data;

          that.stamp.nickName='总天数'
          that.stamp.counts=that.percentageSinceBegin(value)

          that.allUserClockInCountsArr.unshift(that.stamp)
          console.log(that.allUserClockInCountsArr);


        } else {
          that.$message({type: 'error', message: data.message, showClose: true})
        }
      }).catch(error => {
        if (error==="无打卡记录") {
          that.$message({type: 'warning', message: error, showClose: true});
        } else if (error !== 'error') {
          that.$message({type: 'error', message: error, showClose: true});
        }
      });
    },

    putPlanToRedis() {
      let that=this
      if (this.$store.state.token.length === 0) {
        return  that.$message({type: 'error', message: '请先登录', showClose: true})
      }

      if (that.contentCache.length === 0) {
        return that.$message({type: 'error', message: '内容为空不能暂存哦~~~', showClose: true})
      }
      putPlanToRedis(that.contentCache,this.$store.state.token).then(data => {
        if (data.success) {
          that.$message({type: 'success', message: '暂存成功', showClose: true});
        } else {
          that.$message({type: 'error', message: data.message, showClose: true})
        }
      }).catch(error => {
        if (error !== 'error') {

          that.$message({type: 'error', message: error, showClose: true})
        }
      });
    },
    pushTrueMission(value) {
      if (this.contentCache === null) {
        this.contentCache = value;
      }
      this.contentCache.push(value);

    },

    withdrawMission(value) {
      let _contentCache;
      _contentCache = this.contentCache;
      _contentCache.forEach(function (item, index) {
        if (item.text === value.text) {
          _contentCache.splice(index, 1);
        }
      })

    },

    getAllClockInMethod: function () {
      let that = this
      getAllClockIn().then(data => {
        if (data.success) {
          that.allClockInArr = data.data;
          that.loadingPage = true;

          that.$message({type: 'success', message: '全部打卡查询成功', showClose: true});
        } else {
          that.$message({type: 'error', message: data.message, showClose: true})
        }
      }).catch(error => {
        if (error !== 'error') {

          that.$message({type: 'error', message: error, showClose: true})
        }
      });
    },

    submitContent(textData) {
      let that = this

      if (that.contentCache.length < 1) {
        this.$message({
          message: '您的计划为空 或 未点击规划确定按钮(*^▽^*)',
          type: 'warning'
        });
        return null;
      }

      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, "您确定要提交每日规划并打卡吗？"),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';

            that.contentCache.forEach(function (item, index) {
              that.content.push(item.text);
            });

            pushClockInContent(that.content, this.$store.state.token).then(data => {
              if (data.success) {
                that.$message({type: 'success', message: '打卡成功', showClose: true});
                this.$router.go(0)
              } else {
                that.$message({type: 'error', message: data.message, showClose: true})
              }
            }).catch(error => {
              if (error !== 'error') {

                that.$message({type: 'error', message: error, showClose: true})
              }
            });
            this.content = [];

            setTimeout(() => {
              done();
              setTimeout(() => {
                instance.confirmButtonLoading = false;
              }, 300);
            }, 3000);
          } else {
            done();
          }
        }
      });
    },

    getOneDayPlan(value) {
      let that = this;

      if (value === "") {
        that.$message({type: "warning", message: '日期不能为空哦！(*^▽^*)', showClose: true});
        return false;
      }

      for (let ca of that.checkArr) {

        if ((ca).indexOf(value) > -1) {

          getOneDayPlan(this.$store.state.token, value).then(data => {
            if (data.success) {
              that.oneDayTimeArr = data.data.content;
              this.$refs.OneDayPlanDialog.getOneDayTimeArr(that.oneDayTimeArr);
            } else {
              that.$message({type: "error", message: data.message, showClose: true});
            }
          }).catch(error => {
            if (error !== "error") {
              that.$message({type: 'error', message: error, showClose: true})
            }
          });
          return true;
        }
      }that.$message({type: "warning", message: '当天没有打卡哦！(*^▽^*)', showClose: true});
      return false;
    },

    getIndividualClockInMethod() {
      let that = this
      getIndividualClockIn(this.$store.state.token).then(data => {
        if (data.success) {
          // that.checkArr = data.data
          for (let ca of data.data) {
            ca.trim('"')
            that.checkArr.push(ca);
          }
          that.getAllClockInMethod();
        } else {
          that.$message({type: 'error', message: data.message, showClose: true})
        }

      }).catch(error => {
        if (error !== 'error') {
          that.$message({type: 'error', message: error, showClose: true})
        }
      })
    },

    //绘制日历表格
    calendarTable(date) {
      const that = this;
      that.dateArr = [];            //日期数组，有则填日期，无则填‘’
      that.newDate = date;          //标题展示时间
      let yearMonthDay = that.newDate.split('-');     // 当前年月日
      //当月天数
      that.thisMonthDays = moment(date).daysInMonth();
      //当月一号是星期几
      that.thisDateWeek = moment(date).date(1).weekday();
      let calendarArr = [];
      //往日历数组装每天的日期
      for (let i = 1; i < that.thisMonthDays + 1; i++) {
        calendarArr.push(yearMonthDay[0] + '-' + yearMonthDay[1] + '-' + (i < 10 ? '0' + i : i))
      }
      // 有当月一号是星期几根据规则往前面补空位
      for (let j = 0; j < that.thisDateWeek; j++) {
        calendarArr.unshift('')
      }
      // 表格列数固定为7列，获取最大行数
      let len = calendarArr.length;
      let arrRow = Math.ceil(len / 7);
      that.maxTableRow = arrRow;
      // 获取整个表格的格子个数，给后面多余的格子补空
      for (let k = 0; k < arrRow * 7 - len; k++) {
        calendarArr.push('')
      }
      that.dateArr = calendarArr;
    },

    //上个月
    prevMonth() {
      const that = this;
      let date = moment(that.newDate).subtract(1, 'months').format('YYYY-MM-DD');
      that.calendarTable(date)
    },

    // 下个月
    nextMonth() {
      const that = this;
      let date = moment(that.newDate).add(1, 'months').format('YYYY-MM-DD');
      that.calendarTable(date)
    },

  }
}
</script>

<style>
/*.el-dialog__header, .el-dialog__body, .el-dialog__footer{*/
/*  max-width: 600px !important;*/
/*}*/
.is-selected {
  color: #1989FA;
}
.el-button--primary {
  background-color: #554ff8;
}
.clickInButton {
  border: 10px;
padding: 10px;
font-size: 20px;
  margin: 10px;
}
.flex1 {
  flex-direction:row ;
  flex-wrap: wrap;
  justify-content: space-around;
  align-items:flex-start;
  align-content:stretch;
}
.flex{
  box-sizing: border-box;

  display: -webkit-box;
  -webkit-box-pack: start;
  -webkit-box-align: start;

  display: -webkit-flex;
  -webkit-justify-content: space-between;
  -webkit-align-items: top;

  display: flex;
  justify-content: space-between;
  align-items: top;
  flex-flow:row wrap
}
.flex>div{
  margin:10px;
  padding:20px;
  width:25%;
  min-width:300px;
  border: 1px solid #eee;
  border-radius: 2px;
  position: relative;
}
.flex>div>span{
  position: absolute;
  left:0px;
  top:0px;
  padding:5px 10px;
  font-family: "PingFang SC","Hiragino Sans GB","STHeiti","Microsoft YaHei","WenQuanYi Micro Hei",sans-serif;
  font-size:10px;
  border-radius:0 0 2px 0;
  background:#ea6151;
  color:#fff;
}
.flex>div>input{
  box-sizing: border-box;
  width:100%;
  margin-top:20px;
  border-radius: 2px;
  border:1px solid #dedede;
  padding:10px;
  font-size: 16px;
  background:url(data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBzdGFuZGFsb25lPSJubyI/PjwhRE9DVFlQRSBzdmcgUFVCTElDICItLy9XM0MvL0RURCBTVkcgMS4xLy9FTiIgImh0dHA6Ly93d3cudzMub3JnL0dyYXBoaWNzL1NWRy8xLjEvRFREL3N2ZzExLmR0ZCI+PHN2ZyB3aWR0aD0iMTYiIGhlaWdodD0iMTYiIHZpZXdCb3g9IjAgMCAxNiAxNiIgdmVyc2lvbj0iMS4xIiB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbG5zOnhsaW5rPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5L3hsaW5rIj48ZGVmcz48c3R5bGUgdHlwZT0idGV4dC9jc3MiPjwhW0NEQVRBWwpAZm9udC1mYWNlIHsgZm9udC1mYW1pbHk6IGlmb250OyBzcmM6IHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUuZW90PyNpZWZpeCIpIGZvcm1hdCgiZW1iZWRkZWQtb3BlbnR5cGUiKSwgdXJsKCIvL2F0LmFsaWNkbi5jb20vdC9mb250XzE0NDIzNzM4OTZfNDc1NDQ1NS53b2ZmIikgZm9ybWF0KCJ3b2ZmIiksIHVybCgiLy9hdC5hbGljZG4uY29tL3QvZm9udF8xNDQyMzczODk2XzQ3NTQ0NTUudHRmIikgZm9ybWF0KCJ0cnVldHlwZSIpLCB1cmwoIi8vYXQuYWxpY2RuLmNvbS90L2ZvbnRfMTQ0MjM3Mzg5Nl80NzU0NDU1LnN2ZyNpZm9udCIpIGZvcm1hdCgic3ZnIik7IH0KCl1dPjwvc3R5bGU+PC9kZWZzPjxnIGNsYXNzPSJ0cmFuc2Zvcm0tZ3JvdXAiPjxnIHRyYW5zZm9ybT0ic2NhbGUoMC4wMTU2MjUsIDAuMDE1NjI1KSI+PHBhdGggZD0iTTcxMS4zMDYyIDI5MC42OTcyYzI0LjI4MjEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTU0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMjYgMC00My45ODggMTkuNzI4NC00My45ODggNDQuMDUzNXYyMDAuMTA0OTZDNjY3LjMxODMgMjcwLjk5MDMgNjg3LjAwMzYgMjkwLjY5NzIgNzExLjMwNjIgMjkwLjY5NzJ6TTYyMy40ODA4IDExMy40MjAzSDQwMC43NjQ5Mjh2NjYuNTEzOTJoMjIyLjcxNTkwNDAwMDAwMDAyVjExMy40MjAyODh6TTg4NC4wNTMgMTEzLjQyMDNoLTgyLjc3NDAxNnY2Ni4xNDUyOGg4NS45NDAyMjRjMjUuMjc4NSAwIDQ2LjYxMTUgMjEuMzc2IDQ2LjYxMTUgNDYuNjc3djE1My45Mjc2OEg5MC40Mzg2NTYwMDAwMDAwMXYtMTUzLjkyNzY4YzAtMjUuMyAyMS4zMzMtNDYuNjc3IDQ2LjYxMTUtNDYuNjc3aDg2LjUwMzQyNFYxMTMuNDIwMjg4aC04Mi42NDI5NDRjLTY0LjA4NiAwLTExNi41MDc2IDUyLjUwODctMTE2LjUwNzYgMTE2LjcwMzJ2Njc2LjgwMTUzNTk5OTk5OTljMCA2NC4xNzQxIDUwLjQ5MTQgMTE2LjY4MDcgMTE0LjU3NzQgMTE2LjY4MDdIODg0LjA1Mjk5MmM2NC4wNjI1IDAgMTE2LjUwNjYtNTIuNTA2NiAxMTYuNTA2Ni0xMTYuNjgwN1YyMzAuMTIzNTE5OTk5OTk5OThDMTAwMC41NTk2IDE2NS45MjkgOTQ4LjExNDQgMTEzLjQyMDMgODg0LjA1MyAxMTMuNDIwM3pNOTMzLjgyOTYgOTEwLjM1MTRjMCAyNS4zLTIxLjMzMyA0Ni42NzYtNDYuNjExNSA0Ni42NzZIMTM3LjA1MDExMTk5OTk5OTk4Yy0yNS4yNzg1IDAtNDYuNjExNS0yMS4zNzYtNDYuNjExNS00Ni42NzZWNDQ2LjQ0NTU2OEg5MzMuODI5NjMyVjkxMC4zNTEzNnpNMjY3LjEwODQgNjQ2LjE4MTljMzYuODc3MyAwIDY2Ljc1MjUtMjkuOTM5NyA2Ni43NTI1LTY2Ljg4MTUgMC0zNi45MjI0LTI5Ljg3NTItNjYuODYxMS02Ni43NTI1LTY2Ljg2MTEtMzYuODU0OCAwLTY2Ljc1MjUgMjkuOTM5Ny02Ni43NTI1IDY2Ljg2MTFDMjAwLjM1NTggNjE2LjI0MjIgMjMwLjI1MjUgNjQ2LjE4MTkgMjY3LjEwODQgNjQ2LjE4MTl6TTUxMS41NDg0IDY0Ni4xODE5YzM2Ljg1NTggMCA2Ni43NTI1LTI5LjkzOTcgNjYuNzUyNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTU3LTY2Ljg2MTEtNjYuNzUyNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzQ0NC43OTU5IDYxNi4yNDIyIDQ3NC42NzExIDY0Ni4xODE5IDUxMS41NDg0IDY0Ni4xODE5ek0yNjUuOTE2NCA4OTAuNzA5YzM2Ljg3NzMgMCA2Ni43NTE1LTI5LjkzOTcgNjYuNzUxNS02Ni44NjExIDAtMzYuOTQyOC0yOS44NzQyLTY2Ljg4MjYtNjYuNzUxNS02Ni44ODI2LTM2Ljg1NTggMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44ODI2QzE5OS4xNjM5IDg2MC43NjkzIDIyOS4wNTk2IDg5MC43MDkgMjY1LjkxNjQgODkwLjcwOXpNNTExLjU0ODQgODkwLjcwOWMzNi44NTU4IDAgNjYuNzUyNS0yOS45Mzk3IDY2Ljc1MjUtNjYuODYxMSAwLTM2Ljk0MjgtMjkuODk1Ny02Ni44ODI2LTY2Ljc1MjUtNjYuODgyNi0zNi44NzczIDAtNjYuNzUyNSAyOS45Mzk3LTY2Ljc1MjUgNjYuODgyNkM0NDQuNzk1OSA4NjAuNzY5MyA0NzQuNjcxMSA4OTAuNzA5IDUxMS41NDg0IDg5MC43MDl6TTc1NS42NDEzIDY0Ni4xODE5YzM2Ljg1NjggMCA2Ni43NTM1LTI5LjkzOTcgNjYuNzUzNS02Ni44ODE1IDAtMzYuOTIyNC0yOS44OTY3LTY2Ljg2MTEtNjYuNzUzNS02Ni44NjExLTM2Ljg3NzMgMC02Ni43NTI1IDI5LjkzOTctNjYuNzUyNSA2Ni44NjExQzY4OC44ODk5IDYxNi4yNDIyIDcxOC43NjQgNjQ2LjE4MTkgNzU1LjY0MTMgNjQ2LjE4MTl6TTMxMS43MDM2IDI5MC42OTcyYzI0LjI4MTEgMCA0NS4zNzY1LTE5LjcwNjkgNDUuMzc2NS00NC4wMzJWNDYuNTYwMjU1OTk5OTk5OTk1YzAtMjQuMzI1MS0yMS4wOTQ0LTQ0LjA1MzUtNDUuMzc2NS00NC4wNTM1LTI0LjMwMTYgMC00My45ODkgMTkuNzI4NC00My45ODkgNDQuMDUzNXYyMDAuMTA0OTZDMjY3LjcxNDYgMjcwLjk5MDMgMjg3LjQwMiAyOTAuNjk3MiAzMTEuNzAzNiAyOTAuNjk3MnoiIGZpbGw9IiM1ZTdhODgiPjwvcGF0aD48L2c+PC9nPjwvc3ZnPg==) no-repeat 8px 10px;
  padding-left: 36px;
  color:#666;
}

/*transition*/
.fade-enter-active,
.fade-leave-active {
  transition: all .5s ease-in-out;
}
.fade-enter,.fade-leave-active{
  opacity: 0;
  transform: translateY(-10px);

}

*{
  margin: 0;
  padding: 0;
}

.left {
  float: left;
  width: 220px;
  background-color: green;
}

.right {
  background-color: orange;
  margin-left: 220px;
}

.center1 {

}

.me-view-comment-text {
  font-size: 16px;

}

/*------------------------------------------------------------------*/
.tableCol {
  width: calc(97%/ 7);
  border-top: 1px dashed rgb(203, 201, 163);
  border-right: 1px dashed rgb(203, 201, 163)
}

.leftRightBtn {
  width: 10%;
  height: 100%;
}

.leftRightBtn:hover, .tableCol:hover {
  color: black;
  background: #f8df8d;
  border-radius: 10%;
}

.checked {
  width: 90% !important;
  height: 90% !important;
  color: black;
  border-radius: 30%;
  cursor: pointer !important;
  background-color: rgba(116, 245, 116,0.7);
}
.clockInYes {
  width: 76px;
  height: 67px;
  color: black;
  border-radius: 10%;
  z-index: -1;
  position: absolute;
  background-color: rgba(181, 116, 245,0.5);
}
.checkBadge {
  width: 73px;
  height: 65px;
  border-radius: 10%;
  position: absolute;
  background-color: rgba(227, 219, 219, 0.5);

}

.topBorderNone {
  border-top: none !important;
}

.rightBorderNone {
  border-right: none !important;
}
/*布局部分*/
.layout-side {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: space-between;
  align-items: center;
}

.layout-center {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: center;
  align-items: center;
}

.layout-center-top {
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  justify-content: flex-start;
  align-items: center;
}

.layout-left-top {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  justify-content: flex-start;
  align-items: flex-start;
}

.width-100-per {
  width: 100%;
  /*text-align: center;*/
}
.height-100-per {
  height: 100%;
}

.bigBackground {
  background: url("http://static.ytte.top/1.png");
  background-size:cover;
  -webkit-filter:blur(1px);
  -ms-filter:blur(1px);
  filter:blur(1px);
  position:absolute;
  z-index: -3;
  border-radius:5%;
}
.miniBackground {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  position: absolute;
  z-index: 0;
  background-color: rgba(227, 219, 219, 0.5);
}

/*-------------------------------------------------------------------*/

body > .el-container {
  margin-bottom: 40px;
}

.el-container:nth-child(5) .el-aside,
.el-container:nth-child(6) .el-aside {
  line-height: 260px;
}

.el-container:nth-child(7) .el-aside {
  line-height: 320px;
}
.box-card {
  min-width: 550px;
  max-width: 600px;
  padding: 1px 20px;
}
.avatar-clock-in {
  position: absolute;
  width: 120px;
  height: 120px;
  display: block;
  margin: -145px 0px 0px 210px;
  border-radius: 50%;
}
.el-popover {
  border-radius: 7% !important;
}

</style>
