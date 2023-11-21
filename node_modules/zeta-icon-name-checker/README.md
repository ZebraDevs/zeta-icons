# zeta-icon-name-checker

An NPM package used to check the validity of icon and category names for the Zeta Icon Library.

# Usage

## Check Icon Name

Used to check the validity of a single icon name. Pass in categoryName and usedNames to check for duplicate name errors.

```ts
checkIconName(
  iconName: string,
  categoryName?: string,
  usedNames?: string[]
): ZetaIconError
```

## Check Category Name

Used to check the validity of a single category name.
Only returns an error type of `ErrorType.invalidChar` or `ErrorType.none`.

```ts
checkCategoryName(categoryName: string): ZetaIconError
```

## Reading Errors

Errors are all of type `ZetaIconError`. Possible error types are:

```ts
enum ErrorType {
  none,
  iconRenamed,
  invalidChar,
  reservedWord,
}
```

Errors all have severity levels and pre-generated messages based on their type.

<details>
    <summary>Zebra Repository Information</summary>
    <ul>
        <li> Zebra Business Unit : DMO - I&D Team </li>
        <li> Zebra Manager : mikecoomber </li>
        <li> Zebra Repo Admin: mikecoomber </li>
        <li> Zebra Jira Project ID: N/A  </li>
        <li> Product: zeta-icon-name-checker, zeta-icons</li>
        <li> Topics: zeta-icons, icon library</li>
    </ul>
</details>
