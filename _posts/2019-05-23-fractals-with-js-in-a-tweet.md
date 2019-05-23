---
title: Fractals with JavaScript in a tweet!
layout: post
---

Let's implement Fractals with JavaScript, and make it fit in a tweet! 280 characters worth of code creates these amazing patterns:

<video autoplay width="500">
  <source src="{{ site.baseurl }}{{ site.imgurl }}/fractal-tweet.mp4" type="video/mp4">
  Watch a video <a href="{{ site.baseurl }}{{ site.imgurl }}/fractal-tweet.mp4">here</a>
</video>

## Code

```js
F=()=>{
c=v.getContext('2d')
c.lineWidth=.03
C=[1,-.5,-.5]
S=[0,.87,-.87]
P=[[X=300,Y=300],[X,Y],[X,Y]]
R=()=>{d=parseInt(Math.random()*3)
P=P.map (([x,y],i)=>(c.moveTo(x,y),c.lineTo(X=x+3*C[I=(d+i)%3],Y=y+3*S[I]),[X,Y]))
c.stroke()
setTimeout(R,17)
}
R()}
```

And it needs the following HTML to work:

```html
<canvas width=400 height=400 id="v"></canvas>
<script>F()</script>
```

## Demo

You can try it out online at
[my Runkit page](https://runkit.com/asyncanup/5cd629840a18bf001b4860e9)

Or, right here!

<script src="{{ site.baseurl }}{{ site.jsurl }}/fractal-tweet.js"></script>
<div id="canvas-container" style="margin:10px auto"></div>

Click anywhere in the canvas above to generate a new one!

## Line-by-line explanation

```js
F=()=>{
```
Creating a top-level function which starts a recursive loop drawing the fractal progressively.

```
c=v.getContext('2d')
```
`v` here refers to the `<canvas id="v">` HTML element.
In case you didn't know, elements with `id`s are available as globally available JavaScript variables in the browser by default.

Since we're drawing in 2-dimensional space, `.getContext('2d')` gives us the right API to draw in 2D.

```js
c.lineWidth=.03
```
Setting a really small line width makes the new lines in the fractal fade in as they are drawn. It's just weird that that happens.

```js
C=[1,-.5,-.5]
S=[0,.87,-.87]
P=[[X=300,Y=300],[X,Y],[X,Y]]
R=()=>{d=parseInt(Math.random()*3)
P=P.map (([x,y],i)=>(c.moveTo(x,y),c.lineTo(X=x+3*C[I=(d+i)%3],Y=y+3*S[I]),[X,Y]))
c.stroke()
setTimeout(R,17)
}
R()}
```
