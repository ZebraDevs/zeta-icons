export declare enum ErrorType {
    none = 0,
    iconRenamed = 1,
    invalidChar = 2,
    reservedWord = 3
}
export declare enum ErrorSeverity {
    none = 0,
    medium = 1,
    high = 2
}
export declare class ZetaIconError {
    type: ErrorType;
    message: string;
    severity: ErrorSeverity;
    newName?: string;
    constructor(type: ErrorType, iconName: string, newName?: string);
}
