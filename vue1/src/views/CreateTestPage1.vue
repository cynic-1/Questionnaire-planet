<template>
  <div>
  <q-drawer show-if-above v-model="left" side="left" bordered>
    <!-- drawer content -->
    <q-btn-dropdown color="pink" label="选择题" dropdown-icon="change_history">
      <q-list>
        <q-item clickable v-close-popup @click="addSingle">
          <q-item-section>
            <q-item-label>单选</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-close-popup @click="addMulti">
          <q-item-section>
            <q-item-label>多选</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>

    <q-btn color="white" text-color="black" label="填空题" @click="addBlank"/>
    <q-btn color="white" text-color="black" label="评分题" @click="addRank"/>

  </q-drawer>

<!--  <q-page-container>-->
    <q-page padding>
      <q-card class="my-card">
      <h1 class="quetitle">{{modelForm.title}}</h1>
      <vuedraggable v-model="modelForm.topic" class="wrapper" @end="end">
        <q-card class="my-card" v-for="(item, index) in modelForm.topic" :key="index">
          <div>
            <div class="text-h6" style="display: inline-block">
              <div style="display: inline-block" v-show="showNum">第{{ index+1 }}题</div>
              <div style="display: inline-block; color: red" v-show="item.key === 'true'"><sup>*</sup></div>
              {{modelForm.table[item.type]}}题,&emsp;&emsp;题目:&emsp;
              <q-input
                  v-model.trim="item.questionName"
                  style="display: inline-block;"

                  class="text-h6"
              />
            </div>
          </div>

            <br>
            <div class="q-gutter-sm">
              <q-radio keep-color v-model="item.key" val="false" label="选填" color="cyan" />
              <q-radio keep-color v-model="item.key" val="true" label="必填" color="red" />
            </div>


          <q-form>
            <q-input
                v-model.trim="item.describe"
                clearable
                placeholder="请填写问题描述"
            />
          </q-form>

          <!-- 答案 -->
          <q-form style="display: inline-block"
              v-for="(opt, idx) in item.answers"
              v-if="item.type!=2 && item.type !=3"
              :key="idx"
              :label="`选项${idx + 1}`"
              :prop="`topic.${index}.answers.${idx}.value`"
              :rules="[
										{ required: true, message: '请输入答案', trigger: 'blur' },
									]">
            <q-input v-model.trim="opt.value" style="width:258px;display: inline-block" clearable placeholder="请输入答案" />
            <q-btn style="margin-left: 20px;display: inline-block" @click.prevent="removeDomain(index,idx)" round color="red" label="删除"/>
          </q-form>

          <q-form
              v-else-if="item.type===3"
              style="display: inline-block"
              :prop="`topic.${index}.answers.value`"
              :rules="[
										{ required: true, message: '请输入范围', trigger: 'blur' },
									]">
            <q-select v-model="item.answers.value" placeholder="请选择范围">
              <q-option-group
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </q-option-group>
            </q-select>
          </q-form>

          <q-form>
            <q-btn v-show="item.type!=2 && item.type !=3" @click="addDomain(index)">新增选项</q-btn>
            <q-btn @click="removeQuestion(index)">删除题目</q-btn>
            <q-btn style="margin-left: 20px" @click="copy(item)">复制题目</q-btn>
            <br /><br />
            <q-btn size=small @click="moveup(item)" v-if="index!==0">上移</q-btn>
            <q-btn size=small @click="movedown(item)" v-if="index!==modelForm.topic.length-1">下移</q-btn>
          </q-form>

        </q-card>
      </vuedraggable>
      </q-card>
    </q-page>
<!--  </q-page-container>-->

  <q-drawer show-if-above v-model="right" side="right" bordered>
    <!-- drawer content -->

      <q-btn @click="addSubmit()">编辑完成</q-btn>
      <q-btn @click="resetForm('modelForm')">重置</q-btn>
    <q-toggle
        v-model="showNum"
        label="显示题号"
    />
  </q-drawer>
  </div>
</template>

