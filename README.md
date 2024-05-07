<details>
    <summary>Zebra Repository Information</summary>
    <ul>
        <li> Zebra Business Unit : DMO - I&D Team </li>
        <li> Zebra Manager : ncvt73 </li>
        <li> Zebra Repo Admin: mikecoomber </li>
        <li> Zebra Jira Project ID: N/A  </li>
        <li> Product: zeta-icons</li>
        <li> Topics: zeta-icons, icon library</li>
    </ul>
</details>

# zeta-icons

An icon library for the Zeta design system.

## Web

> 🚧 **Note**: Currently, the only way to use these icons is directly from `zeta-icons`. This will change in the future with the impending release of `zeta-web` and `zeta-react`.

## Installation

Zeta Icons is hosted on [npm](https://www.npmjs.com/package/@zebra-fed/zeta-icons), and can be installed with:

`npm i @zebra-fed/zeta-icons`

## Usage

The zeta-icons fonts can be imported into any web project. There are two variants, `zeta-icons-round` and `zeta-icons-sharp`, for round and sharp icons respectively.
Either one or both of these need to be imported via css

```css
@font-face {
  font-family: zeta-icons-round;
  font-weight: bold;
  src: url("@zebra-fed/zeta-icons/font/zeta-icons-round.woff2");
}

.icon {
  font-family: "zeta-icons-round";
  line-height: 1;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
  -moz-osx-font-smoothing: grayscale;
  font-feature-settings: "liga";
}
```

If you are not using a framework that optimizes node modules imports, you may need to point directly to the font:

```css
src: url("./node_modules/@zebra-fed/zeta-icons/outputs/font/zeta-icons-round.woff2");
```

Zeta icons use **_ligatures_**, which allows for the icons to be rendered by simply entering their name. These icons behave as text characters, and so are styled as such:

```html
<span class="icon" style="font-size: 24px; color: blue;">alarm</span>
```

---

# Flutter

Zeta Icons for Flutter are part of [zeta_flutter](https://github.com/ZebraDevs/zeta_flutter).

## Installation

Zeta flutter is hosted on [pub.dev](https://pub.dev/packages/zeta_flutter/), and can be installed with:

`flutter pub add zeta_flutter`

## Usage

The `ZetaIcons` class contains all the zeta icons, in both round and sharp variants.
These can be displayed using the `Icon` class built into Flutter.

```dart
  Icon(ZetaIcons.activity_round, color: Colors.red, size: 24)
```

---

<details>
<summary>Testing</summary>

> 🚧 **Note**: This does not work with all versions of node - tested and working with node 18.17.0

1. Initialize test values:

`ts-node --files test/reset-values.ts`

2. Select tests to run. Within `test/test.ts`, set the values of `functionsToTest` to true.

3. Run tests

`ts-node -files test/test.ts`

</details>
