import Expression, { IExpression } from '../models/Expression.model'


// Function to insert a new expression
export const insertExpression = async (expression: string, result: number): Promise<IExpression> => {
    const newExpression = new Expression({ expression, result });
    return await newExpression.save();
};

// Function to retrieve all expressions
export const getAllExpressions = async (): Promise<IExpression[]> => {
    return await Expression.find().lean(); // Retrieve all expressions from the database
};

// Function to retrieve 10 latest expressions
export const getLatestExpressions = async (limit: number, order: number): Promise<IExpression[]> => {

    // Validate order parameter
    if (order !== 1 && order !== -1) {
        throw new Error('Order must be either 1 (ascending) or -1 (descending)');
    }

    return await Expression.aggregate([
        // First sort descending to get latest records
        { $sort: { timestamp: -1 } },
        // Limit to desired number
        { $limit: limit },
        // Then sort ascending
        { $sort: { timestamp: order} }
    ]);
};