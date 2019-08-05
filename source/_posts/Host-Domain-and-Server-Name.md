title: 'Host, Domain and Server Name'
date: 2017-04-26 09:57:36
categories:
- UI Development
---

最近看有关性能问题的分析，遇到几个名词：`Host`、`Domain`、`Server`。有点混淆不清，所以简单查了一下。

DNS(Domain Name Service)可以准确翻译某个指定的IP地址，找到对应的计算机，反之亦然。

IP地址比较难以记忆，所以Internet允许给网络中的计算机指定一个字符串定义的名称。比如IP地址为`18.72.0.3`就被指定为`bitsy.mit.edu`。整个字符串就是这台计算机的`host name`。第一部分的`bitsy`是机器名，其余的`mit.edu`是其`domain name`。

另外还有一张图能够说明`host name`和`domain name`的关系。

![Host Domain Difference](Host-Domain.png)

`Domain name`和`SubDomain name`比较好区分：

* __example.com__是一个域名；

* __tools.example.com__是`example.com`上的子域名。

来源：

[IP Addresses, Host Names, and Domain Names](https://ist.mit.edu/network/ip)

[Subdomain vs Domain](https://halfelf.org/2012/subdomain-vs-domain/)