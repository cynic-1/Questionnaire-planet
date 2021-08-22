<template>
	<div id="recyclebin">
        <el-card class="box-card-recyclebin">
            <div>
			<el-row :gutter="300">
                <el-col :span="15">
                    <div>如果您想释放上传文件题的空间，请点击“清空数据”，数据清空后将无法恢复，请谨慎操作！</div>
                </el-col>
                <el-col :span="5">
                    <el-button type="danger" icon="el-icon-delete" size="small" @click="QuestionnaireBatchdelete">清空回收站</el-button>
                </el-col>
            </el-row>
            </div>
            <el-table :data="tableData" height="500" stripe  style="width: 100%;opacity: 90%" class="table-questionnaire" >
                <el-table-column label="问卷列表">
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
                            width="180">
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
        </el-card>
	</div>
</template>

<script>
    export default {
        data(){
            return{
                key:'',
                tableData:[],

                memberSelection: [],
                username:19231163
            }
        },
		mounted: function () {
		  this.loadrecyclebin()
		},
        methods:{
            loadrecyclebin(){
                var _this = this
				this.$axios.get("http://47.94.221.172/getmydeletetest/",{params : {username: this.username}})
				.then((res)=>{
					// console.log(res.data.list)
                    this.tableData=res.data.list
				})
            },
            async recover($index, row){ //恢复问卷
                const confirmResult = await this.$confirm('此操作将恢复该问卷, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                //如果用户确认删除，则返回值为字符串 confirm
                //如果用户取消删除，则返回值为字符串 cancel
                if(confirmResult !=='confirm'){
                    return this.$message.info('已取消删除')
                }

                await this.$axios({
                    method:"post",
                    url:"http://47.94.221.172/changerecycle/",
                    header:{
								'Content-Type': 'application/x-www-form-urlencoded'
					},
                    data:{
						testid:row.testid,
					},
                    transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
				    }],
                })
                this.$message.success('恢复问卷成功')
                this.loadrecyclebin()
            },
             async QuestionnaireBatchdelete(){  //清空回收站
                const confirmResult = await this.$confirm('此操作将清空回收站, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                //如果用户确认删除，则返回值为字符串 confirm
                //如果用户取消删除，则返回值为字符串 cancel
                if(confirmResult !=='confirm'){
                    return this.$message.info('已取消删除')
                }
                for(let key in this.tableData){
                    this.$axios({
                        method:"post",
                        url:"http://47.94.221.172/deletemyquestionnaire/",
                        header:{
					    	'Content-Type': 'application/x-www-form-urlencoded'
					    },
                        data:{
					    	testid:this.tableData[key].testid,
					    },
                        transformRequest:[function(data){
					    	let ret = ''
					    	for(let it in data){
				    			ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						    }
					    	return ret
				        }],
                    })
                   this.loadrecyclebin()
                }
                this.$message.success('清空回收站成功')
                
            },
            async DeleteForever($index, row){ //彻底删除问卷
                const confirmResult = await this.$confirm('此操作将彻底删除该问卷, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                //如果用户确认删除，则返回值为字符串 confirm
                //如果用户取消删除，则返回值为字符串 cancel
                if(confirmResult !=='confirm'){
                    return this.$message.info('已取消删除')
                }

                await this.$axios({
                    method:"post",
                    url:"http://47.94.221.172/deletemyquestionnaire/",
                    header:{
								'Content-Type': 'application/x-www-form-urlencoded'
					},
                    data:{
						testid:row.testid,
					},
                    transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
				    }],
                })
                this.$message.success('删除问卷成功')
                this.loadrecyclebin()
            }
        }
    }
</script>

<style>
    .box-card-recyclebin {
	    width: 840px;
        height: 600px;
		margin-top: 30px;
	}
    
</style>