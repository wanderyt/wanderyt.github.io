# wanderyt.github.io

Wanderyt的码农博客

此分支用于后台编辑博客文章，包括创建到部署流程

## 配置环境

### 代理（可选）

#### Git

    $ git config --add http.proxy http://proxy.sin.sap.corp:8080
    $ git config --add https.proxy http://proxy.sin.sap.corp:8080

#### npm

    $ npm config set https-proxy http://proxy.sin.sap.corp:8080
    $ npm config set proxy http://proxy.sin.sap.corp:8080

### hexo

    $ npm install -g hexo

## Clone

    $ git clone --branch blog-editing https://github.com/wanderyt/wanderyt.github.io.git

## 创建新文章

    $ hexo new "POST NAME"

## 生成新文章

    $ hexo [generate/g]

## 部署新文章

    $ hexo [deploy/d]