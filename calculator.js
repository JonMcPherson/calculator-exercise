(function (global, factory) {
    if (typeof define === 'function' && define.amd) {
        define([], factory);
    } else if (typeof module !== 'undefined' && module.exports) {
        module.exports = factory();
    } else {
        global.Calculator = factory();
    }
})(this, function () {
    "use strict";

    var result = 0;

    var operations = Object.create(Object.assign(Array.prototype, {
        peek: function () {
            return this[this.length - 1];
        }
    }));

    var operators = {
        add: new Operator(1, "+", function (a, b) {
            return a + b;
        }),
        subtract: new Operator(1, "-", function (a, b) {
            return a - b;
        }),
        multiply: new Operator(2, "*", function (a, b) {
            return a * b;
        }),
        divide: new Operator(2, "/", function (a, b) {
            return a / b;
        }),
        negate: new Operator(3, "±", function (num) {
            return -num;
        }),
        squareRoot: new Operator(3, "√", function (num) {
            return Math.sqrt(num);
        }),
        reciprocal: new Operator(3, "1/x", function (num) {
            return 1 / num;
        }),
        factor: new Operator(3, "!", function (num) {
            var result = 1;
            for (var i = 2; i <= num; i++) {
                result *= i;
            }
            return result;
        })
    };


    function addOperation(number, operation) {
        result = number;
        var lastOperation = operations.peek();
        if (!lastOperation || operation.operator.order > lastOperation.operator.order) {
            operations.push(operation);
            operation.addOperand(number);
        } else {
            // Combine operations
            lastOperation.addOperand(number);
            calculate(operation.operator.order);
            operation.addOperand(operations.pop());
            operations.push(operation);
        }
        calculate(operation.operator.order);
        return result;
    }

    function evaluate(number) {
        var lastOperation = operations.peek();
        if (lastOperation) {
            lastOperation.addOperand(number);
            calculate(0);
        } else {
            result = number;
        }
        operations.length = 0;
        return result;
    }

    function calculate(order) {
        var operation = operations.peek();
        if (!operation || !operation.isSaturated()) {
            return;
        }
        operations.pop();
        var lastOperation = operations.peek();
        if (lastOperation && lastOperation.operator.order >= order) {
            lastOperation.operands.push(operation);
            calculate(order);
            return;
        }

        operations.push(operation);
        result = operation.execute();
    }


    function Operator(order, symbol, func) {
        this.order = order;
        this.symbol = symbol;
        this.operate = func;
        this.arity = func.length;
    }

    function Operation(operator) {
        this.operator = operator;
        this.operands = [];
    }

    Object.assign(Operation.prototype, {
        execute: function () {
            return this.operator.operate.apply(this, this.operands.map(function (operand) {
                if (operand.constructor === Operation) {
                    return operand.execute();
                }
                return operand;
            }));
        },
        addOperand: function (operand) {
            if (!this.isSaturated()) {
                this.operands.push(operand);
            }
        },
        isSaturated: function () {
            return this.operands.length === this.operator.arity;
        }
    });

    function Controller() {
        var input = result.toString();
        var clearOnNumber = false;

        var Action = function(symbol, handler) {
            this.symbol = symbol;
            this.execute = handler;
        }

        var actions = (function () {
            var operatorHandler = function (operator) {
                return function () {
                    addOperation(Number(input), new Operation(operator));
                    input = result.toString();
                    clearOnNumber = true;
                };
            };

            var actions = {};
            for (var name in operators) {
                var operator = operators[name];
                actions[name] = new Action(operator.symbol, operatorHandler(operator));
            }
            actions.back = new Action("←", function () {
                input = input.substr(0, input.length - 1);
                if (!input.length) {
                    input = "0";
                }
            });
            actions.clear = new Action("C", function () {
                operations.length = 0;
                input = "0";
            });
            actions.clearEntry = new Action("CE", function () {
                input = "0";
            });
            actions.evaluate = new Action("=", function () {
                evaluate(Number(input));
                input = result.toString();
                clearOnNumber = true;
            });
            actions.quit = new Action("Q", function () {
                if (typeof window !== "undefined") {
                    window.dispatchEvent(new Event("unload"));
                }
                // Not really sure how else it would "exit"
                throw "Program has exit";
            });
            return actions;
        })();

        var findActionBySymbol = function (input) {
            var bestMatch = null;
            for (var name in actions) {
                var action = actions[name];
                if (input.lastIndexOf(action.symbol, 0) === 0) {
                    if (!bestMatch || bestMatch.symbol.length < action.symbol.length) {
                        bestMatch = action;
                    }
                }
            }
            return bestMatch;
        };

        this.input = function (value) {
            // value can be an entire equation or only part of an equation
            value = (value && value.replace(/\s/g, "")) || "";

            for (var i = 0; i < value.length; i++) {
                var action = findActionBySymbol(value.substr(i));
                if (action) {
                    action.execute();
                    i += action.symbol.length - 1;
                } else {
                    var char = value[i];
                    if (char === ".") {
                        // Ignore duplicate decimal points
                        if (input.indexOf(".") === -1) {
                            if (clearOnNumber) {
                                input = "0";
                                clearOnNumber = false;
                            }
                            input += char;
                        }
                    } else if (!isNaN(char)) {
                        if (clearOnNumber || input === "0") {
                            input = char;
                            clearOnNumber = false;
                        } else {
                            input += char;
                        }
                    } else {
                        throw new Error("Invalid symbol in '" + value + "' at index " + i);
                    }
                }
            }
            return input || "0";
        };

        this.evaluate = function () {
            this.input("=");
            return result;
        };
    }

    return new Controller();
});