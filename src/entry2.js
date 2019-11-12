import a from './css/a.less'
import Vue from 'vue'
import App from './app.vue'
document.getElementById('title2').innerHTML = 'title2的内容'
export default function entry2(){
    console.log('entry2')
}

console.log(App,'App')
new Vue({
    el:'#app',
    data:{
        count:90
    },
    template:'<App/>',
    // render:(h)=>h(App),
    components:{App}
})

