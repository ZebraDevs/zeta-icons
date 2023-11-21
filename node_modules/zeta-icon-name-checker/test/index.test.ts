import { checkCategoryName, checkIconName } from "../src/index";
import { ErrorType } from "../src/error";

describe("testing checkIconName", () => {
  test(`"Test Icon Name" should return an icon error with the type of ${ErrorType.none}`, () => {
    expect(checkIconName("Test Icon Name").type).toBe(ErrorType.none);
  });

  test(`"break" should return a ${ErrorType.reservedWord} error`, () => {
    expect(checkIconName("break").type).toBe(ErrorType.reservedWord);
  });

  test('"test123" should be a valid icon name', () => {
    expect(checkIconName("test123").type).toBe(ErrorType.none);
  });

  test(`"123test" should return a ${ErrorType.invalidChar} error`, () => {
    expect(checkIconName("123test").type).toBe(ErrorType.invalidChar);
  });

  test(`"-test" should return a ${ErrorType.invalidChar} error`, () => {
    expect(checkIconName("-test").type).toBe(ErrorType.invalidChar);
  });

  test(`"-test$" should return a ${ErrorType.invalidChar} error`, () => {
    expect(checkIconName("-test$").type).toBe(ErrorType.invalidChar);
  });

  test(`"$test" should be a valid icon name`, () => {
    expect(checkIconName("$test").type).toBe(ErrorType.none);
  });
});

describe("testing checkCategoryName", () => {
  test("Category Name should be a valid category name", () => {
    expect(checkCategoryName("Category Name").type).toBe(ErrorType.none);
  });

  test("/Category/Name should be an invalid category name", () => {
    expect(checkCategoryName("/Category/Name").type).toBe(
      ErrorType.invalidChar
    );
  });
});
