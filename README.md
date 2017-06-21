# Calculator Exercise

This basic calculator app can be used in the browser with its UI, or through its simple API.

This was built as an exercise and is not intended for real world use.

### Demo

https://jonmcpherson.github.io/calculator-exercise/

### Testing

* clone repository
* install dependencies
```$ npm install```
* run tests
```$ npm test```

### Usage

```javascript
Calculator.input("2 + 3 * 4 =") === "14";
```
```javascript
Calculator.input("2 + 3 * 4");
Calculator.evaluate() === 14;
```
```javascript
Calculator.input("2 +") === "2";
Calculator.input("3") === "3";
Calculator.input("* 4") === "4";
Calculator.input("=") === "14";
```
Supported operator/action symbols:
```
add: +
subtract: -
multiply: *
divide: /
reciprocal: 1/x
factor: !
square root: √
negate: ±
decimal: .
evaluate: =
delete: ←
clear entry: CE
clear all: C
```
