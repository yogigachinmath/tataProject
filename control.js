window.onload = () => {
  const accessKey = localStorage.getItem('accessKey');
  if (accessKey !== null) {
    //   check(accessKey)
  }
  Fetch();
};
let arr = [];
let pages_arr = [];
let setting_arr = [];
let roles = [];
let category = [];

async function check(key) {
  const AK = {
    accessKey: key
  };
  const a = await fetch('http://localhost:3000/check', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(AK)
  });
  const res = await a.json();
  pathname = window.location.pathname;
  let arr = Object.values(res[1]);
  pathname = pathname.split('/');
  if (a.status === 403) {
    alert('not a registered user \n please regiser');
  } else if (a.status === 405) {
    window.location.replace('/validate');
    // window.location.replace('/login')
  } else if (a.status === 401) {
    window.location.replace('/login');
  }
  return await res;
}

async function Fetch() {
  const a = await fetch('http://localhost:3000/check/role');
  const res = await a.json();
  await display(res);
  run();
}

function display(kk) {
  let roleTemp = Object.keys(kk.roles[0])[1];
  roles = kk.roles[0][roleTemp];
  let bool = true;
  let res = kk.pages;
  let field = res[0].admin;
  let fields = Object.keys(field);
  let rawhtml = '';
  let colhtml = '';
  kk.category.forEach(ele => {
    let a = Object.keys(ele)[1];
    ele[a].forEach(val => {
      category.push(val);
      rawhtml = `<tr><th><span class = '${val}'>${val}</span></th>`;
      kk.pages.forEach(element => {
        let b = Object.keys(element)[1];
        let check = '';
        if (element[b][val]) check = 'checked';
        else check = 'unchecked';
        rawhtml += `<td> <div class="checkbox">
                    <input type="checkbox" class="${b.replace(/ /g,'')}-${val.replace(/ /g,'')}" data-type = '${a}' ${check}>
                        </div></td>`;
        if (bool) {
          colhtml += `<th scope="col">${b}</th>`;
        }
      });
      bool = false;
      rawhtml += `</tr>`;
      document.querySelector(`.rows`).innerHTML += rawhtml;
    });
    document.querySelector(
      '.rows'
    ).innerHTML += `<tr><div class = '${a} mb-2'><button class = 'btn btn-primary mr-3 ${a}-submit'>Submit</button><button class = 'btn btn-primary ${a}-reset'>Reset</button></div></tr>`;
  });
  document.querySelector('.columns').innerHTML += colhtml;
}
function run() {
  let htmlcollection = document.querySelectorAll('input');
  htmlcollection.forEach(val => {
    val.addEventListener('click', e => {
      let checked = e.target.checked;
      let className = e.target.className;
      let Roles = className.split('-');
      let role = Roles[0];
      let pathname = Roles[1];
      let data = {
        role: role,
        pathname: pathname,
        checked: checked,
        toChange: true
      };
      if (e.target.dataset.type === 'setting' && data.role !== 'form') {
        if (setting_arr.length === 0) {
          setting_arr.push(data);
        } else {
          let matched = false;
          setting_arr.forEach(ele => {
            if (ele.role === data.role && ele.pathname === data.pathname) {
              ele.toChange = !ele.toChange;
              ele.checked = !ele.checked;
              matched = true;
            }
          });
          if (!matched) setting_arr.push(data);
        }
      } else if(data.role !== 'form'){
        if (pages_arr.length === 0) {
          pages_arr.push(data);
        } else {
          let matched = false;
          pages_arr.forEach(ele => {
            if (ele.role === data.role && ele.pathname === data.pathname) {
              ele.toChange = !ele.toChange;
              ele.checked = !ele.checked;
              matched = true;
            }
          });
          if (!matched) pages_arr.push(data);
        }
      }
    });
  });
  document.querySelector('.url-submit').addEventListener('click', e => {
    if (pages_arr.length !== 0) update(pages_arr);
  });

  document.querySelector('.setting-submit').addEventListener('click', e => {
    if (setting_arr.length !== 0) update(setting_arr);
  });

  document.querySelector('.url-reset').addEventListener('click', e => {
    pages_arr.forEach(ele => {
      if (ele.toChange === true) {
        document.querySelector(
          `.${ele.role}-${ele.pathname}`
        ).checked = !ele.checked;
      }
    });
    pages_arr = [];
  });

  document.querySelector('.setting-reset').addEventListener('click', e => {
    setting_arr.forEach(ele => {
      if (ele.toChange === true) {
        document.querySelector(
          `.${ele.role}-${ele.pathname}`
        ).checked = !ele.checked;
      }
    });
    setting_arr = [];
  });
  document.querySelector('.reset').addEventListener('click', e => {
    arr = pages_arr.concat(setting_arr);
    arr.forEach(ele => {
      if (ele.toChange === true) {
        document.querySelector(
          `.${ele.role}-${ele.pathname}`
        ).checked = !ele.checked;
      }
    });
    arr = [];
    setting_arr = [];
    pages_arr = [];
  });
  document.querySelector('.submit').addEventListener('click', e => {
    arr = pages_arr.concat(setting_arr);
    if (arr.length !== 0) update(arr);
  });
}

