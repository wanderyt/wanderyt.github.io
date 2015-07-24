title: npm vs bower vs grunt vs gulp
date: 2015-07-24 14:40:38
categories:
- Nodejs
tags:
- Nodejs
- npm
- bower
- grunt
- gulp
---

### npm vs bower

首先，两者都是包管理工具。主要的区别在于：

__npm是用于管理node的js包，而bower更偏向于管理前端组件，比如html,css,js等等__

实际上,npm也提供一些前端开发的包，比如`grunt`,`jshint`。不过个人认为这些也还算是node的后端开发工具。

以下这段可能更加说明区别。

{% blockquote %}
Bower, unlike npm, can have multiple files (e.g. .js, .css, .html, .png, .ttf) which are considered the main file(s). Bower semantically considers these main files, when packaged together, a component.
{% endblockquote %}

bower，不像npm，可以包含多种多样的主要文件（.js, .css, .html, .png, .ttf等等）。这些文件都会被认为包的主要文件。bower在提交类库时，这些文件都会被一起打包。

### Grunt

Grunt与npm和bower完全不同，Grunt是一个javascript的任务工具，利用grunt，我们可以做很多其他时候必须人工维护的事情。点出几个Grunt的几个重要用途。

> Zipping some files (e.g. zipup plugin)

> Linting on js files (jshint)

> Compiling less files (grunt-contrib-less)

* * *

npm与bower最大的区别在于，npm主要运用于Node.js项目的内部依赖包管理，安装的模块位于项目根目录下的node_modules文件夹内。而Bower大部分情况下用于前端开发，对于CSS/JS/模板等内容进行依赖管理，依赖的下载目录结构可以自定义。

有人可能会问，为何不用npm一个工具对前后端进行统一的依赖管理呢？ 实际上，因为npm设计之初就采用了的是嵌套的依赖关系树，这种方式显然对前端不友好；而Bower则采用扁平的依赖关系管理方式，使用上更符合前端开发的使用习惯。

不过，现在越来越多出名的js依赖包可以跨前后端共同使用，所以bower和npm上面有不少可以通用的内容。实际项目中，我们可以采用NPM作用于后端；bower作用于前端的组合使用模式。让前后端公用开发语言的同时，不同端的开发工程师能够更好地利用手上的工具提升开发效率。

* * *

### gulp vs grunt

[Gulp官网](http://gulpjs.com/)

Grunt利用一些内嵌的功能来完成一些基本的用途。Grunt是基于配置来完成功能的。

Gulp不是立即可用的，它是基于插件流来完成一个复杂的工作流。

这两种工具都可以将多个任务并行执行，但Gulp会尝试同时执行尽可能多的任务，同时保证任务之间的依赖关系。

Gulp常用的方法有四个：

    gulp.task();    // 定义任务
    gulp.watch();   // 监测文件系统的修改
    gulp.src();     // 打开文件/文件夹
    gulp.dest();    // 输出文件/文件夹

常用的gulp插件有：

    gulp-ruby-sass : 支持sass 
    gulp-minify-css : 压缩css 
    gulp-jshint : 检查js 
    gulp-uglify : 压缩js 
    gulp-concat : 合并文件 
    gulp-rename : 重命名文件 
    gulp-htmlmin : 压缩html 
    gulp-clean : 清空文件夹