import { assert } from "chai";
import { getFigmaDocument, getImageFiles } from "../../scripts/utils/api.js";
import { IconManifest } from "../../types.js";
import { DocumentResponse } from "../../scripts/types/figmaTypes.js";
import { captureConsole, jsonResponse, stubFetch, textResponse } from "./helpers.js";

const makeManifest = (count: number): IconManifest =>
  new Map(
    Array.from({ length: count }, (_, i) => [
      `icon${i}`,
      {
        name: `Icon ${i}`,
        searchTerms: [],
        category: "cat",
        roundPath: `r${i}.svg`,
        sharpPath: `s${i}.svg`,
        roundId: `r${i}`,
        sharpId: `s${i}`,
      },
    ]),
  );

/** Handles both Figma `/images` calls and svg downloads. */
const figmaHandler =
  (svgFor: (id: string) => string = (id) => `<svg id="${id}"/>`) =>
  (url: string) => {
    if (url.startsWith("https://api.figma.com/v1/images/")) {
      const ids = new URL(url).searchParams.get("ids")!.split(",");
      return jsonResponse({ images: Object.fromEntries(ids.map((id) => [id, `https://cdn.test/${id}.svg`])) });
    }
    const id = url.split("/").pop()!.replace(".svg", "");
    return textResponse(svgFor(id));
  };

describe("api (offline)", () => {
  let restore: () => void;
  afterEach(() => restore?.());

  describe("getFigmaDocument", () => {
    it("requests the file with the token and returns the parsed body", async () => {
      const doc = { name: "file", document: { children: [] }, componentSets: {} } as unknown as DocumentResponse;
      const stub = stubFetch(() => jsonResponse(doc));
      restore = stub.restore;

      const result = await getFigmaDocument("FILE123", "tok");

      assert.deepEqual(result, doc);
      assert.equal(stub.calls.length, 1);
      assert.equal(stub.calls[0].url, "https://api.figma.com/v1/files/FILE123");
      assert.equal(stub.calls[0].options?.method, "get");
      assert.deepEqual(stub.calls[0].options?.headers, {
        "X-Figma-Token": "tok",
        "Content-Type": "application/json",
      });
    });

    it("throws with the status text when the status is not 200", async () => {
      restore = stubFetch(() => jsonResponse({}, 403, "Forbidden")).restore;
      let error: Error | undefined;
      try {
        await getFigmaDocument("FILE123", "bad");
      } catch (e) {
        error = e as Error;
      }
      assert.equal(error?.message, "Failed to fetch Figma document: Forbidden");
    });

    it("propagates network errors from fetch", async () => {
      restore = stubFetch(() => Promise.reject(new Error("socket hang up"))).restore;
      let error: Error | undefined;
      try {
        await getFigmaDocument("FILE123", "tok");
      } catch (e) {
        error = e as Error;
      }
      assert.equal(error?.message, "socket hang up");
    });

    it("rejects with 'Request timed out' if fetch never responds", async () => {
      const stub = stubFetch(() => new Promise<Response>(() => {}));
      const realSetTimeout = globalThis.setTimeout;
      // Fire the 10s timeout immediately.
      globalThis.setTimeout = ((fn: () => void) => realSetTimeout(fn, 0)) as typeof setTimeout;
      restore = () => {
        globalThis.setTimeout = realSetTimeout;
        stub.restore();
      };
      let error: Error | undefined;
      try {
        await getFigmaDocument("FILE123", "tok");
      } catch (e) {
        error = e as Error;
      }
      assert.equal(error?.message, "Request timed out");
    });
  });

  describe("getImageFiles", () => {
    it("fetches the image url for every round and sharp id and attaches the svg data", async () => {
      const stub = stubFetch(figmaHandler());
      restore = stub.restore;
      const manifest = makeManifest(2);

      const result = await getImageFiles(manifest, "FILE", "tok");

      assert.deepEqual([...result.keys()], ["icon0", "icon1"]);
      assert.deepEqual(result.get("icon0"), {
        ...manifest.get("icon0"),
        roundData: '<svg id="r0"/>',
        sharpData: '<svg id="s0"/>',
      });
      assert.equal(result.get("icon1")!.roundData, '<svg id="r1"/>');
      assert.equal(result.get("icon1")!.sharpData, '<svg id="s1"/>');

      const apiCall = stub.calls.find((c) => c.url.startsWith("https://api.figma.com"))!;
      assert.equal(apiCall.url, "https://api.figma.com/v1/images/FILE?ids=r0,s0,r1,s1&format=svg");
      assert.equal((apiCall.options?.headers as Record<string, string>)["X-Figma-Token"], "tok");
    });

    it("requests ids in chunks of 100 and merges the responses", async () => {
      const stub = stubFetch(figmaHandler());
      restore = stub.restore;
      const manifest = makeManifest(125); // 250 ids -> 100 + 100 + 50

      const result = await getImageFiles(manifest, "FILE", "tok");

      const apiCalls = stub.calls.filter((c) => c.url.startsWith("https://api.figma.com"));
      const sizes = apiCalls.map((c) => new URL(c.url).searchParams.get("ids")!.split(",").length);
      assert.deepEqual(sizes, [100, 100, 50]);
      assert.equal(result.size, 125);
      assert.equal(result.get("icon124")!.sharpData, '<svg id="s124"/>');
    });

    it("replaces every non-black hex colour with #000000 and leaves black alone", async () => {
      restore = stubFetch(
        figmaHandler(() => '<path fill="#FF00AA"/><path fill="#000000"/><path stroke="#abcdef"/><path fill="#fff"/>'),
      ).restore;

      const result = await getImageFiles(makeManifest(1), "FILE", "tok");

      assert.equal(
        result.get("icon0")!.roundData,
        '<path fill="#000000"/><path fill="#000000"/><path stroke="#000000"/><path fill="#fff"/>',
      );
    });

    it("falls back to empty data and logs when an svg download fails", async () => {
      const stub = stubFetch((url) =>
        url.endsWith("/s0.svg") ? Promise.reject(new Error("boom")) : figmaHandler()(url),
      );
      const output = captureConsole();
      restore = () => {
        output.restore();
        stub.restore();
      };

      const result = await getImageFiles(makeManifest(1), "FILE", "tok");

      assert.equal(result.get("icon0")!.roundData, '<svg id="r0"/>');
      assert.equal(result.get("icon0")!.sharpData, "");
      assert.equal(output.error.length, 1);
      assert.equal(output.error[0][0], "Error fetching SVG for key s0:");
    });

    it("throws when the Figma images endpoint returns a non-200 status", async () => {
      restore = stubFetch(() => jsonResponse({}, 500, "Server Error")).restore;
      let error: Error | undefined;
      try {
        await getImageFiles(makeManifest(1), "FILE", "tok");
      } catch (e) {
        error = e as Error;
      }
      assert.equal(error?.message, "Failed to fetch Figma images: Server Error");
    });

    it("rejects for an empty manifest (reduce over zero responses) - current behaviour", async () => {
      restore = stubFetch(figmaHandler()).restore;
      let error: Error | undefined;
      try {
        await getImageFiles(new Map() as IconManifest, "FILE", "tok");
      } catch (e) {
        error = e as Error;
      }
      assert.instanceOf(error, TypeError);
    });
  });
});
