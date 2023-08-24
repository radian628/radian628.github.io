<!--template=blogpost-template.html-->

# General Programming Advice
This is a list of very general, near-universally-applicable programming advice that I anticipate will greatly assist new programmers.

## Disregard Dogma
I'm fully aware that there are probably a billion articles out there, many of them telling you that there is one correct language, one correct programming paradigm, one correct IDE, et cetera. If there is one thing I hope you take away from this article, it's that you should disregard this kind of dogma, because it is quite simply not true. Programming is a vast field that encompasses a colossal variety of applications. There is *no one tool that will fit the job every single time for every single person*. This idea even applies to this very guide: Nothing I put here is a hard-and-fast rule. If your judgement tells you to break one of these guidelines, then disregard that guideline and follow your judgement. After all, I've based these on my experience, an experience that encompasses a tiny subset of what programmers do as a whole. For instance, the next piece of advice&mdash; to not focus on performance optimization&mdash; may not apply if you're currently writing a game that is getting slow, choppy framerates.
 
## Performance optimization is less important than you think
The importance of performance optimization&mdash; or lack thereof&mdash; is going to be a theme throughout this document. Seriously, if there's one thing to take away (well, if there's *another* thing to take away&mdash; the first, as stated before, is to disregard dogma), it's that you shouldn't optimize unless you have an actual, genuine, concrete reason to do so. Your default mode should not be "how do I make this code run as fast as possible before continuing?"; it should be "how do I make this code run?". Performance optimization can obscure your intentions, forcing your future self to reverse-engineer the underlying purpose behind a segment of code rather than immediately knowing what it does by looking at it.

## Make your code document itself
You've probably been told to comment your code. And this is good advice, don't get me wrong. But this is far from the only thing you can do to allow both yourself and others to understand your code. Another method which is very useful&mdash; in fact, if you ask me, it's *even more* useful&mdash; is to treat the code *itself* as documentation. Let the code *itself* demonstrate what it's supposed to be doing. This can eliminate the need for wordy, superfluous comments. 

### What *not* to do

Take a look at this JavaScript code which capitalizes a string and then prints it to the console.

```js
let str = "test";
let str2 = "";
for (let i = 0; i < str.length; i++) {
    str2 += String.fromCharCode(str.charCodeAt(i) - 32);
}
console.log(str2);
```

There are a few things wrong with this code:
- The variable names don't describe what the variables mean. What is `str`? What is `str2`?
- The purpose of the statement inside of the `for` loop isn't immediately obvious. Sure, you could probably figure out what it does after thinking for a bit, but it still takes some effort.

### Let's add comments!

```js
// lowercase string
let str = "test";
// uppercase string
let str2 = "";
for (let i = 0; i < str.length; i++) {
    // capitalize the ith character from the lowercase string, and add it onto the end of the upper case string
    str2 += String.fromCharCode(str.charCodeAt(i) - 32);
}
console.log(str2);
```

Sure, this may have provided some clarification, but now there's all this text that another programmer has to read. On top of this, they may have to go *back* to those comments if they ever have to remember what these cryptic variables do. This might seem silly and inconsequential in an example as short as this, but what if this were a 100-line function?

### The self-documenting version:

Here's a version that communicates the exact same ideas, but without using any comments:
```js
function capitalizeCharacter(char) {
    return String.fromCharCode(char.charCodeAt(0) - 32);
}

let lowercaseStr = "test";
let uppercaseStr = "";
for (let char of lowercaseStr) {
    uppercaseStr += capitalizeCharacter(char);
}
console.log(uppercaseStr);
```

As you can see, we've fixed many of the problems of the previous two examples:
- The strings now clearly describe their purpose. `str` is now `lowercaseStr` and `str2` is now `uppercaseStr`.
- The `for` loop has becom a `for` `of` loop. This more cleanly communicates the purpose of the loop&mdash; to iterate through all the characters of the string in order&mdash; without forcing a reader to think about the indexing variable `i`, which is only really used incidentally.
- The contents of the `for` loop have been moved into their own function, `capitalizeCharacter`. Reusability benefits aside, this also allows us to encapsulate the concept of "capitalizing a character" into a single, distinct function. Now anyone who sees this code knows that, regardless of how it's implemented under-the-hood, `capitalizeCharacter` will take a lowercase letter and make it uppercase. 

The underlying theme here is that variable names, function names, code structure, and use of language features can communicate a message within your code, a message that can be strategically manipulated to make the purpose of your code clear.

## Don't reinvent the wheel
I have a rule of thumb when I program: Whenever I am about to do some task that will take me longer than a minute or two, but isn't so oddly specific that it's only something *I'd* do for my program, I try to look it up to make sure it doesn't already exist in the standard library. In fact, I'm gonna let you in on a little secret: the entire example we just did in the last portion of this article could've been shortened down to this:
```js
let lowercaseStr = "test";
let uppercaseStr = lowercaseStr.toUpperCase();
```

Yeah. JavaScript can *already* capitalize strings&mdash; no loops or whatnot necessary. That would've saved us a lot of trouble!

### A caveat
There is a caveat to this principle of not reinventing the wheel: Don't let it interfere with your fun. If you're making a personal project for fun, don't let the fact that somebody made a similar thing already discourage you, especially if you're finding the project fun in its own right.

