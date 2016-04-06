title: 'ES6 Learning - Iterator and for...of'
date: 2016-04-05 15:44:56
categories:
- UI Development
tags:
- Javascript
---

## Iterator

`Iterator`的作用有三个：一是为各种数据结构，提供一个统一的、简便的访问接口；二是使得数据结构的成员能够按某种次序排列；三是`ES6`创造了一种新的遍历命令`for...of`循环，`Iterator`接口主要供`for...of`消费。

每一次调用`next`方法，都会返回数据结构的当前成员的信息。具体来说，就是返回一个包含`value`和`done`两个属性的对象。其中，`value`属性是当前成员的值，`done`属性是一个布尔值，表示遍历是否结束。

```javascript
var map = new Map([["name", "张三"], ["title", "Author"]]);
it.next()
// Object {value: "name", done: false}
it.next()
// Object {value: "title", done: false}
it.next()
// Object {value: undefined, done: true}
```

<!-- more -->

## Iterator接口

在`ES6`中，有三类数据结构原生具备`Iterator`接口：数组、某些类似数组的对象、`Set`和`Map`结构。

```javascript
let arr = ['a', 'b', 'c'];
for(let i of arr) {console.log(i);}
// a
// b
// c

let arr = ['a', 'b', 'c'];
let iter = arr[Symbol.iterator]();

iter.next() // { value: 'a', done: false }
iter.next() // { value: 'b', done: false }
iter.next() // { value: 'c', done: false }
iter.next() // { value: undefined, done: true }
```

构造具有`Iterator`接口的对象。

```javascript
class RangeIterator {
  constructor(start, stop) {
    this.value = start;
    this.stop = stop;
  }

  [Symbol.iterator]() { return this; }

  next() {
    var value = this.value;
    if (value < this.stop) {
      this.value++;
      return {done: false, value: value};
    } else {
      return {done: true, value: undefined};
    }
  }
}

function range(start, stop) {
  return new RangeIterator(start, stop);
}

for (var value of range(0, 3)) {
  console.log(value);
}
```

上面的例子是指定对象本身就含有`next`函数，所以迭代器函数返回对象本身是可行的。如果要对一个`Object`实现迭代功能，则需要对`Symbol.Iterator`进行定义。

```javascript
function Obj(value){
  this.value = value;
  this.next = null;
}

Obj.prototype[Symbol.iterator] = function(){

  var iterator = {
    next: next
  };

  var current = this;

  function next(){
    if (current){
      var value = current.value;
      var done = current == null;
      current = current.next;
      return {
        done: done,
        value: value
      }
    } else {
      return {
        done: true
      }
    }
  }
  return iterator;
}

var one = new Obj(1);
var two = new Obj(2);
var three = new Obj(3);

one.next = two;
two.next = three;

for (var i of one){
  console.log(i)
}
// 1
// 2
// 3
```

上面代码首先在构造函数的原型链上部署`Symbol.iterator`方法，调用该方法会返回遍历器对象`iterator`，调用该对象的`next`方法，在返回一个值的同时，自动将内部指针移到下一个实例。

对于类似数组对象（存在数值键名和`length`属性），部署`Iterator`接口才会使用扩展运算符和`for...of`循环。

```javascript
var arrayLike = {
    0: "david",
    1: "wanderyt",
    2: "yutao",
    length: 3
};

for(let i of arrayLike) {
    console.log(i);
}
// Uncaught TypeError: arrayLike[Symbol.iterator] is not a function
[...arrayLike]
// Uncaught TypeError: (var)[Symbol.iterator] is not a function

arrayLike[Symbol.iterator] = Array.prototype[Symbol.iterator];
for(let i of arrayLike) {
    console.log(i);
}
// david
// wanderyt
// yutao
[...arrayLike]
// ["david", "wanderyt", "yutao"]
```

## 调用Iterator场合

### 解构赋值

```javascript
let set = new Set().add('a').add('b').add('c');

let [x,y] = set;
// x='a'; y='b'

let [first, ...rest] = set;
// first='a'; rest=['b','c'];
```

### 扩展运算符

```javascript
// 例一
var str = 'hello';
[...str] //  ['h','e','l','l','o']

// 例二
let arr = ['b', 'c'];
['a', ...arr, 'd']
// ['a', 'b', 'c', 'd']
```

### yield*

跟着一个可遍历的结构，会调用该结构的遍历器接口。与function*一起用。

```javascript
let generator = function* () {
  yield 1;
  yield* [2,3,4];
  yield 5;
};

var iterator = generator();

iterator.next() // { value: 1, done: false }
iterator.next() // { value: 2, done: false }
iterator.next() // { value: 3, done: false }
iterator.next() // { value: 4, done: false }
iterator.next() // { value: 5, done: false }
iterator.next() // { value: undefined, done: true }
```

## 字符串的Iterator接口

```javascript
var someString = "hi";
typeof someString[Symbol.iterator]
// "function"

var iterator = someString[Symbol.iterator]();

iterator.next()  // { value: "h", done: false }
iterator.next()  // { value: "i", done: false }
iterator.next()  // { value: undefined, done: true }
```

