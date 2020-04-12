let fs = require('fs');
let path = require('path');

function travel(dir, callback) {
    fs.readdirSync(dir).forEach(function (file) {
        var pathname = path.join(dir, file);

        if (fs.statSync(pathname).isDirectory()) {
            travel(pathname, callback);
        } else {
            callback(pathname);
        }
    });
}

function main(argv = []) {

    let home = argv[0] || process.cwd();

    travel(home, function (pathname) {
        console.log(pathname);
    });
}

main(process.argv.slice(2));