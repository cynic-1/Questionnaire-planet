<template>
    <div class="home">
        <div class="left">
          <leftBlock></leftBlock>
        </div>
        <div class="main">
          <questionnairelist></questionnairelist>
        </div>
    </div>
</template>

<script>
    import questionnairelist from "@/components/questionnaire/questionnairelist"
    import leftBlock from '@/components/questionnaire/leftBlockAtHome'

    export default {
        name: 'Home',
        props: ['cate', 'words'],
        data() {
            return {
                postList1: [],
                currPage: 1,
                hasNextPage: false
            }
        },
        components: {
            questionnairelist,
            leftBlock
        },
      computed: {
        },
        methods: {
        },
        mounted() {
			console.log(this.$store.state.hasLogin)
        },
        watch:{
      }
    }
</script>
<style scoped lang="less">

.home {
  display: flex;
  padding-top: 60px;
  .left {
    width: 20%;
    height: 40%;
    margin-left: 5%;
  }

  .main {
    width: 70%;
    height: 40%;
    margin-right: 5%;
    alignment: center;
  }
}
    //.site-content {
    //  //display: flex;
    //    .notify {
    //        //margin: 60px 0;
    //        border-radius: 3px;
    //        & > div {
    //            padding: 20px;
    //        }
    //    }
    //
    //    .search-result {
    //        padding: 15px 20px;
    //        text-align: center;
    //        font-size: 20px;
    //        font-weight: 400;
    //        border: 1px dashed #ddd;
    //        color: #828282;
    //    }
    //}
    //.el-card {
    //  margin-bottom: 10px;
    //}
    ///******/
</style>
