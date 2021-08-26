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
      <h1 class="quetitle">{{modelForm.title}}</h1>
      <vuedraggable v-model="modelForm.topic" class="wrapper" @end="end">
        <q-card class="my-card">
          <q-card-section v-for="(item, index) in modelForm.topic" :key="index">
            <div class="text-h6" style="text-align: center">
              第{{ index+1 }}题&emsp;{{modelForm.table[item.type]}}题,&emsp;&emsp;题目:{{ item.questionName }}
            </div>
<!--            <div class="text-subtitle2">by John Doe</div>-->
          </q-card-section>

          <q-markup-table>
            <thead>
            <tr>
              <th class="text-left">Dessert (100g serving)</th>
              <th class="text-right">Calories</th>
              <th class="text-right">Fat (g)</th>
              <th class="text-right">Carbs (g)</th>
              <th class="text-right">Protein (g)</th>
              <th class="text-right">Sodium (mg)</th>
            </tr>
            </thead>
            <tbody>
            <tr>
              <td class="text-left">Frozen Yogurt</td>
              <td class="text-right">159</td>
              <td class="text-right">6</td>
              <td class="text-right">24</td>
              <td class="text-right">4</td>
              <td class="text-right">87</td>
            </tr>
            <tr>
              <td class="text-left">Ice cream sandwich</td>
              <td class="text-right">237</td>
              <td class="text-right">9</td>
              <td class="text-right">37</td>
              <td class="text-right">4.3</td>
              <td class="text-right">129</td>
            </tr>
            <tr>
              <td class="text-left">Eclair</td>
              <td class="text-right">262</td>
              <td class="text-right">16</td>
              <td class="text-right">23</td>
              <td class="text-right">6</td>
              <td class="text-right">337</td>
            </tr>
            <tr>
              <td class="text-left">Cupcake</td>
              <td class="text-right">305</td>
              <td class="text-right">3.7</td>
              <td class="text-right">67</td>
              <td class="text-right">4.3</td>
              <td class="text-right">413</td>
            </tr>
            <tr>
              <td class="text-left">Gingerbread</td>
              <td class="text-right">356</td>
              <td class="text-right">16</td>
              <td class="text-right">49</td>
              <td class="text-right">3.9</td>
              <td class="text-right">327</td>
            </tr>
            </tbody>
          </q-markup-table>
        </q-card>
      </vuedraggable>
    </q-page>
<!--  </q-page-container>-->

  <q-drawer show-if-above v-model="right" side="right" bordered>
    <!-- drawer content -->
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
</style>
