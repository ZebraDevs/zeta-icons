export var ErrorType;
(function (ErrorType) {
    ErrorType[ErrorType["none"] = 0] = "none";
    ErrorType[ErrorType["iconRenamed"] = 1] = "iconRenamed";
    ErrorType[ErrorType["invalidChar"] = 2] = "invalidChar";
    ErrorType[ErrorType["startsWithNumber"] = 3] = "startsWithNumber";
    ErrorType[ErrorType["reservedWord"] = 4] = "reservedWord";
})(ErrorType || (ErrorType = {}));
export var ErrorSeverity;
(function (ErrorSeverity) {
    ErrorSeverity[ErrorSeverity["none"] = 0] = "none";
    ErrorSeverity[ErrorSeverity["medium"] = 1] = "medium";
    ErrorSeverity[ErrorSeverity["high"] = 2] = "high";
})(ErrorSeverity || (ErrorSeverity = {}));
export class ZetaIconError {
    constructor(type, iconName, newName) {
        this.type = type;
        this.newName = newName;
        switch (type) {
            case ErrorType.iconRenamed:
                this.message = `${iconName} will be renamed to ${newName}`;
                this.severity = ErrorSeverity.medium;
                break;
            case ErrorType.invalidChar:
                this.message = `${iconName} contains an invalid character and will not be exported to the library`;
                this.severity = ErrorSeverity.high;
                break;
            case ErrorType.startsWithNumber:
                this.message = `${iconName} starts with a number and will not be exported to the library`;
                this.severity = ErrorSeverity.high;
                break;
            case ErrorType.reservedWord:
                this.message = `${iconName} is a reserved word in Dart or Javascript so will not be available for use in flutter`;
                this.severity = ErrorSeverity.high;
                break;
            case ErrorType.none:
                this.message = `${iconName} is a valid name`;
                this.severity = ErrorSeverity.none;
                break;
        }
    }
}
