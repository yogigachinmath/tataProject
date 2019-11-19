function register() {
  let email = document.querySelector('#exampleInputEmail1').value;
  let pass = document.querySelector('#exampleInputPassword1').value;
  let username = document.querySelector('#username').value;
  let role = document.querySelector('#role').value;
    toRegister(email,pass,username,role);
  return false;
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
    if(a.status === 409){
        alert('user already exists');
    }
    else{
        window.location.replace('/#/login');
    }
}

function login(){
    let email = document.querySelector('#loginEmail').value;
    let pass = document.querySelector('#loginPassword').value;
    toLogin(email,pass);
    return false;
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
    if(a.status === 403){
        alert('invalid credentials')
    }
    else if(a.status === 401){
        alert('Not a registered user \n please register')
    }
    else{
        //set locatstorage 
        localStorage.setItem('accessKey',res.accessToken)
        alert('logged in');
    }
}

window.addEventListener('load', () => {
  trigger();
});
window.addEventListener('hashchange', () => {
  trigger();
});

function trigger() {
    document.querySelectorAll('.disable').forEach(val => val.style.display = 'none' );
  if (window.location.hash === '#/login') {
    document.querySelector('.login').style.display = 'block';
    const accessKey = localStorage.getItem('accessKey')
    if(accessKey !== null)
    check(accessKey);
  }
  else if (window.location.hash === '#/register') {
    document.querySelector('.register').style.display = 'block';
  }
  else if (window.location.hash === '#/admin/dashboard') {
    const accessKey = localStorage.getItem('accessKey')
    if(accessKey !== null){
        check(accessKey).then(val => document.querySelector('.rightContent p').innerHTML = val[0].username);
        document.querySelector('.dashboard').style.display = 'block';
    }
    else{
        window.location.replace('#/login')
    }

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
        alert('not a registered user \n please regiser');
        // window.location.replace('#/login')
    }
    else if(a.status === 401 && window.location.hash === '#/admin/dashboard'){
        window.location.replace('#/login')
    }         
    else if(a.status===200 && window.location.hash === '#/login'){
        window.location.replace('#/admin/dashboard');
    }
    return await res;
}
document.querySelector('#upload-file').addEventListener('change', e => {
    let reader = new FileReader();
    reader.readAsArrayBuffer(e.target.files[0]);
    let checkIfExcel = e.target.files[0].name.split('.');
    if (checkIfExcel[checkIfExcel.length - 1] !== 'xlsx') {
      alert('please provide a correct file');
    } else {
      const formData = new FormData();
      formData.append('file', e.target.files[0]);
      reader.onload = function(e) {
        let data = new Uint8Array(reader.result);
        let arr = new Array();
        for (let i = 0; i != data.length; i++)
          arr[i] = String.fromCharCode(data[i]);
        let bstr = arr.join('');
        let workbook = XLSX.read(bstr, { type: 'binary' });
        let sheetArr = [];
        let colValues = [];
        for (let j = 0; j < workbook.SheetNames.length; j++) {
          let first_sheet_name = workbook.SheetNames[j];
          let worksheet = workbook.Sheets[first_sheet_name];
          let sheetData = XLSX.utils.sheet_to_json(worksheet, { raw: true });
          sheetArr.push(sheetData);
          var cells = Object.keys(worksheet);
          for (var i = 0; i < Object.keys(cells).length; i++) {
            if (cells[i].indexOf('1') > -1) {
              colValues.push(worksheet[cells[i]].v);
            }
          }
        }
        const sheetData = sheetArr[0];
        let bool = true;
        let error = [];
        let rawhtml = '';
        sheetData.map((row, index) => {
          rawhtml += '<tr>';
          colValues.forEach((val, index_Column) => {
            if (val === 'DeviceImei' || val === 'Mileage') {
              if (isNaN(parseFloat(row[val])) || !isFinite(row[val])) {
                let obj = `please provide a valid ${val} (Integer or decimal) at row ${index +
                  1} column ${index_Column + 1}`;
                error.push(obj);
              }
            } else if (
              val === 'Mileage Reading' ||
              val === 'Number of Fuel Sensors' ||
              val === 'Speed' ||
              val === 'Minutes'
            ) {
              if (!Number.isInteger(row[val])) {
                let obj = `the field ${val} should be an Integer at row ${index +
                  1} column ${index_Column + 1}`;
                error.push(obj);
              }
            } else if (
              val === 'SBG' ||
              val === 'SBU' ||
              val === 'BU' ||
              val === 'Project Code' ||
              val === 'Project Name' ||
              val === 'Asset Category' ||
              val === 'Asset Sub Category' ||
              val === 'Asset Type' ||
              val === 'Asset Code' ||
              val === 'Device Type' ||
              val === 'Hardware Vendor Name' ||
              val === 'Hardware Model Number'
            ) {
              if (!row[val]) {
                let obj = `the field ${val} cannot be empty at row ${index +
                  1} column ${index_Column + 1}`;
                error.push(obj);
              }
            } else if (val === 'Fuel Sensor Available') {
              if (row[val].toLowerCase() !== 'yes' && row[val].toLowerCase() !== 'no') {
                  console.log(typeof(row[val]));
                let obj = `for the field ${val} choose either Yes or No at row ${index +
                  1} column ${index_Column + 1}`;
                error.push(obj);
              } else if (!row[val]) {
                  console.log('row');
                let obj = `the field ${val} cannot be empty at row ${index +
                  1} column ${index_Column + 1}`;
                error.push(obj);
              }
            }
            if (bool)
              document.querySelector(
                '.columns'
              ).innerHTML += `<th scope="col"><span>${val}</span></th>`;
            if (row[val]) rawhtml += `<td>${row[val]}</td>`;
            else rawhtml += `<td></td>`;
          });
          bool = false;
          rawhtml += '</tr>';
        });
        if (error.length === 0){
          document.querySelector('.rows').innerHTML += rawhtml;
          document.querySelector('.upload').style.display = 'flex';
        }
        else {
            let rawErrorHtml = '';
          for(let i=0;i<error.length;i++){
              rawErrorHtml += `<p>${error[i]}</p>`;
          }
            document.querySelector('.errors').innerHTML += rawErrorHtml
            $('.errors').css({
              display: 'block'
            });
            document.querySelector('.upload').style.display = 'none';
        }
      };
    }
  });
document.querySelector('.logout').addEventListener('click',(e)=>{
    // localStorage.clear();
    alert('ff')
    // window.location.replace('#/login')
})
document.querySelector('.upload button').addEventListener('click',(e)=>{
    let reader = new FileReader();
    let x = document.querySelector('#upload-file');
    window.x = x;
    console.log(x);
    reader.readAsArrayBuffer(Object.values(x.files)[0]);
    let checkIfExcel = Object.values(x.files)[0].name.split('.');
    if (checkIfExcel[checkIfExcel.length - 1] !== 'xlsx') {
      alert('please provide a correct file');
    } else {
      const formData = new FormData();
      formData.append('file', Object.values(x.files)[0]);
    uploadExcel(formData);
    }
})
async function uploadExcel(formData){
    alert('sending.....')
        fetch(`http://localhost:3000/admin`, {
      method: 'post',
      body: formData
    }).then(val => console.log(val));
}