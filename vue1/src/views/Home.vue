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
			if(window.sessionStorage.getItem('testid') !== null){
				const id = JSON.parse(window.sessionStorage.getItem('testid' || '[]'))
				const path = JSON.parse(window.sessionStorage.getItem('path' || '[]'))
				window.sessionStorage.removeItem('testid')
				window.sessionStorage.removeItem('path')
				this.$router.push({path: path, query: {testid: id}})
			}
        },
        watch:{
      }
    }
</script>
<style scoped lang="less">

.home {
  display: flex;
  padding-top: 80px;
  //padding-bottom: 60px;
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

</style>
