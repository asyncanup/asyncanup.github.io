---
title: Simple JavaScript assert
layout: post
---

It's better to fail with your own error than `undefined is not a function`.

A simple assertion solution would let your application fail early and fail at the
right point in runtime execution.
Allowing you to handle it better.


## How you write assertions

For a recent barebones app, I wrote assertions as part of code like this:

```js
function startApplication(url, callback) {
    assert('string' === typeof url, 'URL needs to be a string!');
  
    if (callback) assert('function' === typeof callback);
    // Application code
}
```

If I had needed a slightly more meaty assertion library, I would have used
[shouldbe](https://github.com/asyncanup/shouldbe) with Underscore. But this was
just fine for the little app.


## Show me the code!
*(Or, how you implement simple assertion)*

Just throw this simple `assert` into your application and use it generously:

```js
function assert(condition, message) {
    if (!condition) {
        throw new Error(message || 'Assertion failed');
    }
}
```