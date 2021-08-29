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
            <el-table :data="tableData" height="540" stripe  style="width: 100%;opacity: 90%" class="table-questionnaire" @selection-change="memberSelectionChange" :default-sort = "{prop: 'createtime', order: 'descending'}">
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
                                    <el-button type="text" class="el-icon-download" @click="downloadquestionnaire()">导出</el-button>
                                    <el-dialog title="请选择导出类型" :visible.sync="dialogFormVisible2" center :modal-append-to-body="false" style="margin-top: 30px;">
					                    <div slot="footer" class="dialog-footer">
					                        <el-button @click="downloadcancel">取 消</el-button>
					                        <el-button type="primary" @click="downloadquestionnaire_doc(props.row)">导出为word</el-button>
                                            <el-button type="primary" @click="downloadquestionnaire_pdf(props.row)">导出为pdf</el-button>
					                    </div>
				                    </el-dialog>
                                    <el-button type="text" class="el-icon-share" @click="share(props.row)">分享</el-button>
                                    <el-dialog title="问卷地址及二维码" :visible.sync="dialogFormVisible1" center :modal-append-to-body="false" style="margin-top: 30px;">
					                          <div id="link" >{{link}}</div>
                                      <el-avatar shape="square" :size="100" :src="avator"></el-avatar>
					                    <div slot="footer" class="dialog-footer">
					                        <el-button @click="sharecancel">取 消</el-button>
                                            <el-button class="btn" @click="copyLink" data-clipboard-action="copy" data-clipboard-target="#link">复制链接</el-button>
					                        <el-button type="primary" @click="sharequestionnaire(props.row)">下载二维码</el-button>
					                    </div>
				                    </el-dialog>
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
                         prop="type"
                         label="问卷类型"
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
                    <el-table-column
                        prop="endtime"
                        label="截止时间"
                        sortable
                        width="180">
                    </el-table-column>
                </el-table-column>
            </el-table>
        </el-card>
	</div>
</template>

<script>
import {aes_encrypt, aes_decrypt} from "@/utils/encryptURL";
import Clipboard from 'clipboard'

