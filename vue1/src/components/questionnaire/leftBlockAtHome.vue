<template>
    <el-container>

		<el-aside width="200px">
			<div class="create_qustionnaire">
				<el-button style="width:100%;" @click="create" type="primary" icon="el-icon-circle-plus">创建问卷</el-button>
				<el-dialog title="问卷标题" :visible.sync="dialogFormVisible" center>
					<el-input v-model="title"  placeholder="请输入问卷标题"></el-input>
					<div slot="footer" class="dialog-footer">
					    <el-button @click="cancel">取 消</el-button>
					    <el-button type="primary" @click="createquestionnaire">确定</el-button>
					</div>
				</el-dialog>
			</div>
			<div class="homemenu">
				<el-menu
				    default-active="2"
				    class="el-menu-vertical-demo"
				    background-color="#545c64"
				    text-color="#fff"

				    active-text-color="#ffd04b"
					:router="true">
				    <el-menu-item index="/home">
                	    <i class="el-icon-menu"></i>
                	    <span slot="title">全部问卷</span>
               		</el-menu-item>
					<el-menu-item index="/administerblog">
                	    <i class="el-icon-star-on"></i>
                	    <span slot="title">星标问卷</span>
                	</el-menu-item>
                	<el-menu-item index="/recyclebin">
                	    <i class="el-icon-document-delete"></i>
                	    <span slot="title">回收站</span>
                	</el-menu-item>
				</el-menu>
			</div>
		</el-aside>
		<el-main>

			<router-view></router-view>
		</el-main>
	</el-container>
</template>

<script>
    export default {
		data(){
			return {
				dialogFormVisible: false,
				title: ''
			}
		},
        methods:{
			create(){
				this.dialogFormVisible = true
			},
            createquestionnaire(){
            	if(this.title === ''){
            		this.$message.warning("请输入标题")
            	}
            	else{
            		this.$router.push({path: "/createtest", query: {title:this.title,type:0}});
            	}
            },
			cancel(){
				this.dialogFormVisible = false
				this.title=''
			}
        }

    }
</script>

<style>
    .avatar-container{
		background-color: #545c64;
		color: #ffff;
		height: 200px;
		width: 199px;
		text-align: center;
		/*padding-top: 10px;*/
	}
    .create_qustionnaire{
        /*padding-top: 40px;*/
    }
	.homemenu{
		padding-top: 60px;
	}
</style>
