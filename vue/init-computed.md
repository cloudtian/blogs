### 计算属性的初始化
`src/core/instance/state.js`
```javascript
const computedWatcherOptions = { lazy: true }

function initComputed (vm: Component, computed: Object) {
  // $flow-disable-line
  const watchers = vm._computedWatchers = Object.create(null)
  // computed properties are just getters during SSR
  const isSSR = isServerRendering()

  for (const key in computed) {
    const userDef = computed[key]

    // 定义computed可以为function 即只有get方法 或object{getFn,setFn}
    const getter = typeof userDef === 'function' ? userDef : userDef.get
    
    // isSSR是否为服务器端渲染
    if (!isSSR) {
      // create internal watcher for the computed property.
      
      // 给每个计算属性创建订阅器并加入到watchers中 = vm._computedWatchers
      watchers[key] = new Watcher(
        vm,
        getter || noop,
        noop,
        computedWatcherOptions // {lazy: true} 
      )
    }
    // component-defined computed properties are already defined on the
    // component prototype. We only need to define computed properties defined
    // at instantiation here.
    if (!(key in vm)) {
      defineComputed(vm, key, userDef)
    }
  }
}
```
初始化计算属性，`isServerRendering()`是判断是否是服务器渲染，这里我们是在浏览器中运行的，所以为`false`;  
为每个计算属性都创建一个订阅器`watcher`，并且传入`lazy:true`即初始化时不调用`get()`方法。当触发到`wathcer`的`update`方法时也不会立即更新，只会设置`this.dirty=true`  
最后调用`defineComputed()`
```javascript
export function defineComputed (
  target: any,
  key: string,
  userDef: Object | Function
) {
  // shouldCache 为true
  const shouldCache = !isServerRendering()
  if (typeof userDef === 'function') {
    // 只声明一个函数，即只有get方法  
    sharedPropertyDefinition.get = shouldCache
      ? createComputedGetter(key)
      // createGetterInvoker返回一个函数，函数中直接return执行参数userDef方法后的结果；这里就不贴代码了
      : createGetterInvoker(userDef)
    sharedPropertyDefinition.set = noop
  } else {
    // 计算属性是个对象，里面可以传get,set,还可以传cache控制是否缓存  
    sharedPropertyDefinition.get = userDef.get
      ? shouldCache && userDef.cache !== false
        ? createComputedGetter(key)
        : createGetterInvoker(userDef.get) 
      : noop
    sharedPropertyDefinition.set = userDef.set || noop
  }
  // 在vm上添加key属性
  Object.defineProperty(target, key, sharedPropertyDefinition)
}

// computed计算属性的求值get方法
function createComputedGetter (key) {
  return function computedGetter () {
    // 获取到initComputed中定义的对应key的watcher
    const watcher = this._computedWatchers && this._computedWatchers[key]
    if (watcher) {
      // watcher的构造函数中设置了dirty=lazy,所以初始化的时候dirty=true
      // watcher在update的时候设置了dirty=true 
      if (watcher.dirty) {
        // 如果watcher中有脏数据，则直接求值;并更新watcher.value的值，且设置dirty=false  
        watcher.evaluate()
      }
      // 并收集该计算属性的依赖
      if (Dep.target) {
        watcher.depend()
      }
      return watcher.value
    }
  }
}
```
`watcher`的`evaluate`方法
```javascript
 evaluate () {
    this.value = this.get()
    this.dirty = false
  }
```
