title: Git Url HTTPS SSH 区别
date: 2016-04-12 17:59:35
categories:
- Git
tags:
- Git
---

继续昨天的搭环境步骤。建好一个`repository`之后，我是把项目的`ssh url`发出来给的大家，这其中遇到了一些问题。

## 他人无法clone

开发人员使用ssh的url进行clone的时候，发现会报错，然后换成https的url就可以。

网上查了下发现，使用https url克隆对初学者来说会比较方便，复制https url然后到git Bash里面直接用clone命令克隆到本地就好了，但是每次fetch和push代码都需要输入账号和密码，这也是https方式的麻烦之处。而使用SSH url克隆却需要在克隆之前先配置和添加好SSH key，因此，如果你想要使用SSH url克隆的话，你必须是这个项目的拥有者。否则你是无法添加SSH key的，另外ssh默认是每次fetch和push代码都不需要输入账号和密码，如果你想要每次都输入账号密码才能进行fetch和push也可以另外进行设置。

使用https的时候可能会遇到`unable to get local issuer certificate`错误，这时需要设置

    git config --global http.sslVerify false

[stackoverflow对应问题解答](http://stackoverflow.com/questions/23885449/unable-to-resolve-unable-to-get-local-issuer-certificate-using-git-on-windows)。

## 他人无法提交代码

这个有多种解决方案。

### 将他人的公钥加到项目的公钥中

### fork + pull request

这种方式感觉不太适合协同开发

### 设置Collaborators