<template>
  <div class="fill-test">
    <div class="left">
      <leftBlock></leftBlock>
    </div>
    <div class="main">
      <fill></fill>
    </div>
  </div>
</template>

<script>
export default {
  name: "FillTest",
  components: {
    leftBlock: () => import('@/components/questionnaire/leftBlockAtHome'),
    fill: () => import('@/components/questionnaire/fill2')
  }
}
</script>

<style scoped lang="less">
.fill-test {
  padding-top: 60px;
  display: flex;
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

