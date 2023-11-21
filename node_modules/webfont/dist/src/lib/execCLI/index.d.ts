/// <reference types="node" />
import { ExecException } from "child_process";
export declare type Output = {
    code?: number;
    error: ExecException | null;
    files: string[];
    stderr?: string;
    stdout?: string;
};
export declare type ExecCLI = (args?: string, destination?: string) => Promise<Output>;
/**
 * @name execCLI
 * @description Execute webfont CLI commands using child_process.
 *
 * @param {String} args - Arguments to pass to the CLI.
 * @param {String} destination - Path to read/write files
 * @return {Promise.<Object>} - Contains CLI error, stdout, stderr data.
 * @example
 *
 * execCLI("--help").then((output) => {
 *  console.log(output.stdout) // => Outputs usage information.
 * })
 *
 */
export declare const execCLI: ExecCLI;
