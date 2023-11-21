import { ZetaIconError, ErrorType, ErrorSeverity } from "./error";
export { checkIconName, checkCategoryName, ZetaIconError, ErrorType, ErrorSeverity, };
declare function checkIconName(iconName: string, categoryName?: string, usedNames?: string[]): ZetaIconError;
declare function checkCategoryName(categoryName: string): ZetaIconError;
