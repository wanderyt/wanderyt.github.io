title: npm基本指令
date: 2015-07-23 15:46:35
categories:
- Nodejs
tags:
- npm
- Nodejs
---

npm的详细讲解在npm官网上的[documentation](https://docs.npmjs.com/)中已经说的很全面了，我只是想简单的提取出其中的一些比较重要的部分。

## 权限问题

    $ npm config get prefix         // 获取npm根路径
    $ ls -l                         // 查看文件权限
    $ whoami                        // 查看当前用户
    $ sudo chown your_user filename // 改变文件权限

## 项目内安装npm包

    $ npm install lodash

直接在当前路径下安装node module

    $ npm install

此方法会直接读取当前路径下的package.json文件，并根据其中的dependency，自动安装node module

    $ npm install lodash --save

自动将lodash的安装信息添加到对应的package.json文件中

    "dependencies": {
        "lodash": "^2.4.1",
        "tap": "*"                  // 自动获取最新版本
    }

## 更新项目内npm包

    $ npm outdated                  // 查看已过期的npm包版本信息
    $ npm update                    // 更新所有npm包

## 卸载项目内npm包

    $ npm ls                        // 查看所有项目内的npm包
    $ npm uninstall lodash          // 卸载lodash包，但package.json中不会删掉对应的dependency
    $ npm uninstall lodash --save   // 卸载lodash包，dependency也会删除

    $ npm prune                     // 根据dependency，删除node_module中未定义关联的npm包

## 全局安装npm包

    $ npm install jshint -g         // 安装jshint
    $ npm config get prefix

## 全局更新npm包

    $ npm outdated -g [--depth=0]   // 查看过期的全局npm包，--depth控制文件深度
    $ npm install -g

## 卸载全局npm包

    $ npm uninstall -g jshint