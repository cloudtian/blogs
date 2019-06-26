### webpack配置之插件篇

#### DllPlugin和DllReferencePlugin
`DllPlugin`和`DllReferencePlugin`用某种方法实现了拆分bundles，同时大大提升了构建速度。

使用场景：项目中使用到的第三方库文件，我们一般都不会频繁的修改，所以可以将其单独打包，只有在第一次打包时需要打包第三方库，之后打包时都只需要打包我们自己编写的代码，可以提高构建速度。

`DllPlugin`插件会生成一个名为`manifest.json`的文件，这个文件是用来让`DllReferencePlugin`映射到相关的依赖上去的。
- `context`(optional): manifest文件中请求的上下文（默认值为webpack的上下文）
- `name`: 暴露出的dll的函数名（`[name]` & `[hash]`）
- `path`: manifest.json文件的绝对路径（输出文件）

配置`webpack.dll.js`:
```javascript
const webpack = require('webpack');
const path = require('path');

const dllEntry = {
    vue_all: ['vue', 'vue-router'],
    babel_runtime: ['@babel/polyfill']
};

module.exports = {
    mode: 'production',
    entry: dllEntry,
    output: {
        path: path.join(__dirname, 'dist', 'dll'),
        library: `[name]_library`,
        filename: `[name].dll.js`
    },
    plugins: [
        new webpack.DllPlugin({
            name: `[name]_library`, // 该处name需要与output中的library一致
            path: path.join(__dirname, 'dist', 'dll', `[name]_manifest.json`)
        })
    ]
};
```
然后运行`webpack --config webpack.dll.js`就可以生成依赖库的源码和匹配id。
接下来如何引用，就需要在`webpack.config.js`添加`DllReferencePlugin`配置了。

`DllReferencePlugin`这个插件是在webpack主配置文件中设置的，这个插件把只有dll的bundles引入到需要的预编译的依赖。
- `context`: (绝对路径) manifest中请求的上下文
- `manifest`: `manifest.json`文件的绝对路径
- `content`(optional): 请求到模块id的映射（默认为`manifest.content`）
- `name`(optional): dll暴露的地方的名称（默认为`manifest.name`）
- `scope`(optional): dll中内容的前缀
- `sourceType`(optional): dll是如何暴露的

配置`webpack.config.js`：
```javascript
const webpack = require('webpack');
const path = require('path');

const dllEntry = {
    vue_all: ['vue', 'vue-router'],
    babel_runtime: ['@babel/polyfill']
};

module.exports = {
    //...其他配置省略
    plugins: [
        ...Object.keys(dllEntry).map(name => {
            return new webpack.DllReferencePlugin({
                manifest: require(path.join(__dirname, 'dist', 'dll', `${name}_manifest.json`))
            });
        });
    ]
};
```
