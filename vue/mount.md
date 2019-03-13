### mount方法跟踪
`entry-runtime-with-compiler`文件mount方法，删除开发环境下的提示后代码如下
```javascript
// 将$mount方法保存到mount中，然后再重新定义$mount方法
const mount = Vue.prototype.$mount
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {
  el = el && query(el)

  const options = this.$options

  // 没有配置render时，将template或者el转换成render方法
  if (!options.render) {
    let template = options.template

    // 主要处理不同写法的template, #id 或者是一个DOM元素，最终都会被转成一个字符串模板
    if (template) {
      if (typeof template === 'string') {
        if (template.charAt(0) === '#') {
          template = idToTemplate(template)
        }
      } else if (template.nodeType) {
        template = template.innerHTML
      } 
    } else if (el) {
      template = getOuterHTML(el)
    } else {
        return this;
    }

    // 此处的template是一个字符串模板
    if (template) {
      const { render, staticRenderFns } = compileToFunctions(template, {
        shouldDecodeNewlines,
        shouldDecodeNewlinesForHref,
        delimiters: options.delimiters,
        comments: options.comments
      }, this)

      // 此时已经有了render方法
      options.render = render
      options.staticRenderFns = staticRenderFns
    }
  }

  // 调用临时mount方法
  return mount.call(this, el, hydrating)
}
```
重新定义的`$mount`方法，主要任务就是根据`template/el`生成`render`方法。
接下来看下临时mount方法，在`web/runtime/index.js`中定义
```javascript
Vue.prototype.$mount = function (
  el?: string | Element,
  hydrating?: boolean
): Component {

  // 如果有el且在浏览器中，则查询el对应的DOM元素
  el = el && inBrowser ? query(el) : undefined

  // 直接调用mountComponent
  return mountComponent(this, el, hydrating)
}
```
`core/instance/lifecycle`中查看`mountComponent`方法
```javascript
export function mountComponent (
  vm: Component,
  el: ?Element,
  hydrating?: boolean
): Component {
  vm.$el = el
  if (!vm.$options.render) {
    vm.$options.render = createEmptyVNode
  }

  // 调用beforeMount钩子
  callHook(vm, 'beforeMount')

  let updateComponent
  
  // 重要：updateComponent作为new Watcher()的第二个参数即为watcher.getter
  // 当vm数据变化时，自动调用该方法
  updateComponent = () => {
    vm._update(vm._render(), hydrating)
  }
  
  // we set this to vm._watcher inside the watcher's constructor
  // since the watcher's initial patch may call $forceUpdate (e.g. inside child
  // component's mounted hook), which relies on vm._watcher being already defined
  new Watcher(vm, updateComponent, noop, {
    before () {
      if (vm._isMounted && !vm._isDestroyed) {
        // 调用beforeUpdate钩子  
        callHook(vm, 'beforeUpdate')
      }
    }
  }, true /* isRenderWatcher */)
  // 该watcher的options中无lazy，所以会在初始化的时候调用updateComponent方法
  hydrating = false

  // manually mounted instance, call mounted on self
  // mounted is called for render-created child components in its inserted hook
  if (vm.$vnode == null) {
    vm._isMounted = true
    callHook(vm, 'mounted')
  }
  return vm
}
```
跟踪进入`updateComponent`方法内部:`vm._update(vm._render(), hydrating)`  
查看`_render`和`_update`方法
```javascript
  Vue.prototype._render = function (): VNode {
    const vm: Component = this
    const { render, _parentVnode } = vm.$options

    if (_parentVnode) {
      vm.$scopedSlots = _parentVnode.data.scopedSlots || emptyObject
    }
    // set parent vnode. this allows render functions to have access
    // to the data on the placeholder node.
    vm.$vnode = _parentVnode
    // render self
    let vnode
    try {
      // 使用：render (createElement) => {return createElement('div', {class: 'xxx'}, 'text');}
      // 调用render方法生成虚拟DOM
      vnode = render.call(vm._renderProxy, vm.$createElement)
    } catch (e) {
      handleError(e, vm, `render`)
      vnode = vm._vnode
    }
    // return empty vnode in case the render function errored out
    if (!(vnode instanceof VNode)) {
      vnode = createEmptyVNode()
    }
    // set parent
    vnode.parent = _parentVnode
    return vnode
  }

  Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
    const vm: Component = this
    const prevEl = vm.$el
    const prevVnode = vm._vnode
    const restoreActiveInstance = setActiveInstance(vm)
    // 将vnode保存到vm._vnode，作为oldVnode
    vm._vnode = vnode
    // Vue.prototype.__patch__ is injected in entry points
    // based on the rendering backend used.
    if (!prevVnode) {
      // initial render 如果没有之前的vnode,则是首次渲染页面
      vm.$el = vm.__patch__(vm.$el, vnode, hydrating, false /* removeOnly */)
    } else {
      // updates 非首次渲染页面，则使用diff算法进行对比vnode，仅更新变动的部分
      vm.$el = vm.__patch__(prevVnode, vnode)
    }
    restoreActiveInstance()
    // update __vue__ reference
    if (prevEl) {
      prevEl.__vue__ = null
    }
    if (vm.$el) {
      vm.$el.__vue__ = vm
    }
    // if parent is an HOC, update its $el as well
    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
      vm.$parent.$el = vm.$el
    }
    // updated hook is called by the scheduler to ensure that children are
    // updated in a parent's updated hook.
  }

```
至此，mount流程走完，在这中间还有两个重点：
`1.render方法是如何生成的` 和 `2.__patch__方法是如何比较两个vnode`

整个mount流程大致如下  
![mount](https://github.com/cloudtian/blogs/blob/master/vue/mount.jpg)