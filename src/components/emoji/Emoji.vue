<template>
  <div class="">
    <!-- 输入框区域 -->
    <div :class="faceShow ?'box boxFaceShow' : 'box'" ref="heightFace">
      <input type="text" v-model="textContent" class="inputContent">
      <button class="faceBut" @click="faceContent">表情</button>
    </div>
    <!-- 表情区域 -->
    <div class="browBox" v-if="faceShow">
      <ul>
        <li v-for="(item,index) in faceList" :key="index" @click="getBrow(index)">{{item}}</li>
      </ul>
    </div>
  </div>
</template>

<script>
// 导入JSON格式的表情库
import appData from "@/assets/emoji/emojis.json";
// const appData = require("@/assets/emoji/emojis.json");
export default {
  name: "Emoji",
  data() {
    return {
      textContent: "",
      faceList: [],
      faceShow: false,
      getBrowString: "",
      content: []
    };
  },
  methods: {
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
    // // 将input的内容渲染到页面上
    // referContent() {
    //   if (this.textContent === "") return alert("请输入内容");
    //   // 存入
    //   this.content.push(this.textContent);
    //   // 清空input数据
    //   this.textContent = "";
    //   // 关闭表情列表
    //   this.faceShow = false;
    // }
  },
};
</script>

<style lang="css" scoped>
body,
html,
head,
.home {
  width: 100%;
  height: 100%;
  padding: 0px;
  position: relative;
  margin: 0px;
}
.home {
  width: 100%;
  height: 100%;
  .contentBox {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    text-align: right;
    position: absolute;
    bottom: 60px;
    li {
      list-style: none;
      padding: 4px 10px;
      margin-bottom: 20px;
      span {
        background: #e6e6e6;
        border-radius: 5px;
        padding: 5px;
      }
    }
  }
  .contFaceShow {
    position: absolute;
    bottom: 240px;
  }
  .box {
    width: 100%;
    height: 40px;
    margin: auto;
    position: absolute;
    bottom: 0px;
    .inputContent {
      position: absolute;
      bottom: 0%;
      left: 0%;
      width: 74%;
      height: 100%;
      border: 1px solid #ccc;
    }
    .referBut {
      position: absolute;
      bottom: 0%;
      right: 2%;
      height: 100%;
      width: 10%;
      border-radius: 5px;
      background: #aaaaff;
      color: #fff;
    }
    .faceBut {
      position: absolute;
      bottom: 0;
      right: 13%;
      height: 100%;
      width: 10%;
      border-radius: 5px;
      background: #aaaaff;
      color: #fff;
    }
  }
  .boxFaceShow {
    position: absolute;
    bottom: 200px !important;
  }

.browBox>ul{
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
}
.browBox>ul>li {

  width: 14%;
  font-size: 26px;
  list-style: none;
  text-align: center;
}
   =
</style>


