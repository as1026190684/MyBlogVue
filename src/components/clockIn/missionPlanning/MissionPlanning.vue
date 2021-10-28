<template>
<div>
<!--  <link href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" rel="stylesheet">-->
  <div class="container" id="app" v-cloak>
    <p v-show="remainTask.length>0">
      任务列表 ({{remainTask.length}})
    </p>
    <ul class="list-group">
      <template v-for="(task,index) in remainTask">
        <li class="list-group-item">
        <span v-on:dblclick="editTask(task)" title="编辑任务" >
          {{index+1+"."}} {{task.text}}
        </span>
          <button v-on:click="removeTask(task)" title="移除任务" style="font-size: 18px ">&#10008;</button >
          <button v-on:click="completeTask(task)" title="任务完成" style="font-size: 18px ">&#10004;&ensp;&ensp;&ensp;&ensp;</button>
        </li>
      </template>
    </ul>
    <form>
      <div class="form-group">
        <label for="exampleInputEmail1">
          任务描述
        </label>
        <textarea
          type="text"
          class="form-control"
          placeholder="请输入你要添加的任务"
          v-model="newTask"
          required id="exampleInputEmail1"
          style="word-break:break-all;"
        />
        <button class="btn btn-primary" type="submit" v-on:click="addTask" style="margin-top: 3px" >
          添加任务
        </button>
<!--        <el-collapse>-->
<!--          <el-collapse-item title="一致性 Consistency" name="1">-->
<!--            <div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>-->
<!--            <div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>-->
<!--          </el-collapse-item>-->
<!--        </el-collapse>-->
<!--        &lt;!&ndash; 输入框区域 &ndash;&gt;-->
<!--        <div :class="faceShow ?'box boxFaceShow' : 'box'" ref="heightFace">-->
<!--          <input type="text" v-model="textContent" class="inputContent">-->
<!--          <button class="faceBut" @click="faceContent">表情</button>-->
<!--        </div>-->
<!--        &lt;!&ndash; 表情区域 &ndash;&gt;-->
<!--        <div class="browBox" v-if="faceShow">-->
<!--          <ul>-->
<!--            <li v-for="(item,index) in faceList" :key="index" @click="getBrow(index)">{{item}}</li>-->
<!--          </ul>-->
<!--        </div>-->
      </div>

    </form>
    <p>
      已完成的Task({{filterTask.length}})
    </p>
    <ol class="list-group">
      <template v-for="task in filterTask">
        <li class="list-group-item">
          {{task.text}}
          <button  v-on:click="withdrawTask(task)" title="撤回任务" style="font-size: 17px;font-weight: bold">撤回</button >
        </li>

      </template>
    </ol>
  </div>
</div>
</template>

