var https = require('https');
var options = {
    hostname: '127.0.0.1',
    port: 8124,
    path: '/',
    method: 'GET'
};

var request = https.request(options, function (response) {});

request.end();

// 但如果目标服务器使用的SSL证书是自制的，不是从颁发机构购买的，默认情况下https模块会拒绝连接，提示说有证书安全问题。
// 在options里加入rejectUnauthorized: false字段可以禁用对证书有效性的检查，从而允许https模块请求开发环境下使用自制证书的HTTPS服务器。