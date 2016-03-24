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

