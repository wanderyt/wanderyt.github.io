title: ES6 Learning - 对象扩展
date: 2016-03-30 15:32:31
categories:
- UI Development
tags:
- Javascript
---

## 属性的简洁表示法

ES6允许直接写入变量和函数。这时属性值等于属性名代表的变量。

```javascript
var birth = '2000/01/01';

var Person = {
  name: '张三',

  //等同于birth: birth
  birth,

  // 等同于hello: function ()...
  hello() { console.log('我的名字是', this.name); }
};
```

## 属性名表达式

ES6支持表达式来定义属性名，使用中括号标识。__注意只在字面量定义对象时才可用。__

```javascript
let obj = {
  [propKey]: true,
  ['a' + 'bc']: 123
};
```

注意，属性名表达式和简洁表示法不能同时使用。

## Object.is()

`==`判断会自动转换数据类型，`===`比较时`NaN`不等于自身，而且`+0`和`-0`相等。

而`Object.is()`就是为了弥补`===`的不足补充进来的方法。

```javascript
+0 === -0 //true
NaN === NaN // false

Object.is(+0, -0) // false
Object.is(NaN, NaN) // true
```

## Object.assign()

将源对象（source）的所有可枚举属性，复制到目标对象（target）。

    Object.assign(targetObject, sourceObject1, sourceObject2, ...)

第一个参数即目标对象，后面可以添加一到多个源对象。属性的覆盖只进行替换，不进行添加。

```javascript
Object.assign({b: 'c'},
  Object.defineProperty({}, 'invisible', {
    enumerable: false,
    value: 'hello'
  })
)
// { b: 'c' }
```

这种复制也只是浅复制。

```javascript
var obj1 = {a: {b: 1}};
var obj2 = Object.assign({}, obj1);

obj1.a.b = 2;
obj2.a.b // 2
```

注意，数组因为可以由对象转化而来，所以这里也可以将数组理解为对象，因此：

    Object.assign([1, 2, 3], [4, 5])； // [4, 5, 3]


## 属性的可枚举性

`Object.getOwnPropertyDescriptor`来获得属性的行为。

```javascript
let obj = { foo: 123 };
Object.getOwnPropertyDescriptor(obj, 'foo')
//   { value: 123,
//     writable: true,
//     enumerable: true,
//     configurable: true }
```

`enumerable`为`false`时，表示某些操作会忽略。

> ES5：

>     for...in 循环：只遍历对象自身的和继承的可枚举的属性
>     Object.keys()：返回对象自身的所有可枚举的属性的键名
>     JSON.stringify()：只串行化对象自身的可枚举的属性

> ES6：

>     Object.assign()：只拷贝对象自身的可枚举的属性
>     Reflect.enumerate()：返回所有for...in循环会遍历的属性

引入`enumerable`的最初目的，就是让某些属性可以规避掉`for...in`操作。

__操作中引入继承的属性会让问题复杂化，大多数时候，我们只关心对象自身的属性。所以，尽量不要用`for...in`循环，而用`Object.keys()`代替。__

## 遍历方法

### for...in

遍历对象自身和继承的可枚举属性（不含`Symbol`属性）。

### Object.keys()

返回不含继承的所有可枚举属性（不含`Symbol`属性）。

### Object.getOwnPropertyNames()

返回数组，包含自身所有属性（不含`Symbol`属性，包含不可枚举属性）。

### Object.getOwnPropertySymbols()

返回数组，包含所有`Symbol`属性。

### Reflect.ownKeys()

返回数组，包含所有属性，不管属性名是`Symbol`或者字符串，也不管是否可枚举。

### Reflect.enumerate()

返回一个`Iterator`对象，遍历对象自身的和继承的所有可枚举属性（不含`Symbol`属性），与`for...in`循环相同。

```javascript
var David = function() {
    this.name = "David";
    this["a" + "ge"] = 26;
};

var Programmer = function() {
    this.type = "Programmer";
};

David.prototype = new Programmer();

var david = new David();

Object.defineProperty(david, "sex", {
    enumerable: false,
    value: "male"
});

Object.defineProperty(david, "company", {
    enumerable: true,
    value: "SAP"
});

// for...in
for(var i in david) {
    console.log(i);
}

/*
name
age
company
type
*/

// Object.keys
Object.keys(david)
// ["name", "age", "company"]

// Object.getOwnPropertyNames
Object.getOwnPropertyNames(david)
// ["name", "age", "sex", "company"]

// Object.getOwnPropertySymbols
Object.getOwnPropertySymbols(david)
// []

// Reflect.ownKeys
Reflect.ownKeys(david)
// ["name", "age", "sex", "company"]

// Reflect.enumerate
Reflect.enumerate(david);
var [...arr] = Reflect.enumerate(david);
arr;
// ["name", "age", "company", "type"]
```

属性遍历的次序规则是：

    首先遍历所有属性名为数值的属性，按照数字排序。
    其次遍历所有属性名为字符串的属性，按照生成时间排序。
    最后遍历所有属性名为`Symbol`值的属性，按照生成时间排序。

## __proto__

`__proto__`属性（前后各两个下划线），用来读取或设置当前对象的`prototype`对象。


```javascript
// es6的写法
var obj = {
  method: function() { ... }
}
obj.__proto__ = someOtherObj;

// es5的写法
var obj = Object.create(someOtherObj);
obj.method = function() { ... }
```

其实`__proto__`这种命名方式就体现出这个属性是不想被直接拿来用的，只不过各个浏览器都提供了这样的操作接口，导致这个属性可以直接读写。

ES6规范中则提供了读写方法：`Object.getPrototypeOf(obj)`和`Object.setPrototypeOf(obj)`。

```javascript
Object.getPrototypeOf({})
// Object {}
Object.getPrototypeOf({__proto__: null})
// null
Object.getPrototypeOf({__proto__: {a: "name"}})
// Object {a: "name"}
```

```javascript
function Rectangle() {
}

var rec = new Rectangle();

Object.getPrototypeOf(rec) === Rectangle.prototype
// true
```





















