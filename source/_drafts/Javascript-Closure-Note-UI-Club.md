title: Javascript Closure Note - UI Club
date: 2016-03-24 13:53:50
categories:
- UI Development
tags:
- Javascript
---

```javascript
function Foo(){
  var i=0;
  return function(){
    document.write(i++);
  }
}
var f1=Foo(),
f2=Foo();
f1(); 
f1();
f2();
```

[问题链接](https://segmentfault.com/q/1010000004620693?utm_source=weekly&utm_medium=email&utm_campaign=email_weekly)