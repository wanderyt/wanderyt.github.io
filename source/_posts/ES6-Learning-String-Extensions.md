title: ES6 Learning - 字符串扩展
date: 2016-03-24 13:59:09
categories:
- UI Development
tags:
- Javascript
---

字符串这边似乎没有什么大的变动，新加了一些原生的函数支持，不过项目中经常会用到underscore或者lodash这样的类库，这些方法看上去更像是官方的一个补充。

## includes()

ES5中经常用indexOf判断字符串中是否包含某一字符或字符串片段。如今ES6新加了includes/startsWith/endsWith来进行辅助。

同时，还提供了第二个参数，提供开始搜索的位置。

```javascript
var s = "Hello world";
s.startsWith("world", 6); // true
s.endsWith("Hello", 5);   // true
s.includes("Hello", 1);   // false
```

<!--more-->

## padStart(), padEnd()

字符串前后补足长度函数。注意，这个是从ES7才会开始支持。目前浏览器都不会支持。

## 模板字符串

反引号（`）来标识一串字符。可以用来定义多行字符串，行分隔符和所有空格、缩进会自动保留。

```javascript
console.log(`string text line 1
    string text line 2`);
string text line 1
    string text line 2
```

同时，模板字符串中支持变量嵌入。需要将变量名写在`${}`之中。如果变量不是普通类型，会自动调用`toString`方法输出。

因此，下面这行代码会报错。

```javascript
var msg = `Hello, ${place}`; // place is not defined
```

模板使用<%...%>放置JavaScript代码，使用<%= ... %>输出JavaScript表达式。

```javascript
var template = `
<ul>
  <% for(var i=0; i < data.supplies.length; i++) {%>
    <li><%= data.supplies[i] %></li>
  <% } %>
</ul>
`;
```

是不是有种JSP的即视感。