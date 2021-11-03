<template>
  <div id="login" v-title data-title="登录">
    <div class="me-login-box me-login-box-radius">

      <h1>YTTE Change Password</h1>

      <el-form ref="userForm" :model="userForm" :rules="rules" class="">
        <el-form-item prop="account" class="el-form-item-style">
          <span class="text-left">用户名：</span>
          <el-input class="el-input-style" placeholder="用户名" v-model="userForm.account"></el-input>
        </el-form-item>

        <el-form-item prop="password" class="el-form-item-style">
          <span class="text-left">新密码：</span>
          <el-input class="el-input-style" placeholder="新密码" type="password" v-model="userForm.password"></el-input>
        </el-form-item>
        <el-form-item prop="mobilePhoneNumber" class="el-form-item-style">
          <span class="text-left">手机号码：</span>
          <el-input class="el-input-style" placeholder="手机号码"  v-model="userForm.mobilePhoneNumber"></el-input>
        </el-form-item>
        <el-form-item prop="verifyNumber" class="el-form-item-style">
          <span class="text-left">验证码：</span>
          <el-input class="verify-code" placeholder="验证码"  v-model="userForm.verifyNumber"></el-input>
          <el-button v-show="Verification" class="verify-btn" type="primary" @click.native.prevent="getVerifyNumber()">获取验证码</el-button>
          <el-button v-show="!Verification" class="verify-btn" disabled plain><span>{{timer}}</span></el-button>
        </el-form-item>
        <el-form-item size="" class="me-login-button">
          <el-button :disabled="Verification" type="primary" @click.native.prevent="changePassword('userForm')" >确认修改</el-button>
        </el-form-item>
      </el-form>

    </div>
  </div>
</template>

<script>

  export default {
    name: 'Change_Password',
    data() {
      const regPos = /^\d+$/; // 非负整数
      const validatePass = (rule, value, callback) => {
        if (regPos.test(value)) {
          callback();
        } else {
          callback(new Error('请输入正确的手机号码'));
        }
      };
      return {
        Verification: true,    //通过v-show控制显示获取还是倒计时
        timer: 60,      //定义初始时间为60s
        isDisabled: false,
        userForm: {
          account: '',
          password: '',
          mobilePhoneNumber: '',
          verifyNumber: ''
        },
        ruleForm: {
          pass: '',
          checkPass: '',
          age: ''
        },
        rules: {
          account: [
            {required: true, message: '请输入用户名', trigger: 'blur'},
            {max: 10, message: '不能大于10个字符', trigger: 'blur'}
          ],
          password: [
            {required: true, message: '请输入密码', trigger: 'blur'},
            {max: 10, message: '不能大于10个字符', trigger: 'blur'}
          ],
          mobilePhoneNumber: [
            {required: true, message: '请输入手机号码', trigger: 'blur'},
            {min: 11, max: 11, message: '手机号码位数不正确', trigger: 'blur'},
            {validator: validatePass, trigger: 'blur'}
          ],
          verifyNumber: [
            {required: true, message: '请输入验证码', trigger: 'blur'},
            {min: 4, max: 4, message: '验证码为4个字符', trigger: 'blur'}
          ],
        }
      }
    },
    methods: {
      getVerifyNumber() {
        let that = this
        let regPos =/^\d+$/;//todo 后端验证该账户是否是这个手机号后发送短信
        if (!regPos.test(that.userForm.mobilePhoneNumber)||that.userForm.mobilePhoneNumber.length!==11) {
          that.$message({type: 'error', message: "手机号码格式不正确", showClose: true});
          return false;
        }
        this.Verification = false;
        that.$store.dispatch('getVerifyNumber', that.userForm.mobilePhoneNumber).then(data => {
          if (data.success) {
            that.handleClick();
          } else {
            this.Verification = true;
            that.$message({type: 'error', message: data.message, showClose: true});
          }
        }).catch((error) => {
          this.Verification = true;
          if (error !== 'error') {
            that.$message({type: error, message: error, showClose: true});
          }
        });
      },
      handleClick() {
        this.Verification = false;      //点击button改变v-show的状态
        let auth_timer = setInterval(() => {  //定时器设置每秒递减
          this.timer--;        //递减时间
          if (this.timer <= 0) {
            this.Verification = true;    //60s时间结束还原v-show状态并清除定时器
            clearInterval(auth_timer)
          }
        }, 1000)
        this.timer=60
      },
      changePassword(userForm) {
        let that = this
        let loading
        this.$refs[userForm].validate((valid) => {
          if (valid) {
            loading = this.$loading({
              lock: true,
              text: '修改中，请稍后...'
            })
            that.$store.dispatch('changePassword', that.userForm).then(data => {
              if (data.success) {
                loading.close();
                this.$router.push({path: '/'})
                that.$message({type: 'success', message: '密码修改成功', showClose: true});
              } else {
                that.$message({type: 'error', message: data.message, showClose: true});
              }
            }).catch((error) => {
              loading.close();
              if (error !== 'error') {
                that.$message({type: error, message: error, showClose: true});
              }
            })
          } else {
            return false;
          }
        });
      },
    }
  }
</script>

<style scoped>
  #login {
    min-width: 100%;
    min-height: 100%;
  }

  .me-video-player {
    background-color: transparent;
    width: 100%;
    height: 100%;
    object-fit: fill;
    display: block;
    position: absolute;
    left: 0;
    z-index: 0;
    top: 0;
  }

  .me-login-box {
    position: absolute;
    width: 470px;
    height: 350px;
    background-color: white;
    margin-top: 150px;
    margin-left: -250px;
    left: 50%;
    padding: 30px;
  }

  .me-login-box-radius {
    border-radius: 10px;
    box-shadow: 0px 0px 1px 1px rgba(161, 159, 159, 0.1);
  }

  .me-login-box h1 {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    vertical-align: middle;
  }

  .me-login-design {
    text-align: center;
    font-family: 'Open Sans', sans-serif;
    font-size: 18px;
  }

  .me-login-design-color {
    color: #5FB878 !important;
  }

  .me-login-button {
    text-align: center;
  }

  .me-login-button button {
    width: 75%;
    margin-left: 20px;
    background-color: #00a1d6;
    border-color: #00a1d6;
  }
.el-input-style {
  width: 100%;
}
.text-left {
  position: absolute;
  right: 360px;
  top: 11px;
  font-size: 14px;
  color: #222;
  line-height: 18px;
  width: 70px;
  text-align: right;
}
.el-form-item-style {
  position: relative;
  width: 350px;
  padding-left:20px ;
  margin:20px auto;
}
.verify-code {
  float: left;
  width: 240px;
  margin-right: 12px;
}
.verify-btn {
  float: left;
  width: 85px;
  height: 40px;
  padding-left: 0;
  padding-right: 0;
  margin-left: 10px;
  background-color: #00a1d6;
  border-color: #00a1d6;
}
  .clearfix:after {
    display: block;
    content: "";
    clear: both;
  }
  .mail-text {
    float: left;
    min-height: 16px;
    line-height: 16px;
    font-size: 14px;
    color: #222;
    width: 326px;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
  }
  .a-verify_style {
    color: #00a1d6;
    text-decoration: none;
    font-size: 12px;
  }
  p {
    display: block;
    margin-block-start: 1em;
    margin-block-end: 1em;
    margin-inline-start: 0px;
    margin-inline-end: 0px;
  }
</style>
