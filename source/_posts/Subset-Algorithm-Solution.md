title: Subset Algorithm Solution
date: 2016-05-26 17:13:10
categories:
- Algorithm
tags:
- Algorithm
- Javascript
---

Recently I applied for the UI engineer position, and in second Skype interview, the interviewee posted an algorithm question.

    Q1:
    Given an array of integers, print all subsets of size k
    E.g. A = [1 2 4 2], printSubsets(A, 1) should output
    1
    2
    4
    printSubsets(A, 2) should output
    1 2
    1 4
    2 4
    printSubsets(A, 3) should output
    1 2 4

<!--more-->

I am not gooed at algorithm, even bad at it. So the only solution I could thought of is Recurrsion.

Yeah, that sucks. However, it really works in this question.

I just need to use recurrsion to reuse the output of subsets with fewer integers, and then combine the subsets with original array to make a Cartesion product.

During this solution thinking, I forgot several things that should be focused or paid attention to. Fortunately, these missings has been notified by the kind interviewee.

Here the solution is attached.

```javascript
var printSubsets = function(array, num) {
    var result = [];
    if (num == 1) {
        for (var i in array) {
            pushElement(result, [array[i]]); // Trap 1
        }
        return result;
    } else {
        return combineElement(array, printSubsets(array, num - 1));
    }
};

var pushElement = function(array, element) {
    var newElement = element.sort(); // [1,2], [2,1] = > [1,2] Trap 2
    var flag = false;
    for (var i in array) {
        flag = array[i].toString() == element.toString() || flag; // Trap 3
    }
    if (!flag) {
        array.push(newElement);
    }
    return array;
};

var combineElement = function(array, result) {
    var targetResult = [];
    for (var i in array) {
        for (var j in result) {
            if (result[j].indexOf(array[i]) < 0) {
                var resultClone = deepCloneArray(result[j]); // Trap 4
                resultClone.push(array[i]);
                pushElement(targetResult, resultClone);
            }
        }
    }
    return targetResult;
};

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
```

I have pointed out the four traps.

#### Trap 1

Rewrite the push method so that the new element will be checked first, and then decided whether to be pushed into the result array.

#### Trap 2

The order of new element should be considerred. [1, 2] and [2, 1] should be regarded as same element, and one of two elements should not be pushed into result array if the other has already been pushed.

#### Trap 3

When checking two arrays which contain the same elements, the method `toString` could be used.

    [1,2] == [1,2] // false
    [1,2].toString() == [1,2].toString() // true

#### Trap 4

In each loop for array elements, the result should remain same. Therefore, we need to ensure that the original result array should not be poluted.

Then what bothers me is that the two function: cloneArray and deepCloneArray. Apparently, cloneArray is just copying arrays in a shallow layer, while deepCloneArray can copy arrays with deepest layer.

However, run the below code, the output realy amazes me.

    var source = [[1], [2], [3]];
    var testClone = cloneArray(source);
    var testDeepClone = deepCloneArray(source);

    testClone; // [[1], [2], [3]]
    testDeepClone; // [[1], [2], [3]]

    source[0] = [1,2];
    testClone; // [[1], [2], [3]]
    testDeepClone; // [[1], [2], [3]]

Really not the same as what I thought it would be.

Another post is waiting for me to explore the copy issue.