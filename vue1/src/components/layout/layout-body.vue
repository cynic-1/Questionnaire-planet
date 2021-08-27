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
              <q-avatar size="60px">
                <img src="../../assets/pentacle_PNG51.png">
              </q-avatar>
              <router-link to="/" class="link">
                天问  Tech Win
              </router-link>

            </q-toolbar-title>

<!--            <q-btn rounded color="" label="登录" />-->

<!--            <q-btn v-if="!$store.state.hasLogin" flat round dense size="20px" icon="assignment_ind" to="/loginRegister"/>-->
<!--            <div class="menu-item hasChild" v-else>-->
<!--              <q-btn-dropdown round>-->
<!--                <q-avatar flat round dense size="45px">-->
<!--                  <img :src="$store.state.avatar" alt="头像">-->
<!--                </q-avatar>-->
<!--              </q-btn-dropdown>-->
<!--            </div>-->

            <q-btn-dropdown
                class="glossy"
                color="purple"
                label="Account Settings"
            >
              <div class="row no-wrap q-pa-md">
                <div class="column">
                  <div class="text-h6 q-mb-md">Settings</div>
                  <q-toggle v-model="mobileData" label="暂时这是个" />
                  <q-toggle v-model="bluetooth" label="没用的功能" />
                </div>

                <q-separator vertical inset class="q-mx-lg" />

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

          <q-tabs align="left">
            <q-route-tab to="/page1" label="Page One" />
            <q-route-tab to="/page2" label="Page Two" />
            <q-route-tab to="/page3" label="Page Three" />
          </q-tabs>
        </q-header>

<!--        <q-drawer show-if-above v-model="left" side="left" bordered>-->
<!--          &lt;!&ndash; drawer content &ndash;&gt;-->
<!--        </q-drawer>-->

<!--        <q-drawer show-if-above v-model="right" side="right" bordered>-->
<!--          &lt;!&ndash; drawer content &ndash;&gt;-->
<!--        </q-drawer>-->

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
</style>