## Maintain a Single Source of Truth

### The Problem
If you've been programming for some time, you have almost certainly encountered a dreaded *synchronization bug*. You may know what I'm talking about already, but here's an example for clarity. Let's say you have a drawing application, where you can draw onto an image in one of two colors: Red, or Blue. As such, you have two buttons: One to change the color to red; and the other to change the color to blue.

<div class="centered"><div>
<button>Red</button><button>Blue</button>
</div></div>

Now, whenever you click one of these buttons, you want two things to happen:
- The button should be highlighted to indicate which button you clicked.
- The image should now be drawn to in the given color.

So, for instance, if you hit the <button>Red</button> button, the UI would update like so:
 
<div class="centered"><div>
<button style="border-width: 4px;">Red</button><button>Blue</button>
</div></div>

The obvious but potentially problematic way to do this would be to have code that does the following when the red button is clicked:
1. Adds an outline to the "red" button.
2. Removes the outline from the "blue" button.
3. Sets a variable that indicates that any future drawing should occur in red.

I hope you can see how this is a problem.

Let's say that for the sake of argument, we implement a similar function for the <button>Blue</button> button. However, *we forget to remove the outline from the other button*. Then, let's say we try to test the program by first pressing the red button and then pressing the blue button. This is the resulting situation:
- Image: Will draw in blue.
- Buttons: <button style="border-width: 4px;">Red</button><button style="border-width: 4px;">Blue</button>

Notice how everything is now out of sync&mdash; the image is drawing in the color we expect, since the last button we pressed is the blue button. However, the buttons are wrong. We want <button>Red</button><button style="border-width: 4px;">Blue</button>, but because we forgot to remove the outline from the other button, we have <button style="border-width: 4px;">Red</button><button style="border-width: 4px;">Blue</button>. This is what I call a synchronization bug.

Now you might be telling me that this is somewhat silly, which makes sense: You only have to change three pieces of data here. How could you forget one of them when there's so little to be kept track of? To that, I ask, what if your code has ten, fifty, maybe a hundred situations like this? What if, in the example I've already given, you add a color picker that *also* must be kept in sync with the red/blue buttons and the image drawing? What if you also change the color of the cursor to reflect the current color being drawn to the image? What if you display the hexadecimal code of the color elsewhere as well? Every single one of these things has to somehow be kept in sync with all the others&mdash; a change to one means you must update everything else. Forgetting a single one of these updates can potentially create a difficult-to-trace bug that only happens under very specific circumstances.

### The Solution
Fortunately, there is a solution to this sort of problem:

Everything in your code should have a single source of truth. 

What does this mean? When mulitple things must be kept in sync (like, for instance, the button highlight and the draw color), they should all be based on the *same* piece of data rather than having their own data that must be kept in sync. When that piece of data changes, everything that it's based on (we can also call these its *dependents*) should update. How can we apply this to our button example above?

Let's remove all the logic of changing button outlines and draw colors from the buttons themselves and instead put all that logic in another function. This function will take a color as input, and will do the following:
1. Iterate through all the buttons.
    - If the button's color matches the color passed into the function, set it to be highlighted.
    - Otherwise, set it to *not* be highlighted.
2. Set the draw color to the color passed into this function.

Now, wherever we need to set the color (specifically, when the buttons respond to clicks), we simply call the function. If we needed to add other things that depend on the color, we change those in the function as well&mdash; for example, if the color of the cursor needs to update to match the draw color, we could update the cursor in the function. Conversely, if we need to add other things that change the color themselves&mdash; like a color picker, for instance&mdash; they simply need to call the function as well. In this case, this color-changing function acts as the "single source of truth"&mdash; the one thing that determines the state of all these otherwise disparate elements that would need to be manually kept in sync had it not been there.

In general, you should seek to create a single source of truth wherever reasonably possible in your code. Any time you notice multiple things that have to be kept in sync, try to get them to all derive their states from a single source of truth, whether that be a function that changes them all simultaneously, a variable, et cetera. 

## Use Guard Clauses to eliminate if-statement pyramids
If you've had to deal with lots of nested conditions, you've probably come across the dreaded if-statement pyramid.
```js
function doSomething() {
    if (variable) {
        if (variable.get("property")) {
            if (variable.get("property").subProperty) {
                // do something...
            }
        }
    }
}
```

These can show up in a variety of different contexts where you need to check several conditions before performing some operation. They might seem fairly innocuous at first&mdash; that is until you've gone halfway across the width of the page in a nested tree of if-statements.

Here is an alternative way of handling this kind of situation, which sidesteps all of this ugly nesting:
```js
function doSomething() {
    if (!variable) return;
    if (!variable.get("property")) return;
    if (!variable.get("property").subProperty) return;

    // do something...
}
```

Rather than checking if each condition is *true* in order to do something, we check if each condition is *false*, and exit the function early if it is. This method of breaking out of the function early to handle conditional logic is called a "guard clause," and it is extremely effective for getting rid of nested if-statement trees.

(And, for those who are aware and are yelling at me through their monitors, yes, I know this last example could have been done *even better* with optional chaining)

