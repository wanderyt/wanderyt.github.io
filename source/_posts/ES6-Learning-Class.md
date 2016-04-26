title: ES6 Learning - Class
date: 2016-04-18 10:23:24
categories:
- UI Development
tags:
- Javascript
---

## 基本语法

### 概述

```javascript
// ES5
function Point(x,y){
  this.x = x;
  this.y = y;
}

Point.prototype.toString = function () {
  return '(' + this.x + ', ' + this.y + ')';
}

// ES6
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  toString() {
    return '(' + this.x + ', ' + this.y + ')';
  }
}
```

注意，不用加`function`关键字，并且方法之间不需要加分号。

类的数据类型就是函数，类本身就指向构造函数。

```javascript
typeof Point // "function"
Point === Point.prototype.constructor // true
```

类的实例上调用方法，其实就是调用原型上的方法。

```javascript
var point = new Point();
point.constructor = Point.prototype.constructor; // true
```

类的内部定义的所有方法，都是不可枚举的。

```javascript
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```

### constructor方法

通过`new`命令生成对象实例时，自动调用该方法。默认返回实例对象（this），但也可以指定返回其他对象。

```javascript
class FooTestString {
  constructor() {
    return 'Test String';
  }
}

var fooTestString = new FooTestString();
fooTestString instanceof FooTestString; // true

class FooTestNewString {
  constructor() {
    return new String('Test String');
  }
}

var fooTestNewString = new FooTestNewString();
fooTestNewString instanceof FooTestNewString; // false
fooTestNewString instanceof String; // true
```


































