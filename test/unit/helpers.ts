import { mkdtempSync, rmSync } from "fs";
import { tmpdir } from "os";
import { join } from "path";

/** Creates a throwaway directory; returns its path and a cleanup function. */
export const makeTmpDir = (prefix = "zeta-icons-test-") => {
  const dir = mkdtempSync(join(tmpdir(), prefix));
  return { dir, cleanup: () => rmSync(dir, { recursive: true, force: true }) };
};

/** Runs `fn` with `process.cwd()` set to `dir`, always restoring the previous cwd. */
export const withCwd = async <T>(dir: string, fn: () => T | Promise<T>): Promise<T> => {
  const previous = process.cwd();
  process.chdir(dir);
  try {
    return await fn();
  } finally {
    process.chdir(previous);
  }
};

/** Silences and records console output. Call `restore()` when done. */
export const captureConsole = () => {
  const original = { log: console.log, error: console.error, warn: console.warn };
  const captured = { log: [] as unknown[][], error: [] as unknown[][], warn: [] as unknown[][] };
  console.log = (...args: unknown[]) => void captured.log.push(args);
  console.error = (...args: unknown[]) => void captured.error.push(args);
  console.warn = (...args: unknown[]) => void captured.warn.push(args);
  return {
    ...captured,
    restore: () => Object.assign(console, original),
  };
};

export const jsonResponse = (body: unknown, status = 200, statusText = "OK") =>
  new Response(JSON.stringify(body), { status, statusText });

export const textResponse = (body: string, status = 200, statusText = "OK") =>
  new Response(body, { status, statusText });

export interface FetchCall {
  url: string;
  options?: RequestInit;
}

/**
 * Replaces `globalThis.fetch` with `handler`. No test in this folder may touch the network.
 * @returns the recorded calls and a `restore` function.
 */
export const stubFetch = (handler: (url: string, options?: RequestInit) => Promise<Response> | Response) => {
  const original = globalThis.fetch;
  const calls: FetchCall[] = [];
  globalThis.fetch = (async (resource: RequestInfo | URL, options?: RequestInit) => {
    const url = String(resource);
    calls.push({ url, options });
    return handler(url, options);
  }) as typeof fetch;
  return { calls, restore: () => (globalThis.fetch = original) };
};

/** Minimal valid svg containing a single path. */
export const svgWithPath = (d = "M0 0H24V24H0Z", fill = "#1D1E23") =>
  `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="${d}" fill="${fill}"/></svg>`;
