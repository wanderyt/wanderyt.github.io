title: Deep Clone in Javascript Object
date: 2016-05-27 14:59:23
categories:
- Javascript
tags:
- Javascript
---

Continue with the last post, issue about deep clone in Javascript object.

Here is a test code snippet for shallow clone or deep clone.

```javascript
/**
 * Test clone for array
 */
var cloneArray = function(element) {
    var result = [];
    for (var i in element) {
        result.push(element[i]);
    }
    return result;
};

var deepCloneArray = function(element) {
    var result = [];
    for (var i in element) {
        if (typeof element[i] == "object") {
            result.push(deepCloneArray(element[i]));
        } else {
            result.push(element[i]);
        }
    }
    return result;
};

/**
 * Test clone for object
 */
var cloneObject = function(element) {
    var result = {};
    for (var i in element) {
        result[i] = element[i];
    }
    return result;
};

var deepCloneObject = function(element) {
    var result = {}; // Trap 1
    for (var i in element) {
        if (typeof element[i] == "object") {
            result[i] = deepCloneObject(element[i]);
        } else {
            result[i] = element[i];
        }
    }
    return result;
};
```

For testing array code part, I am really amazed that the cloned array is independent from the original array.

Maybe there is no deep or shallow clone difference in Javascript array objects.

However, for testing object code part, the difference does exist.

#### Trap 1

In this place, a type check should be added. This version is simplified.

Among objects, there are mainly three sub types that need attention.

```javascript
typeof [1,2,3]; // object
typeof {}; // object
typeof function() {}; // function

[1,2,3] instanceof Array; // true
(function() {}) instanceof Function; // true
Function instanceof Object; // true
```

Therefore, for trap 1 case, an instanceof check should be added, to decide whether the result structure should be array or object.