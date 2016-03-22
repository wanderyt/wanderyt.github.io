title: Install Package Error in Sublime Text 3
date: 2015-08-12 18:02:44
categories:
- UI Development
tags:
- Sublime Text
---

今天告别Sublime Text 2，彻底进入Sublime Text 3的时代。好像迟了点。。。

第一步就遇到了问题。

Ctrl + Shift + P，习惯性的通过内部安装插件，突然提示框弹出：

	There are no packages available for installation.

Google一圈之后似乎满眼都是修改hosts文件，增加对sublime.wbond.net的IP访问。但是报错依旧。

后来在stackoverflow上有一个没有被采纳的建议却真正帮到了我。

下载最新的package contorl文件。

途径一： 到Github上的[package control](https://github.com/wbond/package_control)下载最新的文件。

途径二： 到package control的[官网](https://packagecontrol.io/installation)上直接下载最新的安装文件，上面有安装路径。