## Iterator与Generator函数

主要介绍放到下一章节。

```javascript
var myIterable = {};

myIterable[Symbol.iterator] = function* () {
  yield 1;
  yield 2;
  yield 3;
};
[...myIterable] // [1, 2, 3]

// 或者采用下面的简洁写法

let obj = {
  * [Symbol.iterator]() {
    yield 'hello';
    yield 'world';
  }
};

for (let x of obj) {
  console.log(x);
}
// hello
// world
```

## 遍历器对象的return()，throw()

`return`方法的使用场合是，如果`for...of`循环提前退出（通常是因为出错，或者有`break`语句或`continue`语句），就会调用`return`方法。如果一个对象在完成遍历前，需要清理或释放资源，就可以部署`return`方法。

```javascript
var str = new String("hello world");

[...str] // ["h", "e", "l", "l", "o", " ", "w", "o", "r", "l", "d"]

var index = -1;
str[Symbol.iterator] = function() {
  return {
    next: function() {
      if (index < str.length) {
        index++;
        return { value: str[index], done: false };
      } else {
        return { done: true };
      }
    },
    return: function() {
        console.log("returned....")
    }
  };
};

for(let i of str) {
  if(i === "w") {
    console.log("new word!!!");
    break;
  } else {
    console.log(i);
  }
}
```

## for...of

一个数据结构只要部署了`Symbol.iterator`属性，就被视为具有`iterator`接口，就可以用`for...of`循环遍历它的成员。也就是说，`for...of`循环内部调用的是数据结构的`Symbol.iterator`方法。

### 数组

注意区分的是，`for...of`返回的是数组元素，`for...in`返回的是数组的键名。

```javascript
var arr = ['a', 'b', 'c', 'd'];

for (let a in arr) {
  console.log(a); // 0 1 2 3
}

for (let a of arr) {
  console.log(a); // a b c d
}
```

另外，`for...of`循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。

```javascript
var arr = [3, 5, 7];
arr.foo = 'hello';
arr[7] = "david";

for (let i in arr) {
  console.log(i); // 0, 1, 2, 7, "foo"
}

for (let i of arr) {
  console.log(i); // 3, 5, 7, undefined x 4, "david"
}
```

### Set & Map

```javascript
var engines = new Set(["Gecko", "Trident", "Webkit", "Webkit"]);
for (var e of engines) {
  console.log(e);
}
// Gecko
// Trident
// Webkit

var es6 = new Map();
es6.set("edition", 6);
es6.set("committee", "TC39");
es6.set("standard", "ECMA-262");
for (var [name, value] of es6) {
  console.log(name + ": " + value);
}
// edition: 6
// committee: TC39
// standard: ECMA-262
```

### 类似数组的对象

比如字符串，arguments都可以直接使用`for...of`进行遍历。而对于类似数组对象就要使用`Array.from`转为数组。

```javascript
let arrayLike = { length: 2, 0: 'a', 1: 'b' };

// 报错
for (let x of arrayLike) {
  console.log(x);
}

// 正确
for (let x of Array.from(arrayLike)) {
  console.log(x);
}
```

其他普通对象想要用`for...of`遍历，需要使用`Object.keys()`。__否则只是赋值给iterator接口函数也无法输出。因为它不是一个类数组对象__。

另一种方法是使用Generator函数将对象重新包装一下。

```javascript
var es6 = {
  edition: 6,
  committee: "TC39",
  standard: "ECMA-262"
};

for (e in es6) {
  console.log(e);
}
// edition
// committee
// standard

for (var key of Object.keys(someObject)) {
  console.log(key + ": " + someObject[key]);
}

es6[Symbol.iterator] = Array.prototype[Symbol.iterator];
for(let [name, value] of es6) {
    console.log(name + value);
}
// undefined

function* entries(obj) {
  for (let key of Object.keys(obj)) {
    yield [key, obj[key]];
  }
}

for (let [key, value] of entries(obj)) {
  console.log(key, "->", value);
}
// edition -> 6,
// committee -> TC39,
// standard -> ECMA-262
```

## 遍历方法比较

### Array.forEach

`Array`对象内置有`forEach`方法，但是不能中途跳出，`break`和`return`语句都无法工作。

### for...in

循环遍历数组。

    数组键名是数组，但是返回会是字符串"0"等等。
    不止返回数字键名，还会返回原型链上的键。
    循环顺序不稳定。

```javascript
var arrayLike = {
    0: "david",
    1: "wanderyt",
    2: "yutao",
    name: "Ren",
    age: 26,
    length: 5
};

for(let i in arrayLike) {
    console.log(i);
}
// 0,1,2,name,age,length
```

总之，`for...in`是为遍历对象而设计的，不适合遍历数组。

### for...of

```javascript
for (let value of myArray) {
  console.log(value);
}
```

    有着同for...in一样的简洁语法，但是没有for...in那些缺点。
    不同用于forEach方法，它可以与break、continue和return配合使用。
    提供了遍历所有数据结构的统一操作接口。