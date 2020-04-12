let fs = require('fs');
let path = require('path');

function travel(dir, callback, finish) {
    fs.readdir(dir, function (err, files) {
        (function next(i) {
            if (i < files.length) {
                var pathname = path.join(dir, files[i]);

                fs.stat(pathname, function (err, stats) {
                    if (stats.isDirectory()) {
                        travel(pathname, callback, function () {
                            next(i + 1);
                        });
                    } else {
                        callback(pathname, function () {
                            next(i + 1);
                        });
                    }
                });
            } else {
                finish && finish();
            }
        }(0));
    });
}

function main(argv = []) {

    let home = argv[0] || process.cwd();

    travel(home, function (pathname, fn) {
        console.log(pathname);
        setTimeout(fn, 500);
    }, function () {
        console.log('finish');
    });
}

main(process.argv.slice(2));