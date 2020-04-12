const path = require('path');
require('./foo.js');

// 模块作用域
console.log('__dirname:', __dirname);
console.log('__filename:', __filename);
console.log('path.dirname(__filename):', path.dirname(__filename));

console.log('module.js', require.main === module)
console.log('module.filename:', module.filename);
console.log('require.cache', require.cache);
console.log('require.main', require.main);