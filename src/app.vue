<template>
    <div id="app">
        <span>app组件</span>
        <span>{{s}}</span>
    </div>
</template>
<script>
export default {
    name:'app',
    data(){
        return {
            s:'ddvdsds'
        }
    }
}
</script>
<style scoped>
    #app{
        background: black;
        width:300px;
        height:200px;
        color: #fff;
    }
</style>


