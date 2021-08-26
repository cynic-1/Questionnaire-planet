<template>
	<el-container>
	    <el-main>
	      <el-row>
			  	<q-tabs
        		v-model="tab"
        		indicator-color="yellow"
        		class="bg-primary text-white shadow-2"
      			>
        		<q-tab name="list" icon="today" label="列表视图" />
        		<q-tab name="picture" icon="photo" label="图形视图" />
      			</q-tabs>
              <div class="testtitle">
			    <h2>{{title}}</h2>
              </div>
	        <el-col :span="16">
				<div>
					<div v-for="(test, index) in tests" :key="index">
                        <el-card>
							<p>{{index + 1}}.{{test.stem}}</p>
                        	<p >{{test.answer}}</p>
							<div v-if="test.type!=='3'">
								<div v-for="(value,key,index) in test.answer_rate"
									:key="index">
                            		{{key}} : {{value}}
                        		</div>
							</div>
							<el-collapse>
  								<el-collapse-item title="查看所有用户个人答案">
    								<div v-for="(value,key,index) in test.all_answer"
										:key="index">
                            			{{key}} : {{value}}
                        			</div>
  								</el-collapse-item>
							</el-collapse>
                        </el-card>
						<el-card v-if="tab=='picture'">
							<div v-if="test.type!=2">
								<div :id="index" style="width: 500px; height: 400px;"></div>
							</div>
						</el-card>
                        <br/>
	            </div>
	          </div>
			  
			  <br />
			  <div class="downloaddate">
			    <el-button @click="downloaddate" type="primary">导出数据信息</el-button>
				<el-dialog title="请选择导出类型" :visible.sync="dialogFormVisible3" center :modal-append-to-body="false" style="margin-top: 30px;">
					<div slot="footer" class="dialog-footer">
					    <el-button @click="downloaddatecancel">取 消</el-button>
					    <el-button type="primary" @click="downloaddate_doc">导出为word</el-button>
                        <el-button type="primary" @click="downloaddate_excel">导出为excel</el-button>
					</div>
				</el-dialog>
				<div class="back_home">
			    	<el-button @click="backhome" type="primary">返回</el-button>
			  	</div>
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
			tab: 'list',
			title: '',
			tests: [],
			testid:'',
			dialogFormVisible3:false,
		};
	},
	created(){
		this.testid=this.$route.query.testid
	},
	mounted() {
		this.loadreport()
	},
	methods: {
        backhome(){
            var _this=this
            this.$router.push({path: "/home"})
        },
		downloaddate(){
                this.dialogFormVisible3 = true
            },
        downloaddatecancel(){
            this.dialogFormVisible3 = false
        },
        downloaddate_doc(){         // 导出数据doc
		    return new Promise((resolve, reject) => {
		        this.$axios({
					method: 'post',
		            url: "http://47.94.221.172/getdocx1/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
			        data: {
                        testid:this.testid
                    },
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
			        responseType: 'blob'
			    }).then(
			        response => {
			        resolve(response.data)
			        let blob = new Blob([response.data], {
						type: 'application/msword'
			        })
					console.log(response.headers)
					let fileName = `${this.title}(数据)`
			         if (window.navigator.msSaveOrOpenBlob) {
			            navigator.msSaveBlob(blob, fileName)
			        } else {
			            var link = document.createElement('a')
			            link.href = window.URL.createObjectURL(blob)
			            link.download = fileName
			            link.click()
			            window.URL.revokeObjectURL(link.href)
			        }
					},
			        err => {
						reject(err)
			        }
		        )
		    })
		},
        downloaddate_excel(){         // 导出数据excel
		    return new Promise((resolve, reject) => {
		        this.$axios({
					method: 'post',
		            url: "http://47.94.221.172/getexcel/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
			        data: {
                        testid:this.testid
                    },
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
			        responseType: 'blob'
			    }).then(
			        response => {
			        resolve(response.data)
			        let blob = new Blob([response.data], {
						type: 'application/vnd.ms-excel'
			        })
					console.log(response.headers)
					let fileName = `${this.title}(数据)`
			         if (window.navigator.msSaveOrOpenBlob) {
			            navigator.msSaveBlob(blob, fileName)
			        } else {
			            var link = document.createElement('a')
			            link.href = window.URL.createObjectURL(blob)
			            link.download = fileName
			            link.click()
			            window.URL.revokeObjectURL(link.href)
			        }
					},
			        err => {
						reject(err)
			        }
		        )
		    })
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
		left: 42%;
		width: 300px;
	}
.back_home{
		position: relative;
		left: 92%;
		width: 200px;
	}
</style>