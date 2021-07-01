---
title: Rearranging Equations Game - Introduction (Unity/React/Literate programming)
layout: post
---

Here's a new project I'm spending nights and weekends on, a math learning game
that teaches how to solve equations by rearranging them.

I'm doing this with [Jyoti](https://twitter.com/methodiva), and [John
Bamberg](https://johnbamberg.github.io/), a big-time mathematician and Math
professor at University of Western Australia. John intends to use this game as
part of his course teaching equation solving to students preparing for higher
education.

So, what do you do in this game, again?

You isolate an unknown variable to the left-hand side in order to solve the
equation, and also to make the socially-anxious character X feel calmer.

The technical details are as interesting as the game itself. It's built in the
React way of top-down unidirectional rendering based on state, with every
change to the state represented as an explicit action that affects the state
when reduced over.

The frontend world is well acquainted with this state management pattern,
introduced by Elm and popularized by Redux, but I haven't seen any games,
established or indie, do this yet.

Another interesting thing about the technical approach is that the entire
source code is written as a Literate Programming book, with every feature being
its own isolated chapter!

Watch on to find out more:

<video autoplay loop controls width="100%">
  <source src="{{ site.baseurl }}{{ site.publicurl }}/rearranging-equations/01-introduction.mp4" type="video/mp4">
  Watch a video <a href="{{ site.baseurl }}{{ site.publicurl }}/rearranging-equations/01-introduction.mp4">here</a>
</video>

> Watch on Vimeo, if you like that better:
  [vimeo.com/569788466](https://vimeo.com/569788466)

Playable link to the game: [equations.notabot.ai](https://equations.notabot.ai)

Link to the literate programming source (in book form):
[equations.notabot.ai/source](https://equations.notabot.ai/source)

Reach out on [Twitter](https://twitter.com/asyncanup),
[LinkedIn](https://linkedin.com/in/anupbishnoi), or
[email](mailto:pixelsallover@gmail.com) if you'd like to talk about any of
this.
