title: Create react app with customized backend API
date: 2018-02-07 15:41:25
categories:
- UI Development
tags:
- Nodejs
- React
---

目前在做一个图片展示页面，使用的是`create-react-app`搭建起来的react应用。只是突发奇想页面渲染过程中，如何能把图片保存在server端。

直接在React代码中使用保存文件的api目前还没有找到，所以只能寄希望于`nodejs`端来解决保存问题。

大概在网上搜了一下，目前普遍的做法跟自己想的比较类似，就是在`nodejs`自定义一个保存图片的api，然后React代码中发送api请求，nodejs端捕获，并且保存对应的图片到server文件系统中。

实践起来还是比较复杂的，中间遇到的问题也不少。

### 搭建Nodejs Server

<!--more-->

使用`express`迅速搭建一个server，端口号暂定为5000。（Create React App默认的Webpack Server端口为3000）

__server/server.js__:

```javascript
const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

app.get('/api/downloadPicture', (req, resp) => {
    resp.send('download success');
});

app.listen(port, () => console.log(`Listening on port ${port}`));
```

接下来先模拟写一个图片下载的服务。目前项目里抓取的都是twitter上的图片，所以拿一个例子来说明。

图片："https://pbs.twimg.com/media/DUWPzZ7W4AExatH.jpg"

```javascript
http.get ({
    path: `https://pbs.twimg.com/media/DUWPzZ7W4AExatH.jpg`
}, function (response) {
    response.on("end", function(){
        console.log("saved png");
    });
});
```

报错：__Error: connect ECONNREFUSED__

这个错误是说明无法与服务器连接。debug很久才发现，图片是存放在twitter网站的静态资源，需要翻墙使用代理才能下载到。加上公司的proxy，这个图片才算是能正常下载下来。

```javascript
http.get ({
    host: host, // proxy host
    port: port, // proxy port
    path: `https://pbs.twimg.com/media/DUWPzZ7W4AExatH.jpg`
}, function (response) {
    mkdirp(`${process.cwd()}${path.sep}downloadImages`, (err) => {
        var imageFile = fs.createWriteStream(`${process.cwd()}${path.sep}downloadImages${path.sep}${imgName}`);
        response.on("data", function(chunk){
            imageFile.write(chunk);
        });
        response.on("end", function(){
            console.log("saved png");
        });
    });
});
```

使用`mkdirp`是因为需要自动创建下载目录。`fs.writeFileSync`不负责创建路径。事实上，如果路径不存在，会直接报错导致程序中断。

图片的写入需要创建一个fileStream来实现。给repsonse上绑一个data的监听事件，一旦是有数据返回就往stream上写数据流直到response返回结束。

至此，nodejs api编写完成。

### React发送请求

在React中，在`componentDidMount`中发送请求，这样就不会阻塞页面的加载渲染。

```javascript
componentDidMount() {
    fetch(`http://localhost:5000/api/downloadPicture?img=${img}&type=twitter`).then((resp) => {
        console.log(resp);
    });
}
```

直接使用5000端口的API端点，前端会直接报错。这里存在一个跨域请求的访问，出于安全考虑，浏览器会禁止这类访问，并将请求状态置为500。所以我们只能使用3000端口。但如何把端口从3000映射到nodejs的5000端口上？

此时需要在`package.json`里增加一行：

```json
{
  //...
  "proxy": "http://localhost:5000"
}
```

关于这个proxy的定义，只在网上找到这么一句解释：

> A proxy to use for outgoing https requests. If the HTTPS_PROXY or https_proxy or HTTP_PROXY or http_proxy environment variables are set, proxy settings will be honored by the underlying request library.

大概就是如果使用了`proxy`，所有HTTP / HTTPS的请求都会被代理到proxy设定的域名下。这样我们就可以调用localhost:5000下的服务了。

### 启动服务器

前后端相应的配置都已经完成，还剩最后一步：启动两个服务器。

```json
{
  //...
  "scripts": {
    "start": "node scripts/start.js",
    "poststart": "node server/server.js"
  },
  //...
}
```

很遗憾，这样写并不能启动我们自定义的服务器。node是单线程，启动了create-react-app的服务器之后，就会一直监听在那里，不会再执行第二步命令。所以需要`concurrently`库来帮助。

`concurrently`可以“同时”执行多个命令。

```json
{
  //...
  "scripts": {
    "start": "node scripts/start.js",
    "mystart": "concurrently --kill-others-on-fail \"node server/server.js\" \"npm run start\""
  },
  //...
}
```

参数`kill-others-on-fail`是当某一个命令失败后，同时结束其他命令。这样我们就可以保证两个服务器同时启动。

---

参考来源：

[How to get "create-react-app" to work with your API](https://www.fullstackreact.com/articles/using-create-react-app-with-a-server/)