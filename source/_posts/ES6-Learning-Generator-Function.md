title: ES6 Learning - Generator函数
date: 2016-04-06 11:21:15
categories:
- UI Development
tags:
- Javascript
---

## 简介

`Generator`函数是`ES6`提供的一种异步编程解决方案。执行`Generator`函数会返回一个遍历器对象，依次遍历`Generator`函数内部的每一个状态。

    function关键字与函数名之间有一个星号。
    函数体内部使用yield语句，定义不同的内部状态

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

<!-- more -->

```javascript
hw.next()
// { value: 'hello', done: false }

hw.next()
// { value: 'world', done: false }

hw.next()
// { value: 'ending', done: true }

hw.next()
// { value: undefined, done: true }
```

    第一次调用，执行Generator函数，直到遇到第一个yield为止，返回yield语句的值。
    第二次调用，从上次停下的yield语句开始，执行到下一个yield或者return语句。
    第三次调用，从上次停下的yield语句开始，执行到下一个yield或者return语句，done为true，表示遍历已经结束。
    第四次调用，遍历已经结束，next方法返回value为undefined，同时done为true表示结束。

ES6没有规定星号写在哪个位置，所以下面的都能通过。

    function * foo(x, y) { ··· }
    function *foo(x, y) { ··· }
    function* foo(x, y) { ··· } // 普通写法
    function*foo(x, y) { ··· }

## yield语句

`Generator`函数执行的暂停标志。

`yield`后面的表达式，只有当调用`next`方法、内部指针指向该语句时才会执行。（`Lazy Evaluation`）

`yield`和`return`的区别在于，一个`Generator`函数可以多次执行`yield`语句，但是只能执行一次`return`语句，遇到第一个`return`语句之后，后续不会再执行。

另外，__`yield`语句不能用在普通函数中。__

yield语句如果要放到一个表达式中，则必须放到圆括号中。

```javascript
var generator = function* () {
    var input = (yield 123) + (yield 234);
    return input;
}

var g = generator();
g.next()
// Object {value: 123, done: false}
g.next()
// Object {value: 234, done: false}
g.next()
// Object {value: NaN, done: true} (undefined + undefined = NaN)
```

### 与Iterator接口关系

任意一个对象的`Symbol.iterator`方法，等于该对象的遍历器对象生成函数，调用该函数会返回该对象的一个遍历器对象。

```javascript
function* gen(){
  // some code
}

var g = gen();

g[Symbol.iterator]() === g
// true
```

## next方法的参数

__`yield`语句的返回值是`undefined`__。`next`方法可以带一个参数，被当做上一个`yield`语句的返回值。

这一段感觉有点无法理解。看两段代码：

```javascript
function* gen() {
  while(true) {
    var value = yield null;
    console.log(value);
  }
}

var g = gen();
g.next(1);
// "{ value: null, done: false }"
g.next(2);
// "{ value: null, done: false }"
// 2

var generator = function* () {
  for(let i = 0; i < 10; i++) {
    var value = yield i;
    console.log(i);
  }
};

var g = generator();
g.next(19)
// Object {value: 0, done: false}
g.next(19)
// 0
// Object {value: 1, done: false}
```

教程中的例子比较好的说明了next参数的用途。

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

上面代码中，第二次运行next方法的时候不带参数，导致y的值等于2 * undefined（即NaN），除以3以后还是NaN，因此返回对象的value属性也等于NaN。第三次运行Next方法的时候不带参数，所以z等于undefined，返回对象的value属性等于5 + NaN + undefined，即NaN。

如果向next方法提供参数，返回结果就完全不一样了。上面代码第一次调用b的next方法时，返回x+1的值6；第二次调用next方法，将上一次yield语句的值设为12，因此y等于24，返回y / 3的值8；第三次调用next方法，将上一次yield语句的值设为13，因此z等于13，这时x等于5，y等于24，所以return语句的值等于42。

