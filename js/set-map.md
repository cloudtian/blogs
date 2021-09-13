### WeakSet
WeakSet对象允许将弱保持对象存储在一个集合中。  

WeakSet对象是一些对象值的集合，并且其中的每个对象值都只能出现一次。  
WeakSet和Set对象的区别：  
- 与Set相比，WeakSet只能是**对象的集合**，而不能是任何类型的任意值。
- WeakSet持弱引用：集合中对象的引用为**弱引用**。如果没有其他的对WeakSet中对象的引用，那么这些对象会被当成垃圾回收掉。这也意味着WeakSet中没有存储当前对象的列表，WeakSet是**不可枚举**的。
- WeakSet比Set更适合跟踪对象引用，尤其是在涉及大量对象时。WeakSet非常适合处理检测循环引用的场景，例如递归调用自身的函数需要一种通过跟踪哪些对象已被处理，来应对循环数据结构的方法。
- WeakSet 的一个用处，是储存 DOM 节点，而不用担心这些节点从文档移除时，会引发内存泄漏。


### WeakMap
WeakMap对象是一组键值对的集合，其中的键是弱引用。
**键必须是对象**（原始数据类型是不能作为key的），而值可以是任意的。  
WeakMap的key是**不可枚举**的（美缝方法能给出所有的key）。因为key是弱引用，在没有其他引用时垃圾回收会将键对象进行回收，此时WeakMap中就找不到该键了，假如key是可枚举的，那么取得的结果会受到垃圾回收机制的影响，从而得到不确定的结果。     
当要往对象上添加数据，又不想干扰垃圾回收机制时，可以使用WeakMap。