---
layout: post
title: What's slowing your website down?
---

Get a quick list of resources in your website that loaded slowly during page load, using Chrome DevTools.

This uses [Resource Timing API](http://www.w3.org/TR/resource-timing/) enabled on the latest Chrome.


## Show me the code!

Just open the console and run:

```js
performance.getEntriesByType('resource')
  .sort(function (a, b) {
    return a.duration > b.duration ? -1 : 1;
  })
  .map(function (entry) { return entry.name; })
  .join('\n');
```


## Example

Running it on [Crood](https://github.com/asyncanup/crood) gave me these results up top:

```
http://127.0.0.1:8000/js/lib/ace/ace.js
http://127.0.0.1:8000/js/lib/require.js
http://127.0.0.1:8000/js/lib/prefixfree.min.js
http://127.0.0.1:8000/css/lib/bootstrap/css/bootstrap.css
http://127.0.0.1:8000/css/animations.css
http://127.0.0.1:8000/css/main.css
http://127.0.0.1:8000/css/lib/humane.flatty.css
http://127.0.0.1:8000/css/lib/bootstrap/css/bootstrap.css
http://127.0.0.1:8000/js/app/utils/path.js
http://127.0.0.1:8000/js/app/utils/ui.js
http://127.0.0.1:8000/js/app/views/file-list.js
http://127.0.0.1:8000/js/lib/jquery.js
http://127.0.0.1:8000/js/app/models/editor.js
http://127.0.0.1:8000/js/app/models/file-list-collection.js
http://127.0.0.1:8000/js/lib/underscore.js
http://127.0.0.1:8000/css/main.css
http://127.0.0.1:8000/css/animations.css
...
```

Surprisingly to me, `ace.js`, `require.js` and `bootstrap.css` consistently take longer than `jquery.js`


## Use cases

- You could send this list to server and record for analytics later.
- You could make big decisions about what files (resources) to concatenate together by running this over and over.


## Customize

- Get Top 5 (and so on) of the most taxing resources by tacking on `.slice(0, 5)` before `.join('\n');`
- Use `requestStart` and `startTime` to compare load order of resources.