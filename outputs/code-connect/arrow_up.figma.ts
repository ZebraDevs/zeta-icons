import { figma, html } from "@figma/code-connect/html";
figma.connect("https://www.figma.com/design/VQ7Aa3rDYB7mgpToI3bZ4D?node-id=247:572", {
  props: { rounded: figma.enum("Style", { Round: true, Sharp: false }) },
  example: (props) => html`<zeta-icon rounded=${props.rounded}>arrow-up</zeta-icon>`,
});
