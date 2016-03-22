title: Git Standard Flow
date: 2015-08-14 10:52:18
categories:
- Git
tags:
- Git
---

ThoughtBot的Git使用规范流程。

![Git Flow](/images/Git Flow.png)

## 新建分支

    # 获取主干最新代码
    $ git checkout master
    $ git pull

    # 新建一个开发分支myfeature
    $ git checkout -b myfeature

## 提交分支commit

    $ git add --all
    $ git status
    $ git commit [--verbose]

git commit 命令的verbose参数，会列出 diff 的结果。

## 撰写提交信息

提交信息的范本：

    Present-tense summary under 50 characters

    * More information about commit (under 72 characters).
    * More information about commit (under 72 characters).

    http://project.management-system.com/ticket/123

## 与主干同步

    $ git fetch origin
    $ git rebase origin/master

## 合并commit

    $ git rebase origin/master

此时如果还有未commit的代码，需要先stash，之后完成rebase，再stash pop。

## 推送到远程仓库

    $ git push --force origin myfeature

git push命令要加上force参数，因为rebase以后，分支历史改变了，跟远程分支不一定兼容，有可能要强行推送

## 发出Pull Request