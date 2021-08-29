<template>
  <q-page padding>
    <q-card class="my-card" style="min-height: 700px; margin-right: 12%; margin-left: 12%; padding-bottom: 20px">
        <div class="text-h3" style="text-align: center; margin-bottom: 20px">{{title}}</div>
		<h5 style="text-align: right;">距离考试结束<span style="color:red">{{Math.floor(countdown/3600)}}</span>小时<span style="color:red">{{Math.floor(countdown%3600/60)}}</span>分<span style="color:red">{{Math.floor(countdown%3600%60)}}</span>秒</h5>
		<h5 v-if="disable" style="text-align: right;">总分:<span style="color:red">{{sum}}</span>分</h5>
          <q-card class="my-card ques-card" v-for="(test, index) in tests" :key="index">
            <div style="padding-bottom: 20px">
             <div class="text-h5 my-inline" style="display: inline-block">
                <div class="my-inline" v-show="showNum">第{{ index+1 }}题</div>
                <div class="my-inline" style="color: red" v-show="+test.mustdo === 1"><sup>*</sup></div>
                <div class="my-inline">{{topicMap[+test.type]}}题,&emsp;&emsp;题目:&emsp;{{test.stem}}<span v-if="test.score !== 0">({{test.score}}分)</span>
					<span v-if="disable && test.score !== 0">你的得分:<span style="color:red">{{test.myscore}}</span>分</span>
				</div>
              </div>
              <div class="text-h6 ques-description">
                {{test.describe}}
              </div>

<!--              单选-->
              <q-radio
                  v-if="+test.type === 0"
                  v-for="(option,index) in test.answers"
                  :key="index"
                  :label="option.value"
                  :val="option.value"
                  v-model="test.useranswer"
                  style="padding-right: 20px"
				  :disable="disable"
              />

              <!-- 多选 -->

              <q-checkbox
                  v-if="+test.type === 1"
                  v-for="(option,index) in test.answers"
                  :key="index"
                  v-model="test.useranswer"
                  :label="option.value"
                  :val="option.value"
                  color="cyan"
                  style="padding-right: 20px"
				  :disable="disable"
			/>


              <q-input
                  v-if="+test.type === 2"
                  placeholder="请输入答案"
                  outlined
                  v-model="test.useranswer"
                  style="width: 80%"
				  :disable="disable"
			/>              
            </div>
          </q-card>

      <div class="return-button">
        <q-btn  v-if="!isVisitor" @click="save({
					testid: testid,
					userid: username,
					issubmit: isSubmit
				},`http://47.94.221.172:80/userfillquestionnaire/`)" color="secondary" :disable="disable">保存</q-btn>
        <q-btn v-else @click="save({
					testid: testid,
					visitorip: visitorip,
					issubmit: isSubmit
				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" color="secondary" :disable="disable">保存</q-btn>
        <q-btn v-if="!isVisitor" @click="submitCount({
					testid: testid,
					userid: username,
					issubmit: isSubmit
				},`http://47.94.221.172:80/userfillquestionnaire/`)" color="primary" :disable="disable">提交问卷</q-btn>
        <q-btn v-else @click="submitCount({
					testid: testid,
					visitorip: visitorip,
					issubmit: isSubmit
				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" color="primary" :disable="disable">提交问卷</q-btn>
		<q-btn @click="back" v-if="disable">返回</q-btn>
      </div>
    </q-card>
  </q-page>
</template>

<script>
import {aes_decrypt} from "@/utils/encryptURL";

