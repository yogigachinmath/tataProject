const fs = require('fs')
const http = require('http')


let server = http.createServer(function(req,res){
console.log('request was made'+req.url);
if(req.url === '/'){
res.writeHead(200,{'Content-Type':'text/html'});
fs.createReadStream(__dirname + '/login.html').pipe(res);
}
else if(req.url === '/login'){
    res.writeHead(200,{'Content-Type':'text/html'});
fs.createReadStream(__dirname + '/login.html').pipe(res);
}
else if(req.url === '/control'){
    res.writeHead(200,{'Content-Type':'text/html'});
fs.createReadStream(__dirname + '/control.html').pipe(res);
}
else if(req.url === '/login.js'){
    res.writeHead(200,{'Content-Type':'application/javascript'});
fs.createReadStream(__dirname + '/login.js').pipe(res);
}
else if(req.url === '/admin.js'){
    res.writeHead(200,{'Content-Type':'application/javascript'});
fs.createReadStream(__dirname + '/admin.js').pipe(res);
}
else if(req.url === '/style.css'){
    res.writeHead(200,{'Content-Type':'text/css'});
    fs.createReadStream(__dirname + '/style.css').pipe(res);
}
else if(req.url === '/index'){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.createReadStream(__dirname + '/admin.html').pipe(res);
}
else if(req.url === '/register'){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.createReadStream(__dirname + '/register.html').pipe(res);
}
else if(req.url === '/dashboard'){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.createReadStream(__dirname + '/user.html').pipe(res);
}
else if(req.url === '/validate'){
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.createReadStream(__dirname + '/validate.html').pipe(res);
}
else if(req.url === '/register.js'){
    res.writeHead(200,{'Content-Type':'application/javascript'});
fs.createReadStream(__dirname + '/register.js').pipe(res);
}
else if(req.url === '/user.js'){
    res.writeHead(200,{'Content-Type':'application/javascript'});
fs.createReadStream(__dirname + '/user.js').pipe(res);
}
else if(req.url === '/control.js'){
    res.writeHead(200,{'Content-Type':'application/javascript'});
fs.createReadStream(__dirname + '/control.js').pipe(res);
}
else{
    res.writeHead(200,{'Content-Type':'text/html'});
    fs.createReadStream(__dirname + '/error.html').pipe(res);
}
})

server.listen(4000,'127.0.0.1');
console.log('listening on port 4000');