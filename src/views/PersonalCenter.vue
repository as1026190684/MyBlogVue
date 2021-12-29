<template>
  <div id="PersonalCenter">
    <base-header ></base-header>
    <div class="back"></div>
    <div class="font"></div>

    <div class="backCenter">
      <div class="el-image-border">
        <el-row>
          <el-upload
            class="avatar-uploader"
            :action="actionUrl"
            :show-file-list="false"
            :on-success="handleAvatarSuccess"
            :on-remove="handleRemove"
            :before-upload="beforeAvatarUpload">
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <span v-if="imageUrl" class="el-upload-action" @click.stop="handleRemove()">
                <i class="el-icon-delete"></i>
            </span>
            <i v-else class="el-icon-upload2 avatar-uploader-icon" stop></i>
          </el-upload>
        </el-row>
      </div>


      <el-container style="height: 500px; " class="viewCard">
        <el-aside width="300px" style="background-color: rgba(255,243,243,0.1);">
          <el-menu :default-openeds="[]">
            <el-submenu index="1"  style="background-color: rgba(255,243,243,0.5)!important;">
              <template slot="title" ><i class="el-icon-message" ></i>MyBlog</template>
              <el-menu-item-group style="background-color: rgba(255,243,243,0.2) !important;">
                <div v-for="(item,index) in ownBlogNameArr" style="background-color: rgba(255,243,243,0.2) !important;">
                   <el-menu-item
                     index="1-1"
                     :key="index"
                     @click="view(item.id)"
                     style="background-color: rgba(255,243,243,0.2) !important;font-size: 15px !important;">{{index+1+' . ' }} {{item.title}}</el-menu-item>
                  <hr style="margin: 0 10%"/>
                </div>
              </el-menu-item-group>
            </el-submenu>
          </el-menu>
        </el-aside>

        <el-container >
          <el-main style="padding-top: 2px !important;">
            <el-card shadow="hover" class="userCard" style="background-color: rgba(255,243,243,0.1);color: white;font-weight: bold">
              昵称：<el-input style="float:right;width: 150px;margin-top: -5px" v-model="input.nickname" :placeholder=this.$store.state.name>
            </el-input>
            </el-card>
            <el-card shadow="hover" class="userCard" style="background-color: rgba(255,243,243,0.1);color: white;font-weight: bold">
              账户：<el-input style="float:right;width: 150px;margin-top: -5px" v-model="input.account" :placeholder=this.$store.state.account>
            </el-input>
            </el-card>
            <el-card shadow="hover" class="userCard" style="background-color: rgba(255,243,243,0.1);color: white;font-weight: bold">
              密码：<el-input style="float:right;width: 150px;margin-top: -5px" v-model="input.password" :placeholder=this.$store.state.password>
            </el-input>
            </el-card>
          </el-main>
        </el-container>
      </el-container>




    </div>

  </div>
</template>

