const base64Code = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function base64(str) {
    return Buffer.from(str).toString('base64');
}

function base64Custom(str) {
    let buffer = Buffer.from(str, 'utf8');
    console.log('转成Buffer(16进制)', buffer);
    let current;
    let result = {
        hex: buffer.toString('hex'),
        tenOrigin: [],
        bin: [], // 原始二进制（8位）
        sixBin: [], // 3个8位开始分组成4个6位
        eightBin: [],
        ten: [],
        base64: [],
        end: '',
        final: ''
    };
    for (let i = 0; i < result.hex.length;i+=2) {
        current = parseInt(result.hex.slice(i, i+2), 16).toString(2);
        while(current.length < 8) {
            current = '0' + current;
        }
        result.bin.push(current);
        current = parseInt(result.hex.slice(i, i+2), 16).toString(10);
        result.tenOrigin.push(current);
    }
    console.log('转成十进制编码', result.tenOrigin.join(' '));
    console.log('转成二进制编码', result.bin.join(' '));
    for (let i = 0; i < result.bin.join('').length;i+=6) {
        current = result.bin.join('').slice(i, i+6);
        while(current.length < 6) {
            current = current + '0';
        }
        result.sixBin.push(current);
    }
    console.log('转成二进制编码（4-6）', result.sixBin.join(' '));
    for (let i = 0; i < result.sixBin.join('').length;i+=6) {
        current = result.sixBin.join('').slice(i, i+6);
        current = '00' + current;
        result.eightBin.push(current);
    }
    console.log('转成二进制编码（4-8）', result.eightBin.join(' '));
    for (let i = 0; i < result.eightBin.join('').length;i+=8) {
        result.ten.push(parseInt(result.eightBin.join('').slice(i, i+8), 2));
    }
    console.log('转成十进制编码', result.ten.join(' '));
    result.base64 = result.ten.map(i => base64Code[i]);

    // 末尾补=
    let length = result.base64.join('').length % 4;
    while (length && (4 - length)) {
        result.end += '=';
        length++;
    }
    result.final = result.base64.join('') + result.end;
    console.log('转成Base64编码', result.final);
    return result.final;
}

let word = process.argv[2] || '密';
console.log('base64:', base64(word));
console.log('base64Custom:', base64Custom(word));