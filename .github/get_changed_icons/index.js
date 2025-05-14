import { getIcons, getConventionalCommit, getBody } from '../../dist/scripts/on-release/get-changed-icons.js'
import core from "@actions/core";

const icons = getIcons();

core.setOutput('conventional-commit', getConventionalCommit(icons))
core.setOutput('body', getBody(icons))