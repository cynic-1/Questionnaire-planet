<template>
	<div id="questionnaire">
        <el-card class="box-card-questionnaire">
            <div>
			<el-row :gutter="300">
                <el-col :span="15">
                    <el-input placeholder="请输入问卷名进行搜索" v-model="title" clearable @clear="loadquestionnaire">
                        <el-button slot="append" icon="el-icon-search" @click="loadquestionnaire"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="danger" icon="el-icon-delete" circle @click="QuestionnaireBatchdelete">批量删除</el-button>
                </el-col>
            </el-row>
            </div>
            <el-table :data="tableData" height="500" stripe  style="width: 100%;opacity: 90%" class="table-questionnaire" @selection-change="memberSelectionChange" :default-sort = "{prop: 'date', order: 'descending'}">
                <el-table-column label="问卷列表">
                    <el-table-column
                        type="selection"
                        width="55">
                    </el-table-column>
                    <el-table-column type="expand">
                    <template slot-scope="props">
                        <el-form label-position="left" inline class="demo-table-expand">
                            <el-form-item >
                                <div>
                                    <el-button type="text" class="el-icon-view" @click="checkClick(props.row.id)">预览</el-button>
                                    <el-button type="text" class="el-icon-edit" @click="checkClick(props.row.id)">设计问卷</el-button>
                                    <el-button type="text" class="el-icon-data-analysis" @click="checkreport(props.row)">查看数据分析</el-button>
                                    <el-button type="text" class="el-icon-download" @click="checkClick(props.row.id)">导出</el-button>
                                    <el-button type="text" size="small" class="el-icon-document-copy" @click="copyquestionnaire(props.row.id)">复制</el-button>
                                    <el-button type="text" size="small" class="el-icon-delete" @click="deletequestionnaire(props.row)">删除</el-button>
                                </div>
                            </el-form-item>
                        </el-form>
                    </template>
                </el-table-column>
                    <el-table-column
                        prop="title"
                        label="问卷名称"
                        width="180">
                    </el-table-column>
                    <el-table-column
                         prop="testid"
                         label="ID"
                         width="180">
                    </el-table-column>
                    <el-table-column
                        prop="sequenced"
                        label="回收量"
                        sortable
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="isopen"
                        label="发布状态"
                        width="100">
                        <template slot-scope="scope">
                            <el-switch v-model="scope.row.isopen"
                            active-value="1"
                            inactive-value="0"
                            @change="useStateChange(scope.row)">
                            </el-switch>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createtime"
                        label="创建日期"
                        sortable
                        width="180">
                    </el-table-column>
                    <el-table-column
                        prop="starttime"
                        label="发布日期"
                        sortable
                        width="180">
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
                title:'',
                tableData:[],
                username:19231163,
                memberSelection: [],
            }
        },
		mounted: function () {
		  this.loadquestionnaire()
		},
        methods:{
            checkreport(){
                var _this=this
                this.$router.push({path: "/report"});
            },
            loadquestionnaire(){
                var _this = this
				this.$axios({
					method:"post",
					url:"http://47.94.221.172/getmytest/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						username:this.username,
                        title:this.title,
					},
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					}],
                }).then((res)=>{
					    // console.log(res.data.list)
                        this.tableData=res.data.list
				    })
            },

            useStateChange(row){
                var _this = this
					this.$axios({
						method:"post",
						url:"http://47.94.221.172/changeopen/",
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

            },
            async QuestionnaireBatchdelete(){  //批量删除
                const confirmResult = await this.$confirm('此操作将移动该问卷到回收站, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                  type: 'warning'
                }).catch(err => err)
                //如果用户确认删除，则返回值为字符串 confirm
                //如果用户取消删除，则返回值为字符串 cancel
                if(confirmResult !=='confirm'){
                    return this.$message.info('已取消删除')
                }
                for(let key in this.memberSelection){
                    this.$axios({
                        method:"post",
                        url:"http://47.94.221.172/changerecycle/",
                        header:{
					    	'Content-Type': 'application/x-www-form-urlencoded'
					    },
                        data:{
					    	testid:this.memberSelection[key],
					    },
                        transformRequest:[function(data){
					    	let ret = ''
					    	for(let it in data){
				    			ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						    }
					    	return ret
				        }],
                    })
                    this.loadquestionnaire()
                }
                this.$message.success('删除问卷成功')

            },
            async deletequestionnaire(row){ //删除
                const confirmResult = await this.$confirm('此操作将移动该问卷到回收站, 是否继续?', '提示', {
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
                this.$message.success('删除问卷成功')
                this.loadquestionnaire()
            },
            memberSelectionChange(val) {
                let id = val.map(item => item.testid)
                this.memberSelection = id;
            }
        }
    }
</script>

<style>
    .box-card-questionnaire {
      width: 1144px;
      height: 600px;
		/*margin-top: 10%;*/
    /*  alignment: center;*/
	}
    .demo-table-expand {
        font-size: 0;
    }
    .demo-table-expand label {
        width: 90px;
        color: #010c1b;
    }
    .demo-table-expand .el-form-item {
        margin-right: 0;
        margin-bottom: 0;
        width: 50%;
    }

</style>
