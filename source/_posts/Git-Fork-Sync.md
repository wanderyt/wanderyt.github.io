title: Git Fork Sync
date: 2016-04-08 14:55:21
categories:
- Git
tags:
- Git
---

今天在工作中，想在`Github`上建立一个`repository`供大家协同开发，有人提出要可以进行`code review`，之前在项目中用到过`Gerrit`，但是这种小型项目感觉用`Gerrit`有点大材小用。

总之，先尝试了一下Fork的使用。

## Fork

`USERA`在`Github`上新建一个`repository`，之后`USERB`去`Fork`这个`repository`。然后`clone`到本地。

    $ git clone git@github.wdf.sap.corp:USERB/RepositoryName.git

这里用的是ssh url。

## Commit

`Clone`下来之后，`USERB`可以进行编辑，比如新建一个`err.md`文件，并填写一些内容。

    $ git add filename
    $ git commit

## Push

之后，`USERB`进行`push`操作，注意，此时`push`是到了`USERB`的`repository`。

如果想要让项目的原作者注意到，`USERB`需要发起一个`pull request`。

## Pull Request

创建一个`pull request`，`base`是远程的USERA的`repository`，`head`是`USERB`的`repository`。

填写`comment`，这时就可以等待原作者的同意并并入到原作者的项目中去了。

## Keep Synced

此时大家可能会注意到一个问题，我们如何保持我们fork出来的项目和原项目同步呢？

    $ git fetch [origin]

这条命令没有错，但是只是从`USERB`的`repository`的远程来拉代码，并不能解决同步问题。

这时我们需要设定一个新的`remote`源。

    $ git remote -v

查看当前的`remote`。

    origin  git@github.wdf.sap.corp:USERB/RepositoryName.git (fetch)
    origin  git@github.wdf.sap.corp:USERB/RepositoryName.git (push)

新加一个新的`remote`。

    $ git remote add upstream git@github.wdf.sap.corp:USERA/RepositoryName.git

此时我们看到，`remote`变成了四个。

    origin  git@github.wdf.sap.corp:USERB/RepositoryName.git (fetch)
    origin  git@github.wdf.sap.corp:USERB/RepositoryName.git (push)
    upstream  git@github.wdf.sap.corp:USERA/RepositoryName.git (fetch)
    upstream  git@github.wdf.sap.corp:USERA/RepositoryName.git (push)

之后，我们如果要保持代码同步的话，可以直接输入命令。

    $ git fetch upstream

## 文献

参考文章： [Fork and Pull](http://www.worldhello.net/gotgithub/04-work-with-others/010-fork-and-pull.html), [Fork a Repo](https://help.github.com/articles/fork-a-repo/)