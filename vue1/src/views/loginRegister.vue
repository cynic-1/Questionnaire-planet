<template>
  <div class="login-register">
    <div class="contain">
      <div class="big-box" :class="{active:isLogin}">
        <div class="big-contain" v-if="isLogin">
          <div class="btitle">账户登录</div>
          <div class="bform">
            <input type="text" placeholder="用户名" v-model="form.username">
            <span class="errTips" v-if="nameError">* 用户名不存在 *</span>
            <input type="password" placeholder="密码" v-model="form.userpwd">
            <span class="errTips" v-if="passwordError">* 密码填写错误 *</span>
          </div>
          <button class="bbutton" @click="login">登录</button>
        </div>
        <div class="big-contain" v-else>
          <div class="btitle">创建账户</div>
          <div class="bform">
            <input type="text" placeholder="用户名" v-model="form.username">
            <span class="errTips" v-if="existed">* 用户名已经存在！ *</span>
            <input type="email" placeholder="邮箱" v-model="form.useremail">
            <span class="errTips" v-if="emailError">* 邮箱填写错误 *</span>
            <input type="password" placeholder="密码" v-model="form.userpwd">
            <span class="errTips" v-if="passwordFormatError">* 密码格式错误 *</span>
          </div>
          <button class="bbutton" @click="register">注册</button>
        </div>
      </div>
      <div class="small-box" :class="{active:isLogin}">
        <div class="small-contain" v-if="isLogin">
          <div class="stitle">你好，世界!</div>
          <p class="scontent"></p>
          <button class="sbutton" @click="changeType">我还没号</button>
        </div>
        <div class="small-contain" v-else>
          <div class="stitle">新世界大门</div>
          <p class="scontent"></p>
          <button class="sbutton" @click="changeType">我有号了</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>

export default{
  name: 'login-register',
  data () {
    return {
      isLogin: false,
      nameError: false,
      emailError: false,
      passwordError: false,
      existed: false,
      passwordFormatError: false,
      form: {
        username: '',
        useremail: '',
        userpwd: ''
      }
    }
  },
  created:function(){
    this.loggingState()
  },
  destroyed:function() {
    this.loggingState()
  },
  methods: {
    loggingState(){
      this.$store.commit('SET_LOGGING_STATE')
    },
    changeType () {
      this.isLogin = !this.isLogin
      this.form.username = ''
      this.form.useremail = ''
      this.form.userpwd = ''
      this.nameError = false
      this.emailError = false
      this.passwordError = false
      this.passwordFormatError = false
      this.existed = false

    },
    login () {
      let self = this;
      if (self.form.userpwd !== '') {
        self.$axios({
          method: 'post',
          url: 'http://47.94.221.172/login/',
          data: {
            username: self.form.username,
            pass: self.form.userpwd
          }
        })
          .then(res => {
            switch (res.data.code) {
              case 200:
                this.$Notice.open({
                  title: '成功登录'
                })
                sessionStorage.setItem('Authorization', /* "Bearer " + */ res.data.token)
                this.$store.commit('SET_LOG_STATE', true)
                this.$store.commit('SET_SITE_INFO', res.data)
                sessionStorage.setItem('siteInfo', JSON.stringify(res.data))
                this.$router.push({
                   path:`/`}, onComplete => { }, onAbort => { })
                break
              case 1:
                this.$store.commit('SET_LOG_STATE', false)
                this.$Notice.open({
                  title: '用户名或密码错误'
                })
                break
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$Notice.open({
          title: '填写不能为空！'
        })
      }
    },
    register () {
      let self = this;
      if (self.form.username !== '' && self.form.userpwd !== '') {
        self.$axios({
          method: 'post',
          url: 'http://47.94.221.172/register/',
          data: {
            username: self.form.username,
            email: self.form.useremail,
            pass: self.form.userpwd,
          }
        })
          .then(res => {
            switch (res.data.code) {
              case 200:
                this.$Notice.open({
                  title: '成功注册！'
                })
                this.existed = false
                this.nameError = false
                this.isLogin = true
                this.form.username = ''
                this.form.useremail = ''
                this.form.userpwd = ''
                this.$router.push({
                  path:`/login`}, () => { }, () => { })
                // this.login()
                break
              case 0:
                this.$Notice.open({
                  title: '用户名已存在'
                })
                this.existed = true
                this.nameError = false
                break
              case 1:
                this.$Notice.open({
                  title: '密码格式错误，需要至少八位的数字和字母组合'
                })
                this.existed = false
                this.passwordFormatError = true
                break
            }
          })
          .catch(err => {
            console.log(err)
          })
      } else {
        this.$Notice.open({
          title: '填写不能为空！'
        })
      }
    }
  }
}
</script>

<style scoped="scoped">
.login-register{
  width: 100vw;
  height: 100vh;
  box-sizing: border-box;
}
.contain{
  width: 60%;
  height: 60%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%,-50%);
  background-color: #fff;
  border-radius: 20px;
  box-shadow: 0 0 3px #f0f0f0,
  0 0 6px #f0f0f0;
}
.big-box{
  width: 70%;
  height: 100%;
  position: absolute;
  top: 0;
  left: 30%;
  transform: translateX(0%);
  transition: all 1s;
}
.big-contain{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.btitle{
  font-size: 2.0em;
  font-weight: bold;
  /*color: rgb(57,167,176);*/
  color: #FFE116;
}
.bform{
  width: 100%;
  height: 40%;
  padding: 10px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
}
.bform .errTips{
  display: block;
  width: 50%;
  text-align: left;
  color: red;
  font-size: 0.7em;
  margin-left: 1em;
}
.bform input{
  width: 50%;
  height: 15%;
  border: none;
  outline: none;
  border-radius: 10px;
  padding-left: 2em;
  background-color: #f0f0f0;
}
.bbutton{
  width: 20%;
  height: 40px;
  border-radius: 24px;
  border: none;
  outline: none;
  /*background-color: rgb(57,167,176);*/
  background-color: #FFE116;
  color: black;
  font-size: 0.9em;
  cursor: pointer;
}
.bbutton:hover{
  color: white;
}
.small-box{
  width: 30%;
  height: 100%;
  background: linear-gradient(135deg,#FFE116,#FFF10F);
  position: absolute;
  top: 0;
  left: 0;
  transform: translateX(0%);
  transition: all 1s;
  border-top-left-radius: inherit;
  border-bottom-left-radius: inherit;
}
.small-contain{
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}
.stitle{
  font-size: 1.8em;
  font-weight: bold;
  color: #EE7623;
}
.scontent{
  font-size: 1.2em;
  color: #fff;
  text-align: center;
  padding: 2em 4em;
  line-height: 1.7em;
}
.sbutton{
  width: 60%;
  height: 40px;
  border-radius: 24px;
  border: 1px solid black;
  outline: none;
  background-color: transparent;
  color: black;
  font-size: 1.2em;
  cursor: pointer;
}
.sbutton:hover {
  color: white
 }

.big-box.active{
  left: 0;
  transition: all 0.5s;
}
.small-box.active{
  left: 100%;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  border-top-right-radius: inherit;
  border-bottom-right-radius: inherit;
  transform: translateX(-100%);
  transition: all 1s;
}
</style>
