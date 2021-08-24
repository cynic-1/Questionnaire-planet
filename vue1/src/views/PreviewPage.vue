<template>
  <div class="preview">
    <div class="left">
      <leftBlock></leftBlock>
    </div>
    <div class="main">
      <preview></preview>
    </div>
  </div>
</template>

<script>
export default {
  name: "PreviewPage",
  components: {
    leftBlock: () => import('@/components/questionnaire/leftBlockAtHome'),
    preview: () => import('@/components/questionnaire/Preview')
  }
}
</script>

<style scoped lang="less">
.preview {
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
</style>
