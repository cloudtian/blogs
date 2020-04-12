/**
 * 大文件拷贝
 * small-file-copu.js这种一次性把所有文件内容都读取到内存中后
 * 再一次性写入磁盘的方式不适合拷贝大文件，内存会爆仓。
 * 对于大文件，我们只能读一点写一点，直到完成拷贝。
 */
var fs = require('fs');

function copy(src, dst) {
    fs.createReadStream(src).pipe(fs.createWriteStream(dst));
}

function main(argv) {
    copy(argv[0], argv[1]);
}

main(process.argv.slice(2));

/*
 * 以上程序使用fs.createReadStream创建了一个源文件的只读数据流，并使用fs.createWriteStream创建了一个目标文件的只写数据流，
 * 并且用pipe方法把两个数据流连接了起来。
 */