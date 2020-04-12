let http = require('http');
let path = require('path');
let fs = require('fs');

const MULTI_FILE_COMBINE_MARK = '??';
const MULTI_FILE_SEPARATE_MARK = ',';

const MIME = {
    '.css': 'text/css',
    '.js': 'application/javascript'
};

function parseUrl (root, url) {
    if (!url.includes(MULTI_FILE_COMBINE_MARK)) {
        url = url.replace('/', '/??');
    }

    let [base, paths] = url.split(MULTI_FILE_COMBINE_MARK);
    let pathnames = paths.split(MULTI_FILE_SEPARATE_MARK)
        .map(item => {
            return path.join(root, base, item);
        });

    return {
        mime: MIME[path.extname(pathnames[0])] || 'text/plain',
        pathnames
    };
}

function combineFiles (pathnames, callback) {
    var output = [];

    (function next(i, len) {
        if (i < len) {
            fs.readFile(pathnames[i], function (err, data) {
                if (err) {
                    callback(err);
                } else {
                    output.push(data);
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, Buffer.concat(output));
        }
    }(0, pathnames.length));
}

function main(argv) {

    var config = JSON.parse(fs.readFileSync(argv[0]), 'utf-8'),
        root = config.root || '.',
        port = config.port || 80,
        server;

    server = http.createServer(function (request, response) {
        var urlInfo = parseUrl(root, request.url),
            pathnames = urlInfo.pathnames;

        validateFiles(pathnames, function(err, data) {
            if (err) {
                response.writeHead(404);
                response.end(err.message);
            } else {
                response.writeHead(200, {
                    'Content-Type': urlInfo.mime
                });

                // response.end(data);
                // 二次迭代：一遍读取文件，一般输出响应
                outputFiles(pathnames, response);
            }
        });
    }).listen(port);

    // 第三次迭代：配置守护进程
    process.on('SIGTERM', function () {
        server.close(function () {
            process.exit(0);
        });
    });
}

function validateFiles(pathnames, callback) {
    (function next(i, len) {
        if (i < len) {
            fs.stat(pathnames[i], function (err, stats) {
                if (err) {
                    callback(err);
                } else if (!stats.isFile()) {
                    callback(new Error());
                } else {
                    next(i + 1, len);
                }
            });
        } else {
            callback(null, pathnames);
        }
    }(0, pathnames.length));
}

function outputFiles (pathnames, writer) {
    (function next(i, len) {
        if (i < len) {

            // 使用只读数据流简化代码
            var reader = fs.createReadStream(pathnames[i]);
            var isJsFile = path.extname(pathnames[i]) === '.js';

            reader.pipe(writer, {end: false});
            reader.on('end', function () {

                // 合并JS文件时可以自动在JS文件之间插入一个;来避免一些语法问题
                writer.write(isJsFile ? '\n;\n' : '\n');

                next(i + 1, len);
            });
        } else {
            writer.end();
        }
    }(0, pathnames.length));
}

main(process.argv.slice(2));