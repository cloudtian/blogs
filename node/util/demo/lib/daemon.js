// 第三次迭代： 配置守护进程
var cp = require('child_process');

var worker;

function spawn(server, config) {
    worker = cp.spawn('node', [server, config]);
    worker.on('exit', function (code) {
        if (code !== 0) {
            spawn(server, config);
        }
    });
}

function main(argv) {
    spawn('server.js', argv[0]);
    process.on('SIGTERM', function () {
        worker.kill();
        process.exit(0);
    });
}

main(process.argv.slice(2));