import { rmSync } from "fs";
import { createRequire } from "module";
import { testOutputDir } from "../dist/test/data/constants.js";
const require = createRequire(import.meta.url);

before(() => {
  rmSync(testOutputDir, { recursive: true, force: true });
  require("dotenv").config({
    path: ".env.test.local",
  });
});
