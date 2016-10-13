title: Yarn - New Package Management Tool
date: 2016-10-13 11:14:14
categories:
- UI Development
- Javascript
- npm
tags:
- Javascript
- npm
---

今天偶尔看到一篇[文章](https://code.facebook.com/posts/1840075619545360)，讲到Facebook新出的一个Package Management Tool：`Yarn`。

主要的优势就是分析包之间的关联关系，并缓存已下载的内部包依赖。Yarn的实现方法主要有三步。

1. 分析：分析每个包的内部依赖，并发送请求到`registry`。
2. 获取：先从本地的全局缓存目录下查找所有的包，如果没有则进行下载。
3. 链接：拷贝所有缓存中的包，到项目的`node_modules`目录下。

Yarn已在Facebook的生成环境中使用，证明其工作的有效性。

    $ npm install -g yarn

相关命令：

    $ npm install
    $ npm install --save <name>

可以替换成：

    $ yarn
    $ yarn add <name>

我也在本地试验了一下，找了一个最基本的项目，这是项目中目前的包依赖，`package.json`文件。

```json
{
  // ...
  "devDependencies": {
    "express": "^4.14.0",
    "grunt": "^1.0.1",
    "grunt-contrib-concat": "^1.0.1",
    "grunt-contrib-jshint": "^1.0.0",
    "grunt-contrib-requirejs": "^1.0.0",
    "grunt-contrib-uglify": "^2.0.0",
    "grunt-contrib-watch": "^1.0.0",
    "grunt-express-server": "^0.5.3",
    "grunt-nodemon": "^0.4.2"
  }
}
```

总共只有这几个包依赖，但是如果使用`npm`进行安装。

    $ npm install

这一条命令总共执行了3分钟。但如果换成`yarn`命令。

    $ yarn

这一条命令分析出了380+个包依赖，优化后总共只执行了不到80秒。速度提升一倍以上，确实是很实用。

以后继续分析yarn的其他功能。

最后感叹一下，Facebook真是的前端技术领域里的担当啊。