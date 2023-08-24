<!--template=blogpost-template.html-->

# In defense of learning JavaScript

Out of all the languages out there (except possibly PHP and COBOL), JavaScript is among the most widely mocked and derided. You can hardly scroll a few thousand pixels in a programming community before seeing a post about some quirky JavaScript behavior that seems to defy all logic or some mishap in the JavaScript ecosystem that causes millions of webapps around the globe to suddenly and unceremoniously crash.

But while there are certainly valid criticisms of JavaScript, there is one that I think is leveled at it *too often* and *too unfairly*: That it's a poor choice of a first language. In this video I'll explain my case for why JavaScript can not only *work* as a first language, but can in fact work *well* as a first language. I'll also address several arguments that attempt to claim otherwise.

## A low barrier to entry

Picture this: You're a programmer learning C++. You want to make a simple 2D graphical application. So you find some library that does that for you and you download it. You immediately get lost in the build process, the nested tree of files, the compiler flags, the PATH environment variable, the linker errors, the compiler incompatibilities, et cetera. Anyone who's used C++ can tell you that the experience of trying to add external dependencies to your project is a complete nightmare.

Compare this to JavaScript, where 2D graphics is essentially built in with HTML/CSS and the Canvas API. In general, JS is going to provide substantially more out-of-the-box than the average language, simply because *so many features* come bundled with the browser. 

Here's another example of JS's low barrier to entry: With C++, you're encouraged to spin up a bloated, complicated IDE or use the terminal and have to figure out how environment variables work. Sure, an experienced programmer will find these things trivial, but a newcomer? Not so much. Conversely, with JS, you could quite literally edit the entire thing in Notepad, double click the HTML file, and open it up in a browser, and *It'll. Just. Work.*

The underlying point here is that JavaScript has a far lower barrier to entry than C++ and many other such languages because it forces you to do very little up front. Sure, you could argue that a programmer might have to worry about NPM, React, Webpack, or all of those other fancy webdev tools out there, but here's the thing: None of those things are mandatory! All you *have* to do is write a few text files and open them in a browser. *That's it.*

## Easy to share

JavaScript's low barrier to entry extends beyond project creation. Anything you create in JavaScript is also going to be extremely easy to share. The simplest way of going about this is to shove all the files in a ZIP file and send it to someone. There's a very good chance they'll be able to directly open it in a browser by double clicking. No lengthy install process. No adding dependencies. No "missing library" errors. 

Even better yet, you can get a web server and host it directly in the browser, so all someone has to do to access the thing you made is to click on a URL. Getting free static site hosting is easy: This site *itself* is hosted on [GitHub Pages](https://pages.github.com/) for free. Other sites like [Neocities](https://neocities.org/) also offer free static site hosting. There are more examples than just those two&mdash; just google "free static site hosting" and you'll get a bunch of them.

## "It does everything for you! You'll take too much for granted!"

This is one of the more common arguments I see levied against JavaScript&mdash; that, because of how high-level and "hand-holdy" it is with its type coercion, automatic memory management, and carefree, happy-go-lucky attitude towards doing things that *should* produce errors, it's spoiling novice programmers and not preparing them for the rude awakening that will be C++, Java, Rust, or whatever other lower level language they might stumble across next.

What if I told you that it's doing the exact opposite.

JavaScript's cool features are also a curse. A blight on any programmer that tries to make a complex application. Because the flexibility you earn from its extremely loose compile-time rules is flexibility you make up for in *extremely frequent run-time errors*. In fact, this in and of itself is another common complaint against JS: Because of its incredibly lax rules, writing JavaScript code requires immense effort to avoid accidentally causing runtime errors, forcing programmers to spend hours debugging issues that a compiler would have otherwise caught instantly.

But wait, don't we *want* new programmers to get good at debugging?

In this regard, JavaScript's lack of compile-time guarantees work to its favor as a learning tool. Because it results in so many runtime errors, it *forces new programmers to learn how to debug their code*. In a way, it's like the flipside of trying to get around C++ compiler errors: In one, you try to debug the issue at compile time; in the other, you try to debug the issue at runtime.
