
<template>
  <div class="me-view-comment-item">
    <div class="me-view-comment-author">
      <a class="">
        <img class="me-view-picture" :src="oneClockInData.author.avatar"></img>
      </a>
      <div class="me-view-info">
        <span class="me-view-nickname">{{oneClockInData.author.nickname}}</span>
        <div class="me-view-meta">
          <span>{{oneClockInData.createDate | format(oneClockInData.createDate)}}</span>
        </div>
      </div>
    </div>

    <el-card class="box-card">
      <el-button v-if="oneClockInData.userId===this.$store.state.id" type="text" class="el-button-clock-in"
      @click="withdrawTodayClockIn()">撤回</el-button>
      <div v-for="(item,index) in oneClockInData.content" :key="index" class="text item">
        {{index+1+" . "}} {{item.text }}
      </div>
    </el-card>

<!--    <div>-->
<!--      <p class="me-view-comment-content">{{oneClockInData.content}}</p>-->
<!--    </div>-->
  </div>
</template>

<script>
import {getAllClockIn, pushClockInContent, withdrawTodayClockIn} from '@/api/clockin'

export default {
  name: "ClockInItem",
  props: {
    oneClockInData:Object
  },
  data() {
    return {
      clockIn: {
        id: '',
        content: '',
        createDate: '',
        userId: '',
        author: {
          nickname: '',
          avatar: '',
          id: ''
        }
      },
    }
  },
  created() {

  },
  mounted() {
  },
  methods: {
    withdrawTodayClockIn() {
      let that = this;
      const h = this.$createElement;
      this.$msgbox({
        title: '消息',
        message: h('p', null, "您确定要今天的打卡吗？"),
        showCancelButton: true,
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        beforeClose: (action, instance, done) => {
          if (action === 'confirm') {
            instance.confirmButtonLoading = true;
            instance.confirmButtonText = '执行中...';

            withdrawTodayClockIn(this.oneClockInData.id, this.$store.state.token).then(data => {
              if (data.success) {
                that.$message({type: 'success', message: '撤回成功', showClose: true});
                this.$router.go(0)
              } else {
                instance.confirmButtonLoading = false;
                instance.confirmButtonText = '确定';
                that.$message({type: 'error', message: data.message, showClose: true})
              }
            }).catch(error => {
              instance.confirmButtonLoading = false;
              instance.confirmButtonText = '确定';
              if (error !== 'error') {
                console.log(error);
                that.$message({type: 'error', message: error, showClose: true})
              }
            });
          } else {
            done();
          }
        }
      })
    }
  }
}
</script>

<style>

.v-note-wrapper .v-note-panel {
  box-shadow: none !important;
}

.me-view-comment-item {
  margin-top: 5px;
  margin-left: 5px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.me-view-comment-author {
  margin: 10px 0;
  /*vertical-align: middle;*/
  width: 150px;
  height: 50px;
}

.me-view-nickname {
  font-size: 14px;
}

.me-view-comment-content {
  line-height: 1.5;
}


.v-note-wrapper .v-note-panel .v-note-show .v-show-content, .v-note-wrapper .v-note-panel .v-note-show .v-show-content-html {
  background: #fff !important;
}

.me-view-picture {
  width: 40px;
  height: 40px;
  border: 1px solid #ddd;
  border-radius: 50%;
  /*vertical-align: middle;*/
  background-color: #5fb878;
}
.me-view-info {
  display: inline-block;
  /*vertical-align: middle;*/
  margin-left: 8px;
}
.me-view-meta {
  font-size: 12px;
  color: #969696;
}
.text {
  font-size: 14px;
}

.item {
  padding: 3px 0;
}

.box-card {
  width: 600px;
}
.el-button-clock-in {
  position: absolute;
  right: 1%;
  margin-top: -5px;
}

</style>
