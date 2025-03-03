import { getIcons, getConventionalCommit, getBody } from '../../dist/scripts/on-release/get-changed-icons.js'
import core from "@actions/core";

const icons = getIcons();

const conventional = getConventionalCommit(icons);
const body = getBody(icons);

console.log('Conventional:', conventional);
console.log('Body:', body);

core.setOutput('conventional-commit', getConventionalCommit(icons))
core.setOutput('body', getBody(icons))