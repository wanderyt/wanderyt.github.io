title: 11段有用的Javascript代码
date: 2015-07-23 17:23:30
categories:
- UI Development
tags:
- Javascript
- HTML
---

来源：[11 JavaScript Code Snippets for Dynamic Web Projects](https://webdesignledger.com/tips/javascript-code-snippets?utm_source=WDL&utm_campaign=88ea4ee87a-WEB_DESIGN_LEDGER_WEEKLY_RSS_EMAIL_CAMPAIGN&utm_medium=email&utm_term=0_5aaadaf60b-88ea4ee87a-82483213)

11段在Web开发中有用的代码。

### 开一个新的窗口

    window.open("http://webdesignledger.com","newWindow");

### 探测浏览器的关闭

一般用户在点击浏览器右上方的关闭按钮时，你可能希望提示用户一些信息。当然，一些比较讨厌的网站会使用这项功能来满足他们的市场需求，比如弹出一个广告或者警告框来保证用户能在他们的页面上多停留片刻。

    function checkBrowser() {
        // triggers on clicking the close button, Alt+F4 , File->Close  
        if(window.event.clientX < 0 && window.event.clientY < 0) {
            window.open("somefile.html", "closewindow",'left=12000,top=1200,width=120,height=50');
        }
    }

__这样确实不值得推荐。__

不过，更多的时候你可以很好的利用这个功能。比如，可以在用户关闭浏览器之前清理用户的Cookies会话信息。这是处于你自己网站的安全考虑，阻止其他人使用不同人的账户来错误的获取网站数据。

<!-- more -->

### 获取下拉列表的值

    <select id="menulist">
        <option value="1">test1</option>
        <option value="2" selected="selected">test2</option>
        <option value="3">test3</option>
    </select>
    
    <script>
        var e = document.getElementById("menulist");
        var optvalue = e.options[e.selectedIndex].value; // the option value attribute
        var opttext  = e.options[e.selectedIndex].text; // internal text inside option element
    </script>

### 探测浏览器类型

    // Internet Explorer
    var ie  = document.all != null;  //ie4 and above
    var ie5 = document.getElementById && document.all;
    var ie6 = document.getElementById && document.all && (navigator.appVersion.indexOf("MSIE 6.")>=0);
    
    // Netscape
    var ns4 = document.layers != null;
    var ns6 = document.getElementById && !document.all;
    var ns  = ns4 || ns6;
    
    // Firefox
    var ff  = !document.layers && !document.all;
    
    // Opera
    var op  = navigator.userAgent.indexOf("opera")>0;
    var op7 = op && operaVersion() <= 7;
    var op8 = op && operaVersion() >= 8;
    
    // Detects the Opera version
    function operaVersion() {
        agent = navigator.userAgent;
        idx = agent.indexOf("opera"); 
        if (idx>-1) {
            return parseInt(agent.subString(idx+6,idx+7));
        }
    }

### 利用Javascript管理Cookie

    function setCookie(name, value) {
        if(name != '')
            document.cookie = name + '=' + value;
    }

    function getCookie(name) {
        if(name == '')
            return('');

        name_index = document.cookie.indexOf(name + '=');

        if(name_index == -1)
            return('');

        cookie_value =  document.cookie.substr(name_index + name.length + 1, document.cookie.length);

        //All cookie name-value pairs end with a semi-colon, except the last one.
        end_of_cookie = cookie_value.indexOf(';');
        if(end_of_cookie != -1)
            cookie_value = cookie_value.substr(0, end_of_cookie);

        //Restores all the blank spaces.
        space = cookie_value.indexOf('+');
        while(space != -1) { 
            cookie_value = cookie_value.substr(0, space) + ' ' + 
            cookie_value.substr(space + 1, cookie_value.length);

            space = cookie_value.indexOf('+');
        }

        return(cookie_value);
    }

以上两个setter/getter方法用于管理cookie。

* * *

顺带提一下Cookie的优缺点，这个是面试前端的必考内容。

#### Cookie的弊端

`cookie`虽然在持久保存客户端数据提供了方便，分担了服务器存储的负担，但还是有很多局限性的。

第一：每个特定的域名下最多生成20个`cookie`

    1.IE6或更低版本最多20个cookie
    2.IE7和之后的版本最后可以有50个cookie。
    3.Firefox最多50个cookie
    4.chrome和Safari没有做硬性限制

`IE`和`Opera`会清理近期最少使用的`cookie`，`Firefox`会随机清理`cookie`。

`cookie`的最大大约为`4096`字节，为了兼容性，一般不能超过`4095`字节。

IE 提供了一种存储可以持久化用户数据，叫做`userData`，从`IE5.0`就开始支持。每个数据最多`128K`，每个域名下最多`1M`。这个持久化数据放在缓存中，如果缓存没有清理，那么会一直存在。

#### 优点：极高的扩展性和可用性

    1.通过良好的编程，控制保存在cookie中的session对象的大小。
    2.通过加密和安全传输技术（SSL），减少cookie被破解的可能性。
    3.只在cookie中存放不敏感数据，即使被盗也不会有重大损失。
    4.控制cookie的生命期，使之不会永远有效。偷盗者很可能拿到一个过期的cookie。

#### 缺点

    1.`Cookie`数量和长度的限制。每个domain最多只能有20条cookie，每个cookie长度不能超过4KB，否则会被截掉。
    2.安全性问题。如果cookie被人拦截了，那人就可以取得所有的session信息。即使加密也与事无补，因为拦截者并不需要知道cookie的意义，他只要原样转发cookie就可以达到目的了。
    3.有些状态不可能保存在客户端。例如，为了防止重复提交表单，我们需要在服务器端保存一个计数器。如果我们把这个计数器保存在客户端，那么它起不到任何作用。

#### 浏览器本地存储

在较高版本的浏览器中，`js`提供了`sessionStorage`和`globalStorage`。在HTML5中提供了`localStorage`来取代`globalStorage`。

`html5`中的`Web Storage`包括了两种存储方式：`sessionStorage`和`localStorage`。

`sessionStorage`用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁。因此`sessionStorage`不是一种持久化的本地存储，仅仅是会话级别的存储。

而`localStorage`用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。

#### web storage和cookie的区别

`Web Storage`的概念和`cookie`相似，区别是它是为了更大容量存储设计的。`Cookie`的大小是受限的，并且每次你请求一个新的页面的时候`Cookie`都会被发送过去，这样无形中浪费了带宽，另外`cookie`还需要指定作用域，不可以跨域调用。

除此之外，`Web Storage`拥有`setItem`,`getItem`,`removeItem`,`clear`等方法，不像`cookie`需要前端开发者自己封装`setCookie`，`getCookie`。

但是`Cookie`也是不可以或缺的：`Cookie`的作用是与服务器进行交互，作为`HTTP`规范的一部分而存在 ，而`Web Storage`仅仅是为了在本地“存储”数据而生

浏览器的支持除了`IE７`及以下不支持外，其他标准浏览器都完全支持(ie及FF需在web服务器里运行)，值得一提的是IE总是办好事，例如IE7、IE6中的`UserData`其实就是javascript本地存储的解决方案。通过简单的代码封装可以统一到所有的浏览器都支持`web storage`。

`localStorage`和`sessionStorage`都具有相同的操作方法，例如`setItem`、`getItem`和`removeItem`等。

* * *

### 探测操作系统类型

JS可以通过navigator属性获取机器的一些详细信息。开发人员可以通过获取这些操作系统的信息来针对Mac或者Windows用户设计不同样式的控件，比如按钮。个人感觉这个用途不是很大，可能还没有做到这么详细的设计案例吧。处女座的最爱？

    var system = navigator.appVersion;
    if (navigator.appVersion.indexOf("Mac") != -1 ) OS = "Mac";
    else if (navigator.appVersion.indexOf("PowerPC") != -1 ) OS = "Mac";
    else if (navigator.appVersion.indexOf("Win") != -1 ) OS = "Win";
    else if (navigator.appVersion.indexOf("SunOS") != -1 ) OS = "Solaris";
    else  OS = "Linux";

    //Determine Browser Version
    bName = navigator.appName;
    bVer  = parseInt(navigator.appVersion);

    if (OS == "Mac" && bName=="Netscape") { 
        // your code here
    }
    else if (OS =="Mac" && bName=="Microsoft Internet Explorer") { 
        // your code here
    }
    else if (OS =="Win" || OS == "Linux" && bName == "Netscape") {
        // your code here
    }
    else if (OS =="Solaris" && bName=="Netscape") {
        // your code here
    }
    else if (OS =="Win" || OS == "Linux" && bName=="Microsoft Internet Explorer") {
        // your code here
    }

更深入一点，StackOverflow上有人讨论过关于[如何解析不同版本的windows](http://stackoverflow.com/questions/8774560/jquery-detecting-the-operating-system-and-operating-system-version)（过于专业了，看不出有什么设计思路）

废话少说，这里只列出答案吧，具体的大家点到链接里细看。

    var os = (function() {
        var ua = navigator.userAgent.toLowerCase();
        return {
            isWin2K: /windows nt 5.0/.test(ua),
            isXP: /windows nt 5.1/.test(ua),
            isVista: /windows nt 6.0/.test(ua),
            isWin7: /windows nt 6.1/.test(ua),
            isWin8: /windows nt 6.2/.test(ua),
            isWin81: /windows nt 6.3/.test(ua)
        };
    }());
    
    if(os.isWin7) {
        ...
    }

### 探测移动端设备类型

更深入的来了！不过感觉这个更实用一点吧，毕竟现在移动端热度太高了，而且不同设备的主题风格都不一样，大小样式也不一样，可展现的元素就有了分别。套用原作者的话，除了考虑响应式设计以外，不同的公司，比如twitter/facebook更有他们自己的移动设计风格考虑。

    var isMobile = {
        Android: function() {
            return navigator.userAgent.match(/Android/i);
        },
        BlackBerry: function() {
            return navigator.userAgent.match(/BlackBerry/i);
        },
        iOS: function() {
            return navigator.userAgent.match(/iPhone|iPad|iPod/i);
        },
        Opera: function() {
            return navigator.userAgent.match(/Opera Mini/i);
        },
        Windows: function() {
            return navigator.userAgent.match(/IEMobile/i);
        },
        any: function() {
            return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
        }
    };
    
    // Examples
    if( isMobile.any() ) alert('Mobile');
    if( isMobile.iOS() ) alert('iOS Device');

开发人员可以根据设备的不同特点更改布局风格以及展现元素的内容。

### 浏览器窗口的各类尺寸

说到移动端以及响应式设计，浏览器窗口的各类尺寸迟早是用得到的。

    function report() { 
        document.getElementsByTagName('output')[0].innerHTML = 
            'screen.width:'+screen.width+
            '<br>screen.height:'+screen.height+
            '<br>window.innerWidth:'+window.innerWidth+
            '<br>window.innerHeight:'+window.innerHeight+
            '<br>window.outerWidth:'+window.outerWidth+
            '<br>window.outerHeight:'+window.outerHeight+
            '<br>document.documentElement.<br> clientWidth:'+document.documentElement.clientWidth+
            '<br>document.documentElement.<br> clientHeight:'+document.documentElement.clientHeight+
            '<br>window.devicePixelRatio:'+window.devicePixelRatio; 
    }
    window.addEventListener('load', report, false);
    window.addEventListener('resize', report, false);
    window.addEventListener('orientationchange', report, false);
    window.addEventListener('deviceorientation', report, false);
    window.addEventListener('MozOrientation', report, false);

### 获取URL参数

    function getUrlParam(name) {
        var results = new RegExp('[\\?&]' + name + '=([^&#]*)').exec(window.location.href);
        return (results && results[1]) || undefined;
    }

### Javascript的回退按钮

    <a href="javascript:history.back(1)">Previous Page</a>

### JS对象的类型检查

    function objIs(type, obj) {
        var clas = Object.prototype.toString.call(obj).slice(8, -1);
        return obj !== undefined && obj !== null && clas === type;
    }
    
    objIs('String', 'test'); // true
    objIs('String', new String('test')); // true










