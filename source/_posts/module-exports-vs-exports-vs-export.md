title: module.exports vs exports vs export
date: 2018-02-05 15:47:31
categories:
- UI Development
tags:
- Javascript
- Nodejs
- Module
---

模块导出的声明语句有很多种：

```
module.exports.hello = function() {
    console.log('hello');
}

module.exports = {
    hello: function() {
        console.log('hello');
    }
}

exports.hi = function() {
    console.log('hi');
};

const david = 'David';
export default david;

export {
    hiDavid: function() {
        console.log('Hi David!');
    }
};
```

Nodejs遵循的是CommonJS规范，使用`require`方法来加载模块，而ES6中是使用`import`来加载模块。参考这个图片：

![commonjs-es6](https://note.youdao.com/yws/api/personal/file/WEBede5c09950ee9a19febbf7d2181ab39c?method=download&shareKey=f54086d77f07614dde2260d2fce3fb59)

### module.export vs exports

```
function (exports, require, module, __filename, __dirname) {
    //...
}
```

可以看出`require`规范下`module`和`exports`都是内置的变量。但是`exports`是被`module.exports`引用的，所以给任意其一赋值都是可行的。

```
// working
module.exports.hello = function() {
    console.log('hello');
}

// working
exports.hi = function() {
    console.log('hi');
};
```

这种情况下，模块导出的是包含两个方法的对象。但是对比下面的声明：

```
// working
module.exports = {
    hello: function() {
        console.log('hello');
    }
}

// NOT Working!!
exports.hi = function() {
    console.log('hi');
};
```

这种情况下，第二个声明失效，因为`module.exports`已经被直接赋值，`exports`会被忽略。
另外，因为`exports`只是一个变量，所以直接给其赋值也是无意义的。

```
// working
module.exports.hello = function() {
    console.log('hello');
}
// NOT Working!!
exports = {
    hi: function() {
        console.log('hi');
    }
}
```

### Nodejs

`require`方法无法识别`export`导出语句，会直接报错。因此`Nodejs`环境下只能使用`module.exports`或者`exports`语法。

```
// module.js
module.exports.hello = function() {
    console.log('hello');
}

exports.hi = function() {
    console.log('hi');
};

const david = 'David';
exports.default = david;

// index.js
var module = require('./module.js');
console.log(module); // {hello: function, hi: function, default: "David"}
```

### ES6

`import`语句可以识别`module.exports`、`exports`和`export`语法。

```
// module.js
module.exports.hello = function() {
    console.log('hello');
}

exports.hi = function() {
    console.log('hi');
};

const david = 'david';
const hiDavid = function() {
    console.log('Hi David');
};

export default david;
export {
    hiDavid
};

// index.js
import test, {hello} from './module.js';
import TestModule from './module.js';
console.log(test);        // david
console.log(hello);       // function
console.log(TestModule);  // {hello: function, hi: function, default: "david", hiDavid: function}
```

可以猜想到，`import`方法中，`export default`和`exports.default`是被认为相似的声明，而且不会强制认为必须是相同的导出导入名称匹配。

这种互通，在`Server Side Rendering`技术中会有更好的体现。在服务器渲染技术中，我们需要找到一种声明在ES6模块（比如React代码）和Nodejs中都可以被识别，这种情况下，使用`module.exports` / `exports`顶替`export`会是更好的选择。