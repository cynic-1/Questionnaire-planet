<template>
	<div id="questionnaire">
        <el-card class="box-card-questionnaire">
            <div>
			<el-row :gutter="300">
                <el-col :span="15">
                    <el-input placeholder="请输入问卷名进行搜索" v-model="key" clearable @clear="loadquestionnaire">
                        <el-button slot="append" icon="el-icon-search" @click="loadquestionnaire"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="5">
                    <el-button type="danger" icon="el-icon-delete" circle @click="QuestionnaireBatchDelete">批量删除</el-button>
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
                                <div class="actions">
                                    <el-button type="text" class="el-icon-view" @click="previewquestionnaire(props.row)">预览</el-button>
                                    <el-button type="text" class="el-icon-edit" @click="designClick(props.row)">设计问卷</el-button>
                                    <el-button type="text" class="el-icon-data-analysis" @click="checkreport(props.row)">查看数据分析</el-button>
                                    <el-button type="text" class="el-icon-download" @click="downloadquestionnaire(props.row)">导出</el-button>
                                    <el-button type="text" class="el-icon-share" @click="share(props.row)">分享</el-button>
                                    <el-button type="text" class="el-icon-document-copy" @click="copy">复制</el-button>
                                    <el-dialog title="问卷标题" :visible.sync="dialogFormVisible" center :modal-append-to-body="false" style="margin-top: 30px;">
					                    <el-input v-model="title"  placeholder="请输入问卷标题"></el-input>
					                    <div slot="footer" class="dialog-footer">
					                        <el-button @click="cancel">取 消</el-button>
					                        <el-button type="primary" @click="copyquestionnaire(props.row)">确定</el-button>
					                    </div>
				                    </el-dialog>
                                    <el-button type="text" class="el-icon-delete" @click="deletequestionnaire(props.row)">删除</el-button>
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
                         width="100">
                    </el-table-column>
                    <el-table-column
                        prop="ansernum"
                        label="回收量"
                        sortable
                        width="100">
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
                dialogFormVisible: false,
                title:'',
                key:'',
                tableData:[],
                username: this.$store.state.username,
                memberSelection: [],
            }
        },
		mounted: function () {
			this.loadquestionnaire()
		},
        methods:{
            share(row){
				var link = `http://localhost:8080/#/fill?testid=${row.testid}`
                this.$alert(`${link}`, '分享问卷链接为', {
					confirmButtonText: '确定',
				});
            },
            checkreport(row){   // 查看数据统计
                var _this=this
                this.$router.push({path: "/report" , query: {testid:row.testid}});
            },
            copy(){
                this.dialogFormVisible = true
            },
            copyquestionnaire(row){     // 复制问卷
                var _this=this
                    this.$axios({
					method:"post",
					url:"http://47.94.221.172/copyquestionnaire/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid:row.testid,
                        title:this.title,
					},
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					    }],
                    })
                    this.$message.success('复制成功')
                    this.loadquestionnaire()
            },
            cancel(){
				this.dialogFormVisible = false
                this.title=''
			},
            downloadquestionnaire(row){         // 导出问卷
			    return new Promise((resolve, reject) => {
			        this.$axios({
						method: 'post',
			            url: "http://47.94.221.172/getdocx/",
						header:{
							'Content-Type': 'application/x-www-form-urlencoded'
						},
			            data: {
                            testid:row.testid
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
						console.log(response)
						let fileName = `${row.title}.doc`
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
                        title:this.key,
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
                var self = this
                self.$axios({
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
            async QuestionnaireBatchDelete(){  //批量删除
              if (this.memberSelection.length === 0) {
                await this.$alert('你尚未选中任何问卷！');
                return
              }
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
                  this.$axios({
                      method:"post",
                      url:"http://47.94.221.172/changerecycle/",
                      header:{
              'Content-Type': 'application/x-www-form-urlencoded'
            },
                      data:{
              testid:this.memberSelection,
            },
                      transformRequest:[function(data){
              let ret = ''
              for(let it in data){
                ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
              }
              return ret
              }],
                  })
              .then((res) => {
                console.log(res)
                this.loadquestionnaire()
                this.$message.success('删除问卷成功')
              })
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
            },
			designClick(row){
                if(row.isopen==='1'||row.ansernum>0){
                    this.$alert('您的问卷已发布，无法修改', '注意', {
                        confirmButtonText: '确定',
                    });
                }else{
				    this.$router.push({path: "/createtest", query: {testid:row.testid,type:1}});
                }
			},
            previewquestionnaire(row){
				this.$router.push({path: "/preview", query: {testid:row.testid}});
			}
        }
    }
</script>

<style>
    .box-card-questionnaire {
	    width: 984px;
        height: 600px;
		margin-top: 30px;
	}
    .demo-table-expand {
        width: 15000px;
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
    .actions{
        width: 950px;
    }

</style>
