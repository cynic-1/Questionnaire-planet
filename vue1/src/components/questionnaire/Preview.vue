<template>

<el-card>
			  <div class="test-title">{{title}}</div>

				<div class="grid-content bg-purple">
					<div class="element" v-for="(test, index) in tests" :key="index">
            <div style="margin-bottom: 10px">
						<p style="font-size: 24px; margin-top: 10px">{{index + 1}}.{{test.stem}}</p>
						<p style="font-size: 10px; margin-top: 10px; ">{{test.describe}}</p>
            </div>
						<el-checkbox-group v-if="test.type === 1" v-model="test.answers">
							<el-checkbox
							v-for="(option,index) in test.answers"
							:label="option.value"
							:key="index"
							>{{option.value}}</el-checkbox>
						</el-checkbox-group>

						<el-radio-group v-else-if="test.type === 0">
							<el-radio
								v-for="(option,index) in test.answers"
								:label="option.value"
								:key="index"
							>{{option.value}}</el-radio>
						</el-radio-group>

						<el-select v-else-if="test.type === 3">
							<el-option
							    v-for="item in 10"
							    :key="item"
							    :label="item"
							    :value="item">
							</el-option>
						</el-select>

						<div v-else>
							<el-input  placeholder="请输入内容"  :disabled="true"></el-input>
						</div>
	            </div>
	          </div>

			  <br />

			  <div class="return-button">
			    <el-button @click="back" type="primary">返回</el-button>
			  </div>

	          <br />


</el-card>
</template>

<script>
export default {
	data() {
		return {
			title: '',
			publisher:'',
			tests: [],
			username:this.$store.state.username,
            testid:'',
		};
	},
    created(){
		this.testid=this.$route.query.testid
	},
	mounted() {
		this.previewmyquestionnaire()
	},
	methods: {
		previewmyquestionnaire(){
			this.$axios({
				method:"post",
				url:"http://47.94.221.172:80/previewquestionnaire/",
				header:{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data:{
					testid: this.testid,
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
				console.log(res.data)
				//if (res.data.code !== '200') return this.$router.push('/404');
				this.title = dic.title
				this.publisher = dic.userid
				this.tests = dic.topic
				console.log(this.tests[0].answers)

			})
		},
        back(){
            this.$router.push({path: "/home"});
        }
	}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="less">
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

.el-col {
  alignment: center;
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
