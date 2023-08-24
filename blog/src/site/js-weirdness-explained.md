<!--template=blogpost-template.html-->

# JavaScript Weirdness Explained

If you've been in online programming communities for more than a few microseconds, you've probably stumbled across *this* image, showcasing what appears to be a lot of very strange behavior in JavaScript:

<img src="public/js-weirdness.jpg" class="centered image">

I'm going to explain why all of these work the way they do.

## `typeof NaN` is `number`
For those who aren't aware, `NaN` stands for "Not a Number" and `typeof` gets the data type of something and prints it as a string. So why is something that's quite literally *Not a Number* treated as a number? WTF, Javascript?

The funny thing is that this isn't even the fault of JavaScript. This is the fault of floating point numbers, the underlying implementation of numbers in JavaScript, that, mind you, is *also* present in virtually every other modern programming language in existence. The floating point number specification *explicitly includes `NaN` values*. Thus, `NaN` *is* a floating-point number, and thus `typeof NaN` returns `number`. By the way, if you *do* want to explicitly detect `NaN`s, there's an `isNaN` function.

## `9999999999999999` is `10000000000000000`
Once again, this is a product of floating-point numbers. As floating-point numbers get bigger, they become less and less precise. At these sizes, the numbers are so large that they cannot represent consecutive integers. Thus, `9999999999999999` is rounded up. To JS detractors' credit here, JavaScript *does* make *everything* floating point by default, so this weirdness may be unexpected to a newcomer (though regular old integers found in other languages have the same problem, they can just go a bit higher). That being said, you *can* make a `BigInt` that supports arbitrary precision by putting an `n` after the end of the number&mdash; i.e. you'd want `9999999999999999n`. 

## `0.5 + 0.1 == 0.6`, but `0.1 + 0.2 != 0.3`???
Once again, this is a product of floating point numbers. It seems that this is the *real* beef this meme has is with floating point numbers. In short, this error is happening because all floating point numbers in their exact form can be represented as n * 2<sup>k</sup>, where *n* and *k* are integers. In other words, a floating point number is always exactly equal to an integer multiplied by an integer power of two. In this format, it is quite literally impossible to 100% precisely represent 0.1, 0.2, 0.3, and 0.6, leaving you with a tiny bit of error. If that error doesn't happen to cancel out, the two operands aren't going to be exactly equal. It is not good practice to compare noninteger floats anyway (at least, not without some small margin of error), so don't do it.

## `Math.max()` is `-Infinity` and `Math.min()` is `Infinity`
You'd expect a function called `Math.max` to return the maximum possible JavaScript number, right? And yet it returns the minimum possible number, `-Infinity`. But this misrepresents what this function is actually designed to do. `Math.max` doesn't return the maximum possible JS number. It returns the maximum of all of its arguments. So if you did `Math.max(3, 5)`, you'd get `5`. If you did `Math.max(3)`, you'd get 3. If you did `Math.max()`, then... wait, hold on, what is it even comparing its arguments against? Well, if it compared them against, say, `-100000`, then what if I did `Math.max(-100001)`? It'd erroneously return `-100000`. I need some number that is smaller than *everything else* so that no matter what I pass into `Math.max`, the original value it's comparing against will be overwritten. What number is smaller than everything else? `-Infinity`.

If you're still confused, it's kind of like how if you're adding together a list of numbers using a `for` loop, you would want to do it like this:
```js
let sum = 0;
for (let num of numList) {
  sum += num;
}
console.log(sum);
```

Notice how you specifically start with `0`. If `numList` were empty, you'd just get `0`. This makes sense, because `0` is the *additive identity*. This means that applying the addition (`+`) operation with `0` as one of the operands will simply return the other operand. Sound familiar? `-Infinity` is the identity element for `Math.max`.

This exact same logic applies to `Math.min` and `Infinity` too.

## `[] + []` is `""`
`+` serves two main purposes in JavaScript: addition and string concatenation. So `1 + 1` is `2`, but `"1" + "1"` is `"11"`. When you try to use `+` on an array, it attempts to do the "string concatenation" version. Consequently, JavaScript tries to convert the arrays into strings. When an array is converted into a string, it converts each element into a string and joins them together, separated by commas. So `[1,2,3].toString()` is `"1,2,3"`. Naturally, an empty array has nothing to separate by commas, so it simply becomes an empty string&mdash; that is, `[]`.toString() becomes `""`. So when you try to "add" two arrays together, they're both coerced into empty strings, and then concatenated to become another empty string.

## `[] + {}` is `"[object Object]"`
A similar story is going on here. `[]` is coerced to an empty string, as usual. However, `{}` is coerced to a completely different string: `"[object Object]"`. You can try doing this just like with the empty array: `({}).toString()` is `"[object Object]"`. This string is designed to tell you two things: What you have is an `object` (not a primitive type) and it is of type `Object`. Try doing this with other kinds of objects and see what happens: `[] + new Map()` is `"[object Map]"` and `[] + document.createElement("div")` is `"[object HTMLDivElement]"`.

## `{} + []` is `0`
Given the previous example, you may wonder why this isn't *also* `"[object Object]"`. In fact, if you do `({}) + []`, you *do* get `"[object Object]"`. This isn't `"[object Object]"` because `{}`, in this case, is *not* data. It's actually a scope for limiting the lifetime of variables. You'd normally write this the way you see below:

