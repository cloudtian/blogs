var http = require('http');
var zlib = require('zlib');

var options = {
    hostname: '127.0.0.1',
    port: 80,
    path: '/',
    method: 'GET',
    headers: {
        'Accept-Encoding': 'gzip, deflate'
    }
};

http.request(options, function (response) {
    var body = [];

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);

        var encoding = response.headers['content-encoding'];

        console.log(encoding);
        if (encoding === 'gzip') {
            zlib.gunzip(body, function (err, data) {
                console.log(data.toString());
            });
        } else {
            console.log(body.toString());
        }
    });
}).end();