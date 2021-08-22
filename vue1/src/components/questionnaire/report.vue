<template>
	<el-container>
	    <el-main>
	      <el-row>
              <div class="testtitle">
			    <h2>{{title}}</h2>
              </div>
	        <el-col :span="16">
				<div>
					<div v-for="(test, index) in tests" :key="index">
                        <el-card>
						<p>{{index + 1}}.{{test.stem}}</p>
                        <p>{{test.answer}}</p>
                        <div v-for="(value,key,index) in test.all_answer"
							:key="index">
                            {{key}} : {{value}}
                        </div>
                        </el-card>
                        <br/>
	            </div>
	          </div>
			  
			  <br />
			  
			  <div class="back_home">
			    <el-button @click="backhome" type="primary">返回</el-button>
			  </div>
			  
	          <br />

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
			tests: []
		};
	},
	mounted() {
		this.loadreport()
	},
	methods: {
        backhome(){
            var _this=this
            this.$router.push({path: "/questionnairelist"})
        },
		loadreport(){
			var _this = this
			this.$axios({
				method:"post",
				url:"http://47.94.221.172/getoutcome/",
				header:{
					'Content-Type': 'application/x-www-form-urlencoded'
				},
				data:{
					testid: '2',
				},
				transformRequest:[function(data){
					let ret = ''
					for(let it in data){
						ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
					}
					return ret
				}],
			}).then((res)=>{
				const dic = res.data
				console.log(dic.allinfo)
				//if (res.data.code !== '200') return this.$router.push('/404');
				this.title = dic.title
				this.tests = dic.allinfo
                console.log(this.tests)
				//for(let item of this.tests){
					//item.cover = 'http://47.94.221.172/' + item.cover
				//}
			})	
		},
		
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2 {
  font-weight: normal;
}

/* 题目*/
.tihao {
  display: flex;
  justify-content: space-around;
}
.testtitle{
		position: relative;
		left: 30%;
		width: 200px;
	}
.back_home{
		position: relative;
		left: 92%;
		width: 200px;
	}
</style>