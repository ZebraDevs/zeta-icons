# zeta-icons

An icon library for the Zeta design system.

# Web

See [Zeta Web](https://github.com/ZebraDevs/zeta-web) for information on using the icons with our web components.

Otherwise, icons can be installed independently using the instructions below.

## Installation

Zeta Icons is hosted on [npm](https://www.npmjs.com/package/@zebra-fed/zeta-icons), and can be installed with:

`npm i @zebra-fed/zeta-icons` or `yarn add @zebra-fed/zeta-icons`

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

Before any tests are ran, make sure to create an `env.test.local` file with the value of `FIGMA_ACCESS_TOKEN` set to a Figma token which has access to the [ZDS Assets Figma](https://www.figma.com/file/VQ7Aa3rDYB7mgpToI3bZ4D/%F0%9F%A6%93-ZDS---Assets?type=design&mode=design&t=Ry8n3GUYc8uvxhMt-0) and the [Test Figma](https://www.figma.com/file/oIiGXVNKX4KjppcGxOEbZa/IconsTestPage?type=design&node-id=156-1674&mode=design&t=pBj7y8J7b6q906it-0).

To test the functionality of the scripts against a test Figma file with a subset of the icons, run

`yarn run test`

and inspect the outputs in test/outputs/test-figma.

To run a full test against the ZDS Assets Figma, run

`yarn run test:build`

and inspect the outputs in test/outputs/zds.

</details>

## Licensing

This software is licensed with the MIT license (see [LICENSE](./LICENSE)).