<script>
import vuedraggable from 'vuedraggable'
import qs from 'qs'
export default {
  name: "CreateTestPage1",
  components:{
    vuedraggable
  },
  data() {
    return {
      url: "http://47.94.221.172:80/modifyquestionnaire/",
      testid: '',
      showNum: false,
      rules: {},
      modelForm: {
        userid: this.$store.state.username,
        topic: [],
        title: '',
        time: '',
        table: ['单选','多选','填空','评分']
      },
      options: [{
        value: 1,
        label: '1~10分'
      }, {
        value: 2,
        label: '1~100分'
      }, {
        value: 3,
        label: '一星到五星制'
      },
      ],
    }
  },
  created(){
    window.addEventListener('beforeunload', this.leaveConfirm)
    window.addEventListener('unload', this.updateRecord)
    let type = this.$route.query.type
    if(type == 0){
      this.modelForm.title = this.$route.query.title
      this.url = "http://47.94.221.172:80/publishquestionnaire/"
    }
    else{
      this.testid = this.$route.query.testid
      this.loadtest()
    }
  },
  // mounted() {
  //   let type = this.$route.query.type
  //   if(type == 0){
  //     this.modelForm.title = this.$route.query.title
  //     this.url = "http://47.94.221.172:80/publishquestionnaire/"
  //   }
  //   else{
  //     this.testid = this.$route.query.testid
  //     this.loadtest()
  //   }
  // },
  methods: {
    updateRecord() {
      if(this.modelForm.topic.length === 0)
        return
      var xmlhttp = new XMLHttpRequest();
      let data = {
        title: this.modelForm.title,
        topic: this.modelForm.topic,
        userid: this.modelForm.userid,
        testid: this.testid
      };
      xmlhttp.onreadystatechange=state_Change;
      xmlhttp.open("POST", this.url, false);
      xmlhttp.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
      xmlhttp.send(JSON.stringify(data));
    },
    async leaveConfirm(e) {
      e = e || window.event
      if (e) {
        e.returnValue = '关闭提示'
      }
      return '关闭提示'
    },

    state_Change()
    {
      if (xmlhttp.readyState==4)
      {// 4 = "loaded"
        if (xmlhttp.status==200)
        {// 200 = OK
          console.log('200_OK')
        }
        else
        {
          console.log("Problem retrieving XML data")
          alert("Problem retrieving XML data");
        }
      }
    },

    loadtest(){
      var _this = this
      this.$axios({
        method:"post",
        url:"http://47.94.221.172:80/getquestionnaire/",
        header:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data:{
          testid: this.testid
        },
        transformRequest:[function(data){
          let ret = ''
          for(let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
      }).then((res)=>{
        const dic = res.data.dic
        console.log(res.data.dic)
        //if (res.data.code !== '200') return this.$router.push('/404');
        this.modelForm.title = dic.title
        for(let item of dic.topic){
          const question = { type: '', questionName: '',key: '', answers: '',describe: '' }
          question.type = String(item.type)
          question.questionName = item.stem
          question.key = item.mustdo == 1?'true':'false'
          question.answers = item.answers
          question.describe = item.describe
          //console.log(question)
          this.modelForm.topic.push(question)
        }
      })
    },
    end(evt) {
      this.$refs.modelForm.clearValidate()
    },
    removeDomain(index, idx) { // 删除选项
      this.modelForm.topic[index].answers.splice(idx, 1)
    },
    removeQuestion(index) {//删除题目
      this.modelForm.topic.splice(index, 1)
    },
    addDomain(index) { // 新增选项
      this.modelForm.topic[index].answers.push({ value: '' })
    },
    resetForm(formName) { // 重置
      this.$refs[formName].resetFields()
    },
    moveup(item){		//上移
      let index = this.modelForm.topic.indexOf(item)
      this.modelForm.topic.splice(index,1)
      this.modelForm.topic.splice(index-1,0,item)
    },
    movedown(item){		//下移
      let index = this.modelForm.topic.indexOf(item)
      this.moveup(this.modelForm.topic[index+1])
    },
    addSubmit() {
      //console.log(this.modelForm.topic[0].answers[1].value)
      if(this.modelForm.topic.length === 0)
        return this.$message.info("问卷至少包含一个题目！")
      this.$refs.modelForm.validate(valid => {
        if (valid) {
          this.$axios({
            method:"post",
            url: this.url,
            header:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
            data:{
              title: this.modelForm.title,
              topic: this.modelForm.topic,
              userid: this.modelForm.userid,
              testid: this.testid
            },
            traditional: true,
            paramsSerializer: data => {
              return qs.stringify(data, { indices: false })
            }
          }).then(res => {
            console.log(res.data)
            if (res.data.code !== '200') return this.$message.error('保存失败');
            this.$message.success('保存成功')
            this.$router.push('/home')
          })

        }
      })
    },
    addSingle(){
      this.modelForm.topic.push({ type: '0', questionName: '',key: 'false', answers: [{ value: '' }] ,describe: ''})
    },
    addMulti(){
      this.modelForm.topic.push({ type: '1', questionName: '',key: 'false', answers: [{ value: '' }] , describe: ''})
    },
    addBlank(){
      this.modelForm.topic.push({ type: '2', questionName: '',key: 'false', answers: [{ value: '' }] , describe: ''})
    },
    addRank(){
      this.modelForm.topic.push({ type: '3', questionName: '',key: 'false', answers: { value: ''} , describe: ''})
    },
    copy(item){
      var newitem = JSON.parse(JSON.stringify(item))
      this.modelForm.topic.push(newitem)
    }
  },
  destroyed() {
    window.removeEventListener('beforeunload', this.leaveConfirm)
    window.removeEventListener('unload', this.updateRecord)
  }
}
</script>

<style scoped>
.quetitle{
  /*position: relative;*/
  /*left: 45%;*/
  /*width: 200px;*/
  text-align: center;
}
</style>
