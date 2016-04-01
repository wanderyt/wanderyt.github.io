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

<!-- more -->

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

上面基本上也列出了很多get方面的用例，下面加一个链式调用的例子。

```javascript
var pipe = (function () {
  var pipe;
  return function (value) {
    pipe = [];
    return new Proxy({}, {
      get: function (pipeObject, fnName) {
        if (fnName == "get") {
          return pipe.reduce(function (val, fn) {
            return fn(val);
          }, value);
        }
        pipe.push(window[fnName]);
        return pipeObject;
      }
    });
  }
}());

var double = n => n * 2;
var pow = n => n * n;
var reverseInt = n => n.toString().split('').reverse().join('') | 0;

pipe(3).double.pow.reverseInt.get
// 63
```

### set()

同get类似，可以通过设定拦截器防止用户对某些属性进行读写。也可以对属性的赋值做一些规范。

```javascript
var handler = {
  get (target, key) {
    invariant(key, 'get');
    return target[key];
  },
  set (target, key, value) {
    invariant(key, 'set');
    return true;
  }
}
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}
var target = {};
var proxy = new Proxy(target, handler);
proxy._prop
// Error: Invalid attempt to get private "_prop" property
proxy._prop = 'c'
// Error: Invalid attempt to set private "_prop" property
```

### apply()

负责拦截函数的调用、`call`和`apply`操作。

```javascript
var handler = {
  apply (target, ctx, args) {
    return Reflect.apply(...arguments);
  }
}
```

三个参数的含义分别为：

    target: 目标对象
    ctx:    目标对象的上下文
    args:   目标对象的参数数组

```javascript
var david = {
  first_name: "David",
  target: function(last_name = "Ren") {
    return `${this.first_name} ${last_name}`;
  }
};
david.target();

var p = new Proxy(david.target, {
  apply (target, ctx, args) {
    console.log(target);
    console.log(ctx);
    console.log(args);
    return `After proxy, ${ctx.first_name} ${args}`;
  }
})

p("Wanderyt");
// function (last_name = "Ren") {
//   return `${this.first_name} ${last_name}`;
// }
// undefined
// ["Wanderyt"]
// Uncaught TypeError: Cannot read property 'first_name' of undefined(…)
// 最后报错主要是因为这里不存在p的调用环境，如果换成call或apply就可以成功看到结果。
p.call(david, "Wanderyt");
// function (last_name = "Ren") {
//   return `${this.first_name} ${last_name}`;
// }
// Object {first_name: "David"}
// ["Wanderyt"]
// "After proxy, David Wanderyt"
```

### has()

负责隐藏某些属性，不被`in`操作符发现。

```javascript
var obj = { a: 10 };
Object.preventExtensions(obj);
var p = new Proxy(obj, {
  has: function(target, prop) {
    return false;
  }
});

"a" in p; // TypeError is thrown
```

注意，这里的has()必须返回一个布尔值类型。

    The has method must return a boolean value.

```javascript
var obj = {
  name: "wanderyt",
  _name: "david"
};
var p = new Proxy(obj, {
  has: function(target, prop) {
    if (prop[0] === "_") {
      return "not found";
    } else {
      return prop in target;
    }
  }
});

"name" in p; // true
"_name" in p; // true
```

这里因为对于_name属性来说，拦截器返回的是`"not found"`字符串，所以是`true`。如果改成返回空字符串，就会返回`false`。

```javascript
var obj = {
  name: "wanderyt",
  _name: "david"
};
var p = new Proxy(obj, {
  has: function(target, prop) {
    if (prop[0] === "_") {
      return "";
    } else {
      return prop in target;
    }
  }
});

"name" in p; // true
"_name" in p; // false
```

### construct()

拦截`new`命令。同`has()`一样，返回值必须要求为对象类型，否则抛出错误。

```javascript
var handler = {
  construct (target, args) {
    return new target(...args);
  }
}

var p = new Proxy(function() {}, {
  construct: function(target, argumentsList) {
    return 1;
  }
});

new p() // 报错
```

### deleteProperty()

用于拦截`delete`操作，如果抛出错误或者返回`false`，则无法被删除。

```javascript
var handler = {
  deleteProperty (target, key) {
    invariant(key, 'delete');
    return true;
  }
}
function invariant (key, action) {
  if (key[0] === '_') {
    throw new Error(`Invalid attempt to ${action} private "${key}" property`);
  }
}

var target = { _prop: 'foo' }
var proxy = new Proxy(target, handler)
delete proxy._prop
// Error: Invalid attempt to delete private "_prop" property
```

### defineProperty()

拦截`Object.defineProperty`操作。对于返回值，文档中说明：

    The defineProperty method must return a Boolean indicating whether it has successfully defined the property on the target or not.

```javascript
var handler = {
  defineProperty (target, key, descriptor) {
    return false;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar';
// TypeError: proxy defineProperty handler returned false for property '"foo"'

// 但是如果我设定返回true，属性依旧不会成功定义
var handler = {
  defineProperty (target, key, descriptor) {
    return true;
  }
};
var target = {};
var proxy = new Proxy(target, handler);
proxy.foo = 'bar';
proxy.foo; // undefined
```

### enumerate()

用来拦截`for...in`循环的。返回一个`iterator`对象。

```javascript
var handler = {
  enumerate (target) {
    return Object.keys(target).filter(key => key[0] !== '_')[Symbol.iterator]();
  }
}
var target = { prop: 'foo', _bar: 'baz', _prop: 'foo' }
var proxy = new Proxy(target, handler)
for (let key in proxy) {
  console.log(key);
  // "prop"
}
```

不过以后应该要避免定义这项拦截器，毕竟根据mozilla文档，这个特性在ES7中会被废弃。[目前mozilla浏览器似乎已经停止使用](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy/handler/enumerate)。不过在firefox浏览器中测试上面这段代码还是可以用的。

