title: ES6 Learning - Promise对象
date: 2016-04-07 16:34:26
categories:
- UI Development
tags:
- Javascript
---

## 含义

`Promise`是异步编程的一种解决方案。语法角度来说可以从它来获取异步操作的消息。

`Promise`对象具有以下特点。

1. 对象的状态不受外界影响。三种状态：`Pending`进行中，`Resolved`已完成和`Rejected`已失败。
2. 一旦状态改变，就不会再变，任何时候都可以得到这个结果。

`Promise`对象的缺点：

1. 无法取消`Promise`，一旦建立就会立即执行，无法中断。
2. 不设置回调函数会导致`Promise`内部抛出的错误不会反映到外部。
3. 当处于`Pending`状态时，无法判断当前进展到哪个阶段（开始还是即将完成）。

<!-- more -->

## 基本用法

Promise新建后就会立即执行。

```javascript
let promise = new Promise(function(resolve, reject) {
  console.log('Promise');
  resolve();
});

promise.then(function() {
  console.log('Resolved.');
});

console.log('Hi!');
```

下面是一个`Promise`模拟`Ajax`的例子。

```javascript
var getJSON = function(url) {
  var promise = new Promise(function(resolve, reject){
    var client = new XMLHttpRequest();
    client.open("GET", url);
    client.onreadystatechange = handler;
    client.responseType = "json";
    client.setRequestHeader("Accept", "application/json");
    client.send();

    function handler() {
      if ( this.readyState !== 4 ) {
        return;
      }
      if (this.status === 200) {
        resolve(this.response);
      } else {
        reject(new Error(this.statusText));
      }
    };
  });

  return promise;
};

getJSON("/posts.json").then(function(json) {
  console.log('Contents: ' + json);
}, function(error) {
  console.error('出错了', error);
});
```

## Promise.prototype.then()

`then(resolveFn, rejectFn)`。

## Promise.prototype.catch()

__一般来说，不要在then方法里面定义Reject状态的回调函数（即then的第二个参数），总是使用catch方法。__

```javascript
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```
































