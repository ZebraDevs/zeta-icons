import { figma, html } from "@figma/code-connect/html";
figma.connect("https://www.figma.com/design/VQ7Aa3rDYB7mgpToI3bZ4D?node-id=1106:3241", {
  props: { rounded: figma.enum("Style", { Round: true, Sharp: false }) },
  example: (props) => html`<zeta-icon rounded=${props.rounded}>wb</zeta-icon>`,
});
