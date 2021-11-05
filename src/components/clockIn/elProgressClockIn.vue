<template>
<!--  <div class="elProgressClockIn">-->
  <div class="el-form-item-style">
    <span class="text-left">{{ uname }}：</span>
    <div class="el-progress-clock-in-div">
      <div :style="{width: percentage365 + '%',backgroundColor: 'rgb'+ colorArr[around]}"></div>
      <span style="text-align: right;float:right;margin:  -25px -60px 0 0;" >{{percentage}} 天</span>
    </div>

  </div>
<!--  </div>-->
</template>

<script>
export default {
name: "elProgressClockIn",
  data() {
    return {
      colorArr: [
        '(32, 200, 222)',
        '(9, 233, 128)',
        '(222, 165, 32)',
        '(165, 32, 222)'
      ]
    };
  },
  props: {
    percentage:{
      type: Number,
      default: 0,
      required: true,
    },
    status: {
      type: Number,
    },
    uname:{
      type: String,
      required: true,
    }
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
  padding-left:60px ;
  margin:20px auto;
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
