### JavaScript数据类型和数据结构
#### 动态类型
JavaScript是一种**动态类型**的语言（或者说是**弱类型**），即我们不需要提前声明变量的类型。在程序的运行中，类型会被自动确定。不过最好还是不要频繁的修改变量的类型，这会不利于V8引擎的优化。

#### 数据类型
- 6种原始类型，可以使用typeof运算符进行检查
  - undefined `typeof instance === 'undefined'`
  - Boolean `typeof instance === 'boolean'`
  - Number `typeof instance === 'number'`
  - String `typeof instance === 'string'`
  - Bigint `typeof instance === 'bigint'`
  - Symbol `typeof instance === 'symbol'`
- null `typeof instance === 'object'`
- Object `typeof instance === 'object'`

#### 原始值
值本身无法被改变
- 布尔类型： true / false
- Null类型：null，未初始化的对象
- Undefined类型：undefined，没有被赋值的变量
- 数字类型：基于IEEE754标准的双精度64位二进制格式的值（(-(2<sup>53</sup> -1) 到 2<sup>53</sup> -1)）。除了能表示浮点数外，还有一些带符号的值: `+Infinity`，`-Infinity`和`NaN`(非数值，Not-a-Number)
- BigInt类型：基础的数据类型，可以用任意精度表示整数。ES6新增的用于安全存储和操作大整数的类型，它甚至可以超过数字的安全整数限制。BigInt是通过在整数末尾附加`n`或调用构造函数来创建。
- 字符串类型：用于表示文本数据。是一组16位的无符号整数值的“元素”。**JavaScript字符串是不可更改的**
  > unicode将世界上所有的文字用2个字节统一进行编码（即16位）
- 符号类型：Symbols是ES6新定义的，是唯一的并且不可修改的，并且可用来作为Object的key的值。

#### 对象
对象是指内存中的可以被标记符引用的一块区域。  

##### 属性  
对象有两种属性：数据属性和访问器属性。  
数据属性  
特性 | 数据类型 | 描述 | 默认值
--|--|--|--|
[[value]]|任何类型|数据值|undefined
[[Writable]]|Boolean|false->[[value]]特性不能被改变|false
[[Enumerable]]|Boolean|true->则属性可以用for...in循环来枚举|false
[[Configurable]]|Boolean|false->属性不能被删除，并且除了[[value]]和[[Writable]]以外的特性都不能被改变|false

访问器属性  
特性 | 类型 | 描述 | 默认值
--|--|--|--|
[[Get]]]|函数对象或者undefined|该函数使用一个空的参数列表，能够在有权访问的情况下读取属性值。|undefined
[[Set]]|函数对象或者undefined|该函数有一个参数，用来写入属性值|undefined
[[Enumerable]]|Boolean|true->则属性可以用for...in循环来枚举|false
[[Configurable]]|Boolean|false->属性不能被删除，并且不能被转变成一个数据属性|false

```javascript
var obj = {};
// 定义一个数据属性
Object.defineProperty(obj, 'name', {
    value: 'cloudtian',
    writable: false,
    configurable: false,
    enumerable: false // 配置false浏览器里查看对象属性时会以浅色字体显示
})

// 定义一个访问器属性
Object.defineProperty(obj, "age", {
    get: function () {
        return '18'; // 浏览器中显示省略号，点击后get一次最新值
    },
    set: function (v) { // 且浏览器中会出现set age: f(), get也一样
        console.log(v)
    },
    configurable: false,
    enumerable: false
})
// 访问器属性中不包含value和wriable
```


##### "标准的"对象，和函数（函数是一个附带可被调用功能的常规对象）  
##### 日期：内建的Date对象  
##### 有序集：数组和类型数组  
##### 键控集：Map,Set,WeakMap,WeakSet  
##### 结构化数据：JSON  
##### 标准库中更多的对象

