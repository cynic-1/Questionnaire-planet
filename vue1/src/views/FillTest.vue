<template>
  <q-page padding>
    <q-card class="my-card" style="min-height: 700px">
        <div class="text-h3" style="text-align: center">{{title}}</div>
          <q-card class="my-card ques-card" v-for="(test, index) in tests" :key="index">
            <div style="padding-bottom: 20px">
              <div class="text-h5" style="display: inline-block">
                <div style="display: inline-block" v-show="showNum">第{{ index+1 }}题</div>
                <div style="display: inline-block; color: red" v-show="+test.mustdo === 1"><sup>*</sup></div>
                <div v-if="+test.type !== 8">{{topicMap[+test.type]}}题,&emsp;&emsp;题目:&emsp;{{test.stem}}</div>
                <div v-if="+test.type === 8">{{topicMap[4]}}题,&emsp;&emsp;题目:&emsp;{{test.stem}}</div>
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
                  style="padding-right: 20px"/>


              <q-input
                  v-if="+test.type === 2"
                  placeholder="请输入答案"
                  outlined
                  v-model="test.useranswer"
                  style="width: 900px"/>

              <q-rating
                  v-if="+test.type === 3"
                  v-model="test.useranswer"
                  size="2em"
                  :max="test.answers.value"
                  color="yellow"
                  icon="star_border"
                  icon-selected="star"
                  no-dimming
              />
              <q-input
                  v-if="+test.type === 8"
                  placeholder="请获取位置"
                  outlined
                  v-model="address"
                   :dense="dense" disable 
                  style="width: 900px"/>
              <q-btn v-if="+test.type === 8" label="获取定位" type="submit" color="primary" @click="getaddress"/>
            </div>
          </q-card>

      <div class="return-button">
        <q-btn  v-if="!isVisitor" @click="save({
					testid: testid,
					userid: username,
					issubmit: isSubmit
				},`http://47.94.221.172:80/userfillquestionnaire/`)" color="secondary">保存</q-btn>
        <q-btn v-else @click="save({
					testid: testid,
					visitorip: visitorip,
					issubmit: isSubmit
				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" color="secondary">保存</q-btn>
        <q-btn v-if="!isVisitor" @click="submitCount({
					testid: testid,
					userid: username,
					issubmit: isSubmit
				},`http://47.94.221.172:80/userfillquestionnaire/`)" color="primary">提交问卷</q-btn>
        <q-btn v-else @click="submitCount({
					testid: testid,
					visitorip: visitorip,
					issubmit: isSubmit
				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" color="primary">提交问卷</q-btn>
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
      topicMap: ['单选', '多选', '填空', '评分','定位']
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
    getaddress(){
      this.$confirm('此操作将获取您当前ip所在地址, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
            this.$axios({
		  	  	method:"post",
				    url:"http://47.94.221.172/get_plath/",
			  	  header:{
					    'Content-Type': 'application/x-www-form-urlencoded'
				    },
				    transformRequest:[function(data){
					    let ret = ''
					    for(let it in data){
						    ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					    }
					    return ret
				      }],
			      }).then((res)=>{
			    	  this.address=res.data.addr
			      })
            this.$message({
            type: 'success',
            message: '获取定位成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消获取'
          });          
        });
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
        for(let item of this.tests){
          // 多选
          if(+item.type === 1){
            if(item.useranswer[0] === ''){
              item.useranswer.pop()
            }
          }
          // 评分
          if(+item.type === 3){
            if(item.useranswer === '')
              item.useranswer = 0
            else
              item.useranswer = +item.useranswer
            const max = +item.answers[0].value
            this.$set(item, 'max' , max)
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
        var1.issubmit = '1'
        this.save(var1, var2)
        alert('提交成功!');
        this.$router.push('/home')
      }else{
        alert('未答完,请完成问卷再提交!');
      }
    }
  }
};
</script>


<style scoped lang="less">
.return-button {
  margin: 0 auto;
  text-align: center;
}

</style>
