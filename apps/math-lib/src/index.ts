/**
 * Evaluates a mathematical expression given as a string.
 * @param expression - The mathematical expression to evaluate.
 * @returns The result of the evaluation.
 * @throws Will throw an error if the expression is invalid.
 */
export const evaluateExpression = (expression: string): number => {
    // Function to validate the expression
    const isValidExpression = (expr: string): boolean => {
        // Regular expression to validate the expression
        const regex = /^[0-9+\-*/().\s]+$/;
        return regex.test(expr);
    };

    // Function to perform the calculation
    const calculate = (tokens: string[]): number => {
        let numStack: number[] = [];
        let opStack: string[] = [];

        const applyOperation = (operator: string) => {
            const b = numStack.pop()!;
            const a = numStack.pop()!;
            switch (operator) {
                case '+':
                    numStack.push(a + b);
                    break;
                case '-':
                    numStack.push(a - b);
                    break;
                case '*':
                    numStack.push(a * b);
                    break;
                case '/':
                    if (b === 0) throw new Error("Division by zero");
                    numStack.push(a / b);
                    break;
            }
        };

        for (let token of tokens) {
            if (!isNaN(Number(token))) {
                numStack.push(Number(token));
            } else if (token === '(') {
                opStack.push(token);
            } else if (token === ')') {
                while (opStack.length && opStack[opStack.length - 1] !== '(') {
                    applyOperation(opStack.pop()!);
                }
                opStack.pop(); // Remove '('
            } else {
                while (opStack.length && precedence(opStack[opStack.length - 1]) >= precedence(token)) {
                    applyOperation(opStack.pop()!);
                }
                opStack.push(token);
            }
        }

        while (opStack.length) {
            applyOperation(opStack.pop()!);
        }

        return numStack[0];
    };

    // Function to determine operator precedence
    const precedence = (operator: string): number => {
        if (operator === '+' || operator === '-') return 1;
        if (operator === '*' || operator === '/') return 2;
        return 0;
    };

    // Validate the expression
    if (!isValidExpression(expression)) {
        throw new Error("Invalid expression");
    }

    // Tokenize the expression
    const tokens = expression
        .replace(/\s+/g, '') // Remove whitespace
        .split(/([\+\-\*\/\(\)])/)
        .filter(token => token.length > 0); // Filter out empty tokens

    // Evaluate the expression
    return calculate(tokens);
};