async function update(data) {
  const a = await fetch('http://localhost:3000/check/role', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const res = await a.json();
}

function submitNewUrl() {
  let newUrl = document.querySelector('.newUrl').value;
  let urlPage = document.querySelector('.selectPage').value;
  if (confirm('confirm that you want to add the url')) {
    if (urlPage === 'Url') {
      var btn = document.createElement('tr');
      let url_submit = document.querySelector('.url-submit').parentElement;
      let rawhtml = `<th class = '${newUrl}'>${newUrl}</th><tr>`;
      let names = [];
      roles.forEach(ele => {
        rawhtml += `<td><div class = 'checkbox'><input type = 'checkbox' class = "${ele.replace(/ /g,'')}-${newUrl.replace(/ /g,'')}" data-type = '${urlPage.toLowerCase()}' /></div></td>`;
        names.push(`${ele.replace(/ /g,'')}-${newUrl.replace(/ /g,'')}`);
      });
      btn.innerHTML += rawhtml;
      url_submit.before(btn);
      addEvent(names);
      addUrl(newUrl, urlPage);
    } else {
      var btn = document.createElement('tr');
      let url_submit = document.querySelector('.setting-submit').parentElement;
      let rawhtml = `<th class = '${newUrl}'>${newUrl}</th><tr>`;
      let names = [];
      roles.forEach(ele => {
        rawhtml += `<td><div class = 'checkbox'><input type = 'checkbox' class = "${ele.replace(/ /g,'')}-${newUrl.replace(/ /g,'')}" data-type = '${urlPage.toLowerCase()}' /></div></td>`;
        names.push(`${ele.replace(/ /g,'')}-${newUrl.replace(/ /g,'')}`);
      });
      btn.innerHTML += rawhtml;
      url_submit.before(btn);
      addEvent(names);
      addUrl(newUrl, urlPage);
    }
  } else {
    return false;
  }
  return false;
}
async function addEvent(names){
   names.forEach(ele => {
       document.querySelector('.'+ele).addEventListener('click',(e) => {
        let checked = e.target.checked;
      let className = e.target.className;
      let Roles = className.split('-');
      let role = Roles[0];
      let pathname = Roles[1];
      let data = {
        role: role,
        pathname: pathname,
        checked: checked,
        toChange: true
      };
      if (e.target.dataset.type === 'setting') {
        if (setting_arr.length === 0) {
          setting_arr.push(data);
        } else {
          let matched = false;
          setting_arr.forEach(ele => {
            if (ele.role === data.role && ele.pathname === data.pathname) {
              ele.toChange = !ele.toChange;
              ele.checked = !ele.checked;
              matched = true;
            }
          });
          if (!matched) setting_arr.push(data);
        }
      } else {
        if (pages_arr.length === 0) {
          pages_arr.push(data);
        } else {
          let matched = false;
          pages_arr.forEach(ele => {
            if (ele.role === data.role && ele.pathname === data.pathname) {
              ele.toChange = !ele.toChange;
              ele.checked = !ele.checked;
              matched = true;
            }
          });
          if (!matched) pages_arr.push(data);
        }
      }
       });
   })
}
async function addUrl(url, role) {
  console.log('sending...');
  let data = [url, role.toLowerCase(), category];
  const a = await fetch('http://localhost:3000/check/addurl', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
}
