title: Angular Route Analysis
date: 2015-07-21 15:10:53
categories:
- AngularJS
tags:
- AngularJS
- Javascript
---

之前去面试前端工程师的时候，提到AngularJS总会被问到一个问题，AngularJS的路由的实现原理是什么。

自己的理解一直不是很深，看过的技术帖子也没有讲的比较深入的，今天总算看到一篇细致的讲解。分享一下。

转自： [Angular路由深入浅出](http://div.io/topic/1096)

## Angular路由

> 路由(`route`)，几乎所有的MVC(VM)框架都应该具有的特性，因为它是前端构建单页面应用(SPA)必不可少的组成部分。

## 0.1 ngRoute vs ui.router

首先，无论是使用哪种路由，作为框架额外的附加功能，它们都将以`模块依赖`的形式被引入，简而言之就是：在引入路由源文件之后，你的代码应该这样写(以`ui.router`为例)：

    angular.module("myApp", ["ui.router"]); // myApp为自定义模块，依赖第三方路由模块ui.router

这样做的目的是：__在程序启动(bootstrap)的时候，加载依赖模块(如：ui.router)，将所有`挂载`在该模块的`服务(provider)`，`指令(directive)`，`过滤器(filter)`等都进行注册__，那么在后面的程序中便可以调用了。

说到这里，就得看看`ngRoute`模块和`ui.router`模块各自都提供了哪些服务，哪些指令？

1. ngRoute
1. $routeProvider(服务提供者) --------- 对应于下面的urlRouterProvider和stateProvider
1. $route(服务) --------- 对应于下面的urlRouter和state
1. $routeParams(服务) --------- 对应于下面的stateParams
1. ng-view(指令) --------- 对应于下面的ui-view
1. ui.router
1. $urlRouterProvider(服务提供者) --------- 用来配置路由重定向
1. $urlRouter(服务)
1. $stateProvider(服务提供者) --------- 用来配置路由
1. $state(服务) --------- 用来显示当前路由状态信息，以及一些路由方法（如：跳转）
1. $stateParams(服务) --------- 用来存储路由匹配时的参数
1. ui-view(指令) --------- 路由模板渲染，对应的dom相关联
1. ui-sref(指令)
1. ...

(注：服务提供者：用来提供服务实例和配置服务。)

这样一看，其实`ui.router`和`ngRoute`大体的设计思路，对应的模块划分都是一致的(毕竟是同一个团队开发)，不同的地方在于功能点的实现和增强。

***

那么问题来了：ngRoute弱在哪些方面，ui.router怎么弥补了这些方面?

这里，列举两个最重要的方面来说(其他细节，后面再说)：

1. 多视图
1. 嵌套视图

***

### 多视图

> 多视图：页面可以显示多个动态变化的不同区块。

这样的业务场景是有的：

比如：页面一个区块用来显示页面状态，另一个区块用来显示页面主内容，当路由切换时，页面状态跟着变化，对应的页面主内容也跟着变化。

首先，我们尝试着用`ngRoute`来做：

html

    <div ng-view>区块1</div>
    <div ng-view>区块2</div>

js

    $routeProvider
        .when('/', {
        template: 'hello world'
    );

我们在html中利用ng-view指令定义了两个区块，于是两个div中显示了相同的内容，这很合乎情理，但却不是我们想要的，但是又不能为力，因为，在ngRoute中：

1. 视图没有名字进行唯一标志，所以它们被同等的处理。
1. 路由配置只有一个模板，无法配置多个。

ok，针对上述两个问题，我们尝试用`ui.router`来做：

html

    <div ui-view></div>
    <div ui-view="status"></div>

js

    $stateProvider
        .state('home', {
            url: '/',
            views: {
                '': {
                    template: 'hello world'
                },
                'status': {
                    template: 'home page'
                }
            }
        });

这次，结果是我们想要的，两个区块，分别显示了不同的内容，原因在于，在ui.router中：

1. 可以给视图命名，如：ui-view="status"。
1. 可以在路由配置中根据视图名字(如：status)，配置不同的模板（其实还有controller等）。

注：视图名是一个字符串，不可以包含`@`（原因后面会说）。

***

### 嵌套视图

> 嵌套视图：页面某个动态变化区块中，嵌套着另一个可以动态变化的区块。

这样的业务场景也是有的：

比如：页面一个主区块显示主内容，主内容中的部分内容要求根据路由变化而变化，这时就需要另一个动态变化的区块嵌套在主区块中。

其实，嵌套视图，在html中的最终表现就像这样：

    <div ng-view>
        I am parent
        <div ng-view>I am child</div>
    </div>

转成javascript，我们会在程序里这样写：

    $routeProvider
        .when('/', {
        template: 'I am parent <div ng-view>I am child</div>'
    });

倘若，你真的用ngRoute这样写，你会发现浏览器崩溃了，因为在ng-view指令link的过程中，代码会无限递归下去。

那么造成这种现象的最根本原因：__路由没有明确的父子层级关系！__

看看`ui.router`是如何解决这一问题的？

    $stateProvider
        .state('parent', {
            abstract: true,
            url: '/',
            template: 'I am parent <div ui-view></div>'
        })
        .state('parent.child', {
            url: '',
            template: 'I am child'
        });

1. 巧妙地，通过`parent`与`parent.child`来确定路由的`父子关系`，从而解决无限递归问题。
1. 另外子路由的模板最终也将被插入到父路由模板的div[ui-view]中去，从而达到视图嵌套的效果。

***

## ui.router工作原理

> 路由，大致可以理解为：一个查找匹配的过程。

对于前端`MVC(VM)`而言，就是将`hash值`(#xxx)与一系列的`路由规则`进行查找匹配，匹配出一个符合条件的规则，然后根据这个规则，进行数据的获取，以及页面的渲染。

所以，接下来：

+ 第一步，学会如何创建路由规则？
+ 第二步，了解路由查找匹配原理？

***

### 路由的创建

首先，看一个简单的例子：

    $stateProvider
        .state('home', {
            url: '/abc',
            template: 'hello world'
        });

上面，我们通过调用`$stateProvider.state(...)`方法，创建了一个简单路由规则，通过参数，可以容易理解到：

1. 规则名：'home'
1. 匹配的url：'/abc'
1. 对应的模板：'hello world'

意思就是说：当我们访问`http://xxxx#/abc`的时候，这个路由规则被匹配到，对应的模板会被填到某个`div[ui-view]`中。

看上去似乎很简单，那是因为我们还没有深究具体的一些路由配置参数（我们后面再说）。

这里需要深入的是：`$stateProvider.state(...)`方法，它做了些什么工作？

1. 首先，创建并存储一个state对象，里面包含着该路由规则的所有配置信息。
1. 然后，调用`$urlRouterProvider.when(...)`方法，进行路由的`注册`(之前是路由的创建)，代码里是这样写的：

    $urlRouterProvider.when(state.url, ['$match', '$stateParams', function ($match, $stateParams) {
        // 判断是否是同一个state || 当前匹配参数是否相同
        if ($state.$current.navigable != state || !equalForKeys($match, $stateParams)) {
            $state.transitionTo(state, $match, { inherit: true, location: false });
        }
    }]);

上述代码的意思是：当`hash值`与`state.url`相匹配时，就执行后面那段回调，回调函数里面进行了两个条件判断之后，决定是否需要跳转到该state？

***

这里就插入了一个话题：为什么说 “跳转到该state，而不是该url”？

其实这个问题跟大家一直说的：__“ui.router是基于state(状态)的，而不是url”__是同一个问题。

我的理解是这样的：之前就说过，路由存在着明确的`父子关系`，每一个路由可以理解为一个state，

1. 当程序匹配到某一个子路由时，我们就认为这个子路由state被激活，同时，它对应的父路由state也将被激活。
1. 我们还可以手动的激活某一个state，就像上面写的那样，`$state.transitionTo(state, ...)`;，这样的话，它的父state会被激活（如果还没有激活的话），它的子state会被销毁（如果已经激活的话）。

***

ok，回到之前的路由注册，调用了`$urlRouterProvider.when(...)`方法，它做了什么呢？

它创建了一个rule，并存储在rules集合里面，之后的，每次hash值变化，路由重新查找匹配都是通过遍历这个`rules`集合进行的。

***

### 路由的查找匹配

有了之前，路由的创建和注册，接下来，自然会想到路由是如何查找匹配的？

恐怕，这得从页面加载完毕说起：

1. angular 在刚开始的$digest时，`$rootScope`会触发`$locationChangeSuccess`事件（angular在每次浏览器hash change的时候也会触发`$locationChangeSuccess`事件）
1. ui.router 监听了`$locationChangeSuccess`事件，于是开始通过遍历一系列rules，进行路由查找匹配
1. 当匹配到路由后，就通过`$state.transitionTo(state,...)`，跳转激活对应的state
1. 最后，完成数据请求和模板的渲染

可以从下面这段源代码看到，看到查找匹配的起始和过程：

    function update(evt) {
        // ...省略
        function check(rule) {
            var handled = rule($injector, $location);
            // handled可以是返回：
            // 1. 新的的url，用于重定向
            // 2. false，不匹配
            // 3. true，匹配
            if (!handled) return false;

            if (isString(handled)) $location.replace().url(handled);
            return true;
        }

        var n = rules.length, i;

        // 渲染遍历rules，匹配到路由，就停止循环
        for (i = 0; i < n; i++) {
            if (check(rules[i])) return;
        }
        // 如果都匹配不到路由，使用otherwise路由(如果设置了的话)
        if (otherwise) check(otherwise);
    }

    function listen() {
        // 监听$locationChangeSuccess，开始路由的查找匹配
        listener = listener || $rootScope.$on('$locationChangeSuccess', update);
        return listener;
    }

    if (!interceptDeferred) listen();

***

那么，问题来了：难道每次路由变化(hash变化)，由于监听了’$locationChangeSuccess'事件，都要进行rules的遍历来查找匹配路由，然后跳转到对应的state吗？

答案是：肯定的，一般的路由器都是这么做的，包括ngRoute。

那么ui.router对于这样的问题，会怎么进行优化呢？

回归到问题：我们之所以要循环遍历rules，是因为要查找匹配到对应的路由(state)，然后跳转过去，倘若不循环，能直接找到对应的state吗？

答案是：可以的。

还记得前面说过，在用ui.router在创建路由时：

1. 会实例化一个对应的state对象，并存储起来(states集合里面)
1. 每一个state对象都有一个state.name进行唯一标识(如：'home')

根据以上两点，于是ui.router提供了另一个指令叫做：`ui-sref指令`，来解决这个问题，比如这样：

    <a ui-sref="home">通过ui-sref跳转到home state</a>

当点击这个a标签时，会直接跳转到home state，而并不需要循环遍历rules，ui.router是这样做到的(这里简单说一下)：

首先，ui-sref="home"指令会给对应的dom添加`click事件`，然后根据state.name，直接跳转到对应的state，代码像这样：

    element.bind("click", function(e) {
        // ..省略若干代码
        var transition = $timeout(function() {
            // 手动跳转到指定的state
            $state.go(ref.state, params, options);
        });
    });

跳转到对应的state之后，ui.router会做一个善后处理，就是改变hash，所以理所当然，会触发’$locationChangeSuccess'事件，然后执行回调，但是在回调中可以通过一个判断代码规避循环rules，像这样：

    function update(evt) {
        var ignoreUpdate = lastPushedUrl && $location.url() === lastPushedUrl;

        // 手动调用$state.go(...)时，直接return避免下面的循环
        if (ignoreUpdate) return true;

        // 省略下面的循环ruls代码
    }

说了那么多，其实就是想说，我们`不建议直接使用href="#/xxx"来改变hash`，然后跳转到对应state(虽然也是可以的)，因为这样做会多了一步rules循环遍历，浪费性能，就像下面这样：

    <a href="#/abc">通过href跳转到home state</a>

***

## 0.3 路由详解

> 这里详细地介绍ui.router的参数配置和一些深层次用法。

***

不过，在这之前，需要一个demo，ui.router的[官网demo](http://angular-ui.github.io/ui-router/sample/#/)无非就是最好的学习例子，里面涉及了大部分的知识点，所以接下来的代码讲解大部分都会是这里面的(建议下载到本地进行代码学习)。

为了更好的学习这个demo，我画了一张图来描述这个demo的contacts部分各个视图模块，如下：

![angular-router](images/angular-router-1.png)

***

父与子
之前就说到，在ui.router中，路由就有父与子的关系(多个父与子凑起来就有了，祖先和子孙的关系)，从javascript的角度来说，其实就是路由对应的state对象之间存在着某种`引用`的关系。

用一张数据结构的表示下contacts部分，大概是这样([原图](http://gtms01.alicdn.com/tps/i1/TB1je9bHFXXXXXEXXXXysygGpXX-2481-1686.jpg))：

原图看出各个state对象之间通过`parent`字段维系了这样一个`父与子`的关系(粉红色的线)。

ok，接下来就看下是如何定义路由的父子关系的？

假设有一个父路由，如下：

    $stateProvider
    .state('contacts', {});

ui.router提供了几种方法来定义它的子路由：

1.点标记法(`推荐`)

    $stateProvider
    .state('contacts.list', {});

通过状态名简单明了地来确定父子路由关系，如：状态名为'a.b.c'的路由，对应的父路由就是状态名为'a.b'路由。

2.`parent`属性

    $stateProvider
    .state({
        name: 'list',// 状态名也可以直接在配置里指定
        parent: 'contacts'// 父路由的状态名
    });

或者：

    $stateProvider
    .state({
        name: 'list',// 状态名也可以直接在配置里指定
        parent: {// parent也可以是一个父路由配置对象(指定路由的状态名即可)
            name: 'contacts'
        }
    });

通过`parent`直接指定父路由，可以是父路由的状态名(字符串)，也可以是一个包含状态名的父路由配置(对象)。

***

竟然路由有了`父与子`的关系，那么它们的注册顺序有要求嘛？

答案是：没有要求，我们可以在父路由存在之前，创建子路由(不过，不是很推荐)，因为ui.router在遇到这种情况时，在内部会帮我们先`缓存`子路由的信息，等待它的父路由注册完毕后，再进行子路由的注册。

***

### 模板渲染

当路由成功跳转到指定的state时，ui.router会触发'$stateChangeSuccess'事件通知所有的ui-view进行模板重新渲染。

代码是这样的：

    if (options.notify) {
        $rootScope.$broadcast('$stateChangeSuccess', to.self, toParams, from.self, fromParams);
    }

而`ui-view`指令在进行`link`的时候，在其内部就已经监听了这一事件(消息)，来随时更新视图：

    scope.$on('$stateChangeSuccess', function() {
        updateView(false);
    });

***

大体的模板渲染过程就是这样的，这里遇到一个问题，就是：每一个`div[ui-view]`在重新渲染的时候如何获取到对应视图模板的呢?

要想知道这个答案，

首先，我们得先看一下模板如何设置？

一般在设置`单视图`的时候，我们会这样做：

    $stateProvider
        .state('contacts', {
            abstract: true,
            url: '/contacts',
            templateUrl: 'app/contacts/contacts.html'
        });

在配置对象里面，我们用`templateUrl`指定模板路径即可。

如果我们需要设置`多视图`，就需要用到`views`字段，像这样：

    $stateProvider
        .state('contacts.detail', {
            url: '/{contactId:[0-9]{1,4}}',
            views: {
                '' : {
                    templateUrl: 'app/contacts/contacts.detail.html',
                },
            'hint@': {
                    template: 'This is contacts.detail populating the "hint" ui-view'
                },
            'menuTip': {
                templateProvider: ['$stateParams', function($stateParams) {
                    return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
                }]
            }
        }
    });

这里我们使用了另外两种方式设置模板：

1. `template`：直接指定模板内容，另外也可以是函数返回模板内容
1. `templateProvider`：通过依赖注入的调用函数的方式返回模板内容

上述我们介绍了设置`单视图`和`多视图`模板的方式，其实最终它们在ui.router内部都会被统一格式化成的`views`的形式，且它们的key值会做特殊变化：

上述的`单视图`会变成这样：

    views: {
        // 模板内容会被安插在根路由模板(index.html)的匿名视图下
        '@': {
            abstract: true,
            url: '/contacts',
            templateUrl: 'app/contacts/contacts.html'
        }
    }

`多视图`会变成这样：

    views: {
        // 模板内容会被安插在父路由(contacts)模板的匿名视图下
        '@contacts': {
            templateUrl: 'app/contacts/contacts.detail.html',
        },
        // 模板内容会被安插在根路由(index.html)模板的名为hint视图下
        'hint@': {
            template: 'This is contacts.detail populating the "hint" ui-view'
        },
        // 模板内容会被安插在父路由(contacts)模板的名为menuTip视图下
        'menuTip@contacts': {
            templateProvider: ['$stateParams', function($stateParams) {
                return '<hr><small class="muted">Contact ID: ' + $stateParams.contactId + '</small>';
            }]
        }
    }

我们会发现views对象里面的`key`变化了，最明显的是出现了一个`@`符号，其实这样的key值是ui.router的一个设计，它的原型是：`viewName + '@' + stateName`，解释下：

1. `viewName`
1. 指的是`ui-view="status"`中的'status'
1. 也可以是''(空字符串)，因为会有匿名的`ui-view`或者`ui-view=""`
1. `stateName`
    -默认情况下是父路由的state.name，因为子路由模板一般都安插在父路由的ui-view中
1. 也可以是''(空字符串)，表示最顶层rootState
1. 还可以是任意的祖先`state.name`

这样原型的意思是，表示__该模板将会被安插在名为stateName路由对应模板的viewName视图下__(可以看看上面代码中的注释理解下)。

其实这也解释了之前我说的：“为什么state.name里面不能存在`@`符号”？因为`@`在这里被用于特殊含义了。

所以，到这里，我们就知道在`ui-view`重新进行模板渲染时，是根据`viewName + '@' + stateName`来获取对应的视图模板内容(其实还有controller等)的。

***

其实，由于路由有了`父与子`的关系，某种程度上就有了override(覆盖或者重写)可能。

父路由和子路由之间就存在着视图的override，像下面这段代码：

    $stateProvider
        .state('contacts.detail', {
            url: '/{contactId:[0-9]{1,4}}',
            views: {
                'hint@': {
                    template: 'This is contacts.detail populating the "hint" ui-view'
                }
            }
        });
    
    $stateProvider
        .state('contacts.detail.item', {
            url: '/item/:itemId',
            views: {
                'hint@': {
                    template: ' This is contacts.detail.item overriding the "hint" ui-view'
                }
            }
        });

上面两个路由(state)存在着`父与子`的关系，且他们都对`@hint`定义了视图，那么当子路由被激活时(它的父路由也会被激活)，我们应该选择哪个视图配置呢？

答案是：子路由的配置。

具体的，ui.router是如何实现这样的视图override的呢？

简单地回答就是：通过javascript原型链实现的，你可以在每次路由切换成功后，尝试着打印出`$state.current.locals`这个变量一看究竟。

***

### controller控制器

有了模板之后，必然不可缺少controller向模板对应的作用域(scope)中填写数据，这样才可以渲染出动态数据。

我们可以为每一个视图添加不同的controller，就像下面这样：

    $stateProvider
        .state('contacts', {
            abstract: true,
            url: '/contacts',
            templateUrl: 'app/contacts/contacts.html',
            resolve: {
                'contacts': ['contacts', function( contacts){
                    return contacts.all();
                }]
             },
            controller: ['$scope', '$state', 'contacts', 'utils', function ($scope, $state, contacts, utils) {
                // 向作用域写数据
                $scope.contacts = contacts;
            }]
        });

注意：controller是可以进行`依赖注入`的，它注入的对象有两种：

1. 已经注册的服务(service)，如：`$state`，`utils`
1. 上面的`reslove`定义的解决项(这个后面来说)，如：`contacts`

但是不管怎样，目的都是：向作用域里写数据。

***

### reslove解决项

resolve在state配置参数中，是一个对象(key-value)，每一个value都是一个可以依赖注入的函数，并且返回的是一个promise(当然也可以是值，resloved defer)。

我们通常会在resolve中，进行数据获取的操作，然后返回一个promise，就像这样：

    resolve: {
        'contacts': ['contacts', function( contacts){
            return contacts.all();
        }]
    }

上面有好多contacts，为了不混淆，我改一下代码：

    resolve: {
        'myResolve': ['contacts', function(contacts){
            return contacts.all();
        }]
    }

这样就看清了，我们定义了resolve，包含了一个myResolve的key，它对应的value是一个函数，依赖注入了一个服务contacts，调用了`contacts.all()`方法并返回了一个promise。

于是我们便可以在controller中引用myResolve，像这样：

    controller: ['$scope', '$state', 'myResolve', 'utils', function ($scope, $state, contacts, utils) {
        // 向作用域写数据
        $scope.contacts = contacts;
    }]

这样做的目的：

1. 简化了controller的操作，将数据的获取放在resolve中进行，这在多个视图多个controller需要相同数据时，有一定的作用。
1. 只有当reslove中的promise全部resolved(即数据获取成功)后，才会触发'$stateChangeSuccess'切换路由，进而实例化controller，然后更新模板。

***

另外，子路由的resolve或者controller都是可以依赖注入父路由的resolve提供的数据服务，就像这样：

    $stateProvider
        .state('parent', {
            url: '',
            resolve: {
                parent: ['$q', '$timeout', function ($q, $timeout) {
                    var defer = $q.defer();
                    $timeout(function () {
                        defer.resolve('parent');
                    }, 1000);
                    return defer.promise;
                }]
            },
            template: 'I am parent <div ui-view></div>'
        })
        .state('parent.child', {
            url: '/child',
            resolve: {
                child: ['parent', function (parent) {// 调用父路由的解决项
                    return parent + ' and child';
                }]
            },
            controller: ['child', 'parent', function (child, parent) {// 调用自身的解决项，以及父路由的解决项
                console.log(child, parent);
            }],
            template: 'I am child'
        });

另外每一个视图也可以单独定义自己的resolve和controller，它们也是可以依赖注入自身的state.resolve，或者view下的resolve，或者父路由的reslove，就像这样：

html

    <div ui-view></div>
    <div ui-view="status"></div>

javascript:

    $stateProvider
        .state('home', {
            url: '/home',
            resolve: {
                common: ['$q', '$timeout', function ($q, $timeout) {// 公共的resolve
                    var defer = $q.defer();
                    $timeout(function () {
                        defer.resolve('common data');
                    }, 1000);
                    return defer.promise;
                }],
            },
            views: {
                '': {
                    resolve: {
                        special: ['common', function (common) {// 访问state.resolve
                            console.log(common);
                        }]
                    }
                },
                'status': {
                    resolve: {
                        common: function () {// 重写state.resolve
                            return 'override common data'
                        }
                    },
                    controller: ['common', function (common) {// 访问视图自身的resolve
                        console.log(common);
                    }]
                }
            }
        });

总结一下：

1. 路由的controller除了可以依赖注入正常的service，也可以依赖注入resolve
1. 子路由的resolve可以依赖注入父路由的resolve，也可以重写父路由的resolve供controller调用
1. 路由可以有单独的state.resolve之外，还可以在views视图中单独配置resolve，视图resolve是可以依赖注入自身state.resolve甚至是父路由的state.resolve

## 0.4 相关其他angular文章

[Angular系列文章](http://www.html-js.com/article/column/693)

