title: Linux下安装Node和Git
date: 2016-04-15 15:19:18
categories:
- UI Development
tags:
- Linux
- Nodejs
- Git
---

还是最近UI Club的小项目。对于我这种linux白痴来说，需要在远程的Linux安装Node环境和Git环境，今天算是上了满满一堂课，感谢Guoliang老师的耐心帮忙。

首先还是要安装一些最基本的应用。

ssh远程命令行操作的神器：[xterm](http://mobaxterm.mobatek.net/)。

操作文件系统的应用：[winscp](http://winscp.net/eng/index.php)。

## 安装nodejs

首先去Node官网下载Linux版本的安装文件，下载下来是一个`tar.xz`文件。这种文件就是Linux下面的压缩包后缀。

使用`winscp`将安装包拖拽到远程目录中，我放到的是`/root/Downloads`下。之后使用解压缩命令。

    $ tar xvfJ [node-install-file.tar.xz] -C [/tmp/node]

命令的含义是将压缩包解压缩到`/tmp/node`文件夹下。

之后将node文件夹移动到用户的目录下。

    $ sudo su -c "chown -R root:root /tmp/node*"
    $ sudo mv /tmp/node* /usr/local/node

这里可以任意指定node的安装目录，我是放到了`/usr/local/node`下。

## 设置node环境变量

这时访问node命令发现不会识别，主要是因为环境命令还没有设置。

设置环境命令有多个地方。

> 可以在顶级目录下的`/etc/bash.bashrc`文件中追加`PATH`的定义。这种方式会使所有的用户都获得这种命令的执行权。

> 在当前用户下的`.bashrc`文件中追加`PATH`的定义。这种方式只会让当前用户获得这种命令的执行权。我选择的是这一种方法。

首先查看当前环境变量的定义。

    $ cd /root
    $ cat .bashrc

可以看到里面的定义。此时利用vim编辑器编辑文件，追加`PATH`的定义。

    $ vi .bashrc

进入编辑器模式，填写内容：

    export PATH="$PATH:[node-directory]/bin"

这里将node的安装目录下的`bin`文件夹设置进来。加两个vim的命令。

__注意，其一，Linux的环境变量是通过冒号分隔的；其二，安装目录路径一定要是绝对路径。__

    ESC： 从编辑模式切换到命令模式
    a： 当前光标位置追加文本
    wq： 保存文件并退出

保存时可能会遇到`readonly option is set`的错误。这时输入命令

    :set noreadonly

之后再输入`wq`就可以保存退出了。

这时重新开一个`session`，就能使用`node`命令和`npm`命令了。

补充一点，`cd ~`会直接进入当前用户的文件夹目录。所以`cnpvg50830120:/`和`cnpvg50830120:~`的区别就在于，前者是绝对路径，是顶级目录，后者是当前用户所在的文件夹目录。

## 安装Git

首先查看当前Linux的版本信息再决定用哪个安装。

    $ cat /etc/SuSE-release

我的那个server是SUSE Linux Enterprise 11 SP3，所以用`zypper`命令安装`Git`。

    $ zypper search git // 搜索当前REPOSITORY的安装列表里是否有git安装文件
    $ zypper install git

REPOSITORY是负责定义安装那些工具的来源。这些来源可以通过命令来看。

    $ zypper lr // 列出所有的源
    $ zypper ar [options] <URI> <alias> // 添加源

定义源其实就是定义一些安装时下载的来源，所以使用`zypper install [name]`时需要联网。

    $ curl www.baidu.com // 检查是否能联网访问baidu.com

其他的一些命令。

    $ zypper mr // 删除源
    $ zypper rr // 导入导出源

安装好之后，就可以使用`Git`了。

## 创建项目

在服务器上新建一个项目目录，用于clone项目代码。

    $ mkdir [WORKSPACE_PATH/PROJECT_NAME]
    $ git clone [GIT_URL] [PROJECT_PATH]

这时可能会报错，说`Could not read from remote repository`。

这个错有可能是因为当前机器上的ssh key没设定或者没有添加到Github账号中做关联。

    $ ssh-keygen -t rsa -C "USER_NAME" // 注意。USER_NAME为Github用户名

之后可能会问`.ssh`要生成到哪个文件夹下，我全部使用默认。

生成`ssh key`之后，将`id_rsa.pub`文件内容添加到`Github`账号中。之后就可以正常的clone git repository。

每次更新代码时，执行git命令。

    $ cd [PROJECT_PATH]
    $ git fetch origin
    $ git rebase [BRANCH_NAME]