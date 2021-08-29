<template>
    <el-container>

		<el-aside width="200px">
			<div class="create_qustionnaire">
				<el-dropdown split-button type="primary">
				  新建问卷
				  <el-dropdown-menu slot="dropdown">
				    <el-dropdown-item @click.native="create('1')">普通问卷</el-dropdown-item>
				    <el-dropdown-item @click.native="create('2')">投票问卷</el-dropdown-item>
				    <el-dropdown-item @click.native="create('3')">报名问卷</el-dropdown-item>
				    <el-dropdown-item @click.native="create('5')">考试问卷</el-dropdown-item>
				    <el-dropdown-item @click.native="create('4')">疫情填报问卷</el-dropdown-item>
				  </el-dropdown-menu>
				</el-dropdown>
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
              <router-link to="/home">
                	    <i class="el-icon-menu"></i>
                	    <span>全部问卷</span>
              </router-link>
               		</el-menu-item>
<!--					<el-menu-item>-->
<!--            <router-link to="/administerblog">-->
<!--                	    <i class="el-icon-star-on"></i>-->
<!--                	    <span>星标问卷</span>-->
<!--            </router-link>-->
<!--                	</el-menu-item>-->
                	<el-menu-item>
                    <router-link to="/recyclebin">
                	    <i class="el-icon-document-delete"></i>
                	    <span>回收站</span>
                      </router-link>
                  </el-menu-item>
				</el-menu>
			</div>
		</el-aside>
	</el-container>
</template>

<script>
    export default {
		data(){
			return {
				dialogFormVisible: false,
				title: '',
				newtype: '1'
			}
		},
        methods:{
			create(type){
				this.dialogFormVisible = true
				this.newtype = type
				console.log(this.newtype)
			},
            createquestionnaire(){
            	if(this.title === ''){
            		this.$message.warning("请输入标题")
            	}
            	else{
					if(this.newtype === '1')
						this.$router.push({path: "/createtest", query: {title:this.title,type:0}});
					if(this.newtype === '2')
						this.$router.push({path: "/createtest2", query: {title:this.title,type:0}});
					if(this.newtype === '3')
						this.$router.push({path: "/createtest3", query: {title:this.title,type:0}});
					if(this.newtype === '4')
						this.$router.push({path: "/createtest4", query: {title:this.title,type:0}});
					if(this.newtype === '5')
						this.$router.push({path: "/createtest5", query: {title:this.title,type:0}});
            	}
            },
			cancel(){
				this.dialogFormVisible = false
				this.title=''
			}
        }

    }
</script>

<style lang="less">
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
    .router-link-exact-active {
      color: #ffd04b !important;
      i {
        color: #ffd04b;
      }
    }

    .el-menu-item:hover {
      color: #ffd04b !important;
      i {
        color: #ffd04b;
      }
    }

</style>
