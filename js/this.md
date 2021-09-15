### this
绝大多数情况下，**函数的调用方式决定了`this`的值**（运行时绑定）。  
`this`不能在指向期间被赋值，并且在每次函数被调用时`this`的值也可能会不同。
- ES5 引入了`bind`方法来设置`this`值，而不用考虑函数如何被调用的。
- ES6 引入的箭头函数不提供自身的`this`绑定，其`this`的值将保持为闭合词法上下文的值。

### 示例
```javascript
const name = 'jht';
const test = {
    name: 'tsy',
    getName: function () {
        return this.name;
    },
    getName2: () => {
        return this.name;
    },
    getName3: function () {
        let getObjName = () => {
            return this.name
        }
        return getObjName;
    }
}

console.log(test.getName()); // 在对象上调用，this是test对象，打印 tsy
let getName = test.getName;
console.log(getName()); // 函数在全局作用域上调用，this是window，打印jht
console.log(test.getName2()); // 虽然通过对象调用，但是是箭头函数，其this指向window，打印jht
console.log(test.getName3()())// 内部箭头函数在对象上调用时创建，打印tsy
let getName3 = test.getName3;
console.log(getName3()())// 内部箭头函数在全局作用域中创建，this指向window，打印jht

function getName4() {
    return this.name;
}
console.log(getName4()); // this指向window,打印jht
console.log(getName4.call(test)); // call（或apply）调用函数时将this指向test对象,打印tsy
```

### 语法
this 是 当前指向上下文的一个属性。

- 全局上下文：在全局指向环境中（在任何函数体外部），`this`指向全局对象
  > 可以使用`globalThis`获取全局对象
- 函数上下文：在函数内部，`this`的值取决于函数被调用的方式
- 类上下文：`this`在类中的表现与在函数中类似。在类的构造函数中，`this`是一个常规对象。类中所有非静态的方法都会被添加到`this`的原型中。
  > - 静态方法不是`this`的属性，它们只是类自身的属性。  
  > - 派生类的构造函数没有初始的`this`绑定。在构造函数中调用`super()`会生成一个`this`绑定。派生类不能在调用`super()`之前返回，除非其构造函数返回的是一个对象，或者根本没有构造函数。
- `bind`方法：调用`f.bind(someObject)`会创建一个与`f`具有相同函数体合作用域的函数，但是在这个新函数中，`this`将永久的被绑定到`someObject`参数上，无论这个函数是如何调用的。且`bind`只生效一次(即对已经`bind`过了的函数再次`bind`，其`this`指向第一次`bind`的第一个参数)
- 箭头函数：箭头函数中，`this`与封闭词法环境的`this`保持一致，在创建箭头函数的时候确定。在全局代码中，它将被设置为全局对象。
  > 如果将`this`传递给`call`，`bind`或`apply`来调用箭头函数，它将被忽略。
- 作为对象的方法：当函数作为对象的方法被调用时，`this`被设置为调用该函数的对象。
  > `this`的绑定只受最接近的成员引用的影响。o.b.c(),c方法指向时this指向o.b
- 作为构造函数：当一个函数用作构造函数时，它的`this`被绑定到正在构造的新对象。
  > 虽然构造函数返回的默认值是`this`所值的那个对象，但它仍可以手动返回其他的对象(如果返回的值不是一个对象，则返回`this`对象)
- 作为一个DOM事件处理函数：`this`指向触发事件的元素
- 作为一个内联事件处理函数：当代码被内联on-event处理函数调用时，它的`this`指向监听器所在的DOM元素
- 类中的`this`：和其他普通函数一样，方法中的`this`值取决于他们如何被调用。
  > 不过有时，我们期望类中的方法的`this`值总是指向这个类的实例，可以在构造函数中通过`bind`绑定类方法。



### call 和 apply
call()方法在使用一个指定的this值和若干个指定的参数值的前提下调用某个函数或方法   
apply()方法在使用一个指定的this值和参数值必须是数组类型的前提下调用某个函数或方法

类比
```javascript
f.call(o)  // 或者 f.apply(o) 功能：调用f()方法时，设置函数体内的this指向对象o
// 类似于 （假设对象o不存在名为m的属性）
o.m = f; // 将f存储为o的临时方法
o.m(); // 调用它，不传参数
delete o.m; // 删除临时方法
```

##### 实现apply
```javascript
// 随机生成一个对象obj的唯一属性
function getUniqueKey(obj) {
    var uniqueProper = '00' + Math.random();
    if (obj.hasOwnProperty(uniqueProper)) {
        arguments.callee(obj)//如果obj已经有了这个属性，递归调用，直到没有这个属性
    } else {
        return uniqueProper;
    }
}

Function.prototype.myApply = function (context) {
    context = context || window; // apply支持传null或不传。传null时视为window 
    var args = arguments[1]; // apply方法第二个参数为参数数组
    var fn = getUniqueKey(context); // 要保证我们新增的属性在context上属性的唯一性，可以使用随机数
    context[fn] = this; // context 为要替换的this上下文，当前函数的this指向要执行的函数
    var result; // 保存结果用于返回
    if (args === void 0) { // 没有传参则直接执行
        result = context[fn](); 
    } else { // 支持传参，拼接参数 
        var params = []; 
        for(var i = 0; i < args.length; i++) {
            params.push('args[' + i +']');
        }
        result = eval('context[fn](' + params + ')'); // 强大的eval可以计算字符串，执行其中的js代码
    }   
    
    delete context[fn];
    return result;
}

name = "home"
var tsy = {
    name: 'tsy',
    myName (age, other) {
        console.log(this.name, age, other);
        return {
            name: this.name,
            age
        };
    }
}
var jht = {
    name: 'jht'
}

tsy.myName(); // tsy
tsy.myName.myApply(jht); // jht
tsy.myName.myApply(jht, [24]); // jht 24
tsy.myName.myApply(null, [24, '24']); // home 24 '24'
```

##### 实现call
直接利用上面的myApply方法实现myCall。
```javascript
Function.prototype.myCall = function () {
    return this.myApply([].shift.myApply(arguments), arguments);
}

tsy.myName(); // tsy
tsy.myName.myCall(jht); // jht
tsy.myName.myCall(jht, 24); // jht 24
tsy.myName.myCall(null, 24, '24'); // home 24 '24'
```

##### 实现bind  
bind方法创建一个新函数，称为绑定函数。绑定函数会以创建它时传入bind方法的第一个参数作为this。  
传入bind方法的第二个以及以后的参数加上绑定函数运行时本身的参数按照顺序作为原函数的参数来调用原函数。
```javascript 
Function.prototype.myBind = function (context) {
   var fn = this;
   if (typeof fn !== 'function') {
       throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable')
   }
   var args = Array.prototype.slice.myCall(arguments, 1);
   var F = function () {};
   if (this.prototype) {
       F.prototype = this.prototype;
   }
   var bound = function () {
       var params = args.concat(Array.prototype.slice.myCall(arguments));
       return fn.myApply((this instanceof F ? this : context || this), params);
   }
   bound.prototype = new F();
   return bound;
}

tsy.myName(); // tsy
tsy.myName.myBind(jht)(); // jht
tsy.myName.myBind(jht, 24)(); // jht 24
tsy.myName.myBind(null, 24)('24'); // home 24 '24'
tsy.myName.myBind(null)(24, '24'); // home 24 '24'
```