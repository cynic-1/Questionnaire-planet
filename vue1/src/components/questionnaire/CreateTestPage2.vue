<template>
  <div>
  <q-drawer show-if-above side="left" bordered>
    <!-- drawer content -->
   <div class="left-main">
     <q-btn-dropdown color="pink" label="选择题" dropdown-icon="change_history" size="30px">
       <q-list>
         <q-item clickable v-close-popup @click="addSingle">
           <q-item-section>
             <q-item-label>投票单选</q-item-label>
           </q-item-section>
         </q-item>
   
         <q-item clickable v-close-popup @click="addMulti">
           <q-item-section>
             <q-item-label>投票多选</q-item-label>
           </q-item-section>
         </q-item>
       </q-list>
     </q-btn-dropdown>
   
     <q-btn-dropdown color="pink" label="个人信息" dropdown-icon="change_history" size="30px">
       <q-list>
         <q-item clickable v-close-popup @click="addName">
           <q-item-section>
             <q-item-label>姓名</q-item-label>
           </q-item-section>
         </q-item>
        
         <q-item clickable v-close-popup @click="addID">
           <q-item-section>
             <q-item-label>ID</q-item-label>
           </q-item-section>
         </q-item>
		 
		 <q-item clickable v-close-popup @click="addBlank">
		   <q-item-section>
		     <q-item-label>其他信息</q-item-label>
		   </q-item-section>
		 </q-item>
       </q-list>
     </q-btn-dropdown>
     
   </div>

  </q-drawer>

<!--  <q-page-container>-->
    <q-page padding>
      <q-card class="my-card">
	  <q-form ref="modelForm" :rule="rules" :model="modelForm">
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


	<!--          <q-form-->
	<!--              :prop="`topic.${index}.questionName`"-->
	<!--              label="问题"-->
	<!--              :rules="{ required: true, message: '请填写问题', trigger: 'change' }"-->
	<!--          >-->
	<!--            <q-input-->
	<!--                v-model.trim="item.questionName"-->
	<!--                style="max-width: 300px"-->
	<!--                clearable-->
	<!--                label="请填写问题"-->
	<!--                :prefix="`topic.${index}.questionName`"-->
	<!--            />-->
	<!--          </q-form>-->
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
		</q-form>
	  </q-card>
	 
    </q-page>
<!--  </q-page-container>-->

  <q-drawer show-if-above side="right" bordered>
    <!-- drawer content -->
	  <div class="q-pa-md" style="max-width: 300px">
	      <q-input filled v-model="modelForm.time" placeholder="截至时间">
	        <template v-slot:prepend>
	          <q-icon name="event" class="cursor-pointer">
	            <q-popup-proxy transition-show="scale" transition-hide="scale">
	              <q-date v-model="modelForm.time" mask="YYYY-MM-DD HH:mm:ss">
	                <div class="row items-center justify-end">
	                  <q-btn v-close-popup label="Close" color="primary" flat />
	                </div>
	              </q-date>
	            </q-popup-proxy>
	          </q-icon>
	        </template>
	  
	        <template v-slot:append>
	          <q-icon name="access_time" class="cursor-pointer">
	            <q-popup-proxy transition-show="scale" transition-hide="scale">
	              <q-time v-model="modelForm.time" mask="YYYY-MM-DD HH:mm:ss" format24h>
	                <div class="row items-center justify-end">
	                  <q-btn v-close-popup label="Close" color="primary" flat />
	                </div>
	              </q-time>
	            </q-popup-proxy>
	          </q-icon>
	        </template>
	      </q-input>
	    </div>
 <!-- drawer content -->

    <div>
      <q-btn label="提交" type="submit" color="primary" @click="addSubmit()"/>
      <q-btn label="重置" type="reset" color="primary" flat class="q-ml-sm" @click="resetForm('modelForm')"/>
    </div>

<!--      <q-btn @click="addSubmit()">编辑完成</q-btn>-->
<!--      <q-btn @click="resetForm('modelForm')">重置</q-btn>-->
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
        topic: [{ type: '0', questionName: '您喜欢的网站：',key: 'true', answers: [{ value: '腾讯' },{ value: 'google' },{ value: '淘宝' },{ value: '网易云' },{ value: '其他' }] ,describe: ''}],
        title: '',
        time: '',
        table: ['单选','多选','填空','评分']
      },
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
		this.modelForm.time = dic.endtime=="None"?'':dic.endtime
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
      console.log(this.modelForm.topic)
      if(this.modelForm.topic.length === 0)
        return this.$message.info("问卷至少包含一个题目！")
      //this.$refs.myForm.validate().then(success => {
		//console.log(this.modelForm.topic)
        //if (success) {
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
			  time: this.modelForm.time,
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

        //}
      //})
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
	addName(){
	  this.modelForm.topic.push({ type: '2', questionName: '您的姓名',key: 'false', answers: [{ value: '' }] , describe: ''})
	},
	addID(){
	  this.modelForm.topic.push({ type: '2', questionName: '您的ID',key: 'false', answers: [{ value: '' }] , describe: ''})
	}
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
.left-button {
  margin-top: 40px;
}
.left-main {
  margin-top: 30%;
  margin-left: 40px;
}
.question-bottom {
  display: inline-block;
  margin-bottom: 20px;
}
</style>

