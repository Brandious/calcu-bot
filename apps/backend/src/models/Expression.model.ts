import mongoose, { Document, Schema } from 'mongoose';

export interface IExpression extends Document {
    expression: string,
    result: number;
    timestamp: Date;
}


const ExpressionSchema: Schema = new Schema({
    expression: {
        type: String,
        required: true,
    },
    result: {
        type: Number
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
})

const Expression = mongoose.model<IExpression>('Expression', ExpressionSchema)

export default Expression