### getOwnPropertyDescriptor()

拦截`Object.getOwnPropertyDescriptor`，返回一个属性描述对象或者`undefined`。

```javascript
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return
    }
    return Object.getOwnPropertyDescriptor(target, key)
  }
}
var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'wat')
// undefined
Object.getOwnPropertyDescriptor(proxy, '_foo')
// undefined
Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

经测试，返回值不能是一个普通的对象，必须包含属性描述内容，`{ value: 'tar', writable: true, enumerable: true, configurable: true }`，缺一项或者完全不符合都会抛出错误。

    Uncaught TypeError: 'getOwnPropertyDescriptor' on proxy: trap reported non-configurability for property 'wat' which is either non-existant or configurable in the proxy target

```javascript
var handler = {
  getOwnPropertyDescriptor (target, key) {
    if (key[0] === '_') {
      return
    }
    return { value: 'tar', writable: true, enumerable: true, configurable: true }
  }
}
var target = { _foo: 'bar', baz: 'tar' };
var proxy = new Proxy(target, handler);
Object.getOwnPropertyDescriptor(proxy, 'baz')
// { value: 'tar', writable: true, enumerable: true, configurable: true }
```

### getPrototypeOf()

用来拦截`Object.getPrototypeOf`运算符以及下列操作。

    Object.prototype.__proto__
    Object.prototype.isPrototypeOf()
    Object.getPrototypeOf()
    Reflect.getPrototypeOf()
    instanceof

必须返回一个对象或者null，不会对对象进行检查。

```javascript
var proto = {};
var p = new Proxy({}, {
  getPrototypeOf(target) {
    return proto;
  }
});
Object.getPrototypeOf(p) === proto // true
```

### isExtensible()

拦截`Object.isExtensible`操作。这里有一个强制要求：

    Object.isExtensible(proxy) === Object.isExtensible(target)

```javascript
var p = new Proxy({}, {
  isExtensible: function(target) {
    console.log("called");
    return true;
  }
});

Object.isExtensible(p)
// "called"
// true

var p = new Proxy({}, {
  isExtensible: function(target) {
    return false;
  }
});

Object.isExtensible(p); // 报错
```

### ownKeys()

拦截`Object.keys()`操作。必须返回一个可枚举的对象。

```javascript
var target = {};

var handler = {
  ownKeys(target) {
    return "david";
  }
};

var proxy = new Proxy(target, handler);

Object.keys(proxy)
// Uncaught TypeError: CreateListFromArrayLike called on non-object
```

这里因为对对象不会做细致检查，因此返回普通对象时会解析成空数组，即使是一个类数组对象。

```javascript
var target = {};

var handler = {
  ownKeys(target) {
    return {length: 2, 0: "david", 1: "ren"}; // or {0: "david", 1: "ren"}
  }
};

var proxy = new Proxy(target, handler);

Object.keys(proxy)
// []
```

### setPrototypeOf()

拦截`Object.setPrototypeOf`，或者`obj.__proto__`操作。

```javascript
var handler = {
  setPrototypeOf (target, proto) {
    throw new Error('Changing the prototype is forbidden');
  }
}
var proto = {};
var target = function () {};
var proxy = new Proxy(target, handler);
proxy.setPrototypeOf(proxy, proto);
// Error: Changing the prototype is forbidden
proxy.__proto__ = {};
// Error: Changing the prototype is forbidden
```

## Proxy.revocable()

返回一个可取消的Proxy实例。方法返回值是一个对象，包括`{proxy: proxy, revoke: revoke}`。

    proxy: 取消函数相关的Proxy实例
    revoke: 取消函数

一旦revoke被调用，proxy对象即被取消，所有作用在proxy上的拦截器均被取消，若再调用直接报错。

```javascript
let target = {};
let handler = {};

let {proxy, revoke} = Proxy.revocable(target, handler);

proxy.foo = 123;
proxy.foo // 123

revoke();
proxy.foo // TypeError: Revoked
```

## Reflect

`Reflect`对象是一个内置对象，不可构建（使用`new`操作符），所有属性和方法都是静态的。

至于`Reflect`对象的功能是什么，ES6官方文档上并没有说明，不过我在[stackoverflow](http://stackoverflow.com/questions/25421903/what-does-the-reflect-object-do-in-javascript)上找到了一个答案。

总结下来三点：

    目前基本方法都绑在`Object`对象上，为了做向下兼容，目前不会删除这些方法，但基本上将来都会移到`Reflect`对象下。
    使用在Proxy中，防止原生方法被Proxy拦截污染，并方便快捷链接到目标对象的对应方法上。
    防止全局Object对象被设置拦截。

不过还有一点需要注意到，同样的方法，比如`Object.defineProperty`和`Reflect.defineProperty`，两者的返回值是有区别的。

    Object.defineProperty会返回目标对象或者抛出异常。
    Reflect.defineProperty会返回`true`或`false`表示是否成功。

相信对于js开发者来说，第二种返回值更加人性，毕竟我们不想各个地方都要提防着是否需要`try...catch`。而且使用上更加便捷，可以作为if的条件来使用。

另外，`Reflect`可以代替一些基本操作。

    Reflect.deleteProperty(obj, prop) <=> delete obj[prop]
    Reflect.has(obj, prop) <=> (prop in obj)

注意下段代码就能看出区别：

```javascript
var david = {name: "david"}
var handler = {has: function(target) {return false;}}
var proxy = new Proxy(david, handler)
name in david; // false
name in proxy; // false
Reflect.has(david, "name"); // true
```

因此可以看出，调用`Reflect[method]`是最安全的，不会担心会不会有拦截器作用。








