interface BaseResponse {
    status: 'success' | 'error';
    message?: string;
}

export interface Evaluation {
    expression: string;
    result: number;
    isHistory: boolean
    timestamp: Date;
}


export interface EvaluationResponse extends BaseResponse {
    data?: Evaluation
}

export interface HistoryResponse extends BaseResponse {
    data?: Array<Evaluation>;
}