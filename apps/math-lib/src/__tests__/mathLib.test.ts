import { evaluateExpression } from '../index';

describe('Expression Evaluation', () => {
    it('should evaluate a valid expression correctly', () => {
        const result = evaluateExpression('2 + 2');
        expect(result).toBe(4);
    });

    it('should throw an error for division by zero', () => {
        expect(() => evaluateExpression('2 / 0')).toThrow('Division by zero');
    });

    it('should handle negative numbers', () => {
        const result = evaluateExpression('-2 + 3');
        expect(result).toBe(1);
    });

    it('should handle complex expressions', () => {
        const result = evaluateExpression('3 + 5 * (2 - 8)');
        expect(result).toBe(-27);
    });
});