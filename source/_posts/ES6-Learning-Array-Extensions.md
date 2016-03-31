title: ES6 Learning - 数组扩展
date: 2016-03-28 11:09:39
categories:
- UI Development
tags:
- Javascript
---

## Array.from()

将两类对象转为数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括ES6新增的数据结构Set和Map）。

```javascript
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']

Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']
```

此处slice的这种用法我还没见过，但是测试确实可以。

<!--more-->

扩展运算符（`...`）也可以将某些数据结构转为数组。扩展运算符背后调用的是遍历器接口（Symbol.iterator），如果一个对象没有部署这个接口，就无法转换。Array.from方法则是还支持类似数组的对象。所谓类似数组的对象，本质特征只有一点，即必须有length属性。因此，任何有length属性的对象，都可以通过Array.from方法转为数组，而此时扩展运算符就无法转换。

```javascript
// arguments对象
function foo() {
  var args = [...arguments];
}

// NodeList对象
[...document.querySelectorAll('div')]

Array.from({length: 3});
// [ undefined, undefined, undefinded ]
```

Array.from()中第二个参数可以传入一个map的function。

```javascript
function typesOf () {
  return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']
```

## Array.of()

将一组值转换为数组。主要为了区别Array构造函数。

```javascript
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1

Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

## copyWithin()

数组实例方法。三个参数：

    target（必需）：从该位置开始替换数据。
    start（可选）：从该位置开始读取数据，默认为0。如果为负值，表示倒数。
    end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示倒数。

如果start和end相同则什么都没做。

```javascript
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]
```

## find()和findIndex()

数组实例方法。`find`是找到数组成员，`findIndex`是找到数组成员位置。

参数是一个回调函数`function(value, index, arr)`，回调函数的三个参数依次是：

    value：当前的值
    index：当前的位置
    arr：原数组

```javascript
[1, 5, 10, 15].find(function(value, index, arr) {
  return value > 9;
}) // 10

[NaN].indexOf(NaN)
// -1
[NaN].findIndex(y => Object.is(NaN, y))
// 0
```

## fill()

使用给定值填充一个数组。三个参数依次是：

    value（必需）：要填充的数
    start（可选）：填充的起始位置
    end（可选）：填充的结束位置

```javascript
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']
```

## entries(), keys(), values()

对数组的遍历。`entries()`遍历键值对，`keys()`遍历键名，`values()`遍历值。返回一个遍历器对象。

```javascript
for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```

遍历器对象可以通过`for..of`或者`next()`方法进行遍历。

## includes()

返回布尔值，表示数组是否包含给定的值。

与indexOf的区别是，indexOf还需要判断是否返回-1的值，并且内部使用的是严格的`===`判断，这会导致`NaN`的误判。

```javascript
[NaN].indexOf(NaN)
// -1
[NaN].includes(NaN)
// true
```

## 数组空位

在ES5和ES6中，空位的处理是不一样的。

```javascript
// ES5
var a = new Array(3); // [,,,]
a[0] === undefined; // false

// ES6
var a = new Array(3); // [undefined,undefined,undefined] 或 [,,,]
a[0] === undefined; // true
```

ES5中对空位的处理不一致，在此只做说明：

    `forEach()`, `filter()`, `every()`和`some()`都会跳过空位。
    `map()`会跳过空位，但会保留这个值
    `join()`和`toString()`会将空位视为`undefined`，而`undefined`和`null`会被处理成空字符串。

__ES6则明确空位转为`undefined`__。

```javascript
[,'a','b',,].copyWithin(2,0) // [,"a",,"a"]
[...['a',,'b']]
// [ "a", undefined, "b" ]

let arr = [, ,];
for (let i of arr) {
  console.log(1);
}
// 1
// 1
```

## 数组推导

先上代码。

```javascript
var a1 = [1, 2, 3, 4];
var a2 = [for (i of a1) i * 2];
```

ES7才会支持，所以chrome的控制台无法使用这种语法。其实就是在数组定义时使用`for...of`甚至是`if`条件判断来设定新的数组结构。

```javascript
var years = [ 1954, 1974, 1990, 2006, 2010, 2014 ];
[for (year of years) if (year > 2000) year];
// [ 2006, 2010, 2014 ]

[for (year of years) if (year > 2000) if(year < 2010) year];
// [ 2006]

[for (year of years) if (year > 2000 && year < 2010) year];
// [ 2006]
```

个人不喜欢这样的写法，会使一个简单结构的声明变得异常难读。