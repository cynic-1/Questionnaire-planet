<template>
    <div id="layout-body">
      <q-layout view="hHh LpR fFf">

        <q-header elevated class="bg-primary glossy text-white" height-hint="98">
          <q-toolbar>
<!--            <q-btn dense flat round icon="menu" @click="left = !left" />-->

            <q-toolbar-title style="
            font-size: xx-large;
            font-weight: bolder;
            color: floralwhite;
            font-family: Helvetica Neue,Helvetica,PingFang SC,Hiragino Sans GB,Microsoft YaHei,微软雅黑,Arial,sans-serif;">
              <q-avatar size="100px">
                <img src="../../assets/pentacle_PNG51.png" class="my-trans">
              </q-avatar>
              <router-link to="/home" class="link">
                天问  Tech Win
              </router-link>

            </q-toolbar-title>

            <q-btn-dropdown
                class="glossy"
                color="purple"
                label="账户设置"
            >
              <div class="row no-wrap q-pa-md">
                <div class="column items-center" v-show="$store.state.hasLogin">
                  <q-avatar size="72px" >
                    <img :src="this.$store.state.avatar">
                  </q-avatar>


                  <div class="text-subtitle1 q-mt-md q-mb-xs">{{this.$store.state.username}}</div>

                  <q-btn
                      color="primary"
                      label="退出登录"
                      push
                      size="sm"
                      v-close-popup
                      @click.native="quit()"
                  />
                </div>

                <div class="column items-center" v-show="!$store.state.hasLogin">
                  <q-avatar size="72px" >
                    <img src="../../assets/panda.png">
                  </q-avatar>
                  <div class="text-subtitle1 q-mt-md q-mb-xs">未登录</div>

                  <q-btn
                      color="primary"
                      label="登录/注册"
                      push
                      size="sm"
                      v-close-popup
                      to="/login"
                  />
                </div>

              </div>
            </q-btn-dropdown>

            <!--            <q-btn dense flat round icon="menu" @click="right = !right" />-->
          </q-toolbar>

        </q-header>

        <q-page-container>
          <router-view />
        </q-page-container>

        <q-footer elevated class="bg-grey-3 text-black">
          <q-toolbar>
            <q-toolbar-title  style="text-align: center;">
              <q-avatar>
                <img src="../../assets/pentacle_PNG51.png">
              </q-avatar>
                天问：一站式问卷收集管理平台
            </q-toolbar-title>

          </q-toolbar>
        </q-footer>

      </q-layout>
    </div>
</template>

<script>
    export default {
        name: "layout-body",
        data(){
          return{
              minHeight: 600,
            mobileData: false,
            bluetooth: false
          }
        },
      methods: {
        checkLogin(){
          if(sessionStorage.getItem('Authorization')===null||sessionStorage.getItem('Authorization')===''){
            this.$store.commit('SET_LOG_STATE',false)
            this.$store.dispatch('getSiteInfo0').then(data =>{
              this.$store.commit('SET_SITE_INFO', data)
            })
          }else{
            this.$store.commit('SET_LOG_STATE',true)
            this.$store.commit('SET_SITE_INFO', JSON.parse(sessionStorage.getItem('siteInfo')))
          }
        },
        quit(){
          this.$confirm('你真的要退出吗？', '将要退出账号').then(()=>{
            let self = this
            self.$store.commit('SET_LOG_STATE', false)
            window.sessionStorage.removeItem('username')
            window.sessionStorage.removeItem('HasLogin')
            sessionStorage.removeItem('Authorization')
            sessionStorage.removeItem('siteInfo')
            window.sessionStorage.removeItem('ip')
            this.$router.go(0);
          })
        }
      },
      created(){
        // window.addEventListener('scroll', this.watchScroll)
        this.checkLogin()
      },
    }
</script>

<style scoped>
#layout-body{
    background-color: #eff3f6;
    min-height: -moz-calc(100vh - 80px);
    min-height: -webkit-calc(100vh - 80px);
    min-height: calc(100vh - 80px);
}
.link:hover {
  color: #1dffd1;
}
.my-trans {
  cursor: pointer;
}
/*.my-trans:hover::before {*/
/*  -webkit-transform:rotate(360deg);*/
/*  transform:rotate(360deg);*/
/*  -webkit-transition:-webkit-transform 1s linear;*/
/*  transition:transform 1s linear;*/
/*}*/

.my-trans:hover {
  animation:my-trans 1.2s infinite
}
@keyframes my-trans {
  0% {
    transform:rotate(0);
    /*animation-timing-function:cubic-bezier(.55,.055,.675,.19)*/
  }
  /*50% {*/
  /*  transform:rotate(900deg);*/
  /*  !*animation-timing-function:cubic-bezier(.215,.61,.355,1)*!*/
  /*}*/
  100% {
    transform:rotate(360deg)
  }
}
</style>
