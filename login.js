function login(){
    let email = document.querySelector('#loginEmail').value;
    let pass = document.querySelector('#loginPassword').value;
    toLogin(email,pass);
    return false;
}
const details = {}
window.onload = function(){
    const accessKey = localStorage.getItem('accessKey')
    if(accessKey !== null){
        check(accessKey);
    }
}
async function check(key){
    console.log('hh')
    const AK = {
        accessKey:key
    } 
    const a = await fetch('http://localhost:3000/check',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(AK)
    })
    const res = await a.json();
    if(a.status === 403 ){
        // alert('not a registered user \n please regiser');     
    }
    else if(a.status === 401){
        // console.log('401')
        localStorage.clear();
        // window.location.replace('/login')
    }         
    else if(a.status===200){
        console.log(window.location);
        window.location.replace('/dashboard');
    }
    details = res;
    return await res;
}

async function toLogin(email,password){
    const a = await fetch('http://localhost:3000/login',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({
            'email':email,
            'password':password
        })
    })
    const res = await a.json();
    console.log(res);
    if(a.status === 403){
        alert('invalid credentials')
    }
    else if(a.status === 401){
        alert('Not a registered user \n please register')
    }
    else{
        //set locatstorage 
        localStorage.setItem('accessKey',res[0].accessToken)
    //    const role = await fetch('http://localhost:3000/check/role',{
    //     method:'POST',
    //     headers:{'Content-Type':'application/json'},
    //     body:JSON.stringify({
    //         token:res.accessToken
    //     })
    //    })
        window.location.replace(`/dashboard`)

    }
}

// document.querySelector('.pp').addEventListener('click',(e)=>{
//     alert('hi')
// })