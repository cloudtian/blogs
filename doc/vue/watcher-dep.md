### 订阅者和依赖收集器
`src/core/observer/watcher.js`  
先看构造函数
```javascript
constructor (
    vm: Component,
    expOrFn: string | Function,
    cb: Function,
    options?: ?Object,
    isRenderWatcher?: boolean
  ) {
    this.vm = vm
    if (isRenderWatcher) {
      vm._watcher = this
    }
    vm._watchers.push(this)
    // options
    if (options) {
      this.deep = !!options.deep
      this.user = !!options.user
      this.lazy = !!options.lazy
      this.sync = !!options.sync
      this.before = options.before
    } else {
      this.deep = this.user = this.lazy = this.sync = false
    }
    this.cb = cb
    this.id = ++uid // uid for batching
    this.active = true
    this.dirty = this.lazy // for lazy watchers
    this.deps = []
    this.newDeps = []
    this.depIds = new Set()
    this.newDepIds = new Set()
    this.expression = process.env.NODE_ENV !== 'production'
      ? expOrFn.toString()
      : ''
    // parse expression for getter
    if (typeof expOrFn === 'function') {
      this.getter = expOrFn
    } else {
      // parsePath函数返回一个闭包函数，可用于读取一个对象的多级属性
      this.getter = parsePath(expOrFn)
      if (!this.getter) {
        this.getter = noop
      }
    }
    this.value = this.lazy
      ? undefined
      : this.get()
  }
```
构造函数主要是一些属性的初始化，
- lazy 如果为true，在在第一次get的时候才计算值，初始化的时候不计算；如果为false，则初始化的时候会计算值
- deps,newDeps,depIds,newDepIds记录依赖
- expOrFn 表达式
当`lazy`为`false`，时，会在初始化的时候就调用`this.get()`
```javascript
get () {
    // 这里又看到pushTarget函数了，这次把this作为一个参数传入，所以Dep.target === this
    pushTarget(this)
    let value
    const vm = this.vm
    try {
      // 调用getter方法，可以收集依赖
      value = this.getter.call(vm, vm)
    } catch (e) {
      if (this.user) {
        handleError(e, vm, `getter for watcher "${this.expression}"`)
      } else {
        throw e
      }
    } finally {
      // "touch" every property so they are all tracked as
      // dependencies for deep watching
      if (this.deep) {
        traverse(value)
      }
      // 取出Dep.target的this
      popTarget()

      // 清理依赖收集器
      this.cleanupDeps()
    }
    return value
  }
```
`get`方法这里主要是把当前`this`添加到`Dep.target`，然后调用`this.getter`方法便于收集相关依赖，最终再清理依赖收集器。
```javascript
cleanupDeps () {
    let i = this.deps.length
    while (i--) {
      const dep = this.deps[i]
      // 遍历deps, 若newDepIds新收集的依赖中没有，则删除
      if (!this.newDepIds.has(dep.id)) {
        dep.removeSub(this)
      }
    }
    // 将newDepIds赋给depIds，newDeps赋给deps,然后清空newDepIds和newDeps
    let tmp = this.depIds
    this.depIds = this.newDepIds
    this.newDepIds = tmp
    this.newDepIds.clear()
    tmp = this.deps
    this.deps = this.newDeps
    this.newDeps = tmp
    this.newDeps.length = 0
  }
```
`cleanupDeps()`清理依赖，将旧的和新的进行对比，更新旧的依赖，然后清空新的，方便下一次收集。
```javascript
addDep (dep: Dep) {
    const id = dep.id
    // newDepIds和depIds两个if判断用于去重
    // newDepIds可以在doubleMsg的一次求值过程中，避免对msg的重复依赖
    // depIds可以在由于msg更新（更新后会触发watcher.update,这里会再次对msg进行求值）而导致的再次对doubleMsg求值的时候，避免对msg的重复依赖
    if (!this.newDepIds.has(id)) {

      // 在一个计算属性中例如：doubleMsg () { return this.msg + this.msg; } 会对msg进行多次依赖收集，
      // 而使用newDepIds即可避免对msg进行多次依赖收集
      this.newDepIds.add(id)
      this.newDeps.push(dep)

      // 当求值结束之后，newDepIds就清空了，而depIds中就是之前newDepIds的值
      if (!this.depIds.has(id)) {
        dep.addSub(this)
      }
    }
  }
```
上面出现的`dep.removeSub(this)`和`dep.addSub(this)`分别是删除订阅者和添加订阅者；`this`是watcher。接下来看看`class Dep`  
`src/core/observer/dep.js`  
```javascript
export default class Dep {
  static target: ?Watcher;
  id: number;
  subs: Array<Watcher>;

  constructor () {
    this.id = uid++
    // 用于存放收集的watcher实例
    this.subs = []
  }

  addSub (sub: Watcher) {
    this.subs.push(sub)
  }

  removeSub (sub: Watcher) {
    remove(this.subs, sub)
  }

  // defineReactive()方法中重新定义数据的原有属性，
  // 属性的get()被调用时发生数据劫持，dep.depend()收集依赖关系
  // 即调用get()方法时，如果Dep.target有值，则会把该值添加到this.subs中；
  depend () {
    if (Dep.target) {
      // 这里的方法调用有点绕：Dep.target即watcher -> wathcher.addDep(dep) -> dep.addSub(wathcher) -> this.subs.push(watcher)
      Dep.target.addDep(this)
    }
  }

  // 同上，属性的set()被调用时，会判断属性值是否发生变更
  // 如果发生变更，则通过dep.notify()通知vm，触发update
  notify () {
    // stabilize the subscriber list first
    const subs = this.subs.slice()
    for (let i = 0, l = subs.length; i < l; i++) {
      // 通知所有的watcher，去调用update()方法
      subs[i].update()
    }
  }
}
```
当数据改变时，会调用`dep.notify()`触发订阅者的更新方法
```javascript
 update () {
    /* istanbul ignore else */
    if (this.lazy) {
      this.dirty = true
    } else if (this.sync) {
      // 如果是同步模式，则直接调用run方法，默认是异步模式，即会调用下面的queueWatcher()方法
      this.run()
    } else {
      // queueWatcher会把run推迟到nextTick后运行
      // 会创建一个watcher队列，然后在nextTick时统一调用一次
      queueWatcher(this)
    }
  }
  run () {
    if (this.active) {
      // 调用get()方法，可重新收集依赖
      const value = this.get()
      if (
        value !== this.value ||
        // Deep watchers and watchers on Object/Arrays should fire even
        // when the value is the same, because the value may
        // have mutated.
        isObject(value) ||
        this.deep
      ) {
        // set new value
        const oldValue = this.value
        this.value = value
        // 更新this.value的值，触发回调方法cb
        if (this.user) {
          try {
            this.cb.call(this.vm, value, oldValue)
          } catch (e) {
            handleError(e, this.vm, `callback for watcher "${this.expression}"`)
          }
        } else {
          this.cb.call(this.vm, value, oldValue)
        }
      }
    }
  }
```