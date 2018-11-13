<template>
    <section class="loginContainer">
      <div class="loginInner">
        <div class="login_header">
          <h2 class="login_logo">硅谷外卖</h2>
          <div class="login_header_title">
            <a href="javascript:;" :class="{on:loginWay}" @click="loginWay=!loginWay">短信登录</a>
            <a href="javascript:;" :class="{on:!loginWay}" @click="loginWay=!loginWay">密码登录</a>
          </div>
        </div>
        <div class="login_content">
          <form @submit.prevent="getInfo">
            <div :class="{on:loginWay}">
              <section class="login_message">
                <input type="tel" maxlength="11" placeholder="手机号" v-model="phone">
                <button :disabled="!checkPhone" class="get_verification" :class="{right_phone:checkPhone && !countDown}" @click.prevent="getCode">
                  {{countDown?`已发送(${countDown}秒)`:'获取验证码'}}
                </button>
              </section>
              <section class="login_verification">
                <input type="tel" maxlength="8" placeholder="验证码"  v-model="code">
              </section>
              <section class="login_hint">
                温馨提示：未注册硅谷外卖帐号的手机号，登录时将自动注册，且代表已同意
                <a href="javascript:;">《用户服务协议》</a>
              </section>
            </div>
            <div :class="{on:!loginWay}">
              <section>
                <section class="login_message">
                  <input type="tel" maxlength="11" placeholder="手机/邮箱/用户名" v-model="name">
                </section>
                <section class="login_verification">
                  <input type="tel" maxlength="8" placeholder="密码" v-if="showPwd" v-model="pwd">
                  <input type="password" maxlength="8" placeholder="密码" v-if="!showPwd" v-model="pwd">
                  <div class="switch_button" :class="showPwd?'on':'off'" @click="showPwd=!showPwd">
                    <div class="switch_circle" :class="{right:showPwd}"></div>
                    <span class="switch_text">{{showPwd?'abc':'...'}}</span>
                  </div>
                </section>
                <section class="login_message">
                  <input type="text" maxlength="11" placeholder="验证码" v-model="captcha">
                  <img class="get_verification" src="http://localhost:4000/captcha" alt="captcha" @click="getCaptcha">
                </section>
              </section>
            </div>
            <button class="login_submit">登录</button>
          </form>
          <a href="javascript:;" class="about_us">关于我们</a>
        </div>
        <a href="javascript:" class="go_back" @click="$router.back()">
          <i class="iconfont icon-arrow-right-copy"></i>
        </a>
      </div>
      <AlertTip  :alertText="alertText" v-show="showAlert" @closeTip="closeTip"/>
    </section>
</template>

