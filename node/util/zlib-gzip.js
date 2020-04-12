// zlib模块压缩HTTP响应体数据
// 判断客户端是否支持gzip，并在支持的情况下使用zlib模块返回gzip之后的响应体数据。

var http = require('http');
var zlib = require('zlib');

http.createServer(function (request, response) {
    var i = 1024,
        data = '';

    while (i--) {
        data += '.'
    }

    if ((request.headers['accept-encoding'] || '').indexOf('gzip') !== -1) {
        zlib.gzip(data, function (err, data) {
            response.writeHead(200, {
                'Content-Type': 'text/plain',
                'Content-Encoding': 'gzip'
            });
            response.end(data);
        });
    } else {
        response.writeHead(200, {
            'Content-Type': 'text/plain'
        });
        response.end(data);
    }
}).listen(80);