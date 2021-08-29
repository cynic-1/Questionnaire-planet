<template>
  <div class="introduction">
    <div style="float: right; margin: 100px">
      <q-btn to="/login" label="开始使用天问" size="40px" rounded color="cyan"/>
    </div>

  </div>
</template>

<script>
export default {
name: "IntroductionPage"
}
</script>

<style scoped>
.introduction {
  width: 100vw;
  height: 80vh;
  box-sizing: border-box;
  background-image: url("../assets/intro.png");
  background-size: cover;
}
</style>
