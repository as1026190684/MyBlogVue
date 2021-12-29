<template>
  <div class="el-form-item-style">
    <div class="block">
      <li>
        <a  target = "blank" href="https://wwu.lanzoui.com/iMSAywq4qdg">点击此处下载 学习记录客户端（密码:1234）</a>
      </li>
      <span class="demonstration">选择日期进行查询</span>
      <el-date-picker
        v-model="oneDay"
        align="right"
        type="date"
        placeholder="选择日期"
        :picker-options="pickerOptions"
        @change="getOneDayStudyRecords($event)"
        value-format="yyyy-MM-dd">
      </el-date-picker>
    </div>
    <div :key="reflashKey">
      <textarea class="el-input-clock-in"
                :value="'时间：'+oneDayStudyRecords.createDate+'\n'+'学习时长：'+oneDayStudyRecords.learningDurationTime+'\n'+'学习记录：\n'+oneDayStudyRecords.learningRecords" readonly>
        </textarea>
    </div>

    <div class="block">
      <span class="demonstration">选择月份进行查询</span>
      <el-date-picker
        v-model="value2"
        type="monthrange"
        align="center"
        unlink-panels
        range-separator="至"
        start-placeholder="开始月份"
        end-placeholder="结束月份"
        @change="getMonthsStudyRecords($event)"
        value-format="yyyy-MM-dd"
        :picker-options="pickerOptions1">
      </el-date-picker>

    </div>

    <echarts-interval :topTen="this.topTen"></echarts-interval>


  </div>
</template>

<script>