```js
{
}
+ [];
```

If you're still confused, the curly braces effectively mean the exact same thing as the following:

```js
if (true) {
}
+ [];
```

What we have here is an anonymous block created to limit the scope of variables, immediately followed by the unary plus operator (that is, `+` with only a single argument), taking an empty array as its one argument. In fact, you could write this like `+ []` and it'd do the same thing&mdash; *the `{}` does nothing*. The unary plus operator attempts to coerce its operand into a number. An empty array is coerced into `0`. Why? It's kind of a two-step process. When JavaScript attempts to coerce something into a number, it tries three things in order, stopping when the first one produces a number or a primitive value that can be coerced into a number:
1. Tries to call the object's `Symbol.toPrimitive` function. I tried to see if the array data type had this function by typing out `[][Symbol.toPrimitive]`, but this returned `undefined`, so evidently, no such function exists.
2. Tries to call the object's `valueOf` function. `[].valueOf()` just returns another array, so no luck here. If JS kept trying this, it'd just end up in an infinite loop. It only pursues this method if `valueOf` returns a primitive.
3. Tries to call the object's `toString` function. As we established earlier, an empty array coerces to an empty string when converted to a string, so JS now has an empty string, `""`. Nice, we have our primitive!

This empty string is then coerced into a number, as that is what unary `+` does. What number does an empty string coerce to? `0`.

And thus, `{} + []` is `0`. 

## `true + true + true` is `3`
Okay, after that one, it's nice to have something simpler. This is more or less a byproduct of how C, C++, Java, etc. handle booleans. In those languages, `true` is `1` and `false` is `0`. In fact, you can try this in C++ and it'll resolve to `3` as well.

## `true - true` is `0`
See the above explanation.

## `true == 1` is `true`
See the above explanation.

## `true === 1` is `false`
Okay, this one is slightly weirder. `==` in JavaScript tries to perform type coercion to make its operands the same type when checking equality. Conversely, `===` does no such thing. If its two operands are different types, it will return false because it will not attempt to coerce them. Similarly, `1 == "1"` is `true`, but `1 === "1"` is `false`.

## `(!+[]+[]+![]).length` is `9`
Alright, let's break this one down.

### `+[]`
Let's start out with the first `+[]`. As we've established earlier, applying the unary `+` operator to `[]` gives us `0`. 

### `!+[]`
We then apply the `!` operator (the first exclamation mark) to that, coercing it into the boolean `false` and negating it to give us `true`.

### `!+[]+[]`
So now we have `!+[]+[]`, which evaluates to `true+[]`, as established in the last step. Since we're using the *binary* `+` operator on an array, it tries to convert it to a string to use it in string concatenation. It also tries to convert `true` to a string. `true` becomes `"true"` and `[]`, as we've established before, becomes `""`. `"true"+""` is `"true"`, so now we have the string `"true"`.

### `!+[]+[]+![]`
Substituting in the last step, this is actually `"true"+![]`. `![]`, as expected, tries to coerce `[]` to a boolean and then negate it. JavaScript has a concept of "truthy" and "falsy" values&mdash; i.e. values treated as `true` and values treated as `false`. Everything is truthy except for `null`, `NaN`, `0`, empty strings, and `undefined`. Therefore, `[]` is truthy, so `![]` becomes `!true`, which becomes `false`.

Remember that we were originally trying to evaluate `"true"+![]`. Substituting gives us `"true"+false`. Once again, the `+` operator is treated as string concatenation, giving us `"true"+"false"` as `false` is coerced to string. This in turn resolves to `"truefalse"`.

### `(!+[]+[]+![]).length`
Substituting what we have before, we can convert this statement to `("truefalse").length`. This string is nine characters long. Thus, this entire thing resolves to `9`.

## `9 + "1"` is `"91"`
You should probably be able to guess what's happening here by this point. One of the arguments to `+` is a string, so it attempts to perform string concatenation.

## `91 - "1"` is `90`
Unlike the `+` operator, the `-` operator has no string analogue. Therefore, when it's given strings, it coerces them to numbers.

## `[] == 0` is `true`
The `==` operator first converts the empty array to a primitive the same way described earlier&mdash; it tries `Symbol.toPrimitive`, then `valueOf`, then finally `toString`. For arrays, only the last one exists, so it uses it, producing an empty string.

Then, we use the weird rules of `==` to do the rest: When comparing a number to a non-number, `==` will always coerce the non-number into a number. As stated before, the empty string `""` coerces into `0`. `0 == 0`, so we get `true`.

## Conclusion
So that's how everything in this image actually works. If you see someone making fun of JavaScript, send them this link! That way, they can make fun of the language even more given the absurd length and complexity of these small, unassuming expressions. In all seriousness though, most of this stuff rarely ever becomes much of a problem in actual JavaScript code. If you give the language the same due dilligence you'd give any other language, you'll do just fine. And if you're *really* concerned, then just use TypeScript.

Oh also, thanks to [Mozilla Web Docs](https://developer.mozilla.org/en-US/) for providing me with some of the weirder, wackier specifics of JavaScript's arcane type coercion rules.