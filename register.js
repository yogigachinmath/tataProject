function register() {
    let email = document.querySelector('#exampleInputEmail1').value;
    let pass = document.querySelector('#exampleInputPassword1').value;
    let username = document.querySelector('#username').value;
    let role = document.querySelector('#role').value;
    toRegister(email,pass,username,role);
    return false;
  }
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
        console.log('401')
        // window.location.replace('/login')
    }         
    else if(a.status===200){
        console.log(window.location);
        window.location.replace('/dashboard');
    }
    return await res;
}
  async function toRegister(email,pass,username,role){
      let data = {
          "email":email,
          "password":pass,
          "username":username,
          "role":role
      }
      console.log(data)
    const a = await fetch('http://localhost:3000/register',{
          method:'POST',
          headers:{'Content-Type':'application/json'},
          body:JSON.stringify(data)
      })
      const res = await a.json();
      if(a.status === 409){
          alert('user already exists');
      }
      else if (a.status === 200){
          console.log(res);
        localStorage.setItem('accessKey',res.accessToken)
        window.location.replace(`/dashboard`);
      }
  }