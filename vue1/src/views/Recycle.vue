<template>
  <div class="recycle">
    <div class="left">
      <leftBlock></leftBlock>
    </div>
    <div class="main">
      <RecycleBin></RecycleBin>
    </div>
  </div>
</template>

<script>
import RecycleBin from "@/components/questionnaire/RecycleBin";
import leftBlock from "@/components/questionnaire/leftBlockAtHome";

export default {
  name: "Recycle",
  components: {
    RecycleBin,
    leftBlock
  }
}
</script>

<style scoped lang="less">
.recycle {
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
