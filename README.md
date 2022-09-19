# What is `this` ?!

`this` keyword has been a mystery for me for a long time.

From a background like Java, PHP or other standard language, `this` is the instance of the current object in the class method. `this` cannot be used outside the method and such a simple approach does not create confusion.

In JavaScript the situation is different: `this` is the context of a function invocation (a.k.a. exection). The language has 4 function invocation types:

- function invocation: `alert('Hello World!')`
- method invocation: `console.log('Hello World!')`
- constructor invocation: `new RegExp('\\d')`
- indirect invocation: `alert.call(undefined, 'Hello World!')`

Each invocation type defines the context in its way, so this behaves differently than the developer expects.

Moreover [strict mode](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode) also affects the execution context.


#### The key to understanding `this` keyword is having a clear view of function invocation and how it impacts the context.


Before starting, let's familiarize with a couple of terms:

- `Invocation` of a function is executing the code that makes the body of a function, or simply calling the function. For example `parseInt` function invocation is `parseInt('15')`.
- `Context` of an invocation is the value of `this` within function body.


## 1. Function Invocation

`Function invocation` is performed when an expression that evaluates to a function object is followed by an open parenthesis `(`, a comma separated list of arguments expressions and a close parenthesis `)`. For example `parseInt('18')`.

A simple example of function invocation:

```js
function hello(name) {
  return 'Hello ' + name + '!';
}
// Function invocation
const message = hello('World');
```

`hello('World')` is a function invocation: `hello` expression evaluates to a function object, followed by a pair of parenthesis with the `'World'` argument.

A more advanced example is the `IIFE` (immediately-invoked function expression):

```js
// IIFE
const message = (function(name) {
  return 'Hello ' + name + '!';
})('World');
```

IIFE is a function invocation too: the first pair of parenthesis `(function(name) {...})` is an expression that evaluates to a function object, followed by the pair of parenthesis with `'World'` argument: `('World')`.

### 1.1.`this` in a function invocation

##### `this` is the `global object` in a function invocation.

The global object is determined by the execution environment. In a browser, the global object is `window` object.

In a function invocation, the execution context is the global object.

Let's check the context in the following function:

```js
function sum(a, b) {
  console.log(this);
  this.myNumber = 20;
  return a + b;
}
// sum() is invoked as a function
// this in sum() is a global object (window)
sum(15, 16);     // => 31
window.myNumber; // => 20
```

At the time `sum(15, 16)` is called, JavaScript automatically sets `this` as the global object (`window` in a browser).

When `this` is used outside of any function scope (the topmost scope: global execution context), it also equals to the global object:

```js
console.log(this === window); // => true
this.myString = 'Hello World!';
console.log(window.myString); // => 'Hello World!'
```

```html
<!-- In an html file -->
<script type="text/javascript">
 console.log(this === window); // => true
</script>
```

### 1.2. `this` in a function invocation, strict mode

##### `this` is `undefined` in a function invocation in strict mode

