import { parseIconPage } from "../.github/fetch_icons/parse-icons.js";
import testResponse from "./test-response.json" assert { type: "json" };

const iconPage = testResponse.document.children.filter(
  (page) => page.name == "Icons"
)[0];
await parseIconPage(
  iconPage,
  "./outputs",
  "./outputs/icons",
  testResponse.componentSets
);
