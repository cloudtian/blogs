var http = require('http');

var options = {
    hostname: 'www.example.com',
    port: 80,
    path: '/upload',
    method: 'POST',
    headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
    }
};

var request = http.request(options, function (response) {});

request.write('Hello World');
request.end();

// http模块提供了便捷API
http.get('http://127.0.0.1:8124/', function (response) {
    var body = [];

    console.log('statusCode:', response.statusCode);
    console.log('headers:', response.headers);

    response.on('data', function (chunk) {
        body.push(chunk);
    });

    response.on('end', function () {
        body = Buffer.concat(body);
        console.log(body.toString());
    });
});



