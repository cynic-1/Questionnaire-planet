<template>
	<el-container>
	    <el-main>
	      <el-row>
          <el-card>
            <div class="test-title">{{title}}</div>
				<div class="grid-content bg-purple">
					<div class="element" v-for="(test, index) in tests" :key="index">
            <div style="margin-bottom: 10px">
						<p style="font-size: 24px; margin-top: 10px">{{index + 1}}.{{test.stem}}</p>
						<p style="font-size: 10px; margin-top: 10px">{{test.describe}}</p>
            </div>
						<el-checkbox-group v-if="test.type == '5'" v-model="test.useranswer">
							<!-- label绑定答案的值,可以绑定索引index,也可以绑定答案内容city -->
							<el-checkbox
							v-for="(option,index) in test.answers"
							:label="option.value"
							:key="index"
							style="display:block;"
							>{{option.value}}</el-checkbox>
						</el-checkbox-group>

						<el-radio-group v-else-if="test.type == '4'" v-model="test.useranswer">
							<el-radio
								v-for="(option,index) in test.answers"
								:label="option.value"
								:key="index"
								style="display:block;"
							>{{option.value}}</el-radio>
						</el-radio-group>

						<div v-else>
							<el-input  placeholder="请输入内容" v-model="test.useranswer"></el-input>
						</div>
	            </div>
	          </div>

			  <br />

			  <div class="return-button">
			    <el-button  v-if="!isVisitor" @click="save({
					testid: testid,
					userid: username,
					issubmit: isSubmit
				},`http://47.94.221.172:80/userfillquestionnaire/`)" type="primary">保存</el-button>
				<el-button  v-else @click="save({
					testid: testid,
					visitorip: visitorip,
					issubmit: isSubmit
				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" type="primary">保存</el-button>
			    <el-button v-if="!isVisitor" @click="submitCount({
					testid: testid,
					userid: username,
					issubmit: isSubmit
				},`http://47.94.221.172:80/userfillquestionnaire/`)" type="success">提交问卷</el-button>
				<el-button v-else @click="submitCount({
					testid: testid,
					visitorip: visitorip,
					issubmit: isSubmit
				},`http://47.94.221.172:80/visitorfillquestionnaire/`)" type="success">提交问卷</el-button>
			  </div>

	          <br />
			  
          </el-card>

	      </el-row>
	    </el-main>
	  </el-container>
</template>

<script>
import {aes_decrypt} from "@/utils/encryptURL";

export default {
	data() {
		return {
			testid: '',
			title: '',
			publisher:'',
			tests: [],
			username:this.$store.state.username,
			isSubmit: '0',
			visitorip: '',
			isVisitor: false,
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
				if (this.isSubmit === '1')
					this.results = res.data.dic
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
				this.isSubmit = '1'
				this.save(var1, var2)
				alert('提交成功!');
				console.log(this.results)
				for(let item1 of this.results){
					for(let item2 of this.tests){
						if(item1.questionid === item2.questionid)
							item2.num = item1.num
					}
				}
				//console
				//this.$router.push('/home')
			}else{
				alert('未答完,请完成问卷再提交!');
			}
		}
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

.test-title {
  text-align: center;
  font-size: xxx-large;
  font-weight: bolder;
  /*color: #6cd0b9;*/
  color: #fce33f;
}
.return-button {
  margin: 0 auto;
  text-align: center;
}
.element {
  margin-top: 10px;
}
h1,
h2 {
  font-weight: normal;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
/* 题目*/
.tihao {
  display: flex;
  justify-content: space-around;
}
.ti {
  display: inline-block;
  width: 25px;
  height: 25px;
  line-height: 27px;
  border: 1px solid #bbb;
  color: #bbb;
  border-radius: 50%;
  text-align: center;
}
.active {
  background-color: blue;
  color: white;
}
.unkey {
  background-color: green;
  color: white;
}
</style>
