<template>
  <div>

    <q-drawer show-if-above side="left" bordered>
      <q-tabs
          v-model="tab"
          indicator-color="blue"
          class="text-teal"
          vertical
          shrink
          style="height: 200px"
      >
        <q-tab name="list" icon="today" label="列表视图" />
        <q-tab name="picture" icon="photo" label="图形视图" />
      </q-tabs>
      <div style="text-align: center">
        <q-btn color="cyan" label="导出数据" @click="downloaddate" icon-right="download"></q-btn>
        <br/>
		<br/>
        <q-btn color="blue" label="返回主页" @click="backhome" icon-right="home"></q-btn>
      </div>


    </q-drawer>
<!--			<el-row>-->
<!--			<el-col :span="20">-->
<!--              <div class="testtitle">-->
<!--			    <h2>{{title}}</h2>-->
<!--              </div>-->
<!--			</el-col>-->
<!--			<el-col :span="2">-->
<!--			  <div class="downloaddate">-->
<!--			    <el-button @click="downloaddate" type="text">导出数据信息</el-button>-->
<!--				<el-dialog title="请选择导出类型" :visible.sync="dialogFormVisible3" center :modal-append-to-body="false" style="margin-top: 30px;">-->
<!--					<div slot="footer" class="dialog-footer">-->
<!--					    <el-button @click="downloaddatecancel">取 消</el-button>-->
<!--					    <el-button type="primary" @click="downloaddate_doc">导出为word</el-button>-->
<!--                        <el-button type="primary" @click="downloaddate_excel">导出为excel</el-button>-->
<!--					</div>-->
<!--				</el-dialog>-->
<!--			  </div>-->
<!--			</el-col>-->
<!--			<el-col :span="2">-->
<!--				<el-button @click="backhome" type="text">返回</el-button>-->
<!--			</el-col>-->
<!--			</el-row>-->
    <el-dialog title="请选择导出类型" :visible.sync="dialogFormVisible3" center :modal-append-to-body="false" style="margin-top: 30px;">
      <div slot="footer" class="dialog-footer">
        <q-btn color="red" @click="downloaddatecancel">取 消</q-btn>
        <q-btn color="blue" @click="downloaddate_doc">导出为word</q-btn>
        <q-btn color="green" @click="downloaddate_excel">导出为excel</q-btn>
      </div>
    </el-dialog>

    <br/>
				<div>
					<div v-show="tab==='list'">
					<q-table
      				style="height: 600px"
      				title="提交情况"
      				:data="data"
      				:columns="columns"
      				row-key="index"
      				virtual-scroll
      				:pagination.sync="pagination"
      				:rows-per-page-options="[0]"
    				/>
					</div>
						<div v-show="tab==='picture'">
							<el-card>
								<div id="linechart" style="width: 1200px; height: 400px;"></div>
							</el-card>
							<br/>
							<div v-for="(test, index) in tests" :key="index">
								<el-card v-show="+test.type!==2 && +test.type!==8" class="picturedata">
								<el-collapse >
									<div @click="loadchart(index)">
	 									<el-collapse-item :title="(index + 1)+`.`+test.stem">
											<q-tabs
        									v-model="tab1[index]"
        									class="text-primary"
      										>
        										<q-tab name="bar"  label="柱状图" />
        										<q-tab name="pie"  label="饼状图" />
      										</q-tabs>
											<div v-show="tab1[index]==='bar'" :id="index+'bar'" style="width: 500px; height: 400px;"></div>
											<div v-show="tab1[index]==='pie'" :id="index+'pie'" style="width: 500px; height: 400px;"></div>
	  									</el-collapse-item>	
										</div>	
									</el-collapse>
								</el-card>
								<div v-show="+test.type!==2 && +test.type!==8"><br/></div>
							</div>
	            		</div>
	            </div>
  </div>
</template>

<script>
export default {
	data() {
		return {
			data:[],
			pagination: {
        		rowsPerPage: 0
      		},
      		columns: [{
         		name: 'index',
          		label: '#',
          		field: 'index'
        		},
        		{
          		name: 'user',
          		label: 'user',
          		align: 'center',
          		field:'user',
        		},
        		{ name: 'submit_time', align: 'center', label: 'submit_time', field: 'submit_time' }],
				tab: 'list',
				tab1: [],
				title: '',
				tests: [],
				testid:'',
				dialogFormVisible3:false,
        splitterModel: 20
		};
	},
	created(){
		this.testid=this.$route.query.testid
	},
	mounted() {
		this.loadreport()
		this.loadtable()
    	this.loadline()
	},
	methods: {
		loadtable(){
			this.$axios({
				method:"post",
				url:"http://47.94.221.172/outcomeinlist/",
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
				console.log(res.data)
				this.data=res.data.all.data
				for(let key in res.data.all.columns){
					this.columns.push(res.data.all.columns[key])
				}
			})
		},
		loadline(){
			let column2 = this.$echarts.init(document.getElementById('linechart'));
			// console.log('in loadline ' + column2)
			this.$axios({
				method:"post",
				url:"http://47.94.221.172/line_chart/",
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
				column2.setOption(res.data.option);
			})
		},
		loadchart(index){
			// if(tab1==='bar'){
				let ord2=index.toString()
				let a=ord2+'bar'
				console.log(a)
        		let fuck = document.getElementById(a)
        		console.log(fuck)
				let column1 = this.$echarts.init(document.getElementById(a));
				console.log('sss')
				// console.log('in loadchart' + column1)
				this.$axios({
					method:"post",
					url:"http://47.94.221.172/histogram/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid: this.testid,
						ord: ord2,
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
			// }
			// if(tab1==='pie'){
				let ord1=index.toString()
				let b=ord1+'pie'
				let column2 = this.$echarts.init(document.getElementById(b));
				this.$axios({
					method:"post",
					url:"http://47.94.221.172/pie_chart/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid: this.testid,
						ord:ord1,
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
			// }

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
				for (let i=0;i<this.tests.length;i++){
					this.tab1.push('bar')
				}
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
</style>
