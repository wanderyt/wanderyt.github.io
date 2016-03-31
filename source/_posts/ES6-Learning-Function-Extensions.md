title: ES6 Learning - 函数扩展
date: 2016-03-28 15:55:41
categories:
- UI Development
tags:
- Javascript
---

## 参数默认值

### 基本用法

之前比较常见的写法是：

```javascript
function(x, y) {
  y = y || "some string";
  ...
}
```

但是这样的话，如果y是一个布尔值类型的`false`，这是y的值就被重写成了`"some string"`。

ES6中更简洁的写法是：

```javascript
function Point(x = 0, y = 0) {
  this.x = x;
  this.y = y;
}

var p = new Point();
p // { x: 0, y: 0 }
```

<!--more-->

### 参数解构

这里就涉及到一个`undefined`的属性值问题。

```javascript
function fetch(url, { body = '', method = 'GET', headers = {} }){
  console.log(method);
}

fetch('http://example.com', {})
// "GET"
```

### length属性

ES5中函数的`length`属性会返回形参的个数。但在ES6中，`length`经过测试应该是第一个设定默认值的参数之前的参数个数。。

```javascript
var a = function(x, y) {};
// ES5
a.length; // 2

var fn1 = function(x = 5, y) {};
// ES6
fn1.length; // 0

var fn2 = function(x, y = 1) {};
// ES6
fn2.length; // 1
```

所以，一个比较好的代码风格是，__通常情况下，定义了默认值的参数，应该是函数的尾参数。__否则，length属性失真，并且前置的有默认值的参数在实际调用中是无法省略的。

```javascript
var a = function(x = 1, y) {
  return [x, y];
};

a() // [1, undefined]
a(2) // [2, undefined])
a(, 1) // 报错
a(undefined, 1) // [1, 1]
```

### 作用域

如果参数默认值是一个变量，则__变量所处的作用域先是当前函数的作用域，然后才是全局作用域__。

```javascript
let x = 1;

function f(y = x) {
  let x = 2;
  console.log(y);
}

f() // 1
```

而如果参数默认值是一个函数对象，则__函数的作用域是在其声明时所在的作用域，那么函数的作用域不是主调用函数，而是全局作用域__。

```javascript
let foo = 'outer';

function bar(func = x => foo) {
  let foo = 'inner';
  console.log(func()); // outer
}

bar();
```

### 应用

利用默认值，可以对某一个参数设定不得省略，如果省略就抛出一个错误。

```javascript
function throwIfMissing() {
  throw new Error('Missing parameter');
}

function foo(mustBeProvided = throwIfMissing()) {
  return mustBeProvided;
}

foo(); // Error: Missing parameter
```

由于参数在没有传入时会被设为默认的函数，所以当执行`mustBeProvided`时，会调用错误函数抛出`Error`。

## rest参数

利用`rest`参数，可以获取函数的多余参数并转为一个数组。这样可以避免利用`arguments`对象。

```javascript
function add(...values) {
  let sum = 0;

  for (var val of values) {
    sum += val;
  }

  return sum;
}

add(2, 5, 3) // 10
```

注意，这样使用之后，`rest`参数后面不得再跟有其他参数，否则会报错。同时，`length`属性不会计算`rest`参数。

## 扩展运算符

### 语法

`...`作为`rest`的逆运算，将数组转变为用逗号分隔的参数序列。主要用于函数调用中。

```javascript
function add(x, y) {
  return x + y;
}

var numbers = [4, 38];
add(...numbers) // 42
```

### 替代数组的apply方法

`call`和`apply`方法的主要区别就是`call`需要的是逗号分隔的多个参数，而`apply`需要的是一个数组型的参数。

```javascript
// ES5的写法
Math.max.apply(null, [14, 3, 77]);

// ES6的写法
Math.max(...[14, 3, 77]);

// ES5
new (Date.bind.apply(Date, [null, 2015, 1, 1]));
// ES6
new Date(...[2015, 1, 1]);
```

### 应用

#### 合并数组

```javascript
var arr1 = ['a', 'b'];
var arr2 = ['c'];
var arr3 = ['d', 'e'];

// ES5的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

#### 与解构赋值结合

```javascript
const [first, ...rest] = ["foo"];
first  // "foo"
rest   // []
```

#### Iterator接口对象

扩展运算符调用的都是对象的Iterator接口，因此Map，Set和Generator函数都可以使用扩展运算符。

```javascript
var go = function*(){
  yield 1;
  yield 2;
  yield 3;
};

[...go()] // [1, 2, 3]
```

## name属性

返回函数的函数名。

```javascript
const bar = function baz() {};

// ES5
bar.name // "baz"

// ES6
bar.name // "baz"
```

`Function`构造函数返回的函数对象，`name`属性为`'anonymous'`。

```javascript
(new Function).name // "anonymous"
```

## 箭头函数

### 基本用法

```javascript
var f = v => v;
// 等价于
var f = function(v) {
  return v;
};
```

### 注意事项

1. 函数体内的this对象，就是定义时所在的对象，而不是使用时所在的对象。

```javascript
var a = [1, 2, 3, 4];

var test1 = function() {
	return this.a;
};

test1(); // [1, 2, 3, 4]
test1.prototype.call([1,2,3]); // [1, 2, 3]
// =========================================
var test2 = () => this.a;

test2(); // [1, 2, 3, 4]
test2.call({a: [1,2,3]}); // [1, 2, 3, 4]
```

__可以看出，箭头函数中定义的`this`是定义时就设定好的，不会根据函数执行的环境而变化。__


2. 不可以当做构造函数，不能用`new`关键字，否则报错。

3. 不可以使用`arguments`对象，可以用rest代替。

4. 不可以使用`yield`命令，所以不能用作Generator函数。

```javascript
function foo() {
  return () => {
    return () => {
      return () => {
        console.log(`id:`, this.id);
      };
    };
  };
}

var f = foo.call({id: 1});

var t1 = f.call({id: 2})()(); // id: 1
var t2 = f().call({id: 3})(); // id: 1
var t3 = f()().call({id: 4}); // id: 1
```

## 函数绑定

上文看到，箭头函数无法使用`call`，`apply`等方式进行上下文的绑定，但ES7提供了一个解决方案，即双冒号`::`。

双冒号左边是一个对象，右边是一个函数。

```javascript
// ES7
var test2 = () => this.a;
{a: [1,2,3]}::test2();
```

__由于双冒号运算符返回的还是原对象，因此可以采用链式写法。__这句话有点难以理解。等到ES7真正可用的时候测试一个看看假如箭头函数有返回值的话究竟会返回哪个值。

## 尾调用优化

尾调用就是某个函数最后一步是调用另一个函数。

```javascript
function f(x){
  return g(x);
}
```

__“尾调用优化”（Tail call optimization），即只保留内层函数的调用帧。如果所有函数都是尾调用，那么完全可以做到每次执行时，调用帧只有一项，这将大大节省内存。这就是“尾调用优化”的意义。__

__这里可以看到，如果内层函数用到了外层函数的内部变量，则无法进行尾调用优化。__

## 严格模式

严格模式下才会开启尾调用优化，这是因为正常模式下函数内部的两个变量会跟踪函数的调用栈。

    `func.arguments`：返回调用时函数的参数
    `func.caller`：返回调用当前函数的那个函数

所以当严格模式禁用这两个参数时，尾调用优化才会生效。

## 尾逗号

感觉没什么用，就是帮助解决版本管理时不太合实际的行数变化。而且还是ES7生效。


