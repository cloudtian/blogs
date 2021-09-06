## 继承与原型链
`JavaScript`是动态的，本身不提供一个`class`的实现。即便是ES6中引入的`class`，也只是语法糖，`JavaScript`仍然是基于原型的。

JavaScript中万物皆对象。每一个实例对象(`object`)都有一个私有属性(`__proto__`)指向它的构造函数(`constructor`)的原型对象(`prototype`)。该原型对象也有一个自己的原型对象(`__proto__`)，层层向上直到一个对象的原型对象为null。null没有原型并且是原型链中的最后一个环节。


## 实现继承的方式
```javascript
// 父类A
function A (name) {
    this.name = name || 'a';
}
A.prototype.getName = function () {
    return this.name;
}
```
#### 原型链继承
将父类的实例作为子类的原型  
```javascript
function B () {}
B.prototype = new A()
B.prototype.name = 'b'

var b = new B();
b.getName()
console.log(b instanceof B) // true
console.log(b instanceof A) // true
```

#### 构造函数继承
使用父类的构造函数增强子类实例，等同于复制父类的实例属性给子类
```javascript
function B (name) {
    A.call(this)
}
```