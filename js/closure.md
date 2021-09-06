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



### 模拟私有方法
```javascript
var Counter = (function () {
    var privateCounter = 0;
    function changeBy(val) {
        privateCounter += val;
    }
    return {
        increment: function () {
            changeBy(1);
        },
        value: function () {
            return privateCounter;
        }
    };
})();
Counter.value(); // 0
Counter.increment();
Counter.value(); // 1
```
> 上述立即执行匿名函数体内，包含私有变量privateCouner和changeBy函数，这两项都无法在匿名函数外部直接访问，必须通过匿名函数返回的三个公共函数访问。这三个公共函数共享同一个环境的闭包。  


```javascript
var makeCounter = function () {
    var privateCounter = 0;
    function changeBy(val) {
        privateCounter += val;
    }
    return {
        increment: function () {
            changeBy(1);
        },
        value: function () {
            return privateCounter;
        }
    };
};
var Counter1 = makeCounter()
var Counter2 = makeCounter()
Counter1.value(); // 0
Counter1.increment(); 
Counter1.value(); // 1
Counter2.value(); // 0
```
> 上述Counter1和Counter2中的privateCounter是各自独立的。每个闭包都是引用字节词法作用域内的变量。在一个闭包内对变量的修改，不会影响到另一个闭包中的变量。


### 一个常见的错误
实现每隔一秒打印0到10依次递增的数字
```javascript
for (var i = 0; i < 10; i++) {
    setTimeout(function () {
        console.log(i)
    }, i * 1000)
}
```
> 然而上述代码运行结果并不如人意，结果会每隔一秒打印10次数字10。因为变量i使用var进行声明，由于变量提升所以具有函数作用域，当定时器触发时，for循环已经结束，此时i的值为10。
> 我们可以通过闭包来解决这个问题。为每一个定时器回调创建一个新的词法环境，保存每次循环时i的值
```javascript
for (var i = 0; i < 10; i++) {
    (function (i) {
        setTimeout(function () {
            console.log(i)
        }, i * 1000)
    })(i)
}

// 使用ES6中的let创建块级作用域实现，（减少闭包的使用）
for (let i = 0; i < 10; i++) {
    setTimeout(function () {
        console.log(i)
    }, i * 1000)
}
```

### 性能
闭包在处理速度和内存消耗方面对脚本性能具有负面影响。所以如果不是某些特定任务需要闭包，一般不要在函数中创建函数。
