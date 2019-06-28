// 节流
function throttle (fn, wait) {
    let timer= null;
    return function () {
        if (timer) return;
        timer = setTimeout(() => {
            fn.apply(this, arguments);
            timer = null;
        }, wait);
    };
}

// 防抖
function debounce (fn, wait) {
    let timer = null;
    return function () {
        clearTimeout(timer);
        timer = setTimeout(() => {
            fn.apply(this, arguments);
        }, wait);
    }
}

// underscore.js中的节流和防抖
// 节流：频率控制 用于将高频率连续调用某函数控制为低频率
var throttle1 = function (fn, wait, options = {}) {
    var timer = null;
    var previous = 0;
    var result;
    return function () {
        var now = +new Date();
        if (!previous && options.leading === false) { // leading=false禁用第一次首先执行
            previous = now;
        }

        var remaining = wait - (now - previous);
        if (remaining <= 0) {
            clearTimeout(timer);
            timer = null;
            previous = now;
            result = fn.apply(this, arguments);
        } else if (!timer && options.trailing !== false) { // trailing=false 禁用最后一次执行
            timer = setTimeout(() => {
                previous = options.leading === false ? 0 : new Date();
                timer = null;
                result = fn.apply(this, arguments);
            }, remaining);
        }
        return result;
    }
};
// 防抖：空闲控制 当高频率连续调用某函数停下来时，才会真正地去执行它
var debounce1 = function (fn, wait, immediate) { // immediate=true,会在wait时间间隔的开始调用这个函数
    var timer = null;
    var result;
    var timestamp;
    return function () {
        timestamp = new Date();
        var later = () => {
            var last = (new Date()) - timestamp;
    
            if (last < wait) {
               timer = setTimeout(later, wait - last);
            } else {
                timer = null;
                if (!immediate) {
                    result = fn.apply(this, arguments);
                }
            }
        };
        var callNow = !timer && immediate;
        if (!timer) {
            timer = setTimeout(later, wait);
        }
        if (callNow) {
            result = fn.apply(this, arguments);
        }
        return result;
    };
}

