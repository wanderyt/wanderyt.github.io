title: Performance research using Chrome DevTool - Phase 1
date: 2017-04-25 13:24:35
categories:
- UI Development
tags:
- Javascript
- Performance
---

最近参与了一个feature的开发，上线过程中需要经过Performance Testing的Signoff，所以顺带学了一些简单地页面性能分析。分析工具就是用的Chrome的DevTool。

平时使用的DevTool里，最常用到的几个Tab是`Elements`/`Network`。但是在这次的性能分析中，着重介绍的是`Timeline`/`Audits`。

<!--more-->

### Timeline

先上官方文档：

[How to use the timeline tool](https://developers.google.com/web/tools/chrome-devtools/evaluate-performance/timeline-tool)

#### Network中的URL分析

提一下`Network`中每个请求的开销。

![Network URL Analysis](/images/Network-URL-Analysis.png)

这里的分析列表中，每一项的含义：

* `Queueing` - 队列处理时间。两种情况下会将请求进行队列处理。其一是有更高优先级的请求；第二是TCP连接资源已经被占满。

* `Stalled` - 请求被拖延的时间。可能包含处理代理服务器的时间。

* `DNS Lookup` - 浏览器需要解析请求的IP地址。

* `Proxy Negotiation` - 浏览器需要将请求越过代理服务器。

* `Request Sent` - 请求发出。

* `ServiceWorker Preparation` - 浏览器启动service worker。

* `Request to ServiceWorker` - 请求发送到service worker。

* `Waiting (TTFB)` - 浏览器等待请求返回的第一个字节。`TTFB`全称为`Time To First Byte`。

* `Content Download` - 浏览器接收到请求响应。

