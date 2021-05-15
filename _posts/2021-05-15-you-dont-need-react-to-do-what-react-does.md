---
title: You don't need React to do what React does
layout: post
---

It’s 2021, and frontend state management is still hard. But you know what, you
don’t need to use React or build your entire app with React to get the benefits
of top-down uni-directional state-driven UI updates.

Look at YouTube Music here, showing mismatching song name and graphic and
playing one of them like who cares.

<img
  src="{{ site.baseurl }}{{ site.imgurl }}/youtube-music-inconsistent-state.png"
  alt="YouTube Music inconsistent song name and cover"
  width="300"
/>

## React-like without React

You know what, you don’t need to use React or build your entire app with React
to get the benefits of top-down uni-directional state-driven UI updates.

You can get by just fine by just creating that conceptual model, and following
it manually in your code. 

Of course you need the conceptual primitives, a normalized Model data
structure, a “dumb” View hierarchy, a ViewModel data structure, and an
idempotent Renderer to update UI.

And you can do that literally in any language or stack in the world. I’ve done
it in C++, C#, Swift, even jQuery Mobile, before React or SwiftUI ever showed
up. 

## And what do you get from such a setup?

You get to run UI and visual tests without ever running the application.

You get to test visual behavior without mocking the entire UI layer of the
target platform. 

You get peace of mind that NOTHING important in the app broke WITHOUT running
the app for EVERY SMALL CHANGE.

> Sorry, I just get excited about this stuff.

You get to build your app and all its visual behavior in one language (C++, or
C# if you’re building on Unity3D), and then plug in platform-specific visual
layer on top, while ENSURING that visual behavior across ALL platforms still
works. Write-once-run-anywhere but for testing!

