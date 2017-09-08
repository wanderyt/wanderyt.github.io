title: Require in Node.js
date: 2017-09-06 14:07:43
categories:
- UI Development
tags:
- Javascript
- Nodejs
- Module
---

Post source: [Requiring modules in Node.js: Everything you need to know](https://medium.freecodecamp.org/requiring-modules-in-node-js-everything-you-need-to-know-e7fbd119be8)

这篇文章主要介绍require方法在nodejs开发中的一些应用技巧。除此之外，模块化开发也会有一些涉及。

```javascript
const config = require('/path/to/config');
```

针对`require()`方法，Node的执行步骤主要分以下5步。

1. 转义。将相对路径转义（resolve）为绝对路径。
2. 装载。在这一步中，VM并非会去执行所加载的模块代码。其主要是分析对应路径下的文件是哪种类型，比如.js、.json甚至是c++文件。
3. 封装。将装载的文件代码封装到一个私有的上下文中，并使其变为可执行代码。
4. 执行。这一步中，Node的VM才会去执行所装载的代码。
5. 缓存。将所加载的文件缓存起来，以便下次再require时不需要将前几个步骤再重复一遍。

<!--more-->

### 转义 - Resolve

在这一步中，require方法会将文件的路径转为绝对路径。

```
require('find-me');
```

Node会查找所有`module.paths`指定的所有路径下的`find-me.js`文件。可以通过module.paths方法查看当前查找路径的优先级顺序。

    $ node
    > module.paths
    [ '/Users/username/stubhub/techspace/my-react-story-book/repl/node_modules',
    '/Users/username/stubhub/techspace/my-react-story-book/node_modules',
    '/Users/username/stubhub/techspace/node_modules',
    '/Users/username/stubhub/node_modules',
    '/Users/username/node_modules',
    '/Users/node_modules',
    '/node_modules',
    '/Users/username/.node_modules',
    '/Users/username/.node_libraries',
    '/usr/local/lib/node' ]

如果这个文件没有找到，则会报错：`cannot find module error.`。

相对应的，在项目目录下创建一个`node_modules`文件夹，其中包含一个`find-me.js`。这样也能require到。

    $ mkdir node_modules
    $ echo console.log('I am not lost');" > node_modules/find-me.js
    $ node
    > require('find-me');
    I am not lost

#### require文件夹

模块化概念中，一个模块不仅仅只是一个文件，还有可能是一个文件夹。可以在`node_modules`下创建一个`find-me`文件夹，然后再在其下创建`index.js`文件，这样也能require到。

    $ mkdir -p node_modules/find-me
    $ echo "console.log('Found again.');" > node_modules/find-me/index.js
    $ node
    > require('find-me');
    Found again.

`index.js`是默认的模块入口文件。也可以通过在`package.json`中配置对应的入口文件名来更改。

    $ echo "console.log('I rule');" > node_modules/find-me/start.js
    $ echo '{ "name": "find-me-folder", "main": "start.js" }' > node_modules/find-me/package.json
    $ node
    > require('find-me');
    I rule

#### require.resolve

当我们需要查找确定某一个模块能否被require到（并非需要真去加载执行这个模块），可以用`require.resolve(moduleName)`来检查。如果模块存在，返回模块的路径；如果不存在，则与`require`方法一样报错。这对于去引用在`package.json`中`optionalDependencies`下定义的模块引用很有用处。

    $ node
    > require.resolve('find-me');
    '/Users/samer/learn-node/node_modules/find-me/start.js'
    > require.resolve('not-there');
    Error: Cannot find module 'not-there'

#### 相对路径 vs 绝对路径

定义模块路径方面，相对路径以`./`或者`../`作为开头，而绝对路径以`/`作为开头。

#### 模块相互引用

创建一个`lib/util.js`文件和`index.js`文件，并输出当前`module`，可以看出node对循环引用的支持。

    $ mkdir lib
    $ echo "console.log('In util', module);" > lib/util.js
    $ echo "console.log('In index', module); require('./lib/util');" > index.js

执行`index.js`文件，可以看到下列输出。

    $ node index.js
    In index Module {
        id: '.',
        exports: {},
        parent: null,
        filename: '/Users/samer/learn-node/index.js',
        loaded: false,
        children: [],
        paths: [ ... ] }
    In util Module {
        id: '/Users/samer/learn-node/lib/util.js',
        exports: {},
        parent:
            Module {
                id: '.',
                exports: {},
                parent: null,
                filename: '/Users/samer/learn-node/index.js',
                loaded: false,
                children: [ [Circular] ],
                paths: [...] },
        filename: '/Users/samer/learn-node/lib/util.js',
        loaded: false,
        children: [],
        paths: [...] }

可以看到，在module util中，指出了其父模块为`index`，但是父模块的介绍中，`children`的属性被标为`[Circular]`，否则会陷入无限循环。

这就引申出了另外一个模块循环引用的问题：如果`util`模块又引用了`index`模块？

#### exports / module.exports

对之前两个模块添加`exports`输出。

```javascript
// Add the following line at the top of lib/util.js
exports.id = 'lib/util';
// Add the following line at the top of index.js
exports.id = 'index';
```

这时，module的输出就变成：

    $ node index.js
    In index Module {
        id: '.',
        exports: { id: 'index' },
        loaded: false,
        ... }
    In util Module {
        id: '/Users/samer/learn-node/lib/util.js',
        exports: { id: 'lib/util' },
        parent:
        Module {
            id: '.',
            exports: { id: 'index' },
            loaded: false,
            ... },
        loaded: false,
        ... }

通常定义module的输出会使用下列语法：

```javascript
exports.id = 1;
// or
module.exports = function () {
    // TBD
};
module.exports = {
    a: 'A',
    b: 'B'
};
```

可以看一下node module包装之后的代码，理解会更加深刻：

```javascript
function (require, module, __filename, __dirname) {
    let exports = module.exports;
    // Your Module Code...
    return module.exports;
}
```

直接给`exports`赋值则不会生效，因为这只是改变了`exports`这个变量，但是输出的`module.exports`没有任何变化。如果是给`exports`添加更多的属性，则会生效。

#### loaded关键字

`loaded`关键字标示模块是否已经加载完成。可以通过`setImmediate`方法来检查这个标志。`setImmediate`方法是在当次event loop结束之后立刻执行。对于加载一个模块来说，event loop就是一次require/load模块的过程，所以下列两种代码执行的效果是一样的。

```javascript
// module A
setImmediate(function() {
    console.log('the module is loaded!');
});

console.log('this is module!');
//---------------------------------------

// module B
console.log('this is module!');

setImmediate(function() {
    console.log('the module is loaded!');
});
```

同样，当模块加载完成时，`exports`对象也立刻执行完毕，所以想通过异步来改变模块输出的数据，是不会成功的。

```javascript
fs.readFile('/etc/passwd', (err, data) => {
    if (err) throw err;
    exports.data = data; // won't work.
});
```

#### 循环引用

现在再来看循环引用的案例。创建两个模块：`lib/moduleA`和`lib/moduleB`。

```javascript
// lib/moduleA.js
exports.a = 1;
require('./moduleB');
exports.b = 2;
exports.c = 3;

// lib/moduleB.js
const ModuleA = require('./moduleA');
console.log('ModuleA is partially loaded here', ModuleA);
```

执行`node moduleA.js`时，会得到下列输出：

    $ node lib/module1.js
    Module1 is partially loaded here { a: 1 }

可以看出node对循环引用的支持，依据的原则就是：在加载过程中创建`exports`对象。如果在加载结束前引用了模块，则只能得到当前执行之后的模块输出。

#### node的封装

通过一句语句就能看出node是对模块进行了封装后再加载：

    $ node
    > require('module').wrapper
    [ '(function (exports, require, module, __filename, __dirname) { ',
    '\n});' ]

这五个参数会经常在模块中用到。`exports`是对`module.exports`的引用，`require`和`module`是执行模块代码必用的函数。`__filename`和`__dirname`是封装的模块的文件名和绝对路径。

也可以通过`arguments`来输出这几个参数：

    $ echo "console.log(arguments)" > index.js
    $ node index.js
    { '0': {},
    '1':
    { [Function: require]
        resolve: [Function: resolve],
        main:
        Module {
            id: '.',
            exports: {},
            parent: null,
            filename: '/Users/username/index.js',
            loaded: false,
            children: [],
            paths: [Object] },
        extensions: { '.js': [Function], '.json': [Function], '.node': [Function] },
        cache: { '/Users/username/index.js': [Object] } },
    '2':
    Module {
        id: '.',
        exports: {},
        parent: null,
        filename: '/Users/username/index.js',
        loaded: false,
        children: [],
        paths:
        [ '/Users/username/node_modules',
            '/Users/node_modules',
            '/node_modules' ] },
    '3': '/Users/username/index.js',
    '4': '/Users/username' }