注意，由于next方法的参数表示上一个yield语句的返回值，所以第一次使用next方法时，不能带有参数。V8引擎直接忽略第一次使用next方法时的参数，只有从第二次使用next方法开始，参数才是有效的。从语义上讲，第一个next方法用来启动遍历器对象，所以不用带有参数。

第一次就使用next参数的情况，在Generator函数外再包一层。

```javascript
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!')
// First input: hello!
```

## for...of循环

一旦返回值中的done参数为true的时候，则终止循环，并此次的value不做处理。

```javascript
function *foo() {
  yield 1;
  yield 2;
  yield 3;
  yield 4;
  yield 5;
  return 6;
}
for (let v of foo()) {
  console.log(v);
}
// 1 2 3 4 5
```

不止是`for...of`，扩展运算符（`...`），解构赋值和`Array.from`都是这样工作。

```javascript
function* numbers () {
  yield 1
  yield 2
  return 3
  yield 4
}

[...numbers()] // [1, 2]

Array.from(numbers()) // [1, 2]

let [x, y] = numbers();
x // 1
y // 2

for (let n of numbers()) {
  console.log(n)
}
// 1
// 2
```

## Generator.prototype.throw()

可以在函数体外抛出异常，并在函数体内捕捉。

```javascript
var g = function* () {
  try {
    yield;
  } catch (e) {
    console.log('内部捕获', e);
  }
};

var i = g();
i.next();

try {
  i.throw('a');
  i.throw('b');
} catch (e) {
  console.log('外部捕获', e);
}
// 内部捕获 a
// 外部捕获 b
```

然而，如果直接调用`throw()`会直接抛错。

```javascript
var generator = function* () {
  for(let i = 0; i < 10; i++) {
    try {
      var value = yield i;
      console.log(i);
    } catch(e) {
      console.log("catch exception...");
    }
  }
};

var g = generator();
g.throw();

// ------------- Comparison -------------//

var generator = function* () {
  for(let i = 0; i < 10; i++) {
    try {
      var value = yield i;
      console.log(i);
    } catch(e) {
      console.log("catch exception...");
    }
  }
};

var g = generator();
g.next();
g.throw();
g.next();
```

这个[问题](http://stackoverflow.com/questions/36446273/how-does-generator-prototype-throw-work-is-an-implicit-next-included)已经提问出去了，回答似乎已经解决。另外，证明一点，`stackoverflow`上的反应还是比`segmentfault`要快很多，20分钟就解决了。

总体思路就是，`g.next()`和`g.throw()`都是同样的工作原理，只不过，`g.throw()`执行之后会直接进入`finally`模块，如果没有则直接退出。

```javascript
var generator = function* () {
  try {
    yield 1;
    yield 2;
  } catch(e) {
    console.log("catch exception...");
  } finally {
    yield 3;
  }
};
var g = generator();
g.next(); // Object {value: 1, done: false}
g.throw();
// catch exception...
// Object {value: 3, done: false}
g.next();
// Object {value: undefined, done: true}
```

## Generator.prototype.return()

可以返回给定的值，并且终结遍历Generator函数。

```javascript
function* gen() {
  yield 1;
  yield 2;
  yield 3;
}

var g = gen();

g.next()        // { value: 1, done: false }
g.return("foo") // { value: "foo", done: true }
g.next()        // { value: undefined, done: true }
```

如果`Generator`函数内部有`try...finally`代码块，那么`return`方法会推迟到`finally`代码块执行完再执行。

```javascript
function* numbers () {
  yield 1;
  try {
    yield 2;
    yield 3;
  } finally {
    yield 4;
    yield 5;
  }
  yield 6;
}
var g = numbers()
g.next() // { done: false, value: 1 }
g.next() // { done: false, value: 2 }
g.return(7) // { done: false, value: 4 }
g.next() // { done: false, value: 5 }
g.next() // { done: true, value: 7 }
```

## yield*语句

用于在一个`Generator`函数中调用另一个`Generator`函数。

相当于在外层`Generator`函数中调用了一个`for...of`循环。

```javascript
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```





