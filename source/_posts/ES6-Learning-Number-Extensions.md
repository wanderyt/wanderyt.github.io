title: ES6 Learning - 数值扩展
date: 2016-03-25 11:03:14
categories:
- UI Development
tags:
- Javascript
---

## 二进制与八进制表示

二进制：前缀`0b`（或`0B`）
八进制：前缀`0o`（或`0O`）

## Number.isFinite(), Number.isNaN()

`Number.isFinite()`用来检查数值是否是非无穷。

```javascript
Number.isFinite(15); // true
Number.isFinite(NaN); // false
Number.isFinite(Infinity); // false
Number.isFinite(-Infinity); // false
Number.isFinite('foo'); // false
```

`Number.isNaN()`用来检查一个值是否为`NaN`。

```javascript
isNaN("abc"); // true
Number.isNaN("abc"); // false
```

由此可以看出，传统的比较方法中，是将值先调用`Number()`转为数值，再进行判断，因此`isNaN("abc")`会得到true。而这两个新方法只对数值有效，非数值一律返回false。这样判断更加准确。

## Number.isInteger()

用来判断一个值是否为整数。因为判断中用的是`floor(value) === value`，所以可以看出__25和25.0是同一个值__。

## Number.EPSILON

注意，这是一个常量，表示一个极小的数。其实质用法就是设定一个可以接受的误差范围。

```javascript
0.1 + 0.2 - 0.3
// 5.551115123125783e-17

5.551115123125783e-17.toFixed(20)
// '0.00000000000000005551'

5.551115123125783e-17 < Number.EPSILON
// true
```

## 安全整数

JavaScript能够准确表示的整数范围在-2^53到2^53之间（不含两个端点）。`Number.MAX_SAFE_INTEGER`和`Number.MIN_SAFE_INTEGER`这两个常量，用来表示这个范围的上下限。

```javascript
Number.MAX_SAFE_INTEGER === Math.pow(2, 53) - 1
// true
Number.MAX_SAFE_INTEGER === 9007199254740991
// true

Number.MIN_SAFE_INTEGER === -Number.MAX_SAFE_INTEGER
// true
Number.MIN_SAFE_INTEGER === -9007199254740991
// true
```

`Number.isSafeInteger()`则是用来判断一个整数是否落在这个范围之内。

## Math内置函数扩展

### Math.trunc()

去除小数部分。

```javascript
Math.trunc(4.9) // 4
Math.trunc(-4.1) // -4
Math.trunc('123.456') // 123
Math.trunc('foo'); // NaN
```

### Math.sign()

判断数是正数、负数还是0。

    参数为正数，返回+1；
    参数为负数，返回-1；
    参数为0，返回0；
    参数为-0，返回-0;
    其他值，返回NaN。

### Math.cbrt()

求立方根。

### Math.clz32()

返回一个数的32位无符号整数形式有多少个前导0。（__Javscript的整数使用32位二进制形式表示__）

对于小数，只考虑整数部分。


```javascript
Math.clz32(0) // 32
Math.clz32(1) // 31
Math.clz32(0b01000000000000000000000000000000) // 1
Math.clz32(0b00100000000000000000000000000000) // 2

Math.clz32() // 32
Math.clz32(NaN) // 32
Math.clz32('foo') // 32
Math.clz32({}) // 32
Math.clz32(true) // 31
```

### Math.imul()

返回两个数以32位带符号整数形式相乘的结果，也是一个32位的带符号整数。

### Math.fround()

返回一个数的单精度浮点数形式。

```javascript
Math.fround(1);     // 1
Math.fround(1.337); // 1.3370000123977661
Math.fround(1.5);   // 1.5
```

### Math.hypot()

返回所有参数的平方和的平方根。

```javascript
Math.hypot(3, 4); // 5
```