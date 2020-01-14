title: Tips in code war
date: 2019-10-23 10:54:59
categories:
- Javascript
tags:
- Javascript
---

This post is to record some fantastic solution for some problems.

## Credit Card Mask

Source: [Credit Card Mask](https://www.codewars.com/kata/5412509bd436bd33920011bc/solutions/javascript)

There is a trick in Regular Expression: (?=) to ensure the following string pattern.

```javascript
function maskify(cc) {
  return cc.replace(/.(?=....)/g, '#'); // or /.(?=.{4})/g
}
```

## Dependency Injection

Source: [Dependency Injection](https://www.codewars.com/kata/dependency-injection/javascript)

Trick: regular expression for function toString to match out all parameters.

```javascript
let regex = /^[^(]+\(([^)]+)/;
```

