### new
new的过程
- 1.创建一个空的简单JavaScript对象
- 2.为步骤1新创建的对象添加属性__proto__,将该属性链接至构造函数的原型对象
- 3.将步骤1新创建的对象作为this的上下文
- 4.如果该函数没有返回对象，则返回this

```javascript
function newFn () {
    let obj = {};
    let constructor = Array.prototype.shift.apply(arguments);
    obj.__proto__ = constructor.prototype;
    let result = constructor.apply(obj, Array.prototype.slice.apply(arguments));
    if (Object.prototype.toString.call(result) === '[object Object]) {
        return result;
    }
    return obj;
}
```
> 如果没有使用`new`运算符，**构造函数会像其他的常规函数一样被调用**，并不会创建一个对象。这种情况下，`this`的指向也是不一样的。
