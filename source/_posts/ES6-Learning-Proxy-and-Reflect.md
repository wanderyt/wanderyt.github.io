title: ES6 Learning - Proxy & Reflect
date: 2016-03-31 16:57:25
categories:
- UI Development
tags:
- Javascript
---

## Proxy

proxy可以理解成对对象的某些操作进行一次拦截。

```javascript
var obj = new Proxy({}, {
  get: function (target, key, receiver) {
    console.log(`getting ${key}!`);
    return Reflect.get(target, key, receiver);
  },
  set: function (target, key, value, receiver) {
    console.log(`setting ${key}!`);
    return Reflect.set(target, key, value, receiver);
  }
});

obj.count = 1
//  setting count!
++obj.count
//  getting count!
//  setting count!
//  2
```

对target进行设置代理时，如果handler没有进行任何拦截，则等同于直接通向源对象。

```javascript
var target = {};
var handler = {};
var proxy = new Proxy(target, handler);
proxy.a = "b";
target.a // "b"
```

```javascript
var target = {};
var handler = {
  get: function(target, property) {
    return 35;
  },
  set: function(target, property, value) {
    target[property] = value;
  }};
var proxy = new Proxy(target, handler);

proxy.a; // 35
target.a; // undefined

proxy.a = 5;
proxy.a; // 5
target.a; // 5

// ============================================
var target = {};
var handler = {
  get: function(target, property) {
    return 35;
  },
  set: function(target, property, value) {
    // target[property] = value;
  }};
var proxy = new Proxy(target, handler);

proxy.a; // 35
target.a; // undefined

proxy.a = 5;
proxy.a; // 35
target.a; // undefined
```

__注意，要使得Proxy起作用，必须针对Proxy实例（上例是proxy对象）进行操作，而不是针对目标对象（上例是空对象）进行操作。__

一个拦截器可以拦截多个操作。

```javascript
var handler = {
  get: function(target, name) {
    if (name === 'prototype') return Object.prototype;
    return 'Hello, '+ name;
  },
  apply: function(target, thisBinding, args) { return args[0]; },
  construct: function(target, args) { return args[1]; }
};

var fproxy = new Proxy(function(x,y) {
  return x+y;
},  handler);

fproxy(1,2); // 1
new fproxy(1,2); // 2
fproxy.prototype; // Object.prototype
fproxy.foo; // 'Hello, foo'
```

## Proxy实例方法

### get()


















