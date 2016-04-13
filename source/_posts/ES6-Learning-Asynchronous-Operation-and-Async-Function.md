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








































