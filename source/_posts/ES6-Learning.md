title: ES6 Learning - 变量声明与解构赋值
date: 2016-03-23 15:01:33
categories:
- UI Development
tags:
- Javascript
---

最近开始学习ES6，话说ES6出来快一年了，中间其实已经间断学习了一些，今天开始总结一下吧。

这次学习还是基于[ruanyf的ES6教程](http://es6.ruanyifeng.com/#README)。想要学习比较深入还是看看这个教程或者[ES6官方文档](http://www.ecma-international.org/ecma-262/6.0/)吧。

首先，还是先附加一个网站，自动检测当前浏览器以及主流浏览器支持ES6的程度。感觉还是很有用的。

[测试链接](http://kangax.github.io/compat-table/es6/)

<!-- more -->

## let

let只在命令所在的代码块内有效，并且不存在变量提升，同时不能重复声明。说明ES6支持代码块，这时候ES5中不写`{}`的习惯终于可以修正了。

```javascript
var a = 1;
var a = 2; // 不报错

let b = 1;
let b = 2; // 报错

console.log(aa); // undefined
var aa = 1;
console.log(bb); // 报错
let bb = 2;

// 比较隐蔽的一个错误
function bar(x = y, y = 2) {
  return [x, y];
}
bar(); // 报错
```

我觉得有用的一点是，__立即执行匿名函数（IIFE）__可以换一种写法了。

比如之前比较常见的一个代码片段：

```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  }
}
a[6](); // 输出10
```

这时候通常做法是使用IIFE。

```javascript
var a = [];
for(var i = 0; i < 10; i++) {
  a[i] = (function(i) {
    return function() {
      console.log(i);
    }
  })(i);
}
a[6](); // 输出6
```

在ES6情况下，我们可以用：

```javascript
var a = [];
for(let i = 0; i < 10; i++) {
  a[i] = function() {
    console.log(i);
  }
}
a[6](); // 输出6
```

另外，ES5中函数声明会直接提升到作用域顶部，而在ES6中则不会。

## const

特性基本与let一致，只是一旦声明不能被赋值号修改。

```javascript
const foo; // Uncaught SyntaxError: Missing initializer in const declaration
```

之所以说赋值号，是因为对于数组、对象之类的数据，const只是保证变量名指向的地址不变，并不保证该地址的数据不变。

```javascript
const foo = {};
foo.prop = 123;
foo.prop; // 123
foo = {}; // Uncaught TypeError: Assignment to constant variable.

const a = [];
a.push("Hello");
a.length = 0;
a = []; // Uncaught TypeError: Assignment to constant variable.
```

想要冻结对象，使用`Object.freeze`方法。

```javascript
var constantize = (obj) => {
  Object.freeze(obj);
  Object.keys(obj).forEach( (key, value) => {
    if ( typeof obj[key] === 'object' ) {
      constantize( obj[key] );
    }
  });
};
```

## 全局对象属性

在ES5中，使用var声明的变量会自动挂到作用域对象中。

```javascript
var a = 1;
this.a; // 1
```

而在ES6中，由于多了let / const / class等声明方式，使用这些声明的全局变量不会挂到全局对象的属性中。

```javascript
let b = 1;
const C = 2;
this.b; // undefined
this.C; // undefined
```

## 数组解构赋值

注意，这种特性只适用于等号右边的数值具有可遍历特性的结构。

```javascript
var [a, [b], ...c] = [1, [3], 2, 3];
a; // 1
b; // 3
c; // [2, 3]

let [foo] = 1; // 报错
```

不完全解构允许存在，左边部分匹配或者右边部分匹配均可，但对于左边解构格式一定要完全配合右边的结构。

```javascript
var [a, [b], ...c] = [1, [3, 4], 2, 3]; // 左边部分匹配
a; // 1
b; // 3
c; // [2, 3]

var [a, [b, d], ...c] = [1, [3], 2, 3]; // 右边部分匹配
a; // 1
b; // 3
c; // [2, 3]
d; // undefined

// 结构不匹配
var [a, [b], ...c] = [1, 3, 2, 3]; // Uncaught TypeError: undefined is not a function
```

这里涉及到一个`function*`和`yield`的使用方法。两者配合会生成一个类似java中使用的迭代器对象，并调用对象的next方法获取下一个返回值。

```javascript
function* gen() {
  for(let i = 0; i < 10; i++) {
    yield i;
  }
}

var g = gen();
console.log(g.next()); // Object {value: 0, done: false}
console.log(g.next().value); // 1
```

## 对象结构赋值

这个跟数组解构赋值最重要的区别是区分了模式和变量。

```javascript
var { foo: baz } = { foo: "aaa", bar: "bbb" };
baz // "aaa"  -- 变量
foo // error: foo is not defined  -- 模式
```

来个晕菜的：

```javascript
var node = {
  loc: {
    start: {
      line: 1,
      column: 5
    }
  }
};

var { loc: { start: { line }} } = node;
line // 1
loc  // error: loc is undefined
start // error: start is undefined
```

此处注意，因为代码块的存在，所以对于将一个已声明的变量用于解构赋值必须非常小心。

```javascript
var x;
{x} = {x: 1};
// SyntaxError: syntax error

// 正确的写法
({x} = {x: 1});
```

因为javascript将{x}解释为一个代码块，因此发生语法错误。所以要__避免{}写在行首__。

## 默认值

这里没什么可说的，要注意的就是ES6里内部执行都是严格的三等号，所以所有不是undefined的值都不会按照默认值来赋值。

```javascript
var { foo: baz = 3, bar = 4 } = { foo: null, bar: undefined };
baz // null
bar // 4
```

## 解构赋值的用途

### 交换变量值

```javascript
[x, y] = [y, x];
```

### 提取数据

这里说的提取数据的来源包括：函数返回值，Json，以及函数形参。

```javascript
function example() {
  return {
    foo: 1,
    bar: 2
  };
}
var { foo, bar } = example();

// 模块指定方法
const { SourceMapConsumer, SourceNode } = require("source-map");
```