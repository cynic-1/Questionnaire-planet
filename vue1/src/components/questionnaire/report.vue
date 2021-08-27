<template>
	<el-container>
	    <el-main>
			  	<q-tabs
        		v-model="tab"
        		indicator-color="yellow"
        		class="bg-primary text-white shadow-2"
      			>
        		<q-tab name="list" icon="today" label="列表视图" />
        		<q-tab name="picture" icon="photo" label="图形视图" />
      			</q-tabs>
			<el-row>
			<el-col :span="20">
              <div class="testtitle">
			    <h2>{{title}}</h2>
              </div>
			</el-col>
			<el-col :span="2">
			  <div class="downloaddate">
			    <el-button @click="downloaddate" type="text">导出数据信息</el-button>
				<el-dialog title="请选择导出类型" :visible.sync="dialogFormVisible3" center :modal-append-to-body="false" style="margin-top: 30px;">
					<div slot="footer" class="dialog-footer">
					    <el-button @click="downloaddatecancel">取 消</el-button>
					    <el-button type="primary" @click="downloaddate_doc">导出为word</el-button>
                        <el-button type="primary" @click="downloaddate_excel">导出为excel</el-button>
					</div>
				</el-dialog>
			  </div>
			</el-col>
			<el-col :span="2">
				<el-button @click="backhome" type="text">返回</el-button>
			</el-col>
			</el-row>  
			  <br/>
				<div>
					<div v-if="tab=='list'">
					<el-table :data="tableData" height="500" stripe  style="width: 100%;opacity: 90%" class="table-questionnaire" @selection-change="memberSelectionChange">
              			<el-table-column
                  		type="selection"
                  		width="55">
              			</el-table-column>
              			<el-table-column label="问卷列表">
							<el-table-column
      							type="index"
								label="序号"
      							width="50">
   							</el-table-column>
                        	<el-table-column
                        	    prop="title"
                        	    label="问卷名称"
                        	    width="180">
                        	</el-table-column>
                        	<el-table-column
                        	    prop="createtime"
                        	    label="创建日期"
                        	    width="180">
                        	</el-table-column>
                       		<el-table-column
                        	    prop="sequenced"
                        	    label="回收量"
                        	    width="125">
                        	 </el-table-column>
                        	<el-table-column
                        	    fixed="right"
                    		    label="恢复"
                    	        width="125">
                        	<template slot-scope="scope">
                                <el-button size="small" type="success" class=" el-icon-video-play" @click="recover(scope.$index, scope.row)"></el-button>
                        	</template>
                        	</el-table-column>
                        	<el-table-column
                         	fixed="right"
                            label="彻底删除"
                            width="132">
                            <template slot-scope="scope">
                                <el-button size="small" type="danger" class="el-icon-circle-close" @click="DeleteForever(scope.$index, scope.row)"></el-button>
                            </template>
                        	</el-table-column>
                		</el-table-column>
            		</el-table>
					</div>
  						<!-- <el-col :span="8">
						<div v-if="tab=='list'">
                        	<el-card class="listdata">
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
						</div>
						</el-col> -->
						<div v-if="tab=='picture'">
							<div v-for="(test, index) in tests" :key="index">
								<el-card v-if="test.type!=2" class="picturedata">
									<el-collapse >
										<div @click="loadchart(index,tab1)">
  										<el-collapse-item :title="(index + 1)+`.`+test.stem">
											<q-tabs
        									v-model="tab1"
        									class="text-primary"
      										>
        										<q-tab name="bar"  label="柱状图" />
        										<q-tab name="pie"  label="饼状图" />
      										</q-tabs>
											<div v-if="tab1=='bar'" :id="index" style="width: 500px; height: 400px;"></div>
											<div v-if="tab1=='pie'" :id="index" style="width: 500px; height: 400px;"></div>

  										</el-collapse-item>
										</div>
									</el-collapse>
								</el-card>
								<div v-if="test.type!=2"><br/></div>
							</div>
						
	            		</div>
	            </div>
			  
			  <br />

	    </el-main>
	  </el-container>
</template>

<script>
export default {
	data() {
		return {
			tab: 'list',
			tab1: 'bar',
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
		loadchart(index,tab1){
			if(tab1=='bar'){
				var a = index.toString()
				var column1 = this.$echarts.init(document.getElementById(a));
				this.$axios({
					method:"post",
					url:"http://47.94.221.172/histogram/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid: this.testid,
						ord:a,
					},
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
				}).then((res)=>{
					column1.setOption(res.data.option);
				})
			}else{
				var b = index.toString()
				var column2 = this.$echarts.init(document.getElementById(b));
				this.$axios({
					method:"post",
					url:"http://47.94.221.172/pie_chart/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid: this.testid,
						ord:b,
					},
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
				}).then((res)=>{
					column2.setOption(res.data.option);
				})
			}
			
		},
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
		left: 50%;
		width: 300px;
	}
.picturedata{
	width: 700px;
	position:relative;
	left: 50%;
	transform: translate(-50%,0);
}
.listdata{
	/* background-color: rgb(79, 244, 250); */
}
</style>