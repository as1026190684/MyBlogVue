<template>
  <div>
  <!--音乐播放器-->
  <div id="QPlayer">
    <div id="pContent">
      <div :id="player">
        <span class="cover"></span>
        <div class="ctrl">
          <div class="musicTag marquee">
            <strong>Title</strong>
            <span> - </span>
            <span :class="playlist.artist">Artist</span>
          </div>
          <div class="progress">
            <div class="timer left">0:00</div>
            <div class="contr">
              <div class="rewind icon"></div>
              <div class="playback icon"></div>
              <div class="fastforward icon"></div>
            </div>
            <div class="right">
              <div class="liebiao icon"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="ssBtn">
        <div class="adf"></div>
      </div>
    </div>
    <ol :id="playlist"></ol>
  </div>
  <div id="if-gg"></div>
  <!--音乐播放器结束-->
  </div>
</template>

<script>
// import  from 'static/js/jquery.marquee.min.js';
// import player from 'static/js/player.js';

export default {
  name: "Music",
  data(){
    return {
       playlist: [{
        title: "Coming home",
        artist: "Remix",
        mp3: "https://pan.wuzuhua.cn/%E9%9F%B3%E4%B9%90%E6%94%B6%E8%97%8F/Nurko%20_%20Roniit%20-%20Falling%20Again.mp3",
        cover: "http://p1.music.126.net/axTRReTzIQQyibyKwXfLaw==/109951163785304009.jpg?param=130y130",
      } ]
    }
  },
  created() {
    this.bgChange()
  },
  methods:{
    bgChange() {
      let lis = $('.lib');
      for (let i = 0; i < lis.length; i += 2)
        lis[i].style.background = 'rgba(246, 246, 246, 0.5)';
    }
  }

}

</script>

<style scoped>

</style>