export default {
  data() {
    return {
      address:'',
      testid: '',
      title: '',
      publisher:'',
      tests: [],
      username:this.$store.state.username,
      isSubmit: '0',
      visitorip: '',
      isVisitor: false,
      showNum: true,
      topicMap: ['单选', '多选', '填空'],
	  countdown: 0,
	  disable: false,
	  sum: 0
    };
  },
  mounted() {
    // this.testid = this.$route.query.testid
    this.testid = aes_decrypt(this.$route.query.testid, 'cynic', false)
    if(window.sessionStorage.getItem('ip') !== null){
      this.isVisitor = true
      this.visitorip = JSON.parse(window.sessionStorage.getItem('ip' || '[]'))
      this.loadmyquestionnaire({
        visitorip: this.visitorip,
        testid: this.testid,
      },"http://47.94.221.172:80/Touristsgettest/")
    }
    else{
      this.loadmyquestionnaire({
        testid: this.testid,
        username: this.username,
      },"http://47.94.221.172:80/usergettest/")
    }
  },
  updated() {
    //console.log(tests);
  },
  methods: {
	getTime(){
	      this.timer = setInterval(()=>{
	        this.countdown--
	        if(this.countdown===0){
			  console.log('time is over')
			  this.$message.info('考试时间到，已自动交卷')
			  if(this.isVisitor){
				  this.auotoSubmit({
					testid: this.testid,
					visitorip: this.visitorip,
					issubmit: this.isSubmit
					},`http://47.94.221.172:80/visitorfillquestionnaire/`)
			  }
			  else{
				  this.auotoSubmit({
					testid: this.testid,
					userid: this.username,
					issubmit: this.isSubmit
					},`http://47.94.221.172:80/userfillquestionnaire/`)
			  }
	          clearInterval(this.timer)
	        }
	      },1000)
	},
    loadmyquestionnaire(var1,var2){
      this.$axios({
        method:"post",
        url: var2,
        header:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: var1,
        transformRequest:[function(data){
          let ret = ''
          for(let it in data){
            ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
          }
          return ret
        }],
      }).then((res)=>{
        if (res.data.code === '0'){
          this.$message.warning('问卷不存在或未开放')
          return this.$router.push('/home')
        }
        if(res.data.code === '1'){
          this.$message.info('你已经填过该问卷了')
          return this.$router.push('/home')
        }
        const dic = res.data.dic
        console.log(res.data)
        //if (res.data.code !== '200') return this.$router.push('/404');
        this.title = dic.title
        this.publisher = dic.userid
        this.tests = dic.topic
        this.showNum = dic.showNum
		this.countdown = dic.countdown - 1
		this.getTime();
        for(let item of this.tests){
          // 多选
          if(+item.type === 1){
            if(item.useranswer[0] === ''){
              item.useranswer.pop()
            }
          }
		  if(+item.type <2){
			this.$set(item, 'myscore', 0)  
		  }
        }
      })
    },
    save(var1,var2){
      const usercard = []
      for(let item of this.tests){
        usercard.push({questionid:item.questionid, useranswer:item.useranswer})
      }
      this.$set(var1, 'usercard', usercard)
      this.$axios({
        method:"post",
        url: var2,
        header:{
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        data: var1,
        traditinal: true,
        paramsSerializer: data => {
          return qs.stringify(data, { indices: false })
        }
      }).then((res)=>{
        console.log(res.data)
        if (res.data.code !== '200') return this.$message.error(res.data.message);
        this.$message.success("保存成功")
      })
    },
	auotoSubmit(var1,var2){
		var1.issubmit = '1'
		const usercard = []
		//console.log(var1)
		for(let item of this.tests){
			usercard.push({questionid:item.questionid, useranswer:item.useranswer})
		}
		this.$set(var1, 'usercard', usercard)
		this.$axios({
			method:"post",
			url: var2,
			header:{
				'Content-Type': 'application/x-www-form-urlencoded'
			},
			data: var1,
			traditinal: true,
			paramsSerializer: data => {
				return qs.stringify(data, { indices: false })
			}
		}).then((res)=>{				
			if (res.data.code !== '200') return this.$message.error(res.data.message);
			this.sum = res.data.sum
			const results = res.data.scores
			alert('提交完成!');
			for(let item1 of results){
				for(let item2 of this.tests){
					if(item1.questionid === item2.questionid)
						this.$set(item2, 'myscore', item1.score)
				}
			}
			this.disable = true
		})
	},
    submitCount(var1, var2) {
      // 是否答完
      let isComplete = true;
      this.tests.forEach((val) =>{
        if(+val.useranswer.length === 0 && +val.mustdo === 1){
          isComplete = false;
          return;
        }
      })

      if(isComplete){
        // 答题完整,可以提交,在这里进行提交数据操作
        this.auotoSubmit(var1,var2)
      }else{
        this.$confirm('你有未完成的必答题，确定交卷吗？', '提示', {
            type: 'warning'
        }).then(() => {
            this.auotoSubmit(var1,var2)
        }).catch(() => {
        }); 
        
      }
    },
	back(){
		this.$router.push('/home')
	}
  }
};
</script>


<style scoped lang="less">
.return-button {
  margin: 0 auto;
  text-align: center;
}
.my-inline {
  display: inline-block;
}
</style>
