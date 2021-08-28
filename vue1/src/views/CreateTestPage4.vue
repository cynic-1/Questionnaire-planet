<template>
  <div>
    <!-- 左边栏 -->
  <q-drawer show-if-above side="left" bordered :breakpoint="500">
    <!-- drawer content -->
    <q-tabs
        v-model="tab"
        class="text-grey"
        active-color="black"
        indicator-color="primary"
        align="justify"
        narrow-indicator
    >
      <q-tab name="questions" label="问题" />
      <q-tab name="outline" label="大纲" />
    </q-tabs>

    <q-separator />

    <q-tab-panels v-model="tab" animated style="margin-top: 40px">
      <q-tab-panel name="questions">
        <q-btn-dropdown color="pink" rounded label="选择题" dropdown-icon="change_history" size="30px">
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

        <q-btn color="cyan" rounded text-color="white" label="填空题" @click="addBlank" size="30px" icon-right="circle" class="left-button"/>
        <q-btn color="orange" rounded text-color="white" label="定位题" @click="addAddress" size="30px" icon-right="star" class="left-button"/>
      </q-tab-panel>

      <q-tab-panel name="outline">
        <div class="text-h6">这里是问题大纲</div>
        Lorem ipsum dolor sit amet consectetur adipisicing elit.
      </q-tab-panel>

    </q-tab-panels>

  </q-drawer>

<!--  <q-page-container>-->
    <q-page padding>
      <q-card class="my-card" style="min-height: 700px">
	  <q-form ref="modelForm" :rule="rules" :model="modelForm">
		  <div class="text-h3 quetitle">{{modelForm.title}}</div>
		  <vuedraggable v-model="modelForm.topic" class="wrapper" @end="end">
			<q-card class="my-card ques-card" v-for="(item, index) in modelForm.topic" :key="index" @click.native="changeFocus(item)">
				<div style="padding-bottom: 20px">
				  <div class="text-h5" style="display: inline-block">
            <div style="display: inline-block" v-show="showNum">第{{ index+1 }}题</div>
            <div style="display: inline-block; color: red" v-show="item.key === 'true'"><sup>*</sup></div>
            <div v-if="+item.type !== 8">{{modelForm.table[item.type]}}题&emsp;&emsp;题目:&emsp;{{item.questionName}}</div>
            <div v-if="+item.type === 8">{{modelForm.table[3]}}题&emsp;&emsp;题目:&emsp;{{item.questionName}}</div>
				  </div>
          <div class="text-h6 ques-description">
            {{item.describe}}
          </div>
<!--   单选 -->
          <q-form style="display: inline-block"
                  v-for="(opt, idx) in item.answers"
                  v-if="+item.type === 0"
                  :key="idx"
                  :label="`选项${idx + 1}`"
                  :prop="`focusedItem.answers.${idx}.value`">

            <q-radio v-model="useless" :label="opt.value || `选项${idx + 1}`" :val="opt.value" style="padding-right: 20px"/>
<!--                  :rules="[-->
<!--											{ required: true, message: '请输入答案', trigger: 'blur' },-->
<!--										]"-->

          </q-form>
<!--多选-->
          <q-form style="display: inline-block"
                  v-if="+item.type === 1"
                  v-for="(opt, idx) in item.answers"
                  :key="idx"
                  :label="`选项${idx + 1}`"
                  :prop="`focusedItem.answers.${idx}.value`">
            <q-checkbox v-model="useless" keep-color :label="opt.value || `选项${idx + 1}`" :val="opt.value" style="padding-right: 20px"/>
          </q-form>

          <q-form v-else-if="+item.type === 2">
            <q-input placeholder="请输入答案" outlined readonly style="width: 900px"/>
          </q-form>

          <q-form v-else-if="+item.type===8">
            <q-input placeholder="请获取定位" outlined readonly style="width: 900px"/>
            <q-btn label="获取定位" type="submit" color="primary"/>
          </q-form>
				</div>

			</q-card>
		  </vuedraggable>
		</q-form>
	  </q-card>

    </q-page>
