### 闭包
一个函数里创建一个函数，内层函数中可以访问到外层函数的作用域。这样的组合就是闭包。（内层函数与外层函数的词法环境的引用捆绑在一起）

```javascript
function outerFn () {
    var outerValue = 'outer';
    function innerFn() {
        console.log(outerValue); 
        // 可以获取到outerValue。
        // innerFn的实例维持了一个对它的词法环境（变量outerValue存在其中）的引用
    }
    return innerFn;
}
var outer = outerFn();
// outer是执行outerFn时，创建的innerFn函数实例的引用
outer();
```
> 闭包是由函数以及声明该函数的词法环境组合而成的,该环境包含了这个闭包创建时作用域内的任何局部变量。