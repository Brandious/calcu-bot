import Expression, { IExpression } from '../models/Expression.model'

// Function to insert a new expression
export const insertExpression = async (expression: string, result: number): Promise<IExpression> => {
    const newExpression = new Expression({ expression, result });
    return await newExpression.save();
};

// Function to retrieve all expressions
export const getAllExpressions = async (): Promise<IExpression[]> => {
    return await Expression.find(); // Retrieve all expressions from the database
};