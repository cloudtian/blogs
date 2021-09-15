### Set对象
Set对象是一组值的集合，这些值是不重复的，可以按照添加顺序来遍历。
```javascript
var s = new Set();
s.add(1);
s.add('b');
s.add(true);
s.has('b'); // true
s.delete(true)
s.size; // 2
for (let item of s) console.log(item);
// 1
// "b"
```

> Array 和 Set 对比
- 数组中用于判断元素是否存在的indexOf函数效率低下。
- Set对象匀速根据值删除元素，而数组中必须使用基于下表的splice方法。
- 数组的indexOf方法无法找到NaN值。
- Set对象存储不重复的值，所以不需要手动处理包含重复值的情况。

### WeakSet
WeakSet对象允许将弱保持对象存储在一个集合中。  

WeakSet对象是一些对象值的集合，并且其中的每个对象值都只能出现一次。  
WeakSet和Set对象的区别：  
- 与Set相比，WeakSet只能是**对象的集合**，而不能是任何类型的任意值。
- WeakSet持弱引用：集合中对象的引用为**弱引用**。如果没有其他的对WeakSet中对象的引用，那么这些对象会被当成垃圾回收掉。这也意味着WeakSet中没有存储当前对象的列表，WeakSet是**不可枚举**的。
- WeakSet比Set更适合跟踪对象引用，尤其是在涉及大量对象时。WeakSet非常适合处理检测循环引用的场景，例如递归调用自身的函数需要一种通过跟踪哪些对象已被处理，来应对循环数据结构的方法。
- WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。


### Map对象
一个Map对象就是一个简单的键值对映射集合，可以按照数据插入时的顺序遍历所有的元素。
```javascript
var m = new Map();
m.set('a', 1) // set()方法设置key,value映射
m.set('b', 1)
m.set('c', 1)
m.size; // 3  size getter属性获取长度
m.get('a'); // 1  获取键key对应的value值
m.has('a'); // true 判断是否有该键值对
m.delete('b'); // 删除键值对

for (var [key, value] of sayings) {
  console.log(key + '->' + value); // 按插入时的顺序遍历
}

m.clear(); // 清空map
m.size; // 0
```

> Object 和 Map 对比
- Object的均为String类型，在Map里键key是任意类型。
- Object的尺寸必须手动计算，但可以很容易的通过size获取到Map的尺寸。
- Map的遍历遵循元素的插入顺序。
- Object有原型，所有映射中有一些缺省的键。（可以用Object.create(null)回避）。

### WeakMap
WeakMap对象是一组键值对的集合，其中的**键是弱引用**。
**键必须是对象**（原始数据类型是不能作为key的），而值可以是任意的。  
WeakMap的key是**不可枚举**的。因为key是弱引用，在没有其他引用时垃圾回收会将键对象进行回收，此时WeakMap中就找不到该键了，假如key是可枚举的，那么取得的结果会受到垃圾回收机制的影响，从而得到不确定的结果。     
当要往对象上添加数据，又不想干扰垃圾回收机制时，可以使用WeakMap。