<template>
  <div id="app">
    <div id="web_bg" style="">

<!--      <music></music>-->
      <div class="zz">
        <router-view/>
        <go-top></go-top>

      </div>
<!--      <div style="height:100%; width:100%;display: none;">花瓣飘落</div>-->
    </div>
  </div>
</template>

<script>
import GoTop from '@/components/gotop/GoTop'
// import {snowfall}  from'"@/assets/snow/snowfall.jquery.js"'
// import Music  from '@/components/music/Music'
export default {
  name: 'App',
  components: {
    GoTop,
    // Music,
  },
  computed:{

  }
}
</script>

<style>
* { margin: 0; padding: 0; }

body {
	background-color: #f5f5f5;
	font-weight: 400;
	font-family: "Helvetica Neue",Helvetica,"PingFang SC","Hiragino Sans GB","Microsoft YaHei","微软雅黑",Arial,sans-serif;
	line-height: 1.5;
}
a {
    cursor: pointer;
    text-decoration: none;
    transition: none 86ms ease-out;
}
a:hover {
	color: #5FB878;
}
.me-area{
	background-color: #fff;
}
html{height:100%;}
body{min-height:100%;}
body{position:relative;}

.me-pull-right {
	float: right;
}
#web_bg{
  min-width:1000px;
  min-height:1400px;
  /*height: 3700px;*/
  border-radius:40px;
  box-shadow: 10px 10px 5px #888;
  border:1px solid #666;
 }
#web_bg::before{
  content:"";
  background-image: url(http://static.ytte.top/%E4%B8%BB%E9%A1%B5%E8%83%8C%E6%99%AF.jpg);
  background-attachment: fixed;
  background-repeat:no-repeat;
  opacity:0.2;
  z-index:-1;
  background-size:100% auto;
  background-position: center;
  width: 100%;/*父级要宽高100%并与body相同宽高，这样背景图片才不会因网页缩小变大滚动而变化*/
  height: 100%;
  position:absolute;
  top:0;
  left:0;
  border-radius:40px;
}

 .zz {
   opacity:0.8;
   filter:alpha(opacity=40); /* 针对 IE8 以及更早的版本 */
 }

</style>