<script>
import BaseHeader from "@/views/BaseHeader";
import {BASE_API} from "../../config/prod.env";
import {deleteHead} from "@/api/upload";
import {updateAvatarToDb} from "@/api/login";
import {getArticlesByUserId} from "@/api/article";
export default {
name: "PersonalCenter",
  components: {BaseHeader},
  data(){
    return {
      imageUrl: this.$store.state.avatar,
      actionUrl: "http://47.102.208.62:8888/api/upload",//http://localhost:8888/api/upload
      FilePath: {
        filePath: ''
      },
      input: {
        nickname:'',
        account: '',
        password:''
      },
      ownBlogNameArr: []

    };
  },
  created() {
  //todo 改为点击发送请求再实时渲染
    this.getArticlesByUserId()
  },

  methods:{
    view(id) {
      this.$router.push({path: `/view/${id}`})
    },
    getArticlesByUserId() {
      let that =this

      getArticlesByUserId(this.$store.state.id).then(data => {
        if (data.success) {
          that.ownBlogNameArr = data.data;
        }
      }).catch(error => {
        if (error !== 'error') {
          this.$message({type: 'warning', message:error, showClose: true});
        }

      });
    },
    // 移除图片
    handleRemove() { this.$confirm('是否删除头像?', '提示', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }).then(() => {

      this.imageUrl = ''
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
    // 上传成功回调

    handleAvatarSuccess(res, file) {
      let name = this.$store.state.avatar;
      let fileNameNum = name.lastIndexOf("/");
      let fileName=name.substring(fileNameNum+1,name.length)

      //上传成功后，删除七牛云中原有的头像，成功删除好，更新数据库中头像地址，自动更新redis缓存，并更新store中信息
      deleteHead(fileName).then(data => {
        //todo 后端返回string 但是前端显示未定义，
        // console.log(res.data.type)
        // console.log(res.data)

        this.FilePath.filePath=res.data
        if (data.success) {
          updateAvatarToDb(this.FilePath,this.$store.state.token).then(value => {
            //todo redis中id精度缺失
            if (value.success) {
              //更新store中信息

              this.$store.state.avatar = res.data;
              this.imageUrl = res.data;
              this.$message({type: 'success', message: "更新头像成功", showClose: true});
            } else {
              this.$message({type: 'error', message: value.message, showClose: true})
            }
          }).catch(error => {
            this.$message({type: 'error', message: "更新数据库错误", showClose: true})
          });
        } else {
          this.$message({type: 'error', message: value.message, showClose: true})
        }
      }).catch(error => {
        this.$message({type: 'error', message: "图片cdn存储删除错误", showClose: true})
      });



      // console.log(res)

    },
    // 上传前格式和图片大小限制
    beforeAvatarUpload(file) {
      const type = file.type === 'image/jpeg' || 'image/jpg' || 'image/webp' || 'image/png'
      const isLt2M = file.size / 1024 / 1024 < 10
      if (!type) {
        this.$message.error('图片格式不正确!(只能包含jpg，png，webp，JPEG)')
      }
      if (!isLt2M) {
        this.$message.error('上传图片大小不能超过 10MB!')
      }
      return type && isLt2M
    }
  }
}
</script>

<style scoped>
.back {
  width: 100%;
  height: 100%;
  position: absolute;
  margin-left: -40px;
  padding: 20px;
  background: url(http://static.ytte.top/back.jpg);
  background-size:cover;
  /*-webkit-filter:blur(14px);*/
  /*-ms-filter:blur(14px);*/
  /*filter:blur(1px);*/
  /*z-index: -3;*/
  /*border-radius:5%;*/
}
.font{
  margin-top: 200px;
  /*position: center;*/
  /*margin-left: -330px;*/
  /*left: 50%;*/
  /*padding: 20px;*/
  position:fixed;
  bottom:0;
  width:100%;
  height:100%;
  line-height:30px;
  background-color: rgba(200,200,200,0.4);
}
.backCenter {
  min-width: 600px;
  max-width: 900px;
  width: 100%;
  min-height: 780px;
  border-style: solid;
  border-color: white;
  border-radius: 30px;
  margin-top: 80px;
  /*margin-bottom: 80px;*/
  margin-left: -450px;
  left: 50%;
  position: fixed;
}
.el-image-border {
  margin-top: 50px;
  left: 46%;
  position:fixed;
}

/*修改头像框的样式*/
.avatar-uploader{
  width: 120PX;
  height: 120px;
  border-radius: 50%;
  cursor: pointer;
  position: relative;
  overflow: hidden;
  background: url('../assets/img/default_avatar.png') no-repeat;
  background-size: 100% 100%;
}
.avatar-uploader-icon{
  font-size: 0;
  color: #fff;
  width: 120px;
  height: 120px;
  line-height: 120px;
  text-align: center;
}
.avatar-uploader-icon:hover{
  font-size: 28px;
  background-color: rgba(0, 0, 0, .3);
}
.avatar {
  position: relative;
  width: 120px;
  height: 120px;
  display: block;
}
.el-upload-action {
  position: absolute;
  top: 0;
  left: 0;
  display: block;
  width: 100%;
  height: 100%;
  font-size: 0;
  color: #fff;
  text-align: center;
  line-height: 120px;

}
.el-upload-action:hover {
  font-size: 20px;
  background-color: #000;
  background-color: rgba(0, 0, 0, .3)
}
.viewCard {
  /*position: inherit;*/
  width: 100%;
  height: 580px !important;
  margin-top: 180px;
  border-radius: 3%;
}

.userCard {
  margin: 2px 10px 10px 10px;
  min-width: 220px;
  max-width: 260px;
  /*margin-top: 10px;*/
  height: 70px;

}
.el-header {

  line-height: 60px !important;
}
/deep/.el-menu ,/deep/.el-submenu{
  background-color: rgba(255,243,243,0.2);
}
</style>
<style>

</style>
