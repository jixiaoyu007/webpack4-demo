require('./css/index.css')
import {
    fetch
} from './common.js'
// import entry from './entry2.js'

// entry()
document.getElementById('title1').innerHTML = 'title的内容';
let s = 90;
console.log(s)
$('#title1').html('jqueryddddd')
async function refreshSalt() {
    
    const res = await fetch()
        .post('/api/?r=auth/login/refreshsalt')
        .catch(() => {
            console.log('请求接口报错')
        })
    console.log('res',res)    

}
refreshSalt()