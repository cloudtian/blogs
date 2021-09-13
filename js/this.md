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