<script>
import appData from "@/assets/emoji/emojis.json";
export default {
  name: "MissionPlanning",
  components: {

  },
  data() {
    return {
      textContent: "",
      faceList: [],
      faceShow: false,
      getBrowString: "",
      content: [],
    tasks: [],
      newTask: "程序员的修炼之道" //默认值
  }},
  methods: {

    clearTasks() {
      this.tasks = [];
    },
    tasksPush(data) {
      this.tasks.push(data) ;
    },
    // 表情
    faceContent() {
      this.faceShow = !this.faceShow;
      if (this.faceShow === true) {
        for (let i in appData) {
          this.faceList.push(appData[i].char);
        }
      } else {
        this.faceList = [];
      }
    },
    // 获取用户点击之后的标签 ，存放到输入框内
    getBrow(index) {
      for (let i in this.faceList) {
        if (index === i) {
          this.getBrowString = this.faceList[index];
          this.textContent += this.getBrowString;
        }
      }
    },

    addTask: function(event) { //添加任务
      event.preventDefault();
      if (this.newTask==='') {
        return this.$message({type: "error", message: "任务不能为空哦~(*^▽^*)", showClose: true});
      }
      this.tasks.push({
        text: this.newTask,
        complete: false
      });
      this.newTask = "";
    },
    editTask: function(task) { //编辑任务
      //移除当前点击task
      this.removeTask(task);

      //更新vue实例中newTask值
      this.newTask = task.text;
    },
    withdrawTask: function (task) {//撤回任务
      task.complete = false; //设置任务完成的状态
       this.$emit('withdrawMission',task);
    },
    removeTask: function(task) { //删除任务
      //指向Vue实例中的tasks
      let _tasks;
      _tasks = this.tasks;
      //remove
      _tasks.forEach(function(item, index) {
        if (item.text === task.text) {
          _tasks.splice(index, 1);
        }
      })
    },
    completeTask: function(task) { //任务完成状态
      task.complete = true; //设置任务完成的状态
      this.$emit('pushTrueMission',task);
    }
  },
  //用于计算属性，属性的计算是基于它的依赖缓存(如vue实例中的tasks)
  //只有当tasks数据变化时,才会重新取值
  computed: {
    remainTask: function() { //筛选未完成的记录
      return this.tasks.filter(function(task) { //filter过滤器
        return ! task.complete;
      })
    },
    filterTask: function() { //筛选已完成的记录
      return this.tasks.filter(function(task) {
        return task.complete;
      })
    }
  }
}
</script>

<style scoped>

/*.browBox{*/
/*  width: 100%;*/
/*  height: 200px;*/
/*  background: #e6e6e6;*/
/*  position: absolute;*/
/*  bottom: 0px;*/
/*  overflow: scroll;*/
/*}*/
/*.browBox>ul{*/
/*  display: flex;*/
/*  flex-wrap: wrap;*/
/*  padding: 10px;*/
/*}*/
/*.browBox>ul>li {*/

/*  width: 14%;*/
/*  font-size: 26px;*/
/*  list-style: none;*/
/*  !*text-align: center;*!*/
/*}*/

.container {
  width: 100%;
}
.list-group button {
  background: none;
  border: 0;
  color: red;
  outline: 0;
  float: right;
  font-weight: bold;
}
.btn-primary {
  color: #fff;
  background-color: #8a4dea;
  border-color: #2e6da4;
}
.btn {
  display: inline-block;
  padding: 6px 12px;
  margin-bottom: 0;
  font-size: 14px;
  font-weight: normal;
  line-height: 1.42857143;
  text-align: center;
  white-space: nowrap;
  vertical-align: middle;
  -ms-touch-action: manipulation;
  touch-action: manipulation;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
  background-image: none;
  border: 1px solid transparent;
  border-radius: 4px;
}
.btn:focus,
.btn:active:focus,
.btn.active:focus,
.btn.focus,
.btn:active.focus,
.btn.active.focus {
  outline: 5px auto -webkit-focus-ring-color;
  outline-offset: -2px;
}
.btn:hover,
.btn:focus,
.btn.focus {
  color: #37ff00;
  text-decoration: none;
}
.btn:active,
.btn.active {
  background-image: none;
  outline: 0;
  -webkit-box-shadow: inset 0 3px 5px rgba(232, 10, 10, 0.12);
  box-shadow: inset 0 3px 5px rgb(120, 234, 14);
}
.btn.disabled,
.btn[disabled],
fieldset[disabled] .btn {
  cursor: not-allowed;
  filter: alpha(opacity=65);
  -webkit-box-shadow: none;
  box-shadow: none;
  opacity: .65;
}
.form-control {
  display: block;
  width: 95%;
  height: 34px;
  padding: 6px 12px;
  font-size: 16px;
  line-height: 1.42857143;
  color: #0a0707;
  background-color: #fff;
  background-image: none;
  border: 1px solid #ccc;
  border-radius: 4px;
  -webkit-box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  box-shadow: inset 0 1px 1px rgba(0, 0, 0, .075);
  -webkit-transition: border-color ease-in-out .15s, -webkit-box-shadow ease-in-out .15s;
  -o-transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
  transition: border-color ease-in-out .15s, box-shadow ease-in-out .15s;
}
.form-group {
  margin-bottom: 15px;
}
.form-group-sm .form-control {
  height: 30px;
  padding: 5px 10px;
  font-size: 12px;
  line-height: 1.5;
  border-radius: 3px;
}
.form-group-sm select.form-control {
  height: 30px;
  line-height: 30px;
}
.form-group-sm textarea.form-control,
.form-group-sm select[multiple].form-control {
  height: auto;
}
.form-group-sm .form-control-static {
  height: 30px;
  min-height: 32px;
  padding: 6px 10px;
  font-size: 12px;
  line-height: 1.5;
}
.link-top {
  width: 100%;
  margin-top: 5px;
  margin-bottom: 5px;
  border-top: solid #811ff8 1px;
}
.list-group {
  display: flex;
  flex-direction: column;
  padding-left: 0;
  margin-bottom: 0;
  border-radius: 0.25rem;
}

