title: Precompile Less With Express.js
date: 2016-03-15 15:10:18
categories:
- UI Development
tags:
- npm
- express
- less
---

最近学习了一下Express.js，正好之前看到Less的预编译，所以做了一把实践。

先说一下正常的Less样式文件加载方式。

首先定义less文件的引用：

`<link rel="stylesheet/less" type="text/css" href="./less/style.less" />`

样式文件中定义了一些基本的less语法。

	#header {
		.button {
			display: block;
			border: 1px solid black;
			background-color: blue;
			&:hover {
				background-color: white
			}
		}
	}

之后定义less.js的引用：

`<script type="text/javascript" src="./script/less.min.js" />`

但是这样加载页面的效率对于生产环境来说是一种灾难，每次都需要根据less.js首先对引用的less文件进行一次编译，转化成html文件可读的css文件。因此在[less](http://lesscss.org/)官方说明中也提倡预编译方式。

	Client-side is the easiest way to get started and good for developing with Less, but in production, when performance and reliability is important, we recommend pre-compiling using node.js or one of the many third party tools available.

首先借助express.js搭建工程，并在app.js文件中定义中间件。

这里使用的是[Less-middleware](https://github.com/emberfeather/less.js-middleware)。

	var lessMiddleware = require("less-middleware");
	var express = require("express");
	var path = require("path");
	var app = express();

	app.use(lessMiddleware(path.join(__dirname, "ui"), {
		dest: path.join(__dirname, "ui"),
		force: true,       // Always re-compile less files on request
		once: true,        // Only compile once after server starts or restarts. Useful for reducing disk i/o consumption
		debug: true
	}));
	app.use(express.static(path.join(__dirname, "ui")));

	var server = app.listen(3000, function() {
		var host = server.address().address;
		var port = server.address().port;

		console.log('Example app listening at http://%s:%s', host, port);
	});

说明一下，**`__dirname`变量会获取当前模块文件所在目录的完整绝对路径。**

之后，在ui目录下定义`index.html`文件

`<link rel="stylesheet" type="text/css" href="./less/style.css">`

关于less-middleware中间件定义中的各个参数，我也是测试了多次之后才发现每个参数的用途。

	src -- 匹配url中以此为开头的请求路径
	dist -- 编译less文件，并将编译后的css文件生成到此路径下的文件夹中
	force -- 每次请求都会重新编译生成一遍
	once -- 仅仅服务器启动时编译生成css文件

**所以，如果在html中定义less文件的`href`的值为`xx.less`，那么less-middleware会对应去匹配解析`src\xx.less`文件，并生成css文件到`dist\xx.css`。**

至于force设置成为`true`的时候，每次请求页面会重新生成css文件。

app.js中最后那句`app.use(express.static(path.join(__dirname, "ui")));`定义才会将请求重定位到`__dirname\ui`下，所以如果需要访问`ui\index.html`文件，可以直接在地址栏中输入`localhost:3000/index.html`。这就是[express.js的托管静态文件](http://www.expressjs.com.cn/starter/static-files.html)。

总结下来，这应该算是一种预编译，尤其是当force设置成为`false`的时候，使用less文件的效率会有提升。

但是思考一个问题，无论那种预编译方式，每次访问页面都会去发一次请求：

	预编译模式下发一个http请求，获取对应的css文件（其实后台已经完成或需要完成解析less文件功能）
	实时解析模式下发两个http请求，首先获取less文件，之后获取less解析器，并解析less文件

相对来说，预编译模式会好一些，但跟html文件直接饮用css文件比起来还是性能上要差一些。所以，大概这就是使用less的缺点之一吧，但是这个缺点应该不会影响到less的那些好的地方。尤其是它的编程风格更接近html的标签嵌套，因此可读性和可维护性方面是css完全无可比拟的。