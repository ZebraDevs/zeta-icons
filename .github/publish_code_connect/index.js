import core from "@actions/core";
import util from "util";
import { exec } from "child_process";
const asyncExec = util.promisify(exec);

const FIGMA_ACCESS_TOKEN = core.getInput("figma-access-token") || process.env.FIGMA_ACCESS_TOKEN;

const { stdout, stderr } = await asyncExec(`npx figma connect publish --token ${FIGMA_ACCESS_TOKEN}`, {
  cwd: "../..",
});

console.log(stdout);
console.error(stderr);