.list-group-numbered {
  list-style-type: none;
  counter-reset: section;
}
.list-group-numbered > li::before {
  content: counters(section, ".") ". ";
  counter-increment: section;
}

.list-group-item-action {
  width: 100%;
  color: #495057;
  text-align: inherit;
}
.list-group-item-action:hover, .list-group-item-action:focus {
  z-index: 1;
  color: #495057;
  text-decoration: none;
  background-color: #f8f9fa;
}
.list-group-item-action:active {
  color: #212529;
  background-color: #e9ecef;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.5rem 1rem;
  color: #212529;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.list-group-item:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.list-group-item:last-child {
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
}
.list-group-item.disabled, .list-group-item:disabled {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
}
.list-group-item.active {
  z-index: 2;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.list-group-item + .list-group-item {
  border-top-width: 0;
}
.list-group-item + .list-group-item.active {
  margin-top: -1px;
  border-top-width: 1px;
}

.list-group-horizontal {
  flex-direction: row;
}
.list-group-horizontal > .list-group-item:first-child {
  border-bottom-left-radius: 0.25rem;
  border-top-right-radius: 0;
}
.list-group-horizontal > .list-group-item:last-child {
  border-top-right-radius: 0.25rem;
  border-bottom-left-radius: 0;
}
.list-group-horizontal > .list-group-item.active {
  margin-top: 0;
}
.list-group-horizontal > .list-group-item + .list-group-item {
  border-top-width: 1px;
  border-left-width: 0;
}
.list-group-horizontal > .list-group-item + .list-group-item.active {
  margin-left: -1px;
  border-left-width: 1px;
}
.list-group-item-action {
  width: 100%;
  color: #495057;
  text-align: inherit;
}
.list-group-item-action:hover, .list-group-item-action:focus {
  z-index: 1;
  color: #495057;
  text-decoration: none;
  background-color: #f8f9fa;
}
.list-group-item-action:active {
  color: #212529;
  background-color: #e9ecef;
}

.list-group-item {
  position: relative;
  display: block;
  padding: 0.5rem 1rem;
  color: #212529;
  text-decoration: none;
  background-color: #fff;
  border: 1px solid rgba(0, 0, 0, 0.125);
}
.list-group-item:first-child {
  border-top-left-radius: inherit;
  border-top-right-radius: inherit;
}
.list-group-item:last-child {
  border-bottom-right-radius: inherit;
  border-bottom-left-radius: inherit;
}
.list-group-item.disabled, .list-group-item:disabled {
  color: #6c757d;
  pointer-events: none;
  background-color: #fff;
}
.list-group-item.active {
  z-index: 2;
  color: #fff;
  background-color: #0d6efd;
  border-color: #0d6efd;
}
.list-group-item + .list-group-item {
  border-top-width: 0;
}
.list-group-item + .list-group-item.active {
  margin-top: -1px;
  border-top-width: 1px;
}
</style>
