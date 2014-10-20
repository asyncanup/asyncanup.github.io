---
layout: post
title: Simple jQuery Mobile Page Templating Pattern
---

jQuery Mobile has a concept of `pages` at its core. Top-level `div`s can be specified as pages and you each page becomes a mobile `screen` with transitions between them. The pattern shown here can be used to integrate templating into your jQuery Mobile app easily, using [Underscore](http://underscorejs.org/#template) templates 
(or [jQuery tmpl](http://ejohn.org/blog/javascript-micro-templating/) if you prefer).


## Usage

Here's how you might setup your page divs and respective templates:

```html
<div data-role="page" id="main"></div>
<script type="text/template" id="main-template">
  <div data-role="header">
    <h1>Main Page</h1>
  </div>
  <div class="ui-content">
    Go to
    <a href="#about" data-transition="slide">
      About page</a>
  </div>
  <div data-role="footer">
    <%= new Date() %>
  </div>
</script>

<div data-role="page" id="about"></div>
<script type="text/template" id="about-template">
  <div data-role="header">
    <h1>About Page</h1>
  </div>
  <div class="ui-content">
    Go <a href="#" data-rel="back">back</a>
  </div>
  <div data-role="footer">
    <%= new Date() %>
  </div>
</script>
```

Note that the `page` containers above are empty. They will be filled at runtime with the template contents.

And simply by following that markup, you get this:

<center>
  <iframe src="{{ site.baseurl }}/public/jquery-page-templating.html" width="300px" height="430px">
  </iframe>
</center>

Note how the time changes on every transition, that's because the whole page gets completely re-rendered every time. Intended behavior, no more clearing up HTML forms before showing the login page or some such.

You can pass in data to the templates as well using placeholder tags such as `<%= someData %>` for dynamic content, or have any JavaScript code run at all using blocks like:

```html
<% if (condition) { %>
  <p> Content </p>
<% } %>`
```

in the template HTML.


## Alright, show me the code!

```js
$(document).on('pagebeforeshow', '[data-role=page]',
  function () {
    var page = $(this),
      id = page.attr('id');
    try {
      var template =
        _.template($('#' + id + '-template').html());
    } catch (e) {
      console.log('Template error for: ' + id);
      throw e;
    }
    page.html(template()).trigger('create');
  });
```

That's it. It's a simple easy-to-follow convention that makes managing pages easier in jQuery Mobile.