export default {
        data(){
            return{
                dialogFormVisible: false,
                dialogFormVisible1: false,
                dialogFormVisible2: false,
                title:'',
                key:'',
                tableData:[],
                username: this.$store.state.username,
                memberSelection: [],
                link:'',
                avator:'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
                avatorpath:'',
                judge1:false,
            }
        },
		mounted: function () {
			this.loadquestionnaire()
		},
        methods:{
            copyLink () {
                let clipboard = new Clipboard('.btn')
                clipboard.on('success', e => {
                this.$message.success('复制链接成功')
                clipboard.destroy() // 使用destroy可以清楚缓存
                })
                clipboard.on('error', e => {
                clipboard.destroy()
                })
            },
            share(row){
                let encTestId = aes_encrypt(row.testid, 'cynic', false)
              encTestId = encodeURIComponent(encTestId)
                if(row.type==='普通问卷'||row.type==='可重复普通问卷'){
				    this.link = `http://47.94.221.172/#/fill?testid=${encTestId}`
                }
                if(row.type==='报名问卷'||row.type==='可重复报名问卷'){
			        this.link = `http://47.94.221.172/#/fill3?testid=${encTestId}`
                }
                if(row.type==='投票问卷'||row.type==='可重复投票问卷'){
                    this.link = `http://47.94.221.172/#/fill2?testid=${encTestId}`
                }
                if(row.type==='打卡问卷'||row.type==='可重复打卡问卷'){
			        this.link = `http://47.94.221.172/#/fill?testid=${encTestId}`
                }
                if(row.type==='考试问卷'||row.type==='可重复考试问卷'){
			        this.link = `http://47.94.221.172/#/fill5?testid=${encTestId}`
                }
                this.$axios({
					method:"post",
					url:"http://47.94.221.172/makeqrcode/",
					header:{
						'Content-Type': 'application/x-www-form-urlencoded'
					},
					data:{
						testid:row.testid,
                        url:this.link,
					},
					transformRequest:[function(data){
						let ret = ''
						for(let it in data){
							ret += encodeURIComponent(it) + '=' + encodeURIComponent(data[it]) + '&'
						}
						return ret
					    }],
                    }).then((res)=>{
                    this.avator = 'http://47.94.221.172/' + res.data.path;
                    this.avatorpath = res.data.path

				})
                this.dialogFormVisible1 = true
            },
            sharequestionnaire(row){
                 return new Promise((resolve, reject) => {
			        this.$axios({
						method: 'post',
			            url: "http://47.94.221.172/downlowdqrcode/",
						header:{
							'Content-Type': 'application/x-www-form-urlencoded'
						},
			            data: {
                            path:this.avatorpath
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
							type: 'application/x-png'
			            })
						console.log(response)
						let fileName = `${row.title}.png`
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
            sharecancel(){
                this.dialogFormVisible1 = false
                this.link=''
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
                    }).then(() => {
                      this.$message.success('复制成功')
                      this.dialogFormVisible = false
                      this.loadquestionnaire()
                    })
            },
            cancel(){
				this.dialogFormVisible = false
                this.title=''
			},
         downloadquestionnaire(){
                this.dialogFormVisible2 = true
            },
            downloadcancel(){
                this.dialogFormVisible2 = false
            },
            downloadquestionnaire_doc(row){         // 导出问卷doc
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
            downloadquestionnaire_pdf(row){         // 导出问卷pdf
			    return new Promise((resolve, reject) => {
			        this.$axios({
						method: 'post',
			            url: "http://47.94.221.172/getpdf/",
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
							type: 'application/pdf'
			            })
						console.log(response)
						let fileName = `${row.title}.pdf`
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
                    url:"http://47.94.221.172/outoftime/",
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
                }).then((res)=>{
                    console.log(res.data.outoftime)
				    this.judge1=res.data.outoftime;
                    if(this.judge1){
                        this.$confirm('此问卷已过截止时间,开启将重置截止时间, 是否继续?', '提示', {
                            confirmButtonText: '确定',
                            cancelButtonText: '取消',
                           type: 'warning'
                        }).then(() => {
                            console.log('hhhh')
                            this.StateChange(row)
                            this.$message({
                                type: 'success',
                                message: '操作成功!'
                            });
                            // this.loadquestionnaire()
                        }).catch(() => {
                         this.loadquestionnaire()
                         this.$message({
                            type: 'info',
                            message: '已取消操作'
                            });
                        });
                    }else{
                    this.StateChange(row)
                    }
                })
            },
            StateChange(row){
                console.log('ss')
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
                    if(row.type==='普通问卷'||row.type==='可重复普通问卷'){
				        this.$router.push({path: "/createtest", query: {testid:row.testid,type:1}});
                    }
                    if(row.type==='报名问卷'||row.type==='可重复报名问卷'){
				        this.$router.push({path: "/createtest3", query: {testid:row.testid,type:1}});
                    }
                    if(row.type==='投票问卷'||row.type==='可重复投票问卷'){
				        this.$router.push({path: "/createtest2", query: {testid:row.testid,type:1}});
                    }
                    if(row.type==='打卡问卷'||row.type==='可重复打卡问卷'){
				        this.$router.push({path: "/createtest4", query: {testid:row.testid,type:1}});
                    }
					if(row.type==='考试问卷'||row.type==='可重复考试问卷'){
					    this.$router.push({path: "/createtest5", query: {testid:row.testid,type:1}});
					}
                }
			},
            previewquestionnaire(row){
                let encTestId = aes_encrypt(row.testid, 'cynic', false)
				    this.$router.push({path:"/preview", query: {testid: encTestId}});
			}
        }
    }
</script>

<style>
    .box-card-questionnaire {
	    width: 984px;
        height: 640px;
		/*margin-top: 30px;*/
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
