---
title: Colorful Console Logger in JavaScript
layout: post
---

Logging that looks good and helps you `debug` faster.


## Inspiration

[debug](https://github.com/visionmedia/debug) by TJHolowaychuk.


## Usage

```js
var log = debug('setup');

$(document).on('ready', function () {
  log('hey, DOM is ready');
  parseJSON();
  log('cool stuff dude');
});

var parseLog = debug('parseJSON', 'info'),
  parseError = debug('parseJSON', 'error');

function parseJSON() {
  var json = '{ lol: no }';
  parseLog('JSON parsing for', json);
  try {
    var obj = JSON.parse(json);
  } catch (e) {
    parseError('Ughh, invalid', json);
  }
}
```

## Output

In browser console:

![Logs in Chrome DevTools]({{ site.baseurl }}{{ site.imgurl }}/colorful-console-logger-in-js.png)


## Show me the code!


```js
function debug(context, type) {
  var typeBg = {
    log: 'grey',
    info: 'teal',
    error: 'red'
  };
  var max = debug.maxContextLength || 0;
  debug.maxContextLength =
    (context.length > max) ?
      context.length :
      max;
  return function() {
    var args = [].slice.call(arguments),
    var padding = new Array(
      debug.maxContextLength + 1 -
      context.length
    ).join(' ')
    var colored = [
      padding + '%c ' +
      context + ' ',
      'color:white; background:' +
      (typeBg[type || 'log'] || typeBg.log)
    ];
    console.log.apply(console,
      colored.concat(args));
  };
}
```