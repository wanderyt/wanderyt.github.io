title: 分离Github代码和博客生成代码
date: 2015-07-13 16:27:26
categories:
- Blog stuff
tags:
- Hexo
- Git
---

## 1. 问题

玩Hexo两天了，发现一个很重要的问题。

> 利用hexo命令创建博客的markdown文件，之后用deploy命令来生成博客页面并发布到github上。

> git bash中输入这两行命令

>     $ hexo deploy
>     $ git fetch

> 很平常的举动，我要fetch一下远程代码，然后要把本地的修改提交。怎么一下子那么多冲突？OMG

这个问题网上居然没有多少帖子讨论，只能自己开工搞一搞了。

想起来一个兄弟在自己的技术博客里写过一句话：程序猿就要是多搞搞才行。

其实，是由于在 _config.yml 文件中设置的

    # Deployment
    ## Docs: http://hexo.io/docs/deployment.html
    deploy:
      type: git
      repository: http://github.com/wanderyt/wanderyt.github.io.git
      branch: master

导致的。

我没有查到这个branch的作用，但是经过测试，这里的branch应该是指博客页面通过读取repository中远程master上的代码来生成的。

好了，现在就出现问题了，我们当前默认的工作目录所在的branch也是master。所以当我们push本地代码到远程master分支时，就会提示冲突之类的错误了。

<!--more-->

## 2. 解决

了解了问题的原因，接下来就好解决了。

> _Solution_

> 增加一个本地的工作分支，和一个远程的工作分支做对应

> 维护博客内容在工作分支上，生成博客代码在master分支上

>    ___一个Github的Repository中可以有多个远程分支，分管不同的代码___

增加一个本地工作分支

    $ git branch blog-editing

增加一个远程工作分支

    $ git push origin blog-editing
    [$ git push origin :blog-editing // 删除远程分支]

本地远程两个分支都建好之后，切换到本地新建的分支上，提交博客修改代码。

    $ git add directory/\*.txt
    $ git commit -m "MESSAGE_BODY"
    $ git push origin HEAD:refs/heads/blog-editing

搞定！

现在，换一个工作环境，只要fetch blog-editing这个分支的内容，就可以继续我们的博客生活了。