<script>
  import AlertTip from '../../components/AlertTip/AlertTip'
  import {reqSendCode,reqSmsLogin,reqPwdLogin} from '../../api'
  export default {
    data(){
      return {
        loginWay:true,//登录方式  true为短信登录 false为密码登录
        phone:'',//手机号
        countDown:0,//倒计时时间
        code:'',//短信验证码
        showPwd:false,//是否显示密码
        name:'',//用户名
        pwd:'',
        captcha:'',
        showAlert:false,
        alertText:''
      }
    },
    computed:{
      checkPhone(){
        return /^1[34578]\d{9}$/.test(this.phone);
      }
    },
    components:{
      AlertTip
    },
    methods:{
      //加载30秒再去获取验证码的倒计时
      async getCode(){
        if(!this.countDown){
          //倒计时
          this.countDown=30
          var intervalId = setInterval(()=>{
            this.countDown--
            if(this.countDown<=0){
              clearInterval(intervalId)
            }
          },1000)
          //异步请求短信验证码
          const result = await reqSendCode(this.phone)
          if(result.code === 1){
            showAlertTip(result.msg)
            //关闭倒计时
            if(this.countDown){
              this.countDown = 0
              clearInterval(intervalId)
              intervalId = 0
            }
          }

        }
      },
      //显示自定义Alert框
      showAlertTip(text){
        this.showAlert=true
        this.alertText=text
      },
      //关闭自定义Alert框
      closeTip(){
        this.showAlert=false
        this.alertText=''
      },
      //一次性验证码
      getCaptcha(event){
        event.target.src='http://localhost:4000/captcha?date='+Date.now()
      },
      //数据提交
      async getInfo(){
        let result = {}
        if(this.loginWay){//短信登录
          const {checkPhone,phone,code} = this
          if(!checkPhone){
            this.showAlertTip("手机号不正确")
            return
          }else if(!/^\d{6}$/.test(code)){
            this.showAlertTip("短信验证码必须是6位")
            return
          }
          result = await reqSmsLogin(phone,code)
        }else{//密码登录
          const {name,pwd,captcha} = this
          if(!name){
            this.showAlertTip("请输入用户名")
            return
          }else if(!pwd){
            this.showAlertTip("请输入密码")
            return
          }else if(!captcha){
            this.showAlertTip("请输入验证码")
            return
          }
          result = await reqPwdLogin({name,pwd,captcha})
        }
        if(result.code === 0){//登录成功
          //保存userInfo
          const userInfo = result.data
          this.$store.dispatch("saveUserInfo",userInfo)
          //跳转到我的界面
          this.$router.replace("/profile")
        }else{//登录失败
          this.showAlertTip(result.msg)
        }
      }
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixins.styl"
  .loginContainer
    width 100%
    height 100%
    background #fff
    .loginInner
      padding-top 60px
      width 80%
      margin 0 auto
      .login_header
        .login_logo
          font-size 40px
          font-weight bold
          color #02a774
          text-align center
        .login_header_title
          padding-top 40px
          text-align center
          >a
            color #333
            font-size 14px
            padding-bottom 4px
            &:first-child
              margin-right 40px
            &.on
              color #02a774
              font-weight 700
              border-bottom 2px solid #02a774
      .login_content
        >form
          >div
            display none
            &.on
              display block
            input
              width 100%
              height 100%
              padding-left 10px
              box-sizing border-box
              border 1px solid #ddd
              border-radius 4px
              outline 0
              font 400 14px Arial
              &:focus
                border 1px solid #02a774
            .login_message
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .get_verification
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                border 0
                color #ccc
                font-size 14px
                background transparent
                &.right_phone
                  color black
            .login_verification
              position relative
              margin-top 16px
              height 48px
              font-size 14px
              background #fff
              .switch_button
                font-size 12px
                border 1px solid #ddd
                border-radius 8px
                transition background-color .3s,border-color .3s
                padding 0 6px
                width 30px
                height 16px
                line-height 16px
                color #fff
                position absolute
                top 50%
                right 10px
                transform translateY(-50%)
                &.off
                  background #fff
                  .switch_text
                    float right
                    color #ddd
                &.on
                  background #02a774
                >.switch_circle
                  //transform translateX(27px)
                  position absolute
                  top -1px
                  left -1px
                  width 16px
                  height 16px
                  border 1px solid #ddd
                  border-radius 50%
                  background #fff
                  box-shadow 0 2px 4px 0 rgba(0,0,0,.1)
                  transition transform .3s
                  &.right
                    transform translateX(30px)
            .login_hint
              margin-top 12px
              color #999
              font-size 14px
              line-height 20px
              >a
                color #02a774
          .login_submit
            display block
            width 100%
            height 42px
            margin-top 30px
            border-radius 4px
            background #4cd96f
            color #fff
            text-align center
            font-size 16px
            line-height 42px
            border 0
        .about_us
          display block
          font-size 12px
          margin-top 20px
          text-align center
          color #999
      .go_back
        position absolute
        top 5px
        left 5px
        width 30px
        height 30px
        >.iconfont
          font-size 20px
          color #999
</style>
