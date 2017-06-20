var expect = require("chai").expect;
var calculator = require("./calculator");

describe("calculator-exercise", function () {
    it("evaluates multiple calculations", function () {
        calculator.input("2 + 2");
        expect(calculator.evaluate()).to.equal(4);

        calculator.input("+ 5");
        expect(calculator.evaluate()).to.equal(9);
    });

    it("evaluates with cleared entry", function () {
        calculator.input("7 + 8 CE + 7");
        expect(calculator.evaluate()).to.equal(14);
    });

    it("evaluates with preceding negative operand", function () {
        calculator.input("C"); // Clear input from previous evaluation to prevent chaining
        calculator.input("-5*5/3");
        expect(calculator.evaluate()).to.be.within(-8.33334, -8.33333);
    });

    it("evaluates with following operand negated", function () {
        calculator.input("7 + 6±");
        expect(calculator.evaluate()).to.equal(1);
    });

    it("evaluates multiple operations in order", function () {
        calculator.input("C"); // Clear input from previous evaluation to prevent chaining
        calculator.input("-5 * 5 - 15 / 3");
        expect(calculator.evaluate()).to.equal(-30);
    });

    it("evaluates single input with cleared operation", function () {
        calculator.input("5! / 12 C + 9");
        expect(calculator.evaluate()).to.equal(9);
    });

    it("evaluates with reciprocal", function () {
        calculator.input("0.5 1/x * 2");
        expect(calculator.evaluate()).to.equal(4);
    });

    it("quits the program", function () {
        // Not really sure what should actually happen
        expect(function () {
            calculator.input("Q")
        }).to.throw();
    });
});