title: offset vs client vs scroll
date: 2018-02-05 14:31:59
categories:
- UI Development
tags:
- css
- Javascript
---

先上一张神图：

![offset-client-scroll](images/offset-client-scroll.jpg)

以`height`为例：

### offsetHeight

[MDN Definition](https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/offsetHeight)

```
is a measurement which includes the element borders, the element vertical padding, the element horizontal scrollbar (if present, if rendered) and the element CSS height.
```

    offsetHeight = 可看到的元素高度 + 纵向padding + 边框高度 + 横向滚动条高度

### clientHeight

[MDN Definition](https://developer.mozilla.org/en-US/docs/Web/API/Element/clientHeight)

```
returns the inner height of an element in pixels, including padding but not the horizontal scrollbar height, border, or margin
```

    clientHeight = 可看到的元素高度 + 纵向padding - 横向滚动条高度

### scrollHeight

[MDN Definition](https://developer.mozilla.org/en-US/docs/Web/API/Element/scrollHeight)

```
is a measurement of the height of an element's content including content not visible on the screen due to overflow
```

    scrollHeight = 可看到的元素高度 + 看不到的元素高度 + 纵向padding

参考文章来源：

[The properties of offsetTop, clientTop, scrollTop in the JS](http://www.programering.com/a/MTM2QTNwATA.html)
[What is offsetHeight, clientHeight, scrollHeight?](https://stackoverflow.com/questions/22675126/what-is-offsetheight-clientheight-scrollheight)