<!--  </q-page-container>-->

  <q-drawer show-if-above side="right" bordered>
	  <div class="q-pa-md" style="max-width: 300px">
	      <q-input filled v-model="modelForm.time" placeholder="截止时间">
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

    <q-toggle
        v-model="showNum"
        label="显示题号"
    />
	<q-toggle
	    v-model="repeatable"
	    label="可重复填写"
	/>

    <q-card v-show="focusedItem">
      <q-form ref="modelForm" :rule="rules">
        <q-input
            v-model="focusedItem.questionName"
            style="display: inline-block;"
            class="text-h6"
            label="请输入标题"
        />
        <div class="q-gutter-sm">
          <q-radio keep-color v-model="focusedItem.key" val="false" label="选填" color="cyan" />
          <q-radio keep-color v-model="focusedItem.key" val="true" label="必填" color="red" />
        </div>
        <q-input
            v-model.trim="focusedItem.describe"
            clearable
            label="请填写问题描述"
        />
      </q-form>
      <!-- 答案 -->
      <q-form style="display: inline-block"
              v-for="(opt, idx) in focusedItem.answers"
              v-if="+focusedItem.type!==2 && +focusedItem.type !==8"
              :key="idx"

              :prop="`focusedItem.answers.${idx}.value`"
              :rules="[
											{ required: true, message: '请输入答案', trigger: 'blur' },
										]">
        <q-input v-model.trim="opt.value" style="min-width:150px;display: inline-block" :label="`选项${idx + 1}`" placeholder="请输入答案" />
        <q-btn style="margin-left: 20px;display: inline-block" @click.prevent="removeDomain(focusedItem,idx)" round color="red" label="删除"/>
      </q-form>

      <q-form>
        <q-btn style="margin-top: 10px" v-show="+focusedItem.type!==2 && +focusedItem.type !==8" @click="addDomain(focusedItem)">新增选项</q-btn>
        <br/>
        <q-btn @click="removeQuestion(focusedItem)" color="cyan" label="删除题目" icon-right="remove"/>
        <q-btn style="margin-left: 20px" @click="copy(focusedItem)" color="cyan" label="复制题目" icon-right="add"/>
        <br /><br />
        <q-btn size=small @click="moveup(focusedItem)" v-show="focusedItem !== modelForm.topic[0]" label="上移" icon-right="keyboard_arrow_up" color="amber"/>
        <q-btn size=small @click="movedown(focusedItem)" v-show="focusedItem!==modelForm.topic[modelForm.topic.length-1]" label="下移" icon-right="keyboard_arrow_down" color="amber"/>
      </q-form>
    </q-card>

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
	  repeatable: false,
	  order: false,
      rules: {},
      modelForm: {
        userid: this.$store.state.username,
        topic: [{ type: '2', questionName: '请输入您的学号：',key: 'true', answers:[{value: ''}] ,describe: ''},
        {type: '2', questionName: '请输入您的姓名：',key: 'true', answers:[{value: ''}] ,describe: ''},
        { type: '0', questionName: '请选择您的体温范围：',key: 'true', answers:[{ value: '35.0℃以下' },{ value: '35.0℃-36.0℃' },{ value: '36.1℃-37.0℃' },{ value: '37.1℃-38.0℃' },{ value: '38.0℃以上' }] ,describe: '请如实填写'},
        {type: '0', questionName: '是否去过高风险地区：',key: 'true', answers:[{ value: '是' },{ value: '否' }] ,describe: '请如实填写'},
        {type: '0', questionName: '是否有新冠症状：',key: 'true', answers:[{ value: '是' },{ value: '否' }] ,describe: '请如实填写'},
        {type: '8', questionName: '所在地点',key: 'true', answers:[{value: ''}] ,describe: ''}],
        title: '',
        time: '',
        table: ['单选','多选','填空','定位'],

      },
      options:[2,3,4,5,6,7,8,9,10],
      tab: 'questions',
      // type: modelform.topic
      focusedItem: '',
      useless: false,
    }
  },
  created(){
    window.addEventListener('beforeunload', this.leaveConfirm)
    window.addEventListener('unload', this.updateRecord)
    let type = this.$route.query.type
    if(+type === 0){
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
    // 根据中间预览的点击改变右侧题目表单
    changeFocus(v) {
      console.log(this.modelForm.topic.indexOf(v))
      this.focusedItem = v
    },
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
      if (+xmlhttp.readyState===4)
      {// 4 = "loaded"
        if (+xmlhttp.status===200)
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
          question.key = +item.mustdo === 1?'true':'false'
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
    removeDomain(item, idx) { // 删除选项
      item.answers.splice(idx, 1)
    },
    removeQuestion(item) {//删除题目
      let index = this.modelForm.topic.indexOf(item);
      this.modelForm.topic.splice(index, 1);
      this.focusedItem = '';
    },
    addDomain(item) { // 新增选项
      item.answers.push({ value: '' })
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
              testid: this.testid,
              showNum: this.showNum,
			        order: this.order,
              type: this.repeatable === false? '0':'1'
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
      let newItem = { type: '0', questionName: '',key: 'false', answers: [{ value: '' }] ,describe: ''};
      this.modelForm.topic.push(newItem);
      this.focusedItem = newItem;
    },
    addMulti(){
      let newItem = { type: '1', questionName: '',key: 'false', answers: [{ value: '' }] ,describe: ''};
      this.modelForm.topic.push(newItem);
      this.focusedItem = newItem;
    },
    addBlank(){
      let newItem = { type: '2', questionName: '',key: 'false', answers: [{ value: '' }] ,describe: ''};
      this.modelForm.topic.push(newItem);
      this.focusedItem = newItem;
    },
    addAddress(){
      let newItem = { type: '8', questionName: '',key: 'false', answers: [{ value: '' }] ,describe: ''};
      this.modelForm.topic.push(newItem);
      this.focusedItem = newItem;
    },
    copy(item){
      let newitem = JSON.parse(JSON.stringify(item))
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
/*.left-main {*/
/*  margin-top: 30%;*/
/*  margin-left: 40px;*/
/*}*/
.question-bottom {
  display: inline-block;
  margin-bottom: 20px;
}
.ques-card {
  min-height: 100px;
}
.ques-description {
  padding: 20px;
}
</style>

