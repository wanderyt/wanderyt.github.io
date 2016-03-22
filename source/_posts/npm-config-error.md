title: npm config error
date: 2016-03-07 17:58:41
categories:
- UI Development
- npm
tags:
- npm
---

When installing libraries through npm commands, an error occurs with much possibility.

Seems that it is caused by proxy.

![npm install error](/images/npm-config-error.png)

Basically, there are two ways to solve the problem.

## According to stackoverflow

    $ npm install <module> --registry http://165.225.128.50:8000

Tested, not work though.

## Set the registry explicitly

    $ npm config set registry http://registry.npmjs.org
    $ npm install -g <module>

Tested, work.

