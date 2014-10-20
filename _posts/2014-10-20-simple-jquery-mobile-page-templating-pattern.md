---
layout: post
title: Simple jQuery Mobile Page Templating Pattern
---

jQuery Mobile has a concept of `pages` at its core. Top-level `div`s can be specified as pages and you each page becomes a mobile `screen` with transitions between them. The pattern shown here can be used to integrate templating into your jQuery Mobile app easily, using [Underscore](http://underscorejs.org/#template) or [jQuery](http://ejohn.org/blog/javascript-micro-templating/) templates.


## Usage

Here's how you might setup your page divs and respective templates:

```html
<div data-role="page" id="main-page"></div>
<script type="text/template" id="main-page-template">
  <div data-role="header">
    <h2>Page Header</h2>
  </div>
  
  <div role="main" class="ui-content">
      <p>Page content</p>
  </div>
  
  <div data-role="footer">
      <p>Footer content</p>
  </div>
</script>
```