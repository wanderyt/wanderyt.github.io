title: ES6 Learning - 异步操作 & Async函数
date: 2016-04-13 10:09:33
categories:
- UI Development
tags:
- Javascript
---

ES6之前，异步编程的方法大概四种。

> 回调函数
>
> 事件监听
>
> 发布 / 订阅
>
> Promise对象

## 基本概念

### 异步

一个任务分成几段之后，可以先执行第一段，然后转而执行其他任务，等准备好之后再执行第二段。

### 同步

一个任务分成几段之后，段与段之间不能插入其他任务，必须连续执行，这段时间其他任务只能干等着。

### 回调函数

任务分成几段之后，第一段中的function定义了第二段函数的参数，这时第二个参数就是回调函数。

### Promise

    new Promise().then().then()...

<!-- more -->

## Generator函数

### 协程

多个线程互相协作，完成异步任务。

```javascript
function *asnycJob() {
  // ...其他代码
  var f = yield readFile(fileA);
  // ...其他代码
}
```

__奥妙就在于yield命令的使用。__

### 异步任务的封装

看一个案例。

```javascript
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

var g = gen();
var result = g.next();

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```

例子里用Generator函数实现了异步执行，但是连续调用`g.next()`显得流程管理上不是那么方便。

## Thunk函数

### 参数的求值策略

传值调用还是传名调用。传值调用明显更通俗易懂，而且简单实用。而传名调用可能会有性能上的优化。

```javascript
function f(a, b){
  return b;
}

f(3 * x * x - 2 * x - 1, x);
```

### Thunk函数的含义

传名调用实现就是将参数放到一个临时函数中，再将这个临时函数传入函数体。这个临时函数就是Thunk函数。

```javascript
function f(m){
  return m * 2;
}

f(x + 5);

// 等同于

var thunk = function () {
  return x + 5;
};

function f(thunk){
  return thunk() * 2;
}
```

### Thunk in Javascript

Javascript是执行的传值调用。Thunk将多参数函数替换成单参数版本，只接受回调函数作为参数。

```javascript
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var readFileThunk = Thunk(fileName);
readFileThunk(callback);

var Thunk = function (fileName){
  return function (callback){
    return fs.readFile(fileName, callback);
  };
};
```

一个简单的Thunk函数转换器。

```javascript
var Thunk = function(fn){
  return function (){
    var args = Array.prototype.slice.call(arguments);
    return function (callback){
      args.push(callback);
      return fn.apply(this, args);
    }
  };
};

var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```
































