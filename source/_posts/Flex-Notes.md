title: Flex Notes
date: 2017-08-02 13:34:15
categories:
- UI Development
tags:
- css
---

Recently I have learned some basic rules about `flex` layout based on this post [A complete guide to Flexbox](https://css-tricks.com/snippets/css/a-guide-to-flexbox/).

### Introduction

Right beginning: `display: flex` only affects the items inside the container, but of course for the container, it is a `block` element. So the container will possess one line of the page.

Also, it is a 1-dimensional layout, mainly focuses on line layout. Really friendly to responsive design.

For comparison, there is another layout style named `grid`. It is covered by another post [A complete guide to Grid](https://css-tricks.com/snippets/css/complete-guide-grid/). Will discuss that in future posts.

### Main Properties

#### display | container

```css
.container {
    display: flex; // another value: inline-flex;
}
```

`inline-flex` will only affect the container to be an `inline` element. The items inside the container are placed as `inline` elements no matter it is `flex` or `inline-flex`.

#### flex-direction | container

```css
.container {
    flex-direction: row | row-reverse | column | column-reverse;
}
```

#### flex-order | item

```css
.item {
    flex-order: 1; // any other integer
}
```

Place items in the sequence of `flex-order`.

#### flex-grow | item

```css
.item {
    flex-grow: 1; // any positive number or by default 0
}
```

**If all items `flex-grow` is 0, no extra space will be distributed to all items.**

{% codepen wanderyt YxWOdO twilight result 500 1000 %}

#### flex-wrap | container

```css
.item {
    flex-wrap: nowrap | wrap | wrap-reverse;
}
```

`nowrap` will put all items in one line.

{% codepen wanderyt YxWOdO twilight result 500 1000 %}

#### flex-shrink | item

```css
.item {
    flex-shrink: 1; // any integer
}
```

{% codepen wanderyt vJKvyd twilight result 500 1000 %}

#### flex-flow | container

Combination for `flex-direction` and `flex-wrap`.

```css
.container {
    flex-flow: 'flex-direction' || 'flex-wrap'; // default 'row nowrap'
}
```

#### flex-basis | item

```css
.item {
    flex-basis: <length> | auto; /* default auto */
}
```

`length` would be a real valid number like `80px`.
If it is a valid length value, it means the item should use this as its width.
If it is `0`, *the extra space around content in an item* is not counted in when distributing the rest space in line of flex container.
If it is `auto`, *the extra space around content in an item* is distributed based on its `flex-grow` value.

See [this picture](https://www.w3.org/TR/css-flexbox-1/images/rel-vs-abs-flex.svg) to figure out its usage.

#### justify-content | container

```css
.container {
  justify-content: flex-start | flex-end | center | space-between | space-around | space-evenly;
}
```

{% codepen wanderyt rzLPjp twilight result 500 1000 %}

#### flex | item

Combination for `flex-grow`, `flex-shrink` and `flex-basis`.

```css
.item {
  flex: none | [ <'flex-grow'> <'flex-shrink'>? || <'flex-basis'> ]
}
```

`flex-shrink` and `flex-basis` are optional. By default, `0 1 auto`.

### Incompatible Setting

Note that `float`, `clear` and `vertical-align` is not working under `flex` layout.