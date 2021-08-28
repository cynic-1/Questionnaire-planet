<template>
  <q-page padding>
      <q-card class="my-card" style="min-height: 700px">
          <div class="text-h3" style="text-align: center">{{title}}</div>
            <q-card class="my-card ques-card" v-for="(test, index) in tests" :key="index">
              <div style="padding-bottom: 20px">
                <div class="text-h5" style="display: inline-block">
                  <div style="display: inline-block" v-show="showNum">第{{ index+1 }}题</div>
                  <div style="display: inline-block; color: red" v-show="+test.mustdo === 1"><sup>*</sup></div>
                  <div>{{topicMap[+test.type]}}题,&emsp;&emsp;题目:&emsp;{{test.stem}}</div>
                </div>
                <div class="text-h6 ques-description">
                  {{test.describe}}
                </div>
  
  <!--              单选-->
                <q-radio
                    v-if="+test.type === 4 && !disable"
                    v-for="(option,index) in test.answers"
                    :key="index"
                    :label="option.value"
                    :val="option.value"
                    v-model="test.useranswer"
                    style="padding-right: 20px"
					:disabled = "disable"
                />
	<!--              单选结果-->		
				<q-radio
				    v-if="+test.type === 4 && disable"
				    v-for="(option,index) in test.answers"
				    :key="index"
				    :label="`${option.value}(${option.num}人)`"
				    :val="`${option.value}(${option.num}人)`"
				    v-model="test.useranswer"
				    style="padding-right: 20px"
					:disabled = "disable"
				/>
				
                <!-- 多选 -->
  
                <q-checkbox
                    v-if="+test.type === 5 && !disable"
                    v-for="(option,index) in test.answers"
                    :key="index"
                    v-model="test.useranswer"
                    :label="option.value"
                    :val="option.value"
                    color="cyan"
                    style="padding-right: 20px"
					:disabled = "disable"
				/>
				
				<!-- 多选结果 -->
				  
				<q-checkbox
				    v-if="+test.type === 5 && disable"
				    v-for="(option,index) in test.answers"
				    :key="index"
				    v-model="test.useranswer"
				   :label="`${option.value}(${option.num}人)`"
				   :val="`${option.value}(${option.num}人)`"
				    color="cyan"
				    style="padding-right: 20px"
					:disabled = "disable"
				/>
  
                <q-input
                    v-if="+test.type === 2"
                    placeholder="请输入答案"
                    outlined
                    v-model="test.useranswer"
                    style="width: 900px"
					:disabled = "disable"/>
  
              </div>
            </q-card>
  
        <div class="return-button">
          <q-btn  v-if="!isVisitor" @click="save({
  					testid: testid,
  					userid: username,
  					issubmit: isSubmit
  				},`http://47.94.221.172:80/userfillquestionnaire/`)" color="secondary" :disabled = "disable">保存</q-btn>
          <q-btn v-else @click="save({
  					testid: testid,
  					visitorip: visitorip,
  					issubmit: isSubmit
  				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" color="secondary" :disabled = "disable">保存</q-btn>
          <q-btn v-if="!isVisitor" @click="submitCount({
  					testid: testid,
  					userid: username,
  					issubmit: isSubmit
  				},`http://47.94.221.172:80/userfillquestionnaire/`)" color="primary" :disabled = "disable">提交问卷</q-btn>
          <q-btn v-else @click="submitCount({
  					testid: testid,
  					visitorip: visitorip,
  					issubmit: isSubmit
  				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" color="primary" :disabled = "disable">提交问卷</q-btn>
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
			topicMap: ['单选', '多选', '填空', '评分','投票单选','投票多选'],
			results: [],
			disable: false
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
					if(item.type == 5){
						if(item.useranswer[0] == ''){
							item.useranswer.pop()
						}
					}
					if(item.type == 4 || item.type == 5){
						for(let item2 of item.answers)
							this.$set(item2, 'num', 0)
					}
				}
			})
		},
		save(var1,var2){
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
				this.$message.success("保存成功")
			})
		},
		submitCount(var1, var2) {
			// 是否答完
			let isComplete = true;
			this.tests.forEach((val,i) =>{
				if(val.useranswer.length == 0 && val.mustdo == 1){
					isComplete = false;
					return;
				}
			})

			if(isComplete){
				// 答题完整,可以提交,在这里进行提交数据操作
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
					if (res.data.dic !== null || res.data.dic !== null==='' || res.data.dic !== []){
						this.results = res.data.dic
						//console.log(this.results)
					}
					alert('提交成功!');
					//console.log(this.results)
					for(let item1 of this.results){
						for(let item2 of this.tests){
							if(item1.questionid === item2.questionid)
								this.$set(item2, 'answers', item1.answers)
						}
					}
					//console.log(this.tests)
					this.disable = true
				})	
			}else{
				alert('未答完,请完成问卷再提交!');
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
</style>

