title: ES6 Learning - Symbol
date: 2016-03-31 10:34:27
categories:
- UI Development
tags:
- Javascript
---

## 基本语法

ES6新增一种数据类型：

    Undefined
    Null
    Boolean
    String
    Number
    Object
    __Symbol__

`Symbol`主要负责解决同名属性的区分。比如一个对象使用了另一个对象，而两个对象都有一个相同名称的属性，这时就引入`Symbol`加以区分。

```javascript
let s = Symbol();

typeof s
// "symbol"
```

__生成的Symbol是一个原始类型的值__。可以把它当做是一个类似字符串的数据类型。

`Symbol`接收一个参数，负责对Symbol实例的描述。而且，相同描述的Symbol实例实质是不相等的。

```javascript
var s1 = Symbol();
var s2 = Symbol();

s1 === s2 // false

// 有参数的情况
var s1 = Symbol("foo");
var s2 = Symbol("foo");

s1 === s2 // false
```

Symbol值可以显式转化为字符串或者布尔值。

## 作为属性名的Symbol

```javascript
var mySymbol = Symbol();

// 第一种写法
var a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
var a = {
  [mySymbol]: 'Hello!'
};

// 第三种写法
var a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"

var davidSymbol = new Symbol();
a[davidSymbol] // undefined
```

## 应用场景

`Symbol`用于构造对象内部的私有属性比较合适，并且这种属性不会被`for...in`或者`Object.keys()`所选出。

```javascript
var size = Symbol('size');

class Collection {
  constructor() {
    this[size] = 0;
  }

  add(item) {
    this[this[size]] = item;
    this[size]++;
  }

  static sizeOf(instance) {
    return instance[size];
  }
}

var x = new Collection();
Collection.sizeOf(x); // 0
x.add("foo");
Collection.sizeOf(x); // 1

var y = new Collection();
Collection.sizeOf(y); // 0
```

## Symbol.for()

接收一个字符串作为参数，返回以此字符串定义的Symbol对象。如果没有就新建一个对象并返回。

```javascript
var s1 = Symbol.for("foo"); // 新建Symbol("foo")对象
var s2 = Symbol.for("foo");

s1 === s2 // true
```

因此，调用两次`Symbol("foo")`返回的对象不会相等，而调用两次`Symbol.for("foo")`返回的对象一定相等。

__对于参数的解析，ES6内部是通过调用`toString`来进行，因此会有以下的解析结果。__

```javascript
var a = Symbol.for(1);
var b = Symbol.for("1");

a === b; // true
```

## 内置的Symbol值

### Symbol.hasInstance

这是一个类的属性，`foo instanceof Foo`实际调用`Foo[Symbol.hasInstance](foo)`。

### Symbol.isConcatSpreadable

对象的一个属性，为布尔值类型，表示该对象使用`Array.prototype.concat()`时是否可以展开。

```javascript
let obj = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']
```

还记得数组那章节里说有类似数组的对象，所以这里也可以将类数组对象的可展开属性设置为`true`。

```javascript
let obj = {length: 2, 0: 'c', 1: 'd'};
['a', 'b'].concat(obj, 'e') // ['a', 'b', obj, 'e']

obj[Symbol.isConcatSpreadable] = true;
['a', 'b'].concat(obj, 'e') // ['a', 'b', 'c', 'd', 'e']
```

但是经过测试，对于那些无法转成数组的对象，强行设置属性成为`true`的时候往往不起作用。

```javascript
var obj = {name: "david", age: 16};
obj[Symbol.isConcatSpreadable] = true;

["a", "b"].concat(obj, "e");
// ["a", "b", "e"]
```

对于一个类来说，`Symbol.isConcatSpreadable`属性必须写成一个返回布尔值的方法。

```javascript
class A1 extends Array {
  [Symbol.isConcatSpreadable]() {
    return true;
  }
}
class A2 extends Array {
  [Symbol.isConcatSpreadable]() {
    return false;
  }
}
let a1 = new A1();
a1[0] = 3;
a1[1] = 4;
let a2 = new A2();
a2[0] = 5;
a2[1] = 6;
[1, 2].concat(a1).concat(a2)
// [1, 2, 3, 4, [5, 6]]
```

### Symbol.iterator

对象的`Symbol.iterator`属性，指向该对象的默认遍历器方法，即该对象进行`for...of`循环时，会调用这个方法，返回该对象的默认遍历器。

```javascript
class Collection {
  *[Symbol.iterator]() {
    let i = 0;
    while(this[i] !== undefined) {
      yield this[i];
      ++i;
    }
  }
}

let myCollection = new Collection();
myCollection[0] = 1;
myCollection[1] = 2;

for(let value of myCollection) {
  console.log(value);
}
// 1
// 2
```

### Symbol.toPrimitive

在对象被转为原始类型的值时，会调用这个方法。

```javascript
var obj = {
  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case 'number':
        return 123;
      case 'string':
        return 'str';
      case 'default':
        return 'default';
      default:
        throw new Error();
     }
   }
};

2 * obj // 246
3 + obj // "3default"
String(obj) // "str"
obj === "default" // false
"" + obj === "default" // true

// Symbol.toPrimitive不是一个function，直接调用会报错
Symbol.toPrimitive(obj, "default"); // Error
// 如果想直接调用
obj[Symbol.toPrimitive]("default"); // "default"
obj[Symbol.toPrimitive]("string");  // "str"
obj[Symbol.toPrimitive]("defaul");  // Uncaught Error...
```

上面`case when`中定义了一个default判断，如果没有这个判断，则会返回`undefined`。

### Symbol.toStringTag

这个属性可以用来定制调用`Object.prototype.toString`方法时，`[object Object]`或`[object Array]`中`object`后面的那个字符串。

```javascript
({[Symbol.toStringTag]: 'Foo'}.toString())
// "[object Foo]"

class Collection {
  get [Symbol.toStringTag]() {
    return 'xxx';
  }
}
var x = new Collection();
Object.prototype.toString.call(x) // "[object xxx]"
```

### Symbol.unscopables

对象的`Symbol.unscopables`属性，指向一个对象。该对象指定了使用`with`关键字时，哪些属性会被`with`环境排除。

```javascript
Array.prototype[Symbol.unscopables]
// {
//   copyWithin: true,
//   entries: true,
//   fill: true,
//   find: true,
//   findIndex: true,
//   keys: true
// }

Object.keys(Array.prototype[Symbol.unscopables])
// ['copyWithin', 'entries', 'fill', 'find', 'findIndex', 'keys']

// 没有unscopables时
class MyClass {
  foo() { return 1; }
}

var foo = function () { return 2; };

with (MyClass.prototype) {
  foo(); // 1
}

// 有unscopables时
class MyClass {
  foo() { return 1; }
  get [Symbol.unscopables]() {
    return { foo: true };
  }
}

var foo = function () { return 2; };

with (MyClass.prototype) {
  foo(); // 2
}
```















