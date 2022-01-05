邮件模板工具开发总结

## 简要介绍
工具本身主要是基于nodejs进行开发，命令行工具通过Commander库进行开发。 

主要功能：采用mustache模板语法编写邮件模板HTML文件，然后通过工具进行插值渲染生成邮件内容HTML源码字符串。


## 命令行工具
对于命令行工具，一般有以下几个主要文件或目录
```
- bin 存放可执行文件
- lib 存放javascript文件
- docs 文档
- test 测试用例文件
- example 例子文件
- package.json 包描述文件
- readme.md 简介说明
```

package.json中[bin](https://docs.npmjs.com/cli/v7/configuring-npm/package-json#bin)字段： 
可以指定各个内部命令对应的可执行文件的位置。  
要使用myapp作为命令时
`{ "bin": { "myapp": "./cli.js" } }`
当安装myapp时，npm会从cli.js脚本创建一个到/usr/local/bin/myapp的符号链接，这样就可以直接在命令行执行myapp了。  
注意：确保cli.js以`#!/usr/bin/env node`开头，表示该文件需要在Node环境下执行。

## Commander.js
一个Node.js下优秀的命令行交互工具。

### 制作简易命令行工具
制作mycli：期望输出hello world，如果传了-t参数则追加输出当前时间  

创建并进入到mycli文件夹中  
初始化包：`npm init --yes`  
安装：`npm install commander`  
新建bin,lib目录，在bin目录下新建文件mycli,lib目录下新增index.js  
package.json中添加bin字段`"bin": {"mycli": "./bin/mycli"}`    

mycli文件内容如下
```js
#!/usr/bin/env node

const { program } = require('commander');
const version = require('../package.json').version;

program
    .version(version) // 默认选项是-V, --version 可修改
    .option('-t, --time [time]', 'print time') // 设置选项

program.parse(process.argv); // 解析选项（需要放在最后，因为这一操作会终止参数处理）

require('../lib/index')(program.opts()) // 可通过opts方法获取选项
```
index.js文件内容如下
```js
module.exports = function (opts) {
    console.log('hello world ', opts.time ? new Date().toLocaleString() : '');
}
``` 

运行`npm link`可以全局执行mycli命令（在全局环境下，生成一个符号链接文件，该文件的名字为package.json文件中指定的模块名。同时我们对词模块的修改会实施反馈在全局目录）  


### Commander使用简介
定义选项：  
使用`.option()`方法定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项(`-单个字符`)和一个长选项名称(`--一个或多个单词`)，使用逗号，空格或`|`分隔。
解析后的选项可以通过`Commander`对象上的`.opts()`方法获取。也可以通过`.getOptionValue()`和`.setOptionValue()`操作单个选项的值。
> 1. 对于多个单词的长选项，选项名会转为驼峰命名法。例如 `--template-engine`，可通过`program.opts().templateEngine`获取。   
> 2. 多个短选项可以合并简写，最后一个选项可以附加参数。例如 `-a -b -p 80` 可以写为 `-ab -p80` 或者 `-abp80`    
> 3. -- 标记选项的结束    
> 4. 选项在命令行中顺序不固定


选项的类型（boolean型选项和带参数选项，取反选项）及默认值的设置  
```js
program
    .option('-c, --color <color>', 'desc', 'blue')
    .option('--no-color', 'Remove color')
    .option('--no-border', 'Remove border')
    .option('-l, --letter [letters...]', 'specify letters')
```
> 只定义no-border，未定义border, border默认值会被置为true
> 定义了--color，又定义了--no-color，那么color的默认值值还是blue不会变更
> 取反选项在命令行同时出现，后使用的会覆盖之前的选项。
> 选项参数使用方括号表示参数可选，如 `--color [color]`表示可选，如果命令行中不带参数，则改值为boolean选项，有带参数则从参数中取值
> 变长参数选项，通过`...`来设置。命令行中输入多个参数会以数组的形式存储在对应属性字段中


定义命令：  
通过`.command()`或`.addCommand()`可以配置命令。可以为命令绑定处理函数，也可以将命令单独写成一个可执行文件。
```js
program
    .command('default <param1>', {
        isDefault: true, // 设置为默认命令
        hidden: true // 配置true则该命令不会打印在帮助信息里
    })
    .argument('<param2>') // 通过argument自定义参数
    .option('-d, --debug', 'display some debugging')
    .description('命令描述信息'),
    .action((param1, param2， options, command) => {
        // action处理函数，参数为该命令声明的所有参数，并附加两个额外参数
        // 一个是解析出的选项，一个是该命令对象自身
        console.log('命令被调用')
    })
```

自动化帮助信息：
默认的帮助选项是`-h,--help`
```js
program.addHelpText('after', // 位置参数: beforeAll: 作为全局标头栏展示;before：在内建帮助信息之前展示;after：在内建帮助信息之后展示;afterAll：作为全局末尾栏展示
`

Example call:
    $ custom-help --help
`)

program
  .helpOption('-e, --HELP', 'read more information'); // 重写参数

program.addHelpCommand('assist [command]', 'show assistance'); // 添加帮助子命令
```


## mustache.js
[mustache使用文档](https://github.com/janl/mustache.js#usage)   
一个简单强大的JavaScript模板引擎，使用它可以简化js代码中的html编写。模板里没有if语句，else语句或for循环，只有模板标签，是一套轻逻辑的模板语法。  

通过`Mustache.render()`方法就能把给定的模板和数据转变成想要的内容，示例：
```javascript
let htmlTemplate = `
    <div>名称：{{name}}</div>
    <ul>
        {{#hero}}
            <li>{{.}}</li>
        {{/hero}}
    </ul>
`;
let viewData = {
    name: '双城',
    hero: ['金克斯', '蔚', '凯特琳', '杰斯', '炼金']
};
let str = Mustache.render(htmlTemplate, viewData);
```

### 基本原理
```javascript
Writer.prototype.render = function render (template, view, partials, config) {
    var tags = this.getConfigTags(config);
    var tokens = this.parse(template, tags);
    var context = (view instanceof Context) ? view : new Context(view, undefined);
    return this.renderTokens(tokens, context, partials, template, config);
  };
```
主要步骤：
1. 解析模板生成`tokens`数组
2. 将`tokens`数组转换为对应的`html`


#### 解析模板生成tokens
示例中生成的tokens数组如下：可以看出每一项都是`[type节点类型, value节点值, start节点匹配的起始位置, end节点匹配的结束位置]`表示      

生成`tokens`的`this.parse`函数内主要调用了`parseTemplate`函数，
```javascript
function parseTemplate (template, tags) {
    // 几个重要的方法, 代码省略
    // scanner.scanUntil(reg);
    // scanner.scan(reg);
    // return nestTokens(squashTokens(tokens));
}
```
Scanner类是mustache.js中的一个核心的工具类，主要功能是根据传入的正则表达式切割字符串。  
`scanner.scanUntil(reg)`把符合正则表达式之前的字符串 截取出来。   
`scanner.scan(reg)`把符合正则表达式内容截取出来。  
`squashTokens(tokens)`主要用来合并text token。   
`nestTokens`主要是把squashTokens数组转化成层级嵌套的树结构。   


#### 将tokens转换成html
通过调用`this.renderTokens`方法生成html字符串
```javascript
Writer.prototype.renderTokens = function renderTokens (tokens, context, partials, originalTemplate, config) {
    var buffer = '';

    var token, symbol, value;
    for (var i = 0, numTokens = tokens.length; i < numTokens; ++i) {
      value = undefined;
      token = tokens[i];
      symbol = token[0];

      if (symbol === '#') value = this.renderSection(token, context, partials, originalTemplate, config);
      else if (symbol === '^') value = this.renderInverted(token, context, partials, originalTemplate, config);
      else if (symbol === '>') value = this.renderPartial(token, context, partials, config);
      else if (symbol === '&') value = this.unescapedValue(token, context);
      else if (symbol === 'name') value = this.escapedValue(token, context, config);
      else if (symbol === 'text') value = this.rawValue(token);

      if (value !== undefined)
        buffer += value;
    }

    return buffer;
  };
```
`renderTokens`方法重点是根据token的类型进行不同的处理，最后将各个类型的token处理结果拼接起来。