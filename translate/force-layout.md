> [原文](https://gist.github.com/paulirish/5d52fb081b3570c81e3a)

# 什么是强制布局/reflow (回流，重排)

下面所有的属性或方法，在JavaScript中被调用时，都会触发浏览器去同步计算样式并布局。这也叫做回流或者[布局抖动](https://kellegous.com/j/2013/01/26/layout-performance/)，这也是常见的性能瓶颈。

通常来说，所有同步提供布局参数的API都会触发强制的回流/布局。请继续阅读其他案例和细节。

### 元素API

##### 获取盒子度量参数
* `elem.offsetLeft`, `elem.offsetTop`, `elem.offsetWidth`, `elem.offsetHeight`, `elem.offsetParent`
* `elem.clientLeft`, `elem.clientTop`, `elem.clientWidth`, `elem.clientHeight`
* `elem.getClientRects()`, `elem.getBoundingClientRect()`

##### 滚动相关
* `elem.scrollBy()`, `elem.scrollTo()`
* `elem.scrollIntoView()`, `elem.scrollIntoViewIfNeeded()`  
* `elem.scrollWidth`, `elem.scrollHeight`
* `elem.scrollLeft`, `elem.scrollTop` 以及设置它们。

##### 聚焦
* `elem.focus()` ([source](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/core/dom/Element.cpp?q=updateLayoutIgnorePendingStylesheets+-f:out+-f:test&sq=package:chromium&dr=C)&l=2923)

##### 其他…
* `elem.computedRole`, `elem.computedName`  
* `elem.innerText` ([source](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/core/dom/Element.cpp?q=updateLayoutIgnorePendingStylesheets+-f:out+-f:test&sq=package:chromium&dr=C)&l=3440))

### 调用 getComputedStyle()

`window.getComputedStyle()` 通常会强制样式重新计算 

`window.getComputedStyle()` 通常会强制布局，并且，如果下面任何一项为真时：

1. 元素在隐藏的树下
2. 媒体查询属性 (关联视口的那些). 特别是下面这些: ([source](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/core/css/MediaQueryExp.cpp?type=cs&q=f:MediaQueryExp.cpp+MediaQueryExp::IsViewportDependent&l=192))
  * `min-width`, `min-height`, `max-width`, `max-height`, `width`, `height`
  * `aspect-ratio`, `min-aspect-ratio`, `max-aspect-ratio`
  * `device-pixel-ratio`, `resolution`, `orientation` , `min-device-pixel-ratio`, `max-device-pixel-ratio`
3. 必填的属性是以下几种:  ([source](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/core/css/CSSComputedStyleDeclaration.cpp?dr=C&q=f:CSSComputedStyleDeclaration.cpp+isLayoutDependent&sq=package:chromium))
  * `height`, `width`
  * `top`, `right`, `bottom`, `left`
  * `margin` [`-top`, `-right`, `-bottom`, `-left`, or *简写*] 当margin是确定值时.
  * `padding` [`-top`, `-right`, `-bottom`, `-left`, or *简写*] 当padding是确定值时.
  * `transform`, `transform-origin`, `perspective-origin`
  * `translate`, `rotate`, `scale`
  * `grid`, `grid-template`, `grid-template-columns`, `grid-template-rows`
  * `perspective-origin`
  * 这些属性以前在列表中，但是现在似乎不存在了(as of Feb 2018): `motion-path`, `motion-offset`, `motion-rotation`, `x`, `y`, `rx`, `ry`

### 获取window尺寸

* `window.scrollX`, `window.scrollY`
* `window.innerHeight`, `window.innerWidth`
*  window.visualViewport.height / width / offsetTop / offsetLeft ([source](https://source.chromium.org/chromium/chromium/src/+/master:third_party/blink/renderer/core/frame/visual_viewport.cc;l=435-461;drc=a3c165458e524bdc55db15d2a5714bb9a0c69c70?originalUrl=https:%2F%2Fcs.chromium.org%2F))

### Forms: 设置选择 和 聚焦

* `inputElem.focus()`
* `inputElem.select()`, `textareaElem.select()`

### Mouse events: 获取偏移数据

* `mouseEvt.layerX`, `mouseEvt.layerY`, `mouseEvt.offsetX`, `mouseEvt.offsetY` ([source](https://cs.chromium.org/chromium/src/third_party/WebKit/Source/core/events/MouseEvent.cpp?type=cs&q=f:Mouse+f:cpp+::computeRelativePosition&sq=package:chromium&l=517))

### document

* `document.scrollingElement` 仅强制样式
* `document.elementFromPoint`

### 获取Range的尺寸

* `range.getClientRects()`, `range.getBoundingClientRect()`

### SVG

* 十分多; 还没有做一个明确的列表，但是[Tony Gentilcore's 2011 Layout Triggering List](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html) 提到了一部分.


### 让文本处于可编辑状态
  
* 很多很多, …包括复制一个图片到剪切板 ([source](https://cs.chromium.org/search/?q=UpdateStyleAndLayoutIgnorePendingStylesheets+file:%5Esrc/third_party/WebKit/Source/core/editing/+package:%5Echromium$&type=cs))
  

## *附录

* 只有当文档更改并使得样式或布局无效时，回流才有成本。通常，这是因为DOM被改变了。（修改了类，增加/删除节点，甚至是添加了类似:focus之类的伪类）
* 如果布局被强制修改，首先被重新计算的是样式。因此强制布局会触发两个操作。他们的开销十分依赖于内容/场景，但是通常二者的开销相似。
* 你应该怎么做？ 下面的强制布局一节将更详细地介绍所有内容，但简短的版本是： 
  1. 强制布局或修改DOM结构的`for` 循环是最糟糕的，应该避免它们. 
  1. 使用开发者工具的时间线可以看出什么时候发生了什么，你可能会惊讶于你的代码和库代码多久触发一次。
  1. 分批处理读写DOM操作。 (通过[FastDOM](https://github.com/wilsonpage/fastdom) 或者实现虚拟DOM). 在框架的开头阅读需要的参数 (在`rAF`的非常非常的开端, 滚动事件处理等等), 当这些值与最近一次布局结束后仍然一致时。 

<center>
<img src="https://cloud.githubusercontent.com/assets/39191/10144107/9fae0b48-65d0-11e5-8e87-c9a8e999b064.png">
 <i>从Guardian的时间线痕迹中可以看出，Outbrain重复地强制布局，可能是在一个循环中。</i>
</center>

##### 浏览器兼容性 
* 上述数据是通过读取Blink source来构建的，所以在Chrome, Opera以及大多数安卓浏览器都是可行的。
* [Tony Gentilcore's Layout Triggering List](http://gent.ilcore.com/2011/03/how-not-to-trigger-layout-in-webkit.html) 是2011年WebKit内核基本上与上述一致。 
* 现在的WebKit实例对于强制布局几乎一致: [`updateLayoutIgnorePendingStylesheets` - GitHub search - WebKit/WebKit ](https://github.com/WebKit/webkit/search?q=updateLayoutIgnorePendingStylesheets&utf8=%E2%9C%93)
* Gecko's 重绘似乎是通过 FrameNeedsReflow. 结果: [`FrameNeedsReflow` - mozilla-central search](http://lxr.mozilla.org/mozilla-central/search?string=FrameNeedsReflow&find=&findi=%5C.c&filter=%5E%5B%5E%5C0%5D*%24&hitlimit=&tree=mozilla-central)
* 对Edge/IE没有具体数据, 但它应该大致保持一致， 指定了这些属性的返回值。不同的是巧妙优化的数量。

##### 浏览Chromium源码:
* 强制布局 (或者样式重新计算): [`UpdateStyleAndLayoutIgnorePendingStylesheets` - Chromium Code Search](https://cs.chromium.org/search/?q=UpdateStyleAndLayoutIgnorePendingStylesheets+-f:out+-f:test&type=cs)
* 强制样式重新计算: [`UpdateStyleAndLayoutTreeIgnorePendingStylesheets` - Chromium Code Search](https://cs.chromium.org/search/?q=UpdateStyleAndLayoutTreeIgnorePendingStylesheets++-f:out+-f:test&type=cs)

#### CSS 触发器

[CSS 触发器](http://csstriggers.com/) 是一个被关联的资源，关于所有在浏览器生命周期中由于设置/改变一个给定的CSS值的而需要进行的哪些操作操作。这是一个很好的资源。然而，上面的列表中都是关于通过JavaScript同步修改紫色/绿色/暗绿色的圆圈。

#### 更多强制布局参见

* [Avoiding layout thrashing — Web Fundamentals](https://developers.google.com/web/fundamentals/performance/rendering/avoid-large-complex-layouts-and-layout-thrashing?hl=en)
* [Fixing Layout thrashing in the real world | Matt Andrews](https://mattandre.ws/2014/05/really-fixing-layout-thrashing/)
* [Timeline demo: Diagnosing forced synchronous layouts - Google Chrome](https://developer.chrome.com/devtools/docs/demos/too-much-layout)
* [Preventing &apos;layout thrashing&apos; | Wilson Page](http://wilsonpage.co.uk/preventing-layout-thrashing/)
* [wilsonpage/fastdom](https://github.com/wilsonpage/fastdom)
* [Rendering: repaint, reflow/relayout, restyle / Stoyan](http://www.phpied.com/rendering-repaint-reflowrelayout-restyle/)
* [We spent a week making Trello boards load extremely fast. Here’s how we did it. - Fog Creek Blog](http://blog.fogcreek.com/we-spent-a-week-making-trello-boards-load-extremely-fast-heres-how-we-did-it/)
* [Minimizing browser reflow  |  PageSpeed Insights  |  Google Developers](https://developers.google.com/speed/articles/reflow?hl=en)
* [Optimizing Web Content in UIWebViews and Websites on iOS](https://developer.apple.com/videos/wwdc/2012/?id=601)
* [Accelerated Rendering in Chrome](http://www.html5rocks.com/en/tutorials/speed/layers/)
* [web performance for the curious](https://www.igvita.com/slides/2012/web-performance-for-the-curious/)
* [Jank Free](http://jankfree.org/)

-------------

更新于2018年2月. 代码搜索链接和关联元素的属性的少量修改。
