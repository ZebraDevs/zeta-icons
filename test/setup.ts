import { rmSync } from "fs";
import { testOutputDir } from "./data/constants.js";
import * as dotenv from "dotenv";
dotenv.config({ path: ".env.test.local" });

before(() => {
  rmSync(testOutputDir, { recursive: true, force: true });
});
