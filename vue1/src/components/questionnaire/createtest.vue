<template>
	<div class="hello">
		<el-container>
		<el-aside width="200px">
			<el-menu
			    default-active="2"
			    class="el-menu-vertical-demo"
			    background-color="#545c64"
			    text-color="#fff"
			    active-text-color="#409EFF">
			    <el-submenu index="1">
					<template slot="title">
						<span>选择题</span>
					</template>
					<el-menu-item-group>
						<el-menu-item @click="addSingle">单选题</el-menu-item>
						<el-menu-item @click="addMulti">多选题</el-menu-item>
					</el-menu-item-group>
				</el-submenu>

				<el-menu-item-group>
					<el-menu-item @click="addBlank">填空题</el-menu-item>
					<el-menu-item @click="addRank">评分题</el-menu-item>
				</el-menu-item-group>

			</el-menu>
		</el-aside>
		<el-main>
			<el-form ref="modelForm" :rule="rules" :model="modelForm" label-position="right" label-width="100px">
				<h1 class="quetitle">{{modelForm.title}}</h1>
				<vuedraggable v-model="modelForm.topic" class="wrapper" @end="end">
					<div v-for="(item, index) in modelForm.topic" :key="index">
						<el-collapse>
							<el-collapse-item>
								<template slot="title">
									第{{ index+1 }}题&emsp;{{modelForm.table[item.type]}}题,&emsp;&emsp;题目:{{ item.questionName }}
								</template>
								<!-- 问题 -->

								<el-form-item
									:prop="`topic.${index}.questionName`"
									label="问题"
									:rules="{ required: true, message: '请填写问题', trigger: 'change' }">
									<el-input v-model.trim="item.questionName" style="width:258px" clearable placeholder="请填写问题" />

									<br />
									<template>
										<el-radio v-model="item.key" label=true>必填</el-radio>
										<el-radio v-model="item.key" label=false>选填</el-radio>
									</template>
									
								</el-form-item>
								
								<el-form-item>
									<el-input v-model.trim="item.describe" type="textarea" style="width:258px" clearable placeholder="请填写问题描述" />
								</el-form-item>

								<!-- 答案 -->
								<el-form-item
									v-for="(opt, idx) in item.answers"
									v-if="item.type!=2 && item.type !=3"
									:key="idx"
									:label="`选项${idx + 1}`"
									:prop="`topic.${index}.answers.${idx}.value`"
									:rules="[
										{ required: true, message: '请输入答案', trigger: 'blur' },
									]">
									<el-input v-model.trim="opt.value" style="width:258px" clearable placeholder="请输入答案" />
									<el-button style="margin-left: 20px" @click.prevent="removeDomain(index,idx)">删除</el-button>
								</el-form-item>

								<el-form-item
									v-else-if="item.type==3"
									:prop="`topic.${index}.answers.value`"
									:rules="[
										{ required: true, message: '请输入范围', trigger: 'blur' },
									]">
									<el-select v-model="item.answers.value" placeholder="请选择范围">
									    <el-option
											v-for="item in options"
											:key="item.value"
											:label="item.label"
											:value="item.value">
									    </el-option>
									</el-select>
								</el-form-item>

								<el-form-item>
									<el-button v-show="item.type!=2 && item.type !=3" @click="addDomain(index)">新增选项</el-button>
									<el-button @click="removeQuestion(index)">删除题目</el-button>
									<el-button style="margin-left: 20px" @click="copy(item)">复制题目</el-button>
									<br /><br />
									<el-button size=small @click="moveup(item)" v-if="index!=0">上移</el-button>
									<el-button size=small @click="movedown(item)" v-if="index!=modelForm.topic.length-1">下移</el-button>
								</el-form-item>
							</el-collapse-item>
						</el-collapse>
					</div>
				</vuedraggable>

				<!--  设置问卷时间

				<el-form-item label="截止时间" style="margin-top: 30px;">
					<el-date-picker
						label="有效时间"
						v-model="modelForm.time"
						value-format="yyyy-MM-dd HH:mm:ss"
						type="datetimerange"
						range-separator="至"
						start-placeholder="开始日期"
						end-placeholder="结束日期">
					</el-date-picker>
				</el-form-item>

				-->

				<el-form-item>
					<el-button style="margin-top: 10px" @click="addSubmit()">编辑完成</el-button>
					<el-button @click="resetForm('modelForm')">重置</el-button>
				</el-form-item>
			</el-form>
		</el-main>
		</el-container>
	  </div>
