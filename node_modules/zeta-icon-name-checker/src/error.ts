export enum ErrorType {
  none,
  iconRenamed,
  invalidChar,
  startsWithNumber,
  reservedWord,
}

export enum ErrorSeverity {
  none,
  medium,
  high,
}

export class ZetaIconError {
  type: ErrorType;
  message: string;
  severity: ErrorSeverity;
  newName?: string;

  constructor(type: ErrorType, iconName: string, newName?: string) {
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
