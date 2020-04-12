## 节流与防抖

### 场景
1. window对象频繁的onresize,onscroll等事件
2. 拖拽的mousemove事件
3. 输入框根据输入内容自动搜索

### 差异
**节流**：高频事件触发时，n秒内只执行一次。每次触发事件时都判断当前是否有等待执行的延时函数。节流会稀释函数的执行频率。  

**防抖**：触发高频事件后，n秒内只会执行一次。如果n秒内高频事件再次被触发，则重新计算时间。每次触发事件时都取消之间的延时函数。

> 例子：
> - dom的拖拽一般用**节流**，在一定的事件内多次执行，会比较流畅。如果用防抖，就会出现卡顿的感觉，因为只在停止的时候执行了一次。
> - 搜索框的搜索一般用**防抖**，当用户连续不断的输入时，不需要发送请求，当一定时间不输入了就发送一次请求。如果小于这段时间继续输入的话，也不需要发送请求。

### 节流
**时间戳版** 函数触发是在时间段内开始的时候。  
```javascript
function throttle (fn, wait) {
    var previous = 0;
    return function () {
        var now = new Date();
        if (now - previous < wait) return;
        fn.apply(this, arguments);
        previous = now;
    };
}
```
**定时器版** 函数触发是在时间段内结束的时候。  
```javascript
function throttle (fn, wait) {
    var timeout = null;
    return function () {
        if (timeout) return;
        timeout = setTimeout(() => {
            timeout = null;
            fn.apply(this, arguments);
        }, wait); 
    };
}
```
**合并**
```javascript
// options.leading 首次是否执行
// options.trailing 最后是否执行
function throttle (fn, wait, options) {
    var timeout = null;
    var previous = 0;
    return function () {
        var now = new Date();
        if (!previous && options.leading === false) {
            previous = now;
        }
        var remaining = wait - (now - previous);
        if (remaining <= 0) {
            clearTimeout(timeout);
            timeout = null;
            previous = now;
            fn.apply(this, arguments);
        } else if (!timeout && options.trailing !== false) {
            timout = setTimeout(() => {
                previous = options.leading === false ? 0 : new Date();
                timeout = null;
                fn.apply(this, arguments);
            }, remaining);
        }
    };
}
```
### 防抖
**非立即执行** 触发事件后函数不会立即执行，而是在n秒之后执行，如果n秒之内又触发了事件，则会重新计算函数执行时间。
```javascript
function debounce (fn, wait) {
    var timeout = null;
    return function () {
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            fn.apply(this, arguments);
        }, wait);
    };
}
```

**立即防抖** 触发事件后函数立即执行，然后n秒内不触发事件才会执行函数的效果。  
```javascript
function debounce (fn, wait) {
    var timeout = null;
    return function () {
        var callNow = !timeout;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
        }, wait);
        if (callNow) fn.apply(this, arguments);
    };
}
```
**合并**
```javascript
function debounce (fn, wait, immediate) {
    var timeout = null;
    return function () {
        var callNow = !timeout && immediate;
        if (timeout) clearTimeout(timeout);
        timeout = setTimeout(() => {
            timeout = null;
            if (!immediate) fn.apply(this, arguments);
        }, wait);
        if (callNow) fn.apply(this, arguments);
    };
}
```