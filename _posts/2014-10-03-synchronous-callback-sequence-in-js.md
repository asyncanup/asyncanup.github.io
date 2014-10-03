---
title: Synchronous Callback Sequence in JS
layout: post
---

Sometimes you need a sequence of callbacks to run synchronously and break out of the whole sequence as soon as one of them fails.

This pattern is often used when initializing stuff, say when initializing a node.js app, or on DOM ready in the browser, or whenever.

I use this pattern when initializing [Apper](/apper) as seen [here](https://github.com/asyncanup/apper/blob/v2.5.0/lib/init/index.js).


## Just tell already!

So let's say you have the following callbacks (as steps) to run:

```js
[ setupMiddleware, setupRoutes, startApp ]
```

And you want to fail as soon as any one of them bails out.

An inituitive signal to bail out seems to be an explicitly returned `false` value by any step.

So a sample callback might look like:

```js
function setupMiddleware() {
  console.log('setting up');
  var notSuccessful;
  
  // Synchronous code
  
  if (notSuccessful) return false;
}
```

Got ya.


## Now show me the code!

```js
[ setupMiddleware, setupRoutes, startApp ]
  .every(function (callback) {
      return callback() !== false;
  });
```

That's it!

You can get more fancy by calling all the callbacks with the *current* scope's context (*this*).

```js
// the context (*this*) from here gets
// passed to every callback as its context
[ setupMiddleware, setupRoutes, startApp ]
  .every(function (callback) {
    return callback.call(this) !== false;
  }, this);
```


## How does it work?

It works because of the ES5 `Array.prototype.every` method  on arrays, available on all browsers and Node.js.

`every` bails out as soon as the iterator returns `falsy` value for one of the array items.

And how do we make the callback step bail out explicitly? By making it return `false` and checking exactly for a return value of `false` thereafter.

Note that not returning anything (the usual case) would be taken as a success. So no extra code there.

Nice and simple. Like the old functional times.