<template>
    <div id="app">
        <span>app组件</span>
        <span ref="one">{{s}}</span>
    </div>
</template>
<script>
export default {
    name:'app',
    data(){
        return {
            s:'ddvdsds'
        }
    },
    beforeCreate(){
        // console.log(this,'beforeCreate')
    },
    beforeMount(){
        console.log(this,'this')
        console.log(this.$refs,'before')
        console.log(Reflect.ownKeys(this.$refs),'所有属性')
        console.log(typeof this.$refs,'type')
        console.log(this.$refs === null,'是否等于null')

        console.log(Object.getOwnPropertyDescriptors(this.$refs),'getOwnPropertyDescriptors')
    },
    mounted(){
        // console.log(Object.getOwnPropertyDescriptors(this.$refs),'after getOwnPropertyDescriptors')
        // console.log(this.$refs['one'],'afet')
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


