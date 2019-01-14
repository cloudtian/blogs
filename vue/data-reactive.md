### 数据响应
从`initState`入手  
`core/instance/state.js`
```javascript
export function initState (vm: Component) {
  vm._watchers = []
  const opts = vm.$options

  // 初始化props->methods->data->computed->watch
  if (opts.props) initProps(vm, opts.props)
  if (opts.methods) initMethods(vm, opts.methods)
  if (opts.data) {
    initData(vm)
  } else {
    observe(vm._data = {}, true /* asRootData */)
  }
  if (opts.computed) initComputed(vm, opts.computed)
  if (opts.watch && opts.watch !== nativeWatch) {
    initWatch(vm, opts.watch)
  }
}
```
`initState`函数中主要依次初始化props,methods,data,computed,watch。  
从最简单的数据响应`initData`开始：
```javascript
function initData (vm: Component) {
  let data = vm.$options.data

  data = vm._data = typeof data === 'function'
    // data为函数时，为什么不直接调用data方法获取返回值，看看getData()中做了什么其他的事情(调用前后多了个pushTarget, popTarget操作)
    ? getData(data, vm) 
    : data || {}

  const keys = Object.keys(data)

  let i = keys.length
  while (i--) {
    const key = keys[i]
    // 检查key是否以_或者$开头
    if (!isReserved(key)) {
      // 把对vm上数据读写代理到_data上去
      proxy(vm, `_data`, key)
    }
  }
  observe(data, true /* asRootData */)
}

export function getData (data: Function, vm: Component): any {
  // #7573 disable dep collection when invoking data getters
  // 没有传参数，目的是清空Dep.target, 这样就不会在获取data初始值的过程中把依赖记录下来
  pushTarget() 
  try {
    return data.call(vm, vm)
  } catch (e) {
    handleError(e, vm, `data()`)
    return {}
  } finally {
    popTarget()
  }
}
```
`initData`方法中 
- 首先获取`data`的值并保存到`vm._data`上，
- 然后把对`vm`上读写数据代理到`_data`上，
- 最后一行`observe(data, true)`观察数据。  

![data代理](https://github.com/cloudtian/blogs/blob/master/vue/proxy-data.jpg)  

再来看看`initData`中最后一行代码`observe(data, true)`
`core/observer/index.js`：
```javascript
export function observe (value: any, asRootData: ?boolean): Observer | void {
  if (!isObject(value) || value instanceof VNode) {
    return
  }
  let ob: Observer | void
  if (hasOwn(value, '__ob__') && value.__ob__ instanceof Observer) {
    ob = value.__ob__
  } else if (
    shouldObserve &&
    !isServerRendering() &&
    (Array.isArray(value) || isPlainObject(value)) &&
    Object.isExtensible(value) &&
    !value._isVue
  ) {
    ob = new Observer(value) // 关键部分
  }
  if (asRootData && ob) {
    ob.vmCount++
  }
  return ob
}
```
关键部分`ob = Observer(value)`，看一看`Observer`类：
```javascript
export class Observer {
  value: any;
  dep: Dep;
  vmCount: number; 

  constructor (value: any) {
    this.value = value
    this.dep = new Dep()
    this.vmCount = 0

    // value上添加__ob__属性，下次调用observer()方法时不会重复添加观察者
    def(value, '__ob__', this)
    if (Array.isArray(value)) {

      // 这里的作用就是把 数组上的原生方法进行了一次劫持，比如调用push方法的时候，其实调用的是被劫持的一个方法，
      // 而在这个方法内部，Vue会进行notify操作，因此就知道了你对数组的修改了。不过这个做法没法劫持直接通过下标对数组的修改。
      if (hasProto) {
        protoAugment(value, arrayMethods)
      } else {
        copyAugment(value, arrayMethods, arrayKeys)
      }
      // 对数组中的每一项进行observe(items[i])
      this.observeArray(value)
    } else {
      this.walk(value)
    }
  }
  walk (obj: Object) {
    const keys = Object.keys(obj)
    for (let i = 0; i < keys.length; i++) {
      defineReactive(obj, keys[i])
    }
  }
  observeArray (items: Array<any>) {
    for (let i = 0, l = items.length; i < l; i++) {
      observe(items[i])
    }
  }
}
```
`Observer`构造方法中首先定义了一个__ob__属性，然后判断value类型，如果是数组，则对遍历每项调用observer，否则调用this.walk();  
this.walk()函数中对参数obj的每一个键值对进行defineReactive()操作。

`defineReactive`方法:
```javascript
export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: ?Function,
  shallow?: boolean
) {

  // 创建dep，用来收集对当前obj.key的依赖
  const dep = new Dep()

  // 获取属性描述符
  const property = Object.getOwnPropertyDescriptor(obj, key)

  // 属性不可配置则直接返回
  if (property && property.configurable === false) {
    return
  }

  const getter = property && property.get
  const setter = property && property.set

  if ((!getter || setter) && arguments.length === 2) {
    val = obj[key]
  }

  // 如果val是一个对象，那么会递归进行监听。也就是到了new Observer中，childOb返回的是一个observer实例
  // 有了对孩子的监听器之后，当孩子改变时我们就能知道了
  let childOb = !shallow && observe(val)

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      const value = getter ? getter.call(obj) : val
      if (Dep.target) {
        // 添加依赖，如果有孩子，则添加孩子的依赖
        dep.depend()
        if (childOb) {
          childOb.dep.depend()
          if (Array.isArray(value)) {
            dependArray(value)
          }
        }
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      const value = getter ? getter.call(obj) : val
      /* eslint-disable no-self-compare */
      if (newVal === value || (newVal !== newVal && value !== value)) {
        return
      }
      // #7981: for accessor properties without setter
      if (getter && !setter) return
      if (setter) {
        setter.call(obj, newVal)
      } else {
        val = newVal
      }
      childOb = !shallow && observe(newVal)

      // 依赖通知更新
      dep.notify()
    }
  })
}
```
![observer](https://github.com/cloudtian/blogs/blob/master/vue/observer.jpg)  
