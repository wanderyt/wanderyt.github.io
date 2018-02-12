title: Fetch vs Axios
date: 2018-02-12 09:43:22
categories:
- UI Development
tags:
- Nodejs
- ES6
- React
---

写React项目与后端进行交互的时候，之前一直是在使用fetch方法，然而fetch方法有几个缺点需要注意。
同时对比一下最近很火的`axios.js`，发现可以考虑开始使用新的类库了。

### Fetch data

#### fetch

调用fetch api拿到response之后，通常我们需要两步来解析response中的数据。

```javascript
const url = 'some_api_url';
fetch(url).then(data => console.log(data));
```

response中的数据有status，还有body。但会发现body的数据类型是一个`ReadableStream`而不是一个正常的json或者string。我们需要用`response.json()`来进行转换。注意这个方法是返回一个promise对象，所以要继续调用`then`来解析。

```javascript
const url = 'some_api_url';
fetch(url).then(response => response.json()).then(data => console.log(data));
```

这时的data就是我们需要的json或者string数据。

#### axios

    $ npm install --save axios

```javascript
// React - ES6
import axios from 'axios'
// Nodejs
const axios = require('axios')
// HTML
const lib_url = 'https://cdnjs.cloudflare.com/ajax/libs/axios/0.15.3/axios.min.js'
```

使用时和fetch类似。

```javascript
axios.get(url).then(response => console.log(response));
```

可以看到response的数据结构和jquery接口很像，包含了status和data。status是请求返回的状态码，data就是response的数据主体。跟fetch对比起来要少一步promise解析。

### Error Handling

#### fetch

遇到错误处理，通常是使用catch方法来进行捕捉，但是使用fetch时，这种方法会失效。

```javascript
const url = 'wrong_api_url';
fetch(url)
    .catch(error => console.log('BAD', error))
    .then(response => console.log('GOOD', response));
```

使用一个错误的api url，但是看结果会发现还是进入了then的回调函数中。只是状态码变成了400。

#### axios

使用axios时，catch中的回调函数就会被调用到。

```javascript
const url = 'wrong_api_url';
axios(url)
    .catch(error => console.log('BAD', error))
    .then(response => console.log('GOOD', response));
```

打出的error log是：

    BAD ERROR: Request failed with status code 400

可以看出在这两方面中，axios确实是比fetch好用很多。

参考来源：

[Fetch vs. Axios.js for making http requests](https://medium.com/@thejasonfile/fetch-vs-axios-js-for-making-http-requests-2b261cdd3af5)