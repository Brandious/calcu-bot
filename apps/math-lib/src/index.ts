/**
 * Evaluates a mathematical expression given as a string.
 * @param expression - The mathematical expression to evaluate.
 * @returns The result of the evaluation.
 * @throws Will throw an error if the expression is invalid.
 */
export const evaluateExpression = (expression: string): number => {
    // Function to validate the expression
    const isValidExpression = (expr: string): boolean => {
        // Updated regex to allow leading +/- and multiple operators
        const regex = /^[-+]?[0-9+\-*/().\s]+$/;
        return regex.test(expr);
    };

     // Function to tokenize the expression handling negative numbers
     const tokenize = (expr: string): string[] => {
        const tokens: string[] = [];
        const chars = expr.replace(/\s+/g, '').split('');
        let currentNumber = '';
        let isNegative = false;

        for (let i = 0; i < chars.length; i++) {
            const char = chars[i];
            const prevChar = i > 0 ? chars[i - 1] : null;

            // Handle numbers (including decimals)
            if (!isNaN(Number(char)) || char === '.') {
                currentNumber += char;
                continue;
            }

            // Push accumulated number if exists
            if (currentNumber) {
                tokens.push(isNegative ? `-${currentNumber}` : currentNumber);
                currentNumber = '';
                isNegative = false;
            }

            // Handle operators
            if (['+', '-', '*', '/', '(', ')'].includes(char)) {
                // Check for negative numbers
                if (char === '-' && (
                    i === 0 || // Start of expression
                    prevChar === '(' || // After opening parenthesis
                    prevChar && ['+', '-', '*', '/'].includes(prevChar) // After operator
                )) {
                    isNegative = true;
                    continue;
                }
                tokens.push(char);
            }
        }

        // Push final number if exists
        if (currentNumber) {
            tokens.push(isNegative ? `-${currentNumber}` : currentNumber);
        }

        return tokens;
    };


    // Function to perform the calculation
    const calculate = (tokens: string[]): number => {
        let numStack: number[] = [];
        let opStack: string[] = [];

        const applyOperation = () => {
            const operator = opStack.pop()!;
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
                    applyOperation();
                }
                opStack.pop(); // Remove '('
            } else {
                while (opStack.length && 
                       precedence(opStack[opStack.length - 1]) >= precedence(token)) {
                    applyOperation();
                }
                opStack.push(token);
            }
        }

        while (opStack.length) {
            applyOperation();
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

   
       // Evaluate the expression
    try {
        const tokens = tokenize(expression);
        return calculate(tokens);
    } catch (error) {
        throw new Error(`Error evaluating expression: ${error.message}`);
    }
};
