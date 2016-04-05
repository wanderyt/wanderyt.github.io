title: ES6 Learning - Set & Map
date: 2016-04-05 10:38:53
categories:
- UI Development
tags:
- Javascript
---

## Set

### 基本语法

类似于数组，有两种构造方式。

```javascript
var s = new Set();
[1,2,3,4,5,5].map(x => s.add(x));
for (let i of s) {
    console.log(i);
}

var s = new Set([1,2,3,3,4]);
s.size; // 4
[...s]; // [1,2,3,4]
[1,2,3,4,3].foreach(n => s.add(n));
s.size; // 4
```

<!-- more -->

__加入5和'5'是不同的值，set会返回两个元素。同样，数组和对象也会被认为不一样。__

__但是另一方面，加入两次`NaN`或者`Infinity`只会返回一个。__

```javascript
let set = new Set();
let a = NaN;
let b = NaN;
set.add(a);
set.add(b);
set.add(Infinity);
set.add(Infinity);

// Set {NaN, Infinity}
```

### 主要属性方法

#### 操作方法

    add(value)
    has(value)
    delete(value)
    clear(): 清除所有成员，没有返回值

```javascript
set; // Set {NaN, Infinity, [1, 2, 3], [1, 2, 3], Object {}, Object {}}
set.has([1,2,3]);
// false
set.has({});
// false
set.has(NaN);
// true
set.delete([1,2,3]);
// false
set.delete({});
// false
```

#### 遍历方法

    keys()：返回一个键名的遍历器
    values()：返回一个键值的遍历器
    entries()：返回一个键值对的遍历器
    forEach()：使用回调函数遍历每个成员

Set数据结构没有键名和键值的区别，所以`keys`和`values`的行为完全一致。

    Set.prototype[Symbol.iterator] === Set.prototype.values // true

所以遍历Set的方法可以直接使用`for...of`，也可以在set对象上使用扩展运算符（`...`）。

```javascript
let arr = [3, 5, 2, 2, 5, 5];
let unique = [...new Set(arr)];
// [3, 5, 2]
```

使用set做并集、交集和差集。

```javascript
var a = new Set([1,2,3]);
var b = new Set([4,2,3]);

// 并集
var union = new Set([...a, ...b]);

// 交集
var intersect = new Set([...a].filter(x => b.has(x)));

// 差集
var difference = new Set([...a].filter(x => !b.has(x)));
```

遍历操作中同步改变原来Set结构，可以有两种方法。

```javascript
// 方法一
let set = new Set([1, 2, 3]);
set = new Set([...set].map(val => val * 2));
// set的值是2, 4, 6

// 方法二
let set = new Set([1, 2, 3]);
set = new Set(Array.from(set, val => val * 2));
// set的值是2, 4, 6
```

## WeakSet

于Set类似，但是有两个区别。

    成员只能是对象
    对象都是弱引用，即垃圾回收机制不考虑WeakSet对该对象的引用。如果其他对象不在引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存。因此，WeakSet不可遍历

构造函数接收一个数组或者类似数组的对象作为参数。

```javascript
var a = [[1,2], [3,4]];
var ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

var b = [3, 4];
var ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```

基本方法还是有三个。

    WeakSet.prototype.add(value)
    WeakSet.prototype.delete(value)
    WeakSet.prototype.has(value)

__WeakSet的一个用处，是储存DOM节点，而不用担心这些节点从文档移除时，会引发内存泄漏。__

## Map

### 基本用法

JavaScript的对象（Object），本质上是键值对的集合（Hash结构），但是只能用字符串当作键。

```javascript
var data = {};
var element = document.getElementById("myDiv");

data[element] = metadata;
data["[Object HTMLDivElement]"] // metadata

var a = null;
var data = {};
data[a] = "David";
data; // Object {null: "David"}

var aa = null;
data[aa] = "Wanderyt";
data[a]; // Wanderyt
data; // Object {null: "Wanderyt"}
```

构造Map对象时可以传入一个数组参数，表示键值对。

```javascript
var map = new Map([["name", "张三"], ["title", "Author"]]);
// 相当于
var items = [
  ["name", "张三"],
  ["title", "Author"]
];
var map = new Map();
items.forEach(([key, value]) => map.set(key, value));
```

讨论到键的类型，如果是简单类型则比较严格相等（`===`），但对于`NaN`和`Infinity`则视为同一个

```javascript
let map = new Map();
map.set(NaN, 123);
map.get(NaN) // 123
```

### 属性方法

#### size / set(key, value) / get(key)

#### has(key) / delete(key) / clear()

### 遍历方法

三个函数一个方法。

    keys()
    values()
    entries()
    forEach()

```javascript
for (let item of map.entries()) {
  console.log(item[0], item[1]);
}
// "F" "no"
// "T" "yes"

// 或者
for (let [key, value] of map.entries()) {
  console.log(key, value);
}

// 等同于使用map.entries()
for (let [key, value] of map) {
  console.log(key, value);
}
```

map对象也可以使用扩展运算符。

```javascript
let map = new Map([
  [1, 'one'],
  [2, 'two'],
  [3, 'three'],
]);

[...map.keys()]
// [1, 2, 3]

[...map.values()]
// ['one', 'two', 'three']

[...map.entries()]
// [[1,'one'], [2, 'two'], [3, 'three']]

[...map]
// [[1,'one'], [2, 'two'], [3, 'three']]

var reporter = {
  report: function(key, value) {
    console.log("Key: %s, Value: %s", key, value);
  }
};

map.forEach(function(value, key, map) {
  this.report(key, value);
}, reporter);
```

## WeakMap

只接受对象作为键名（null除外），而且键名所指向的对象，不计入垃圾回收机制。

`WeakMap`的设计目的在于，键名是对象的弱引用（垃圾回收机制不将该引用考虑在内），所以其所对应的对象可能会被自动回收。当对象被回收后，`WeakMap`自动移除对应的键值对。典型应用是，一个对应DOM元素的`WeakMap`结构，当某个DOM元素被清除，其所对应的`WeakMap`记录就会自动被移除。基本上，`WeakMap`的专用场合就是，它的键所对应的对象，可能会在将来消失。`WeakMap`结构有助于防止内存泄漏。



























