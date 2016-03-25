title: ES6 Learning - 正则表达式扩展
date: 2016-03-24 17:35:03
categories:
- UI Development
tags:
- Javascript
---

## RegExp构造函数

    new RegExp(pattern, attributes);

attributes中：

`i` - 执行对大小写不敏感的匹配
`g` - 执行全局匹配（而非在找到第一个匹配后停止）
`m` - 执行多行匹配

ES5中如果pattern是正则表达式，而不是字符串，则必须省略该参数。而在ES6中，pattern是正则表达式时，第二个参数指定的新修饰符会覆盖原有正则表达式的修饰符。

```javascript
new RegExp(/abc/ig, 'i').flags
// "i"
```

## u修饰符

因为ES6中支持了Unicode，原来的处理方式都会发生一些变化。

### 点字符

`.`表示除了换行符之外的任意单个字符。对于码点大于0xFFFF的Unicode字符，点字符不能识别，必须加上u修饰符。

```javascript
var s = '𠮷';
/^.$/.test(s) // false
/^.$/u.test(s) // true
```

### Unicode字符表示法

`\u{}`表示Unicode字符。

```javascript
/\u{61}/.test('a') // false
/\u{61}/u.test('a') // true
```

### 量词

这就是不加`\u`的区别。不加`\u`表示量词，但可以配合u修饰符查找Unicode字符。

```javascript
/𠮷{2}/.test('𠮷𠮷') // false
/𠮷{2}/u.test('𠮷𠮷') // true
```

### 预定义模式

```javascript
/^\S$/.test('𠮷') // false
/^\S$/u.test('𠮷') // true
```

__总结一句话，凡是牵涉到Unicode字符时，都需要加上u修饰符才能保证正则的正确匹配。__


## y修饰符

y修饰符表示“粘连”。一句话精简概括，__y修饰符就是要保证`^`头部匹配符通用于全局匹配。__

```javascript
var s = 'aaa_aa_a';
var r1 = /a+/g;
var r2 = /a+/y;

r1.exec(s) // ["aaa"]
r2.exec(s) // ["aaa"]

r1.exec(s) // ["aa"]
r2.exec(s) // null
```

所以在split方法中使用y修饰符，只要匹配成功，数组第一个成员一定是空字符串。

```javascript
'#x#'.split(/#/y)
// [ '', 'x#' ]

'##'.split(/#/y)
// [ '', '', '' ]
```

对应的，正则表达式对象也就多了`sticky`属性，表示是否使用了y修饰符。

`flags`属性表示当前正则表达式使用的所有的修饰符。

个人感觉这块用的似乎比较少，像公司做的项目中，正则表达式一般用在了请求url的匹配与转发中，其他地方用的不多。

不过正则这个东西还是很精妙的，尤其是断言这块很适用于一些小的精细应用中。有时间一定要看看。