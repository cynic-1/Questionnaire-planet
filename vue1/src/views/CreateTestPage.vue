<template>
  <div class="new-test">
    <create-test></create-test>
  </div>
</template>

<script>
export default {
  name: "CreateTestPage",
  components: {
    createTest: () => import('@/components/questionnaire/createtest')
  },

}
</script>

<style scoped>
.new-test {
  padding-top: 60px;
  margin-left: 5%;
  margin-right: 5%;
}
</style>
