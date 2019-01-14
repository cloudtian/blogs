### 查找Vue构造函数
从`package.json`着手采用逆向查找的方法  
运行`npm run dev`即可以监测文件变化并自动构建输出`dist/vue.js`
```json
"scripts": {
    "dev": "rollup -w -c scripts/config.js --environment TARGET:web-full-dev"
}
```
> rollup 是一个 JavaScript 模块打包器，-w即watch，-c即指定配置文件 

查看`script/config.js`文件
```javascript
// Runtime+compiler development build (Browser)
  'web-full-dev': {
    entry: resolve('web/entry-runtime-with-compiler.js'),
    dest: resolve('dist/vue.js'),
    format: 'umd',
    env: 'development',
    alias: { he: './entity-decoder' },
    banner
  }
```
可以看到入口文件是`web/entry-runtime-with-compiler.js`

`web/entry-runtime-with-compiler.js`:
```javascript
import Vue from './runtime/index'
```

`web/runtime/index.js`:
```javascript
import Vue from 'core/index'
```

`core/index.js`:
```javascript
import Vue from './instance/index'
```

`core/instance/index.js`:
```javascript
function Vue (options) {
    // 省略开发模式下的提示
    this._init(options);
}
```
到此找到Vue构造函数

### Vue类的创建
找到了Vue的构造函数，再从内向外依次查看每个文件都干了啥。  
`core/instance/index.js`:
```javascript
// Vue构造函数，就只是调用了一下_init方法，稍后再看_init方法的具体内容
function Vue (options) {
    this._init(options);
}

// 接下来就是一堆mixin方法，主要是在Vue.prototype上添加原型方法

// 定义了_init方法，构造函数中调用的就是此方法
initMixin(Vue);

// 定义了$data,$props属性， $set,$delete,$watch方法
stateMixin(Vue);

// 定义了 $on,$off,$once,$emit 方法
eventsMixin(Vue);

// 定义了 _update,$forceUpdate,$destroy 方法
lifecycleMixin(Vue);

// 定义 $nextTick,_render 方法并添加了一大堆renderHelpers
renderMixin(Vue);
```

`core/index.js`:
```javascript
// 在Vue上定义一些属性或方法：config,util,set,delete,nextTick,options
// use,mixin,extend,
// asset相关接口（directive,filter,component）
initGlobalAPI(Vue)

// 在Vue.prototype上定义$isServer和$ssrContext
// 在Vue上定义FunctionalRenderContext和version属性

// 代码省略
```

`web/runtime/index.js`:
```javascript
// 这里都是web平台相关的一些配置
Vue.config.mustUseProp = mustUseProp
Vue.config.isReservedTag = isReservedTag
Vue.config.isReservedAttr = isReservedAttr
Vue.config.getTagNamespace = getTagNamespace
Vue.config.isUnknownElement = isUnknownElement

// 注册指令和组件，这里的 directives 和 components 也是web平台上的，是内置的指令和组件
// 内置的directives只有两个v-model,和v-show
extend(Vue.options.directives, platformDirectives) 
// 内置组件也很少，这里只注册transition,transitionGroup,还有一个KeepAlive在上面的initGlobalAPI()方法中注册; 
extend(Vue.options.components, platformComponents) 

// 如果不是浏览器，就不进行patch操作了
Vue.prototype.__patch__ = inBrowser ? patch : noop

// 如果有el且在浏览器中运行，则进行mount操作
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && inBrowser ? query(el) : undefined

  // 直接调用mountComponent
  return mountComponent(this, el, hydrating)
}

// devtools的一些提示
```

`web/entry-runtime-with-compiler.js`:
```javascript
// 将上面文件中定义的$mount保存为变量mount，然后重新定义了原型上的$mount方法
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  // 代码省略
  // 主要生成render方法并赋值给this.options.render
  return mount.call(this, el, hydrating)
}

Vue.compile = compileToFunctions
```

### 创建Vue实例
`core/instance/index.js`
```javascript
// Vue构造函数，就直是调用了一下_init方法
function Vue (options) {
    this._init(options);
}
```
`core/instance/init.js`:
```javascript
// 省略掉生产环境下的提示代码
Vue.prototype._init = function (options?: Object) {
    const vm: Component = this
    // 唯一自增的ID
    vm._uid = uid++

    let startTag, endTag

    vm._isVue = true
    if (options && options._isComponent) {
      // 内部组件才会走这里
      initInternalComponent(vm, options)
    } else {
      // 合并Vue上的options和自定义的options
      vm.$options = mergeOptions(
        // resolveConstructorOptions：递归向super查找options,找到了就把父类的options和当前的options进行合并
        resolveConstructorOptions(vm.constructor),
        options || {},
        vm
      )
    }
    
    vm._renderProxy = vm
    
    vm._self = vm

    // 生命周期的初始化工作，初始化了很多变量（主要是设置了父子组件的引用关系）: $parent,$root,$children,$refs,
    // _watcher,_inactive,_directInactive,_isMounted,_isDestroyed,_isBeingDestroyed
    initLifecycle(vm)

    // 注册事件，注意这里注册的不是自己的，而是父组件的。因为很明显父组件的监听器才会注册到孩子身上。
    initEvents(vm)

    // 做一些 render 的准备工作，比如处理父子继承关系等，并没有真的开始 render
    // 添加属性_vnode,_staticTrees, $slots,$scopedSlots 
    // 方法_c(),$createElement() 并且defineReactive $attr和$listeners
    initRender(vm)

    // 准备工作完成，准备进入create阶段，调用beforeCreate钩子
    callHook(vm, 'beforeCreate')
    initInjections(vm) // resolve injections before data/props
    
    // initProps,initMethods,initData,initComputed,initWatch
    // `data`, `props`, `computed` 等都是在这里初始化的，`Vue是如何实现数据响应化的`都在这个函数中
    initState(vm)

    // _provided
    initProvide(vm) // resolve provide after data/props

    // 至此create阶段完成
    callHook(vm, 'created')

    // 如果配置了el，则直接挂载，否则就需要手动调用this.$mount(el)进行挂载
    if (vm.$options.el) {
      vm.$mount(vm.$options.el)
    }
  }
```