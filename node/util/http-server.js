var http = require('http');
var url = require('url');

http.createServer(function (request, response) {
    var body = [];
    var tmp = request.url;

    // 在HTTP服务器回调函数中，request.url不包含协议头和域名，但同样可以用.parse方法解析。

    console.log('\nurl info:\n', url.parse(tmp));
    console.log('\nmethod:\n', request.method);
    console.log('\nheaders:\n', request.headers);

    response.writeHead(200, { 'Content-Type': 'text/plain' });

    request.on('data', function (chunk) {
        body.push(chunk);
        response.write(chunk);
    });

    request.on('end', function () {
        body = Buffer.concat(body);
        console.log('\nbody:\n', body.toString());
        response.end();
    });

    //response.writeHead(200, { 'Content-Type': 'text-plain'});
    //response.end('Hello World\n');
}).listen(8124);