</template>

<script>
	import vuedraggable from 'vuedraggable'
	import qs from 'qs'
	export default {
		components:{
			vuedraggable
		},
		data() {
			return {
				url: "http://47.94.221.172:80/modifyquestionnaire/",
				testid: '',
				rules: {},
				modelForm: {
					userid: this.$store.state.username,
					topic: [],
					title: '',
					time: '',
					table: ['单选','多选','填空','评分']
				},
				options: [{
					value: 1,
					label: '1~10分'
					}, {
					value: 2,
					label: '1~100分'
					}, {
					value: 3,
					label: '一星到五星制'
					},
				],
			}
		},
		created(){
			const type = this.$route.query.type
			if(type == 0){
				this.modelForm.title = this.$route.query.title
				this.url = "http://47.94.221.172:80/publishquestionnaire/"
			}
			else{
				this.testid = this.$route.query.testid
				this.loadtest()
			}
		},
		methods: {
			loadtest(){
				var _this = this
				this.$axios({
					method:"post",
					url:"http://47.94.221.172:80/getquestionnaire/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid: this.testid
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
					this.modelForm.title = dic.title
					for(let item of dic.topic){
						const question = { type: '', questionName: '',key: '', answers: '',describe: '' }
						question.type = String(item.type)
						question.questionName = item.stem
						question.key = item.mustdo == 1?'true':'false'
						question.answers = item.answers
						question.describe = item.describe
						//console.log(question)
						this.modelForm.topic.push(question)
					}
				})
			},
			end(evt) {
			  this.$refs.modelForm.clearValidate()
			},
			removeDomain(index, idx) { // 删除选项
			  this.modelForm.topic[index].answers.splice(idx, 1)
			},
			removeQuestion(index) {//删除题目
			  this.modelForm.topic.splice(index, 1)
			},
			addDomain(index) { // 新增选项
			  this.modelForm.topic[index].answers.push({ value: '' })
			},
			resetForm(formName) { // 重置
			  this.$refs[formName].resetFields()
			},
			moveup(item){		//上移
			  let index = this.modelForm.topic.indexOf(item)
			  this.modelForm.topic.splice(index,1)
			  this.modelForm.topic.splice(index-1,0,item)
			},
			movedown(item){		//下移
			  let index = this.modelForm.topic.indexOf(item)
			  this.moveup(this.modelForm.topic[index+1])
			},
			addSubmit() {
				//console.log(this.modelForm.topic[0].answers[1].value)
				if(this.modelForm.topic.length == 0)
					return this.$message.info("问卷至少包含一个题目！")
				this.$refs.modelForm.validate(valid => {
					if (valid) {
						this.$axios({
							method:"post",
							url: this.url,
							header:{
								'Content-Type': 'application/x-www-form-urlencoded'
							},
							data:{
								title: this.modelForm.title,
								topic: this.modelForm.topic,
								userid: this.modelForm.userid,
								testid: this.testid
							},
							traditinal: true,
							paramsSerializer: data => {
								return qs.stringify(data, { indices: false })
							}
						}).then((res)=>{
							console.log(res.data)
							if (res.data.code !== '200') return this.$message.error('保存失败');
							this.$message.success('保存成功')
							this.$router.push('/home')
						})	

					}
				})
			},
			addSingle(){
				this.modelForm.topic.push({ type: '0', questionName: '',key: 'false', answers: [{ value: '' }] ,describe: ''})
			},
			addMulti(){
				this.modelForm.topic.push({ type: '1', questionName: '',key: 'false', answers: [{ value: '' }] , describe: ''})
			},
			addBlank(){
				this.modelForm.topic.push({ type: '2', questionName: '',key: 'false', answers: [{ value: '' }] , describe: ''})
			},
			addRank(){
				this.modelForm.topic.push({ type: '3', questionName: '',key: 'false', answers: { value: ''} , describe: ''})
			},
			copy(item){
				var newitem = JSON.parse(JSON.stringify(item))
				this.modelForm.topic.push(newitem)
			}
		}
	}
</script>

<style scoped>
	.quetitle{
		position: relative;
		left: 45%;
		width: 200px;
	}
</style>



