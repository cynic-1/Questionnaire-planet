<template>
	<el-container>
	    <el-main>
	      <el-row>
			  <h2>{{title}}</h2>
	        <el-col :span="16">
				<div class="grid-content bg-purple">
					<div v-for="(test, index) in tests" :key="index">
						<p>{{index + 1}}.{{test.stem}}</p>
						<el-checkbox-group v-if="test.type == '1'" v-model="test.useranswer">
							<!-- label绑定答案的值,可以绑定索引index,也可以绑定答案内容city -->
							<el-checkbox
							v-for="(option,index) in test.answers"
							:label="index"
							:key="index"
							>{{option.value}}</el-checkbox>
						</el-checkbox-group>
						
						<el-radio-group v-else-if="test.type == '0'" v-model="test.useranswer">
							<el-radio
								v-for="(option,index) in test.answers"
								:label="index"
								:key="index"
							>{{option.value}}</el-radio>
						</el-radio-group>
						
						<el-select v-else-if="test.type == '3'" v-model="test.useranswer">
							<el-option
								v-if="test.value == '1'"
							    v-for="item in 10"
							    :key="item"
							    :label="item"
							    :value="item">
							</el-option>
							<el-option
								v-else-if="test.value == '2'"
							    v-for="item in 100"
							    :key="item"
							    :label="item"
							    :value="item">
							</el-option>
							<el-option
								v-else
							    v-for="item in 5"
							    :key="item"
							    :label="item"
							    :value="item">
							</el-option>
						</el-select>
						
						<div v-else>
							<el-input  placeholder="请输入内容" v-model="test.useranswer"></el-input>
						</div>
	            </div>
	          </div>
			  
			  <br />
			  
			  <div>
			    <el-button @click="submitCount" type="primary">提交问卷</el-button>
			  </div>
			  
	          <br />

	        </el-col>
			
	        <el-col :span="8">
	          <div class="grid-content bg-purple-light">
	            <h3>题号:</h3>
	            <div class="tihao">
	              <!-- <span class="ti active">{{index + 1}}</span> -->
	              <div v-for="(test,index) in tests" :key="index">
	                <span v-if="test.useranswer.length == '0' && test.mustdo == 1" class="ti">
						{{index + 1}}
	                </span>
					<span v-else-if="test.useranswer.length == '0' && test.mustdo == 0" class="ti unkey">
						{{index + 1}}
					</span>
					
					<span v-else-if="test.useranswer.length == '0' && test.mustdo == 0" class="ti unkey">
						{{index + 1}}
					</span>
	                <span v-else class="ti active">
						{{index + 1}}
					</span>
					
	              </div>
	            </div>
	          </div>
	        </el-col>
	      </el-row>
	    </el-main>
	  </el-container>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			publisher:'',
			tests: []
		};
	},
	mounted() {
		this.loadmyquestionnaire()
	},
	updated() {
		//console.log(tests);
	},
	methods: {
		loadmyquestionnaire(){
			var _this = this
			this.$axios({
				method:"post",
				url:"http://47.94.221.172:80/usergettest/",
				header:{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data:{
					testid: '2',
					username: '19231163'
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
				this.title = dic.title
				this.publisher = dic.userid
				this.tests = dic.topic
				//for(let item of this.tests){
					//item.cover = 'http://47.94.221.172/' + item.cover
				//}
			})	
		},
		submitCount() {
			console.log("提交试卷");
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
				alert('交卷成功!');
			}else{
				alert('未打完,请继续答卷!');
			}
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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