The strict mode is available starting [ECMAScript 5.1](https://262.ecma-international.org/5.1/#sec-10.1.1), which is a restricted variant of JavaScript. It provides better security and stronger error checking.

To enable the strict mode place the directive `'use strict'` at the top of a function body.

Once enabled, the strict mode affects the execution context, making `this` to be `undefined` in a regular function invocation.

An example of a function called in strict mode:

```js
function multiply(a, b) {
  'use strict'; // enable the strict mode
  console.log(this); // => undefined
  return a * b;
}

multiply(2, 5); // => 10
```

The strict mode is active not only in the current scope but also in the inner scopes (for all functions declared inside):

```js
function execute() {
  'use strict';
  
  function concat(str1, str2) {
    // the strict mode is enabled too
    console.log(this); // => undefined
    return str1 + str2;
  }
  
  concat('Hello', ' World!'); // => "Hello World!"
}

execute();
```

A single JavaScript file may contain both strict and non-strict modes. So it is possible to have different context behavior in a single script for the same invocation type:

```js
function nonStrictSum(a, b) {
  console.log(this); // => window
  return a + b;
}

function strictSum(a, b) {
  'use strict';

  console.log(this); // => undefined
  return a + b;
}

nonStrictSum(5, 6); // => 11

strictSum(8, 12); // => 20
```

### 1.3 Pitfall: `this` in an inner function

⚠️ A common trap with the function invocation is thinking that `this` is the same in an inner function as in the outer function.

👍 The context of the inner function (except arrow function) depends only on its own invocation type, but not on the outer function's context.

The following example is calculating a sum of two numbers:

```js
const numbers = {
  numberA: 5,
  numberB: 10,
  sum: function() {
    console.log(this); // => numbers
    function calculate() {
      // this is window or undefined in strict mode
      console.log(this); // => window
      return this.numberA + this.numberB;
    }
    return calculate();
  }
};
```

⚠️ `numbers.sum()` is a <b>method invocation</b> on an object (see [2](#2-Method-invocation)) thus `this` equals `number.calculate()` function is defined inside `sum()`, so you might expect to have this as numbers object in when invoking `calculate()` too.

`calculate()` is a <b>function invocation</b> (but not method invocation), thus here `this` is the global object window (case [1.1](##11-this-in-a-function-invocation)) or `undefined` in strict mode (case [1.2](##12-this-in-a-function-invocation-strict-mode)). Even if the outer function `numbers.sum()` has the context as numbers object, it doesn't have influence here.

The invocation result of `numbers.sum()` is `NaN` (or an error is thrown `TypeError: Cannot read property 'numberA' of undefined` in strict mode). Definitely not the expected result 5 + 10 = 15. All because `calculate()` is not invoked correctly.

we can solve this problem using indirect invocation or with arrow functions, we will see it in the next sections

## 2. Method invocation

A `method` is a function stored in a property of an object. For example:

```js
const myObject = {
  // hello is a method
  hello: function() {
    return 'Hello World!';
  }
};
const message = myObject.hello();
```

`hello` is a method of `myObject`. Use a property accessor `myObject.hello` to access the method.

Method invocation is performed when an expression in a form of [property accessor](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/Property_accessors) that evaluates to a function object is followed by an open parenthesis `(`, a comma separated list of arguments expressions and a close parenthesis `)`.

More examples of method calls are: `[1, 2].join(',')` or `[1, 2].includes(2)`.

Understanding the difference between <b>function invocation</b> (see section [1.](#1-Function-Invocation)) and <b>method invocation</b> is <b>very important!</b>

```js
const words = ['Hello', 'World'];
words.join(', ');   // method invocation

const obj = {
  myMethod() {
    return new Date().toString();
  }
};
obj.myMethod();     // method invocation
const func = obj.myMethod;
func();             // function invocation
parseFloat('16.6'); // function invocation
isNaN(0);           // function invocation
```

### 2.1. `this` in a method invocation

##### `this` is the object that owns the method in a method invocation

Let's create an object with a method that increments a number:

```js
const calc = {
  num: 0,
  increment() {
    console.log(this); // => calc
    this.num += 1;
    return this.num;
  }
};

// method invocation. this is calc
calc.increment(); // => 1
calc.increment(); // => 2
```

Calling `calc.increment()` makes the context of increment function to be `calc` object. So using `this.num` to increment the number property works well.

In ECMAScript 2015 `class` syntax, the method invocation context is also the instance itself:

```js
class Planet {
  constructor(name) {
    this.name = name;
  }
  getName() {
    console.log(this); // => earth
    return this.name;
  }
}
const earth = new Planet('Earth');
// method invocation. the context is earth
earth.getName(); // => 'Earth'
```

### 2.2. Pitfall: separating method from its object

⚠️ A method can be extracted from an object into a separated variable const alone = myObj.myMethod. When the method is called alone alone(), detached from the original object, you might think that this is the object myObject on which the method was defined.

👍 Correctly if the method is called without an object, then a function invocation happens, where this is the global object window or undefined in strict mode (see [1.1](#11this-in-a-function-invocation) and [1.2](#12-this-in-a-function-invocation-strict-mode)).

The following example defines `Pet` constructor and makes an instance of it: `myCat`. Then `setTimout()` after 1 second logs `myCat` object information:

```js
function Pet(type, legs) {
  this.type = type;
  this.legs = legs;
  this.logInfo = function() {
    console.log(this);
    console.log(`The ${this.type} has ${this.legs} legs`);
  }
}
const myCat = new Pet('Cat', 4);
// logs "The undefined has undefined legs"
// or throws a TypeError in strict mode
setTimeout(myCat.logInfo, 1000);
```

⚠️ You might think that `setTimeout(myCat.logInfo, 1000)` will call the `myCat.logInfo()`, which should log the information about `myCat` object.

Unfortunately the method is separated from its object when passed as a parameter: `setTimout(myCat.logInfo)`. The following cases are equivalent:

```js
setTimout(myCat.logInfo);
// is equivalent to:
const extractedLogInfo = myCat.logInfo;
setTimout(extractedLogInfo);
```

When the separated `logInfo` is invoked as a function, `this` is global object or `undefined` in strict mode (but not `myCat` object). So the object information does not log correctly.

we can solve this problem using indirect invocation or with arrow functions, we will see it in the next sections

## 3. Constructor invocation

`Constructor invocation` is performed when new keyword is followed by an expression that evaluates to a function object, an open parenthesis `(`, a comma separated list of arguments expressions and a close parenthesis `)`.

Examples of construction invocation: `new Pet('cat', 4)`, `new Date()`, `new Array()`.

This example declares a function Country, then invokes it as a constructor:

```js
function Country(name = 'Palestine', traveled = false) {
  this.name = name;
  this.traveled = traveled;
}

Country.prototype.travel = function() {
  this.traveled = true;
};

// Constructor invocation
const france = new Country('France', true);
// Constructor invocation
const unitedKingdom = new Country;
```


```js

class City {
  constructor(name = 'Rafah', traveled = false) {
    this.name = name;
    this.traveled = traveled;
  }
  travel() {
    this.traveled = true;
  }
}
// Constructor invocation
const paris = new City('Gaza', true);
```

`new City('Gaza')` is a constructor invocation. The object's initialization is handled by a special method in the class: `constructor`, which has `this` as the newly created object.

The role of the constructor function is to initialize the instance. A constructor call creates a new empty object, which inherits properties from the constructor's prototype.

When a property accessor `myObject.myFunction` is preceded by `new` keyword, JavaScript performs a <b>constructor invocation</b>, but <b>not a method invocation</b>.

For example `new myObject.myFunction()`: the function is first extracted using a property accessor `extractedFunction = myObject.myFunction`, then invoked as a constructor to create a new object: `new extractedFunction()`.

### 3.1. `this` in a constructor invocation

##### `this` is the newly created object in a constructor invocation

The context of a constructor invocation is the newly created object. The constructor initializes the object with data that comes from constructor arguments, sets up initial values for properties, attaches event handlers, etc.

Let's check the context in the following example:

```js
function Foo () {
  // this is fooInstance
  this.property = 'Default Value';
  console.log(this);
}
// Constructor invocation
const fooInstance = new Foo();
fooInstance.property; // => 'Default Value'
```

`new Foo()` is making a constructor call where the context is `fooInstance`. Inside `Foo` the object is initialized: `this.property` is assigned with a default value.

The same scenario happens when using `class` syntax (available in ES2015), only the initialization happens in the `constructor` method:

```js
class Bar {
  constructor() {
    // this is barInstance
    this.property = 'Default Value';
    console.log(this);
  }
}
// Constructor invocation
const barInstance = new Bar();
barInstance.property; // => 'Default Value'
```

At the time when `new Bar()` is executed, JavaScript creates an empty object and makes it the context of the `constructor()` method. Now you can add properties to object using `this` keyword: `this.property = 'Default Value'`.

### 3.2. Pitfall: forgetting about new

Some JavaScript functions create instances not only when invoked as constructors, but also when invoked as functions. For example `RegExp`:

```js
const reg1 = new RegExp('\\w+');
const reg2 = RegExp('\\w+');
reg1 instanceof RegExp; // => true
reg2 instanceof RegExp; // => true
reg1.source === reg2.source; // => true

```

When executing `new RegExp('\\w+')` and `RegExp('\\w+')`, JavaScript creates equivalent regular expression objects.

⚠️ Using a function invocation to create objects is a potential problem (excluding [factory pattern](https://blog.sessionstack.com/how-javascript-works-the-factory-design-pattern-4-use-cases-7b9f0d22151d)), because some constructors may omit the logic to initialize the object when new keyword is missing.

The following example illustrates the problem:

```js
function Vehicle(type, wheelsCount) {
  this.type = type;
  this.wheelsCount = wheelsCount;
  return this;
}
// Function invocation
const car = Vehicle('Car', 4);
car.type; // => 'Car'
car.wheelsCount // => 4
car === window // => true
```

You might think it works well for creating and initializing new objects.

However, this is window object in a function invocation (see [1.1.](#11this-in-a-function-invocation)), thus `Vehicle('Car', 4)` sets properties on the window object. This is a mistake. A new object is not created.

## 4. Indirect invocation

`Indirect invocation` is performed when a function is called using `myFun.call()` or `myFun.apply()` methods.

Functions in JavaScript are first-class objects, which means that a function is an object. The type of function object is `Function`.

From the [list of methods](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Function#Methods) that a function object has, `.call()` and `.apply()` are used to invoke the function with a configurable context.

The following example demonstrates the indirect invocation:

```js
function sum(number1, number2) {
  return number1 + number2;
}
sum.call(undefined, 10, 2);    // => 12
sum.apply(undefined, [10, 2]); // => 12
```

### 4.1. `this` in an indirect invocation

##### `this` is the first argument of `.call()` or `.apply()` in an indirect invocation

The following example shows the indirect invocation context:
```js
const rabbit = { name: 'White Rabbit' };
function concatName(string) {
  console.log(this === rabbit); // => true
  return string + this.name;
}
// Indirect invocations
concatName.call(rabbit, 'Hello ');  // => 'Hello White Rabbit'
concatName.apply(rabbit, ['Bye ']); // => 'Bye White Rabbit'
```

The indirect invocation is useful when a function should be executed with a specific context. For example, to solve the context problems with function invocation, where this is always `window` or `undefined` in strict mode (see [1.3.](#13-Pitfall-this-in-an-inner-function)). It can be used to simulate a method call on an object (see the previous code sample).

## 5. Bound function

`A bound function` is a function whose context and/or arguments are bound to specific values. You create a bound function using `.bind()` method. The original and bound functions share the same code and scope, but different contexts and arguments on execution.

The following code creates a bound function and later invokes it:
```js
function multiply(number) {
  'use strict';
  return this * number;
}
// create a bound function with context
const double = multiply.bind(2);
// invoke the bound function
double(3); // => 6
double(10); // => 20
```

### 5.1. this inside a bound function

##### `this` is the first argument of `myFunc.bind(thisArg)` when invoking a bound function

Let's see how to configure this of a bound function:
```js
const arrObj = {
  array: [3, 5, 10],
};

const numbers = {

  getNumbers() {
    return this.array;
  }
};
// Create a bound function
const boundGetNumbers = numbers.getNumbers.bind(arrObj);
boundGetNumbers(); // => [3, 5, 10]
// Extract method from object
const simpleGetNumbers = numbers.getNumbers;
simpleGetNumbers(); // => undefined or throws an error in strict mode
```

## 6. Arrow function

Arrow function is designed to declare the function in a shorter form and [lexically](https://www.freecodecamp.org/news/javascript-lexical-scope-tutorial/) bind the context.

It can used the following way:

```js
const hello = (name) => {
  return 'Hello ' + name;
};
hello('World'); // => 'Hello World'
// Keep only even numbers
[1, 2, 5, 6].filter(item => item % 2 === 0); // => [2, 6]
```

### 6.1. `this` in arrow function

##### `this` is the `enclosing context` where the arrow function is defined

The arrow function doesn't create its own execution context but takes `this` from the <b>outer function</b> where it is defined. In other words, the arrow function resolves `this` lexically.

The following example shows the context transparency property:
```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
  log() {
    console.log(this === myPoint); // => true
    setTimeout(() => {
      console.log(this === myPoint);      // => true
      console.log(this.x + ':' + this.y); // => '95:165'
    }, 1000);
  }
}
const myPoint = new Point(95, 165);
myPoint.log();
```

`setTimeout()` calls the arrow function with the same context (`myPoint` object) as the `log()` method. As seen, the arrow function "inherits" the context from the function where it is defined.

A regular function in this example would create its own context (`window` or `undefined` in strict mode). So to make the same code work correctly with a function expression it's necessary to manually bind the context: `setTimeout(function() {...}.bind(this))`. This is verbose, and using an arrow function is a cleaner and shorter solution.

If the arrow function is defined in the topmost scope (outside any function), the context is always the global object (`window` in a browser):
```js
const getContext = () => {
 console.log(this); // => window
 return this;
};
console.log(getContext() === window); // => true
```

An arrow function is bound with the lexical this once and forever. this cannot be modified even when using the context modification methods:
```js
const numbers = [1, 2];

(function() { 
  const get = () => {
    console.log(this === numbers); // => true
    return this;
  };
  
  console.log(this === numbers); // => true
  get(); // => [1, 2]
  
  // Try to change arrow function context manually
  get.call([0]);  // => [1, 2]
  get.apply([0]); // => [1, 2]
  
  get.bind([0])(); // => [1, 2]
}).call(numbers);
```

No matter how the arrow function `get()` is called, it always keeps the lexical context `numbers`. Indirect call with other context `get.call([0])` or . `get.apply([0])`, rebinding `get.bind([0])()` have no effect.

An arrow function cannot be used as a constructor. Invoking it as a constructor `new get()` throws an error: `TypeError: get is not a constructor`.

### 6.2. Pitfall: defining method with an arrow function

⚠️ You might want to use arrow functions to declare methods on an object. Fair enough: their declaration is quite short comparing to a function expression: `(param) => {...}` instead of `function(param) {..}`.

This example defines a method `format()` on a class `Period` using an arrow function:

```js
function Period (hours, minutes) { 
  this.hours = hours;
  this.minutes = minutes;
}
Period.prototype.format = () => {
  console.log(this === window); // => true
  return this.hours + ' hours and ' + this.minutes + ' minutes';
};
const walkPeriod = new Period(2, 30);
walkPeriod.format(); // => 'undefined hours and undefined minutes'
```

Since `format` is an arrow function and is defined in the global context (topmost scope), it has `this` as `window` object.

Even if `format` is executed as a method on an object `walkPeriod.format()`, `window` is kept as the context of invocation. It happens because the arrow function has a static context that doesn't change on different invocation types.

The method returns '`undefined hours and undefined minutes'`, which is not the expected result.

👍 The function expression solves the problem because a regular function does change its context depending on invocation

## 7. Conclusion

Because the function invocation has the biggest impact on `this`, from now on <b>do not</b> ask yourself:

```
Where is this taken from ?
```

but <b>do</b> ask yourself:

```
How is the function invoked ?
```

For an arrow function ask yourself:

```
What is this inside the outer function where the arrow function is defined ?
```

This mindset is correct when dealing with `this` and will save you from the headache.