import {formatAll, getCountDays} from "@/utils/time";
import {getMonthsStudyRecords, getOneDayStudyRecords} from "@/api/clockin";
import EchartsInterval from "@/components/clockIn/EchartsInterval";
export default {
name: "ElProgressClockIn3",
  components: {
    EchartsInterval
  },

  data() {
    return {
      reflashKey: 0,
      reflashKey2: 0,
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        },
        shortcuts: [{
          text: '今天',
          onClick(picker) {
            picker.$emit('pick', new Date());
          }
        }, {
          text: '昨天',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24);
            picker.$emit('pick', date);
          }
        }, {
          text: '一周前',
          onClick(picker) {
            const date = new Date();
            date.setTime(date.getTime() - 3600 * 1000 * 24 * 7);
            picker.$emit('pick', date);
          }
        }]
      },
      oneDay: this.dealTime(3),
      oneDayStudyRecords: {
        id: "",
        learningRecords:"",
        learningDurationTime:"",
        createDate:"",
        userId:"",
      },
      monthsStudyRecords: [],


      pickerOptions1: {
        shortcuts: [{
          text: '本月',
          onClick(picker) {
            const end = new Date(new Date().getFullYear(), new Date().getMonth()+1);
            const start = new Date(new Date().getFullYear(), new Date().getMonth());
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '今年至今',
          onClick(picker) {
            const end = new Date();
            const start = new Date(new Date().getFullYear(), 0);
            picker.$emit('pick', [start, end]);
          }
        }, {
          text: '最近六个月',
          onClick(picker) {
            const end = new Date();
            const start = new Date();
            start.setMonth(start.getMonth() - 6);
            picker.$emit('pick', [start, end]);
          }
        }]
      },
      value2: '',
      topTen:{
        xAxisData: [],
        yAxisData: [],
      },

      colorArr: [
        '(32, 200, 222)',
        '(9, 233, 128)',
        '(222, 165, 32)',
        '(165, 32, 222)'
      ],

    };
  },
  props: {

  },
  computed: {
    around() {
      const length = this.colorArr.length;
      if (this.status > length-1) {
        let i = status % (length-1);
        return i;
      } else {
        return this.status;
      }
    },
    percentage365(){
      let time1 = Date.parse(new Date('2021-11-1'));
      let time2 = Date.parse(new Date());
      let nDays = Math.abs(parseInt((time2 - time1) / 1000 / 3600 / 24));
      let i = this.percentage / nDays * 100;
      return i
    }
  },
  mounted() {


  },
  created() {

  },
  methods:{

    initMonthsStudyRecords() {
      const end = new Date(new Date().getFullYear(), new Date().getMonth()+1);
      const start = new Date(new Date().getFullYear(), new Date().getMonth());

      console.log(start.format("yyyy-MM-dd"),end.format("yyyy-MM-dd"))
      const array=[start.format("yyyy-MM-dd"),end.format("yyyy-MM-dd")];
      this.getMonthsStudyRecords(array);
    },
    getMonthsStudyRecords(value) {
      let that = this;
      if (this.value2 !== "") {
        value=this.value2;
      }
      getMonthsStudyRecords(this.$store.state.token, value).then(data => {
        if (data.success) {
          that.monthsStudyRecords = data.data;
          that.monthsStudyRecords.forEach(function(value, key, iterable) {
            that.monthsStudyRecords[key].createDate = value.createDate.substring(0, 10);
            that.monthsStudyRecords[key].learningDurationTime=(value.learningDurationTime/60.0/60.0).toFixed(4)
          });

          that.monthsHandle(value);
          that.studyRecordsHandle(value);

          that.reflashKey++;
        } else {
          that.$message({type: 'error', message: data.message, showClose: true});
        }
      }).catch(error => {
         if (error !== null) {
          that.$message({type: 'error', message: error.toString().substring(0,10), showClose: true});
        } else {
          that.$message({type: 'error', message: "前端数据处理错误", showClose: true});
        }
      });
    },
    studyRecordsHandle(value) {
      let that = this;
      let yAxisDataAgentArr = [];
      that.topTen.xAxisData.forEach(function(value1, key1, iterable1) {
        that.monthsStudyRecords.forEach(function(value2, key2, iterable2) {
          if (value1 === value2.createDate&& new Date(value1)<=new Date(value2.createDate)) {
            yAxisDataAgentArr.push(that.monthsStudyRecords[key2].learningDurationTime)
          }
        });
        if (!yAxisDataAgentArr[key1]&& new Date(value1)<=new Date()) {
          yAxisDataAgentArr[key1] = 0;
        }
      });
      that.topTen.yAxisData = yAxisDataAgentArr;

    },
    monthsHandle(value) {
      let sTime = value[0];
      let eTime = value[1];
      //初始化日期列表，数组
      let diffdate = [];
      let i = 0;
      //开始日期小于等于结束日期,并循环
      while (sTime <= eTime) {
        diffdate[i] = sTime;

        //获取开始日期时间戳
        let stime_ts = new Date(sTime).getTime();
        // console.log('当前日期：' + sTime + '当前时间戳：' + stime_ts);

        //增加一天时间戳后的日期
        let next_date = stime_ts + (24 * 60 * 60 * 1000);

        //拼接年月日，这里的月份会返回（0-11），所以要+1
        let next_dates_y = new Date(next_date).getFullYear() + '-';
        let next_dates_m = (new Date(next_date).getMonth() + 1 < 10) ? '0' + (new Date(next_date).getMonth() + 1) + '-' : (new Date(next_date).getMonth() + 1) + '-';
        let next_dates_d = (new Date(next_date).getDate() < 10) ? '0' + new Date(next_date).getDate() : new Date(next_date).getDate();

        sTime = next_dates_y + next_dates_m + next_dates_d;
        //增加数组key
        i++;
      }
      this.reflashKey2++;
      this.topTen.xAxisData = diffdate
  },

    getOneDayStudyRecords(value) {
      let that = this;
        getOneDayStudyRecords(this.$store.state.token, value).then(data => {
          if (data.success) {
            that.oneDayStudyRecords = data.data;

            that.reflashKey++;
          } else {
            that.$message({type: 'error', message: data.message, showClose: true})
          }
        }).catch(error => {
          if (error.indexOf("数据为空")!==-1) {
            that.$message({type: 'warning', message: error, showClose: true});
          } else {
            that.$message({type: 'error', message: error, showClose: true});
          }
        });

    },

    //  今天昨天明天时间处理 v==3为昨天。v==6为今天。v==9为明天
    dealTime(v){
      let b = 24*60*60*1000   //一天的时间
      let day = new Date();  //当天的时间

      v == 3 ? day.setTime(day.getTime()-b) : v == 6 ?
        day.setTime(day.getTime()) : day.setTime(day.getTime() + b);

      let dayMon=(day.getMonth() + 1) >= 10 ? day.getMonth()+1 : '0' + (day.getMonth() + 1)
      let dayDat=(day.getDate() + 1) >= 10 ? day.getDate() : '0' + (day.getDate())

      let s = day.getFullYear() + "-" + dayMon + "-" + dayDat;
      return s;
    },
  }
}

</script>

<style scoped>
.el-progress-clock-in-div {
  width: 86%;
  height: 30px;
  background-color: rgba(238, 221, 221, 0.5);
  border-radius: 20px;
}
.el-progress-clock-in-div div {
  /*background-color: rgb(146, 32, 222);*/
  border-radius: 30px;
  height: 30px;
}
.el-form-item-style {
  position: relative;
  width: 500px;
  height: auto;
  padding-left:25px ;
  margin:20px auto;
}
.el-input-clock-in {
  min-height: 150px ;
  width: 100%;
  font-size: 16px !important;
}
.text-left {
  position: absolute;
  right: 500px;
  top: 5px;
  font-size: 14px;
  color: #222;
  line-height: 18px;
  width: 70px;
  text-align: right;
}
</style>
