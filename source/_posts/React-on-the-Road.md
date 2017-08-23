title: React on the Road - Chapter 1
date: 2017-07-31 09:41:30
categories:
- UI Development
tags:
- Javascript
- React
---

This is just to record all the issues I met during React development.

### Super

Issue blog: [What's the difference between “super()” and “super(props)” in React when using es6 classes?](https://stackoverflow.com/questions/30571875/whats-the-difference-between-super-and-superprops-in-react-when-using-e)

```javascript
// if you want to access `this.props` in constructor
class MyComponent extends React.Component {
    constructor(props) {
        super(props)

        console.log(this.props)
        // -> { icon: 'home', … }
    }
}
```

vs

```javascript
// If you do not want to access `this.props` in constructor
class MyComponent extends React.Component {
    constructor(props) {
        super()

        console.log(this.props)
        // -> undefined

        // Props parameter is still available
        console.log(props)
        // -> { icon: 'home', … }
    }

    render() {
        // No difference outside constructor
        console.log(this.props)
        // -> { icon: 'home', … }
    }
}
```

### DisplayName

`SomeComponent.displayName` is just to identify the name of current module.

No functional use, just to help the debug to be clear.

Issue blog: [What is React component 'displayName' is used for?](https://stackoverflow.com/questions/41581130/what-is-react-component-displayname-is-used-for)

React source code during debugging: [Debug code in react](https://github.com/facebook/react/blob/90294ead4c627715cb70f20ff448bb0d34ee4c1b/src/renderers/shared/stack/reconciler/ReactCompositeComponent.js#L50-L52)

```javascript
function warnIfInvalidElement(Component, element) {
  if (__DEV__) {
    warning(
      element === null || element === false || React.isValidElement(element),
      '%s(...): A valid React element (or null) must be returned. You may have ' +
      'returned undefined, an array or some other invalid object.',
      Component.displayName || Component.name || 'Component'
    );
    warning(
      !Component.childContextTypes,
      '%s(...): childContextTypes cannot be defined on a functional component.',
      Component.displayName || Component.name || 'Component'
    );
  }
}
```

<!--more-->

### Context of Method

For the following code snippet:

```javascript
class IncreaserPanel extends React.Component {
    constructor(props = {}) {
        super(props);
        this.state = {
            counter: 1
        };

        // Bind increaserMock with this context so that this.increaserMock could be used correctly
        this.increaserMock =  this.increaserMock.bind(this);
    }

    increaser() {
        console.log(this); // output is null if using {this.increaser}
        this.setState({
            counter: this.state.counter + 1
        });
    }

    increaserMock() {
        this.setState({
            counter: this.state.counter + 1
        });
    }

    render() {
        return (
            <section className="IncreaserPanel">
                <UIText
                    text={this.state.counter}>
                </UIText>
                <UIButton
                    text='+'
                    // onClick={() => this.increaser()}>  // this is correct, bind increaser function with this context
                    onClick={this.increaser} // will fail as this is null
                    onClick={this.increaserMock}> // this also works
                </UIButton>
            </section>
        );
    }
};
```

### Export function

In ES6 class function grammer, the `export` could be like this:
```javascript
import React from 'react';
class MyComponent extends React.Component {
    //...
}
export default MyComponent; // import MyComponent from 'myComponent.js'
// or
/**
 * export {
 *     MyComponent,         // import {MyComponent} from 'myComponent.js'
 *     MySecondComponent,
 *     //...
 * }
 */
```

In CMD guideline, the export could be written like this:
```javascript
import React from 'react';
class MyComponent extends React.Component {
    //...
}
module.exports = {
    MyComponent: MyComponent // import {MyComponent} from 'myComponent.js'
};
```

Not much difference, but if we use CMD guideline, it is easier to use in Server side render (SSR), because node.js supports CMD guideline.
