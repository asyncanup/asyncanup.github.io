---
title: React implemented in a Tweet!
layout: post
---

Let's implement the basic [React](https://reactjs.org) API in a tweet, with React DOM & State management as a separate plugin in another tweet.

## What we want, and shall get

- Top-down, one-way, state-driven rendering.
- Compose HTML primitives into higher-level components.
- Ability to write JSX to define components.
- Custom props for higher-order components.
- Event handlers that can change application state and trigger re-renders.

## What we won't get

- No virtual DOM diffing between old and new renders for efficient DOM updates,
  so re-renders will replace HTML content.
- `setState` won't be asynchronous, but synchronous.
- DOM event handlers won't have React-ified names (like `onClick`), but default
  DOM names (like `onclick`).
- Only necessary API surface area implemented, so _yes_ `React.createElement`,
  and _no_ `React.cloneElement`.
- No [React Hooks](https://reactjs.org/docs/hooks-intro.html) API.

## Code

Here's React defined as a global

```js
React={Component:function(e){this.props=e},[C="createElement"]:(t,s,...a)=>t.bind?new t(s):(e=document[C](t),(()=>{for(n in s)e[n]=s[n]})(),g(a).map(t=>e[A](t.props?t.render():t.part?t:new Text(t))),e)},A="appendChild",g=(e=>(e=e||[],e.map?e.flatMap(g):[e]))
```

What does the above do?

- Defines a global [`React`](https://reactjs.org/docs/react-api.html).
- Defines [`React.Component`](https://reactjs.org/docs/react-component.html),
  the component base class.
- Defines
  [`React.createElement`](https://reactjs.org/docs/react-api.html#createelement)
  which can create both HTML primitives and custom components.
- `React.createElement` also accepts `props`, and `children` which get appended
  to the created DOM element.
- JSX essentially transpiles to `React.createElement` calls, with contents
  passed in as `children` argument. These `children` can be custom components,
  primitive HTML elements, or plain text. Code handles them all correctly.

## WHAT! HOW?

Read the annotated, prettified code below for line-by-line explanation.

For now, moving on to more features!

## React DOM + State management

You can bring in React DOM and React's State management API come as a separate
plugin, implemented in another tweet!

```js
ReactDOM={render:(e,t)=>(e.h=t,t[A](e.render()))},React.Component.prototype.setState=function(e){this.state={...this.state,...e},this.h.innerHTML="",ReactDOM.render(this,this.h)};
```

What does the above define?

- A global `ReactDOM`.
- [`ReactDOM.render`](https://reactjs.org/docs/react-dom.html#render) function
  to trigger re-renders.
- [`React.Component#setState`](https://reactjs.org/docs/react-component.html#setstate)
  to set component-level state that triggers a re-render of that component.

## Demo

Let's build React's own [Tic-tac-toe
tutorial](https://reactjs.org/tutorial/tutorial.html) with React-in-a-tweet™.

You can fiddle with the following over at
[JSFiddle](https://jsfiddle.net/asyncanup/0bzfy1sq/), or try it out right here!

<center>
  <iframe src="{{ site.baseurl }}/public/react-tic-tac-toe-demo.html" width="400px" height="200px" style="border:none">
  </iframe>
</center>


Video of working example:

<video autoplay="true" loop="true" width="500">
  <source src="{{ site.baseurl }}{{ site.imgurl }}/react-tic-tac-toe-demo.mp4" type="video/mp4">
  Watch a video <a href="{{ site.baseurl }}{{ site.imgurl }}/react-tic-tac-toe-demo.mp4">here</a>
</video>

## Usage code

Here's how that sweet sweet demo is implemented.

Throw in a root HTML element:

```html
<div id="root"></div>
```

Sprinkle some CSS to make things look right (from [React tutorial](https://reactjs.org/tutorial/tutorial.html)):

```css
body { font: 14px "Century Gothic", Futura, sans-serif; margin: 20px; }
ol, ul { padding-left: 30px; }
.board-row:after { clear: both; content: ""; display: table; }
.status { margin-bottom: 10px; } 
.square {
  background: #fff; border: 1px solid #999; float: left;
  font-size: 24px; font-weight: bold; line-height: 34px;
  height: 34px; margin-right: -1px; margin-top: -1px;
  padding: 0; text-align: center; width: 34px;
}
.square:focus { outline: none; }
.kbd-navigation .square:focus { background: #ddd; }
.game { display: flex; flex-direction: row; }
.game-info { margin-left: 20px; }
```

---

And now the work horse, the JSX-enabled usage of React-in-a-tweet™ (also lifted
from [React tutorial](https://reactjs.org/tutorial/tutorial.html)):

```jsx
function Square(props) {
  return (
    <button className="square" onclick={props.onClick}>
      {props.value}
    </button>
  );
}
```

Returning JSX!

The way that works is: Babel transpiles this JSX to `React.createElement` calls,
which are handled by React-in-a-tweet just fine.

Remember, JSX transpiles to `React.createElement()` calls, and passes in the
component type as the first argument, props defined in JSX as the second
argument, and any children provided as the third argument.

For example:

```jsx
<button className="square" onclick={props.onClick}>
  Square value: {props.value}
  <div>nested</div>
</button>
```

transpiles to:

```js
React.createElement("button", {
  className: "square",
  onclick: props.onClick
},
  "Square value: ", props.value,
  React.createElement("div", null, "nested")
);
```

So, transpiled code includes `React.createElement()` calls that contain 3 or
more arguments: `type`, `props`, and `...children`.

Also notice that the click handler on `button` above has the DOM-defined name
`onclick`, instead of the name that React gives it - `onClick`.

This is because React-in-a-tweet does not implement React's
[synthetic events](https://reactjs.org/docs/handling-events.html#gatsby-focus-wrapper).
But, just like React, you can still assign functions to `onclick`.

Wait, what about `props.onClick` though? Why isn't it it `props.onclick`?
Well, that's just a prop name, which can be anything you like :)

---

Moving on to more definitions:

```jsx
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}
```

Notice how `Board`'s `render` function can call `this.renderSquare()` to fill in
parts of the rendered output. Works just fine.

`renderSquare()` returns a _custom component_, `Square`, not an HTML primitive.
Works fine.

Also notice how the `onClick` handler defined in `renderSquare()` is just an
arrow function. Works great.

But wait, what's `className` doing there? Isn't that a React-ified HTML attribute
name?
Well, no siree.
[`className`](https://developer.mozilla.org/en-US/docs/Web/API/Element/className)
is pure DOM API. Works as is.

---

Now let's define the root game component itself:

```jsx
class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null)
        }
      ],
      stepNumber: 0,
      xIsNext: true
    };
  }

  handleClick(i) {
    console.log('handleClick', i);
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? "X" : "O";
    this.setState({
      history: history.concat([
        {
          squares: squares
        }
      ]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0
    });
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #' + move :
        'Go to game start';
      return (
        <li key={move}>
          <button onclick={() => this.jumpTo(move)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.xIsNext ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={i => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}
```

So much code! Well, as far as React API is concerned, there are only a few
interesting things going on in there.

- `Game`'s `constructor` sets initial state (`this.state`), storing `history`
  and other Tic-tac-toe-specific data.
- `handleClick` click handler uses `this.setState()` and passes in new state.
- `render` does conditional rendering based on whether the game has been won
  yet, and returns JSX for the entire game board.
- Since game state is defined entirely as `Game`'s React state, the entire game
  board will re-render on every game state change in this example. Regardless of
  this example, React-in-a-tweet does allow re-rendering specific parts of a UI
  as long as those specific UI sections hold their own state, instead of
  depending on a single global state.

```jsx
ReactDOM.render(<Game />, document.getElementById("root"));
console.log('✓')
```

React DOM API that triggers the first-render, y'all. Passing in JSX for `<Game
/>` works. It's just the React you know and love!

---

Finally, a helper function that calculates winner after every move:

```js
function calculateWinner(squares) {
  const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) return squares[a];
  }
  return null;
}
```

## Wait, how does React-in-a-tweet itself work?

Glad you asked!

Here's a line-by-line explanation of the tweet-sized source code
of React-in-a-tweet:

Define `React` global:

```js
React = {
```

Define and implement the following API:

- `React.Component`, just a simple base class which stores the `props` passed
to it.

```js
    Component: function(p) {
      this.props = p
    },
```

- `React.createElement`, the work horse of rendering, which accepts:
  * `t`, HTML type name or React component class,
  * `p`, props
  * `...c`, children to be appended to the dom element created.

```js
    [C = 'createElement']: (t, p, ...c) => (
```

In the case of `t` being a React-in-a-tweet component class, ie, a constructor
function derived from `React.Component`, we can just instantiate that function
with passed props and return the resulting React component instance.

```js
      t.bind
        ? new t(p)
```

Otherwise, `t` is an HTML primitive element name, like `button`, or `span`. In
this case, create a new HTML element using `document.createElement(t)`

```js
        : (
          e = document[C](t),
```

and assign all the props passed to it as direct properties of the HTML element.
This is how `onclick`s and other event handlers get registered.

> If you want to use React-like CSS-in-JS, you can modify the part below to
loop over a passed `style` object, and assign its properties to `e[n].style`.

```js
          (() => {
            for (n in p)
              e[n] = p[n]
          })(),
```

We must also append the `children` passed in as arguments into the created DOM
element.

Looping over a flattened list of children, handle the following cases for each
child element (`e`):
- If `a.props` exists, then it's a `React.Component` instance. Call
  `a.render()` to get the corresponding instantiated HTML element.
- If `a.part` exists, then it's a regular HTML element instance already. Do nothing.
- Else, `a` must be plain text. Initialize a new HTML `Text` element to hold the
  string.

In all cases, after instantiating, append the resulting DOM element as a child
to the parent DOM element `e`.

> Note: `A` is just shorthand for `appendChild`, as defined below.

Finally, return `e`, the element created and filled in by this execution of
`React.createElement()`.

```js
          g(c).map(a => (
            e[A](
              a.props
                ? a.render()
                : a.part
                  ? a
                  : new Text(a)
            )
          )),
          e
        )
    )
},
```

Lastly, define `g`, just a helper function that flattens elements, lists, and
list of lists into a single list, to support `React.createElement`'s `children`
argument semantics.

```js
g = a => (
  a = a || [],
  a.map ? a.flatMap(g) : [a]
),
A = 'appendChild',
```

And that's it!

<div class="tenor-gif-embed" data-postid="4323138" data-share-method="host" data-width="100%" data-aspect-ratio="1.7785714285714287"><a href="https://tenor.com/view/americas-got-talent-agt-happy-smile-excited-gif-4323138">Excited GIF</a> from <a href="https://tenor.com/search/americasgottalent-gifs">Americasgottalent GIFs</a></div><script type="text/javascript" async src="https://tenor.com/embed.js"></script>
