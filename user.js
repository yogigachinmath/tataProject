window.onload = function(){
    // document.querySelector('.links').style.display = 'none'
    const accessKey = localStorage.getItem('accessKey')
    if(accessKey !== null){
        check(accessKey).then(val => getLinks());
    }
    else{
        window.location.replace('/login');
    }
}
async function check(key){
    const AK = {
        accessKey:key
    } 
    const a = await fetch('http://localhost:3000/check',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(AK)
    })
const res = await a.json();
    // console.log(res);
    pathname = window.location.pathname;
    let arr = Object.values(res[1]);
    pathname = pathname.split('/');
    // console.log(arr[1][pathname[1]]);
    if(a.status === 403 ){
        alert('not a registered user \n please regiser');
        // window.location.replace('/login')
    }
    else if(a.status === 401){
        window.location.replace('/login')
    }
    else if(!arr[1][pathname[1]]){
        console.log(arr[1]);
        window.location.replace('/validate')
    }      
    return await res;
}
async function getLinks(){
    console.log('jfgnjnj')
    const a = await fetch('http://localhost:3000/user')
    const res = await a.json();
    res.map(val => document.querySelector('.links').innerHTML +=`<a download=${val.link} force href=${val.link}>${val.link}</a>`)
}