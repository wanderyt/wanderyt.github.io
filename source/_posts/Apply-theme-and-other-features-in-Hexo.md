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

<!--more-->

## 2. 评论

目前评论系统用的比较多的是Disqus和多说。

### 2.1 Disqus

在[Disqus官网](http://disqus.com/)申请新网站的 shortname

![Disqus](/images/disqus-info.png)

配置全局 _config.yml 文件

    disqus_shortname: wanderyt

### 2.2 多说

在[多说官网](http://duoshuo.com/)申请新网站的 shortname

配置全局 _config.yml 文件

    duoshuo_shortname: wanderyt

## 3. Google统计

注册[Google Analytics](http://www.google.cn/intl/zh-CN_ALL/analytics/learn/index.html)。

在全局 _config.yml 文件中添加：

    google_analytics: UA-[TrackingID]-1

## 4. 图片显示

把图片放到 source/images 目录下

    ![](images/xxx.jpg)

## 5. Sitemap网站地图

安装插件

    $ npm install hexo-generator-sitemap

之后去百度/谷歌站长工具注册，并提交网站的sitemap。

将下面两行代码贴至主题中layout/_partials/head.swig文件。

    <meta name="baidu-site-verification" content="LmCOIrwcO6" />
    <meta name="google-site-verification" content="0ZYSkBO0_qFiD-ZU4ZG5y9iVG9b0OhuhIoYCBWPg6mk" />

## 6. Swifttype

[Swifttype](https://swiftype.com/home)，可以用来生成站内搜索框。

注册后，Create Engine，并通过默认的搜索功能来生成安装搜索框。生成代码后可以再代码中看到自己的your-swiftype-key。

在站点的 _config.yml 中增加

    swiftype_key: your-swiftype-key

## 7. jsFiddle

这是后来补充，作为程序猿经常要加入代码呈现，jsFiddle和codepen是常用的两种，可惜没有找到hexo对codepen的支持，只找到对jsFiddle的引用。

    {% jsfiddle shorttag [tabs [skin [width [height]]]] %}

至于要怎么用，甩出一段hexo的代码：

    function jsfiddleTag(args, content) {
      var id = args[0];
      var tabs = args[1] && args[1] !== 'default' ? args[1] : 'js,resources,html,css,result';
      var skin = args[2] && args[2] !== 'default' ? args[2] : 'light';
      var width = args[3] && args[3] !== 'default' ? args[3] : '100%';
      var height = args[4] && args[4] !== 'default' ? args[4] : '300';
    
      return '<iframe scrolling="no" width="' + width + '" height="' + height + '" src="http://jsfiddle.net/' + id + '/embedded/' + tabs +     '/' + skin + '" frameborder="0" allowfullscreen></iframe>';
    }

    shorttag - 就是jsFiddle生成代码段时url上的那段id。
    tabs - 主要用到的就是html,css,js,result。
    skin - 我还没找到，暂时先用light代替吧，因为这个参数不是可选的，除非你不想设置jsFiddle的大小。
    width - 宽度
    height - 高度

## 后记

我用的主题是[Next](https://github.com/iissnan/hexo-theme-next)，Github上项目repository里已经有足够多的其他特性的讲解。有兴趣的同学可以一一查看。
