title: 'CSS之margin:auto'
date: 2016-03-22 15:29:10
categories:
- UI Development
tags:
- css
---

css中常用的居中方法就是margin:auto。

首先要搞清楚一点，`auto`的含义可能有两种：__自动距离或者是0__。

## 水平居中

先举一个例子：

{% jsfiddle wanderyt/w46tr1hg/2 html,css,result light 500 300 %}

在这个例子中，`margin:auto`起到了自动居中的作用，但是__这种设置对于浮动元素和内联元素不支持，同时对于绝对定位和固定定位的元素也不支持__。

下面的这个例子是一个绝对定位的`margin:auto`的效果。

{% jsfiddle wanderyt/w46tr1hg/3 html,css,result light 500 300 %}

另外，如果`width`为0情况下，auto代表元素拥有0px的margin。不过暂时我还没想到width为0还要元素居中的例子，这不是无中生有么。

不过，看上去水平情况下还比较好用。

## 垂直居中

[W3C标准](http://www.w3.org/TR/CSS21/visudet.html#Computing_heights_and_margins)上有句话：

    "If "margin-top" or "margin-bottom" is "auto", their used value is 0"

至于具体原因，可能是因为页面的滑动功能，高度的居中需要根据页面位置大小随时计算过于复杂，所以对于`margin:auto`的元素不做自动垂直居中。

但是，W3C开了一个例外，对于绝对定位的元素，需要满足下面一个公式：

    'top' + 'margin-top' + 'border-top-width' + 'padding-top' + 'height' + 'padding-bottom' + 'border-bottom-width' + 'margin-bottom' + 'bottom' = height of containing block

因此，有两个准则：

    If all three of 'top', 'height', and 'bottom' are auto, set 'top' to the static position.
    (Tip: the term "static position" (of an element) refers, roughly, to the position an element would have had in the normal flow)

    If none of the three are 'auto': If both 'margin-top' and 'margin-bottom' are 'auto', solve the equation under the extra constraint that the two margins get equal values.

因此，我们将一个绝对定位的div放到相对定位的div中，设置top, bottom和height的值之后，垂直居中就产生了。

{% jsfiddle wanderyt/m2f7n5fj html,css,result light 500 300 %}

作为对比，我把内层的绝对定位去掉，或者将top / bottom的值设置成auto，这时候margin:auto全部失效。

{% jsfiddle wanderyt/m2f7n5fj/1 html,css,result light 500 300 %}

原文链接： [CSS – margin:auto – How it Works](http://www.hongkiat.com/blog/css-margin-auto/)