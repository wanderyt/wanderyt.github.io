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

如果没有`catch`方法指定错误回调函数，`Promise`对象抛出的错误不会传递到外层代码，导致运行后没有任何输出。

__Chrome不遵守这条规定，会抛出`ReferenceError: x is not defined`的错误。`Promise`对象依旧会变成`rejected`状态。__

```javascript
var someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2); // or var y = x + 2;
  });
};

var p = someAsyncThing();
p.then(function() {
  console.log('everything is great');
})
.catch(function(err) {
  console.log(err);
});
// Chrome报错，Firefox不报错
p; // Promise {[[PromiseStatus]]: "rejected", [[PromiseValue]]: ReferenceError: x is not defined at ...}
```

Promise对象可以连续传递。

```javascript
var promise = new Promise(function(resolve, reject) {
  resolve("Ok");
  reject("Error");
  resolve("Ok again");
});
promise.then(function(value) {
  console.log(value);
  throw new Error("Error");
})
.catch(function(err) {
  console.log(err);
})
.then(function() {
  console.log("continue...");
});
// Ok
// Error: Error(…)
// continue..
promise; // Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "Ok"}
promise.then(function(value) {
  console.log(value);
});
promise;
// Ok
// Promise {[[PromiseStatus]]: "resolved", [[PromiseValue]]: "Ok"}
```

## Promise.all()

    var p = Promise.all([p1, p2, p3]);

参数可以不是数组，但必须具有`Iterator`接口，且返回的每个成员都必须是Promise实例。

`p`的状态由`p1`，`p2`，`p3`决定。

> 只有三个状态都变成`resolved`，`p`的状态才会变成`resolved`，此时返回值是`p1`，`p2`，`p3`的返回值组成的数组。
>
> 只要有一个被`rejected`，`p`的状态就会变成`rejected`，此时第一个被`reject`的promise实例的返回值会传递给`p`的回调函数。

```javascript
// 生成一个Promise对象的数组
var promises = [2, 3, 5, 7, 11, 13].map(function (id) {
  return getJSON("/post/" + id + ".json");
});

Promise.all(promises).then(function (posts) {
  // ...
}).catch(function(reason){
  // ...
});
```

## Promise.race()

    var p = Promise.race([p1, p2, p3]);

只要`p1`，`p2`，`p3`中有一个实例率先改变状态，`p`的状态就跟着改变。

## Promise.resolve()

上面两个方法都会自动做判断参数是否是Promise对象，如果不是，则会调用`Promise.resolve()`方法转为Promise对象。

```javascript
Promise.resolve('foo')
// 等价于
new Promise(resolve => resolve('foo'))
```

参数分为四种情况。

> 参数是Promise实例，则不做任何修改，直接返回实例。

> 参数是thenable对象，会转为Promise对象，然后立即执行对象的`then`方法。

```javascript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function(value) {
  console.log(value);  // 42
});
```

> 参数不是具有`then`方法的对象，或根本不是对象，则返回新的`Promise`对象，状态为`resolved`。

```javascript
var p = Promise.resolve(function() {
  console.log("Hello");
});

p.then(function (s){
  console.log(s)
});

// function () {
//   console.log("Hello");
// }
```

> 不带任何参数，则返回一个普通的`resolved`的Promise对象。

```javascript
var p = Promise.resolve();

p.then(function () {
  // ...
});
```

## Promise.reject()

方法与`Promise.resolve()`一样，只是返回实例的状态为`rejected`。

```javascript
var p = Promise.reject('出错了');
// 等同于
var p = new Promise((resolve, reject) => reject('出错了'))

p.then(null, function (s){
  console.log(s)
});
```

## 附加方法

### done

如果以`then`或`catch`结尾，那么最后一个方法抛出的错误都可能无法捕捉。因此提供一个`done`方法保证回调链尾端总能捕捉任何可能出现的错误。

```javascript
Promise.prototype.done = function (onFulfilled, onRejected) {
  this.then(onFulfilled, onRejected)
    .catch(function (reason) {
      // 抛出一个全局错误
      setTimeout(() => { throw reason }, 0);
    });
};
```

### finally

类似`jquery`中`ajax`的回调函数`always`。

```javascript
Promise.prototype.finally = function (callback) {
  let P = this.constructor;
  return this.then(
    value  => P.resolve(callback()).then(() => value),
    reason => P.resolve(callback()).then(() => { throw reason })
  );
};
```