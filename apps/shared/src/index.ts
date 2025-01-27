export enum ActionType {
    HISTORY = 'history',
    EVALUATE = 'evaluate',
}

export enum ResponseStatus {
    SUCCESS = 'success',
    ERROR = 'error'
}

export enum SocketState {
    DISCONNECT = 'disconnect',
    MESSAGE = 'message',
    HISTORY = 'history',
    RESULT = 'result',
    ERROR = 'error'
}