title: 从单例模式看Javascript的闭包
date: 2015-08-07 10:28:13
categories:
- Javascript
tags:
- Javascript
- Closure
---
## Singleton - 单例模式

偶然间看到一篇讲解Javascript的单例模式的文章。
作为众多设计模式中的入门级模式，想必大家已经对单例模式已经烂熟于心了，可能也是众多程序猿面试时候的脱口而出的设计模式。

虽然不是本篇的重点，还是先回顾一下单例模式的各个样式吧。

    var Singleton = function(name) {
        this.name = name;
        this.instance = null;
    }

    Singleton.prototype.getName = function() {
        return this.name;
    }

    Singleton.getInstance = function(name) {
        if (!this.instance) {
            this.instance = new Singleton(name)
        }
        return this.instance;
    }

    // Have a test
    var a = Singleton.getInstance("a");
    var b = Singleton.getInstance("b");

这种是最常见的单例模式代码。

另外一种是这篇文章中提到的代理模式。

    var CreateSomething = function(name) {
        this.name = name;
        this.init();
    };

    CreateSomething.prototype.init = function() {
        // Do something
    };

    var ProxyCreateSingleton = (function() {
        var instance = null;
        return function(name) {
            if (!instance) {
                instance = new CreateSomething(name);
            }
            return instance;
        }
    })();

    // Have a test
    var a = new ProxyCreateSingleton("a");
    var b = new ProxyCreateSingleton("b");

看到这里，不禁联想到最近做的项目中用到的这种写法：

    var someFunction = (function() {
        var instance = null;
        return function() {
            // Do something with instance
            return instance;
        }
    })();

    // Some place else in global space
    var oInstance = someFunction();

现在才发现这是单例模式的应用。

__原理呢？__

怪自己学艺不精了，只知道闭包（Closure）的用法，却没有真正理解闭包在垃圾回收方面的作用。

someFunction函数，返回值是另一个匿名函数。此时，将返回的这个匿名函数赋给一个全局变量，因此匿名函数就无法被回收。

重点来了，这个匿名函数其实是依靠__其外部的父函数SomeFunction__而存在的，因此，someFunction也无法被回收，其局部变量instance也会一直存活在内存中，这样，每次访问oInstance对象时，指向的都是内存中的那个局部变量instance。

单例就是这样产生的。

推广一下单例的构建方法，使用call / apply。

    var CreateSomething() {
        // Do something
        return oInstance;
    };

    var getSingleton = function(fn) {
        var result;
        return function() {
            return result || (result = fn.apply(this, arguments);
        }
    };

    var createSingleSomething = getSingleton(CreateSomething);

    var something = createSingleSomething(arguments);

## new关键字原理

附带讲一下new的原理吧。

    var a = new A();

1. 创建一个新的object，命名为a；
2. 将A.prototype赋给a.__proto__；
3. 调用A.call(a)，这时A中的this.name = "David"就被赋值过去到a中，成为a.name = "David"；
4. 返回a。

{% codeblock %}
var a = new Object();
a.__proto__ = A.prototype 
var result = A.apply(a, arguments)
if (typeof(result) == "object"){
    return result; // 如果有返回值，那么直接返回函数的返回值，此时new可以认为没有起到效果
}
return a;
{% endcodeblock %}

