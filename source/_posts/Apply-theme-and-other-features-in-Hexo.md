title: Hexo中添加主题等其他功能
date: 2015-07-13 13:39:28
categories:
- Blog stuff
tags:
- Hexo
---
这一篇主要做一些Hexo的后续工作。

## 1. 主题

### 1.1 安装主题

Hexo的[主题列表](https://github.com/tommy351/hexo/wiki/Themes)

下载主题

    $ git clone <repository> themes/<theme-name>

比如，我用的是next主题，命令行输入

    $ git clone https://github.com/iissnan/hexo-theme-next themes/next

### 1.2 配置主题

全局配置文件 _config.yml 中 theme 一行改成想要的主题。

    theme: next

## 2. 评论

目前评论系统用的比较多的是Disqus和多说。

### 2.1 Disqus

在[Disqus官网](http://disqus.com/)申请新网站的 shortname

![disqus-create](http://wanderyt.github.io/images/disqus-info.png)

配置全局 _config.yml 文件

    disqus_shortname: wanderyt

### 2.2 多说

在[多说官网](http://duoshuo.com/)申请新网站的 shortname

配置全局 _config.yml 文件

    duoshuo_shortname: wanderyt

## 后记

其他的功能暂时还没有跟上。不过我用的主题是[Next](https://github.com/iissnan/hexo-theme-next)，Github上项目repository里已经有足够多的其他特性的讲解。有兴趣的同学可以一一查看。

目前似乎还没有找到好的解决图片访问的方法。会继续研究。
