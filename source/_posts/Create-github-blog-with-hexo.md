title: 用Hexo搭建Github博客
date: 2015-07-13 10:49:40
categories:
- Blog stuff
tags:
- Blog
- Hexo
- Git
---
## 1. 安装node.js

Node.js官方下载: [Node.js](http://nodejs.org/download/ "Node.js")

## 2. 配置Github

### 2.1 建立Repository

建立与你用户名对应的仓库，仓库名必须为: your_user_name.github.io

### 2.2 配置SSH-Key

## 3. 安装Hexo

### 3.1 Git Command

打开Git Bash，执行如下命令

    $ npm install -g hexo

<!--more-->

### 3.2 Quick Start

在电脑中建立一个名字叫「Hexo」的文件夹（比如我建在了D:\Hexo），然后在此文件夹中右键打开Git Bash。执行下面的命令

    $ hexo init
    [info] Copying data
    [info] You are almost done! Don't forget to run `npm install` before you start b
    logging with Hexo!

Hexo随后会自动在目标文件夹建立网站所需要的文件。然后按照提示，运行npm install（在 /D/Hexo下）

    $ npm install

会在D:\Hexo目录中安装node_modules。

运行下面的命令启动Hexo

    $ hexo server
    [info] Hexo is running at localhost:4000. Press Ctrl+C to stop.

表明Hexo Server已经启动了，在浏览器中打开[http://localhost:4000/](http://localhost:4000/)，这时可以看到Hexo已为你生成了一篇blog。

按Ctrl+C 停止Server。

部署到Github前需要配置_config.yml文件，首先找到下面的内容

    # Deployment
    ## Docs: http://hexo.io/docs/deployment.html
    deploy:
      type:

然后将它们修改为

    # Deployment
    ## Docs: http://hexo.io/docs/deployment.html
    deploy:
      type: git
      repository: http://github.com/wanderyt/wanderyt.github.io.git
      branch: master

> _NOTE_

> Repository： 必须是__HTTPS__形式的URL

> Example: [http://github.com/wanderyt/wanderyt.github.io.git](http://github.com/wanderyt/wanderyt.github.io.git).

> 楼主当时因为看其他的教程说用SSH形式的URL，结果部署时一直报错no address associated with name，原因可能是Hexo版本升级之后设置方法更改。

之后，执行一下命令。

    $ npm install hexo-deployer-git --save

提示安装成功后，重新生成并部署。

    $ hexo clean
    $ hexo generate
    $ hexo deploy

当部署完成后，在浏览器中打开[http://your_user_name.github.io/](https://your_user_name.github.io/)，正常显示网页，表明部署成功。

否则，可能需要设置一下Repository的Github Page。

点击 Github 上本项目的 Settings，GitHub Pages，将其设置为your_user_name.github.io

至此，创建博客成功。

下一篇写一下如何配置主题，评论之类的功能，依旧是依靠npm插件。

* * *

写一下自己的感受。

搭建博客的方法有很多，网上很多牛人都是用Express，其次用的多的是Jekyll。偶然间看到了Hexo，这个其实省去了很多自己做网页的时间，确实是方便了很多。

接触Hexo之后，一直有一个想法，它是如何通过deploy命令，来把本地生成的markdown文件提交到github上，生成对应的html的。

有试过git的童鞋可以发现，在当前的这个repository下面，执行`git fetch`命令后，会从remote branch上拉下很多新生成的代码，这些肯定是最近一次deploy之后传上去的文件。

有时间一定要钻一下这个方法。