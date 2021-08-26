<template>
    <div id="app" v-cloak>
        <loading></loading>
        <layout-body></layout-body>
    </div>
</template>
<script>
    import layoutBody from '@/components/layout/layout-body'
    import Loading from '@/components/loading'
    export default {
        name: "app",
        components: {
            layoutBody,
            Loading,
        },
    }
</script>
<style lang="less">
    #app {
        font-size: 17px;
        color: #6f6f6f;
    }
</style>
