---
layout: post
title: Difference between setTimeout, setInterval, requestAnimationFrame in JavaScript (browsers)
---

`setTimeout`, `setInterval` and `requestAnimationFrame` seem to be commonly
misunderstood, and yet they are really simple to just tinker with thanks to
browser consoles.

Run the code here in your browsers and compare results with mine!

## Concepts

`setTimeout` attaches a handler to the base event loop, always attaching to the
next iteration of the event loop, which is almost 10ms from current time, but
the exact delay depends on browser implementation.

`setInterval` attaches to the next iteration and all iterations thereafter, but
this handler can get triggered more times than event loop iterations if event
loop is going slowly, which can happen due to cpu spikes and what not.

`requestAnimationFrame` attaches handler to the next "render" loop iteration,
instead of event loop. If you want to update UI in every iteration, then this is
the most efficient place to update DOM because browser renders the DOM right
after.

## Show me the code!

### setTimeout

```js
var count = 0;
var start = Date.now();
function loop() {
  count += 1;
  if (Date.now() - start < 5000) {
    setTimeout(loop, 0);
  } else {
    console.log(count, 'loops in 5 seconds');
  }
}
setTimeout(loop, 0);
```

Result:
```js
960 "loops in 5 seconds"
```

Clearly, `setTimeout` in Chrome is triggering faster than every 10ms.

### setInterval

```js
var count = 0;
var start = Date.now();
var inter = setInterval(loop, 0);
function loop() {
  count += 1;
  if (Date.now() - start >= 5000) {
    clearInterval(inter);
    console.log(count, 'loops in 5 seconds');
  }
}
```

Result:
```
1253 "loops in 5 seconds"
```

`setInterval` is being triggered even faster than `setTimeout`, presumably
because it is being flushed multiple times in some of the event loop iterations.
That would happen if the actual event loop iterations are not able to keep up
with pre-planned iteration delays. In this case, the difference only seems to
occurs in less than 1 in 3 event loop iterations.

It would happen more frequently if the system was experiencing more load.

### requestAnimationFrame

```js
var count = 0;
var start = Date.now();
function loop() {
  count += 1;
  if (Date.now() - start < 5000) {
    requestAnimationFrame(loop);
  } else {
    console.log(count, 'loops in 5 seconds');
  }
}
requestAnimationFrame(loop);
```

Result:
```
302 "loops in 5 seconds"
```

`requestAnimationFrame` seems to be following the spec exactly to refresh at
60fps. Which means the system is doing well in terms of rendering performance
and UI refresh rate.

### Bonus candidate: while(true)

`while(true)` runs indefinitely in the current frame, although it is possible to
break out of it using a counter value comparison, or a time comparison.

```js
var count = 0;
var start = Date.now();
while (Date.now() - start < 5000) {
  count += 1;
}
console.log(count, 'loops in 5 seconds');
```

Result:
```
68557055 "loops in 5 seconds"
```

`while(true)` seems to be a measure of the raw maximum compute performance that
my system provides. Interestingly, using `new Date().getTime()` instead of
`Date.now()` above drops the iteration count down to `34160634`!
Which probaby suggests  that `Date.now()` simply executes faster than `new
Date().getTime()`, since that is the only computation inside that `while(true)`
infinite loop :)

## System spec

All results above are for Google Chrome Version 58.0.3029.110 (64-bit) on
macOS Sierra Version 10.12.3, MacBook Pro (Retina, 15-inch, Mid 2015)

