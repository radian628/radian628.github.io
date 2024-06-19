---
title: Lazy Evaluation
layout: ../../layouts/blog.astro
---

# Lazy Evaluation Explained with JavaScript

Say you're implementing some kind of game that has red, green, and blue game pieces.
As such, you often find yourself creating branching logic following the same structure&mdash;
do one thing if you're on a red square, another thing if you're on a green square, and yet
another thing if you're on a blue square. In other words, you end up with many patterns like this:

```js
let output;
if (color == "red") {
  // do something
  output = something;
} else if (color == "green") {
  // do something else
  output = something;
} else if (color == "blue") {
  // do yet another thing
  output = something;
}

// do something with output
```

You decide that you don't want to keep repeating this annoying if/else structure, so you decide to refactor it into a function:

```js
function branchOnColor(color, ifRed, ifGreen, ifBlue) {
  if (color == "red") {
    return ifRed;
  } else if (color == "green") {
    return ifGreen;
  } else if (color == "blue") {
    return ifBlue;
  }
}
```

There's one new problem, however:
Every parameter in this function is evaluated _before_ being passed into it.
Say you have some expensive computation that only happens if the color is `"green"`.
In the if-else version above, this computation would only happen
if the `if (color == "green")` branch was true. On the other hand, in the function version,
this computation _always_ happens _regardless_ of whether `color == "green"`.
Notice how&mdash; in this example below&mdash; even though we're passing in `"red"` into
`branchOnColor`, it _still_ needs to compute the value of `expensiveComputation`.

```js
branchOnColor(
  "red",
  cheapComputation(),
  expensiveComputation(), // always runs, even if color is NOT "green"!!!
  cheapComputation()
);
```

How could we make this more efficient?

## Call-by-name Semantics

Let's make one subtle change to our `branchOnColor` function.
For reference, here's how it is now.

```js
function branchOnColor(color, ifRed, ifGreen, ifBlue) {
  if (color == "red") {
    return ifRed;
  } else if (color == "green") {
    return ifGreen;
  } else if (color == "blue") {
    return ifBlue;
  }
}
```

Let's change it to expect `ifRed`, `ifGreen`, and `ifBlue` to be callback functions.
Then, instead of returning them directly, it will _call_ them first.

```js
function branchOnColor(color, ifRed, ifGreen, ifBlue) {
  if (color == "red") {
    return ifRed(); // ifRed -> ifRed()
  } else if (color == "green") {
    return ifGreen(); // ifGreen -> ifGreen()
  } else if (color == "blue") {
    return ifBlue(); // ifBlue -> ifBlue()
  }
}
```

Now, when we use `branchOnColor`, it won't actually evaluate the `ifGreen` expression
unless it reaches that branch of the if statement, because now it's a function that will
be run _later_ rather than _now_.

```js
branchOnColor(
  "red",
  () => cheapComputation(),
  () => expensiveComputation(),
  () => cheapComputation()
);
```

So this fixed our problem for this example. This idea of deferring computations until they're
actually needed within a function mimics a method of passing arguments to functions known as
"call-by-name" or "pass-by-name" semantics.

In a parameter which is passed by name, it is _as if_ every instance of that variable within
the function body is replaced with the expression used as the function argument. As an example,
consider the `triple` function:

```js
function triple(x) {
  return 3 * x;
}
```

If we were to then do the following code:

```js
let a = 2;
let b = 4;
triple(a + b);
```

Then under how JavaScript _normally_ runs, where numbers are passed by _value_,
the expression would evaluate like so:

```js
triple(a + b);
```

```js
triple(2 + 4);
```

```js
triple(6);
```

```js
3 * 6;
```

```js
18;
```

However, in pass by _name_, the `a + b` expression would be substituted into the function _first_, only getting evaluated _after the function is called_. It's as if we're passing in the expression `a + b`
_itself_ rather than the value `6`.

```js
triple(a + b);
```

```js
3 * (a + b);
```

```js
3 * (2 + 4);
```

```js
3 * 6;
```

```js
18;
```

## Call-by-need Semantics

Let's say we change the game so that it now supports "dead" game pieces.
We find that the special case for "dead" game pieces comes up a lot, and that we
don't really care what color a piece is when it's dead, so we want to give it its own callback.
As such, we modify the `branchOnColor` function like so:

```js
function branchOnColor(isDead, color, ifRed, ifGreen, ifBlue, ifDead) {
  if (isDead) {
    return ifDead();
  } else if (color == "red") {
    return ifRed();
  } else if (color == "green") {
    return ifGreen();
  } else if (color == "blue") {
    return ifBlue();
  }
}
```

The problem is, we've now run into the same issue of unnecessary computation we had before,
this time with `color`. We won't always actually _use_ `color`. If `isDead` is true,
then we never need to access `color`. Like before, we can wrap `color` in a function
to defer its computation until it's actually needed.

```js
function branchOnColor(isDead, color, ifRed, ifGreen, ifBlue, ifDead) {
  if (isDead) {
    return ifDead();
    // color -> color()
  } else if (color() == "red") {
    return ifRed();
    // color -> color()
  } else if (color() == "green") {
    return ifGreen();
    // color -> color()
  } else if (color() == "blue") {
    return ifBlue();
  }
}
```

And here's an example of how we could use this new function.

```js
branchOnColor(
  true, // isDead
  () => expensiveColor(), // color
  () => blablabla(), // ifRed
  () => blablabla(), // ifGreen
  () => blablabla(), // ifBlue
  () => blablabla() // ifDead
);
```

But wait! Now we have _another_ problem! If we look back to the `branchOnColor` function,
you'll notice that we run `color()` up to three times. In fact, `color()` _does_ run three times
if our color happens to be blue.

We might have deferred `color`'s execution, but we also ended up unnecessarily calculating
it more times than it needs to be calculated.

```js
function branchOnColor(isDead, color, ifRed, ifGreen, ifBlue, ifDead) {
  if (isDead) {
    return ifDead();
    // first call to color()
  } else if (color() == "red") {
    return ifRed();
    // second call to color()
  } else if (color() == "green") {
    return ifGreen();
    // third call to color()
  } else if (color() == "blue") {
    return ifBlue();
  }
}
```

To fix this, we'll have to create a mechanism to _cache_ the result from `color`.
It should be a function that _takes a callback function `f` as input_ and returns
another function as output. The first time this cached function is called, it should
call `f` and store the result. Subsequent times, it should just return the stored result.
Here is the implementation of this `cache` function:

```js
function cache(f) {
  let result;
  let isCached = false;
  return () => {
    // if not cached, run f; otherwise return stored result
    if (!isCached) {
      result = f();
      isCached = true;
    }
    return result;
  };
}
```

Now we can cache the value of `color` to make sure it is only computed at most once:

```js
branchOnColor(
  true, // isDead
  cache(() => expensiveColor()), // color
  () => blablabla(), // ifRed
  () => blablabla(), // ifGreen
  () => blablabla(), // ifBlue
  () => blablabla() // ifDead
);
```

This idea of not only _deferring computation_ until it's needed, but also
_caching it_ so it's only computed at most once, is called "call-by-need"
or "pass-by-need".
In other words, we could say that `color` is being passed by need.

Another more common name for pass-by-need is **lazy evaluation**&mdash; "lazy"
because we don't bother to compute it until it's absolutely necessary, and when
we do, we don't do any more work than we need to do.

## Why even bother?

You might be wondering why one should even bother with this. After all, it adds a lot
of boilerplate and complexity to JavaScript code. I'm sure that if you're a seasoned
JS programmer, you'd've thought of far more elegant solutions to these problems than
the ones I've just described.

The neat thing about lazy evaluation is that other languages&mdash; particularly pure functional languages like Haskell&mdash;
have it as a _default_. In other words, all the caching and wrapping in callbacks is
done _automatically_.

Here's an example of the code snippet above implemented in Haskell. No `cache` or `() =>` needed!

```hs
-- Haskell syntax are somewhat similar to shell commands
-- functions and arguments are separated with whitespace
-- no commas or parentheses needed
branchOnColor
  True
  expensiveColor
  blablabla
  blablabla
  blablabla
  blablabla
```

Compare this to the equivalent JavaScript version:

```js
// if you're wondering why *everything* is being cached in this example,
// this is because Haskell caches everything.
branchOnColor(
  cache(() => true),
  cache(() => expensiveColor()),
  cache(() => blablabla()),
  cache(() => blablabla()),
  cache(() => blablabla()),
  cache(() => blablabla())
);
```
