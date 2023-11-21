#!/usr/bin/env node

'use strict';

var fs$1 = require('fs');
var path$1 = require('path');
var meow = require('meow');
var resolveFrom = require('resolve-from');
var stream = require('stream');
var SVGIcons2SVGFontStream = require('svgicons2svgfont');
var cosmiconfig = require('cosmiconfig');
var crypto = require('crypto');
var deepmerge = require('deepmerge');
var pLimit = require('p-limit');
var xml2js = require('xml2js');
var globby = require('globby');
var nunjucks = require('nunjucks');
var svg2ttf = require('svg2ttf');
var ttf2eot = require('ttf2eot');
var ttf2woff = require('ttf2woff');
var wawoff2 = require('wawoff2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

function _interopNamespace(e) {
    if (e && e.__esModule) return e;
    var n = Object.create(null);
    if (e) {
        Object.keys(e).forEach(function (k) {
            if (k !== 'default') {
                var d = Object.getOwnPropertyDescriptor(e, k);
                Object.defineProperty(n, k, d.get ? d : {
                    enumerable: true,
                    get: function () {
                        return e[k];
                    }
                });
            }
        });
    }
    n['default'] = e;
    return Object.freeze(n);
}

var fs__default = /*#__PURE__*/_interopDefaultLegacy(fs$1);
var fs__namespace = /*#__PURE__*/_interopNamespace(fs$1);
var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
var path__namespace = /*#__PURE__*/_interopNamespace(path$1);
var meow__default = /*#__PURE__*/_interopDefaultLegacy(meow);
var resolveFrom__default = /*#__PURE__*/_interopDefaultLegacy(resolveFrom);
var SVGIcons2SVGFontStream__default = /*#__PURE__*/_interopDefaultLegacy(SVGIcons2SVGFontStream);
var cosmiconfig__default = /*#__PURE__*/_interopDefaultLegacy(cosmiconfig);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var deepmerge__default = /*#__PURE__*/_interopDefaultLegacy(deepmerge);
var pLimit__default = /*#__PURE__*/_interopDefaultLegacy(pLimit);
var xml2js__default = /*#__PURE__*/_interopDefaultLegacy(xml2js);
var globby__default = /*#__PURE__*/_interopDefaultLegacy(globby);
var nunjucks__default = /*#__PURE__*/_interopDefaultLegacy(nunjucks);
var svg2ttf__default = /*#__PURE__*/_interopDefaultLegacy(svg2ttf);
var ttf2eot__default = /*#__PURE__*/_interopDefaultLegacy(ttf2eot);
var ttf2woff__default = /*#__PURE__*/_interopDefaultLegacy(ttf2woff);
var wawoff2__default = /*#__PURE__*/_interopDefaultLegacy(wawoff2);

/*! *****************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */

var __assign = function() {
    __assign = Object.assign || function __assign(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __generator(thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
}

/* eslint-disable max-len, sort-keys */
var meowCLI = meow__default['default']("\n    Usage: webfont [input] [options]\n\n    Input: File(s) or glob(s).\n\n        If an input argument is wrapped in quotation marks, it will be passed to \"fast-glob\"\n        for cross-platform glob support.\n\n    Options:\n\n        --config\n\n            Path to a specific configuration file (JSON, YAML, or CommonJS)\n            or the name of a module in `node_modules` that points to one.\n            If no `--config` argument is provided, webfont will search for\n            configuration  files in the following places, in this order:\n               - a `webfont` property in `package.json`\n               - a `.webfontrc` file (with or without filename extension:\n                   `.json`, `.yaml`, and `.js` are available)\n               - a `webfont.config.js` file exporting a JS object\n            The search will begin in the working directory and move up the\n            directory tree until a configuration file is found.\n\n        -f, --fontName\n\n            The font family name you want, default: \"webfont\".\n\n        -h, --help\n\n            Output usage information.\n\n        -v, --version\n\n            Output the version number.\n\n        -r, --formats\n\n            Only this formats generate.\n\n        -d, --dest\n\n            Destination for generated fonts.\n\n        -m, --dest-create\n\n            Create destination directory if it does not exist.\n\n        -t, --template\n\n            Type of template ('css', 'scss', 'styl') or path to custom template.\n\n        -s, --destTemplate\n\n            Destination for generated template. If not passed used `dest` argument value.\n\n        -c, --templateClassName\n\n            Class name in css template.\n\n        -p, --templateFontPath\n\n            Font path in css template.\n\n        -n, --templateFontName\n\n            Font name in css template.\n\n        --templateCacheString\n\n            Specify cache string in scss/css template.\n\n        --no-sort\n\n            Keeps the files in the same order of entry\n\n        --verbose\n\n            Tell me everything!.\n\n    For \"svgicons2svgfont\":\n\n        --fontId\n\n            The font id you want, default as \"--fontName\".\n\n        --fontStyle\n\n            The font style you want.\n\n        --fontWeight\n\n            The font weight you want.\n\n        --fixedWidth\n\n            Creates a monospace font of the width of the largest input icon.\n\n        --centerHorizontally\n\n            Calculate the bounds of a glyph and center it horizontally.\n\n        --normalize\n\n            Normalize icons by scaling them to the height of the highest icon.\n\n        --fontHeight\n\n            The outputted font height [MAX(icons.height)].\n\n        --round\n\n            Setup the SVG path rounding [10e12].\n\n        --descent\n\n            The font descent [0].\n\n        --ascent\n\n            The font ascent [height - descent].\n\n        --startUnicode\n\n            The start unicode codepoint for files without prefix [0xEA01].\n\n        --prependUnicode\n\n            Prefix files with their automatically allocated unicode codepoint.\n\n        --metadata\n\n            Content of the metadata tag.\n\n        --addHashInFontUrl\n\n            Generated font url will be : [webfont].[ext]?v=[hash]\n", {
    autoHelp: false,
    autoVersion: false,
    flags: {
        ascent: {
            type: "string"
        },
        centerHorizontally: {
            type: "boolean"
        },
        config: {
            "default": null
        },
        descent: {
            type: "string"
        },
        dest: {
            alias: "d",
            "default": process.cwd(),
            type: "string"
        },
        destCreate: {
            alias: "m",
            "default": false,
            type: "boolean"
        },
        destTemplate: {
            alias: "s",
            type: "string"
        },
        fixedWidth: {
            type: "boolean"
        },
        fontHeight: {
            type: "string"
        },
        fontId: {
            type: "string"
        },
        fontName: {
            alias: "u",
            type: "string"
        },
        fontStyle: {
            type: "string"
        },
        fontWeight: {
            type: "string"
        },
        formats: {
            alias: "f"
        },
        help: {
            alias: "h",
            type: "boolean"
        },
        normalize: {
            type: "boolean"
        },
        prependUnicode: {
            type: "boolean"
        },
        round: {
            type: "string"
        },
        sort: {
            "default": true,
            type: "boolean"
        },
        startUnicode: {
            type: "string"
        },
        template: {
            alias: "t",
            type: "string"
        },
        templateClassName: {
            alias: "c",
            type: "string"
        },
        templateFontName: {
            alias: "n",
            type: "string"
        },
        addHashInFontUrl: {
            "default": false,
            type: "boolean"
        },
        templateFontPath: {
            alias: "p",
            type: "string"
        },
        templateCacheString: {
            "default": "",
            type: "string"
        },
        verbose: {
            "default": false,
            type: "boolean"
        },
        version: {
            alias: "v",
            type: "boolean"
        }
    }
});

var getTemplateDirectory = function () { return path__default['default'].resolve(__dirname, "../templates"); };
var getTemplateFilePath = function (template) {
    var templateDirectory = getTemplateDirectory();
    return templateDirectory + "/template." + template + ".njk";
};
var getBuiltInTemplates = function () {
    var templateDirectory = getTemplateDirectory();
    return {
        css: { path: path__default['default'].join(templateDirectory, "template.css.njk") },
        html: { path: path__default['default'].join(templateDirectory, "template.html.njk") },
        json: { path: path__default['default'].join(templateDirectory, "template.json.njk") },
        scss: { path: path__default['default'].join(templateDirectory, "template.scss.njk") },
        styl: { path: path__default['default'].join(templateDirectory, "template.styl.njk") }
    };
};

/* eslint-disable complexity */

const testExpression = /(^|\/|\\)(?:((?:u[0-9a-f]{4,6},?)+)-)(.+)\.svg$/i;

function fileSorter(fileA, fileB) {
  const hasUnicodeA = testExpression.test(fileA);
  const hasUnicodeB = testExpression.test(fileB);

  if (hasUnicodeA == hasUnicodeB) {
    // just compare alphabetically
    const fileA_ = fileA.substr(0, fileA.lastIndexOf('.'));
    const fileB_ = fileB.substr(0, fileB.lastIndexOf('.'));
    return fileA_ < fileB_ ? -1 : 1;
  } else {
    // map true to 0, because we want it to be first
    return (hasUnicodeA ? 0 : 1) - (hasUnicodeB ? 0 : 1);
  }
}

var filesorter = fileSorter;

/* eslint-disable prefer-template,newline-per-chained-call,complexity */

const path = path__default['default'];
const fs = fs__default['default'];

function getMetadataService(options = {}) {
  let usedUnicodes = [];

  // Default options
  options.prependUnicode = !!options.prependUnicode;
  options.startUnicode =
    'number' === typeof options.startUnicode ? options.startUnicode : 0xea01;
  options.log = options.log || console.log; // eslint-disable-line
  options.err = options.err || console.err; // eslint-disable-line

  // Throw on old options usage
  if ('undefined' !== typeof options.appendUnicode) {
    throw new Error(
      'The "appendUnicode" option was renamed "prependUnicode".' +
        ' See https://github.com/nfroidure/gulp-svgicons2svgfont/issues/33'
    );
  }

  return function getMetadataFromFile(file, cb) {
    const basename = path.basename(file);
    const metadata = {
      path: file,
      name: '',
      unicode: [],
      renamed: false,
    };
    const matches = basename.match(/^(?:((?:u[0-9a-f]{4,6},?)+)-)?(.+)\.svg$/i);

    metadata.name =
      matches && matches[2] ? matches[2] : 'icon' + options.startUnicode;
    if (matches && matches[1]) {
      metadata.unicode = matches[1].split(',').map((match) => {
        match = match.substr(1);
        return match
          .split('u')
          .map((code) => String.fromCodePoint(parseInt(code, 16)))
          .join('');
      });
      if (-1 !== usedUnicodes.indexOf(metadata.unicode[0])) {
        cb(
          new Error(
            'The unicode codepoint of the glyph ' +
              metadata.name +
              ' seems to be already used by another glyph.'
          )
        );
        return;
      }
      usedUnicodes.push(...metadata.unicode);
    } else {
      do {
        metadata.unicode[0] = String.fromCodePoint(options.startUnicode++);
      } while (usedUnicodes.includes(metadata.unicode[0]));
      usedUnicodes.push(metadata.unicode[0]);
      if (options.prependUnicode) {
        metadata.renamed = true;
        metadata.path = path.join(
          path.dirname(file),
          'u' +
            metadata.unicode[0].codePointAt(0).toString(16).toUpperCase() +
            '-' +
            basename
        );
        fs.rename(file, metadata.path, (err) => {
          if (err) {
            cb(
              new Error(
                'Could not save codepoint: ' +
                  'u' +
                  metadata.unicode[0]
                    .codePointAt(0)
                    .toString(16)
                    .toUpperCase() +
                  ' for ' +
                  basename
              )
            );
            return;
          }
          cb(null, metadata);
        });
      }
    }
    if (!metadata.renamed) {
      setImmediate(() => cb(null, metadata));
    }
  };
}

var metadata = getMetadataService;

var getGlyphsData = function (files, options) {
    var metadataProvider = options.metadataProvider ||
        metadata({
            prependUnicode: options.prependUnicode,
            startUnicode: options.startUnicode
        });
    var xmlParser = new xml2js__default['default'].Parser();
    var throttle = pLimit__default['default'](options.maxConcurrency);
    return Promise.all(files.map(function (srcPath) { return throttle(function () { return new Promise(function (resolve, reject) {
        var glyph = fs$1.createReadStream(srcPath);
        var glyphContents = "";
        // eslint-disable-next-line no-promise-executor-return
        return glyph.
            on("error", function (glyphError) { return reject(glyphError); }).
            on("data", function (data) {
            glyphContents += data.toString();
        }).
            on("end", function () {
            // Maybe bug in xml2js
            if (glyphContents.length === 0) {
                return reject(new Error("Empty file " + srcPath));
            }
            return xmlParser.parseString(glyphContents, function (error) {
                if (error) {
                    return reject(error);
                }
                var glyphData = {
                    contents: glyphContents,
                    srcPath: srcPath
                };
                return resolve(glyphData);
            });
        });
    }); }); })).then(function (glyphsData) {
        var sortedGlyphsData = glyphsData;
        if (options.sort) {
            var sortCallback = function (fileA, fileB) { return filesorter(fileA.srcPath, fileB.srcPath); };
            sortedGlyphsData = glyphsData.sort(sortCallback);
        }
        return Promise.all(sortedGlyphsData.map(function (glyphData) { return new Promise(function (resolve, reject) {
            metadataProvider(glyphData.srcPath, function (error, metadata) {
                if (error) {
                    return reject(error);
                }
                metadata.unicode.push(metadata.name.replace(/-/gu, "_"));
                glyphData.metadata = metadata;
                return resolve(glyphData);
            });
        }); }));
    });
};

var getOptions = function (initialOptions) {
    if (!initialOptions || !initialOptions.files) {
        throw new Error("You must pass webfont a `files` glob");
    }
    return __assign({ centerHorizontally: false, descent: 0, fixedWidth: false, fontHeight: null, fontId: null, fontName: "webfont", fontStyle: "", fontWeight: "", formats: ["svg", "ttf", "eot", "woff", "woff2"], formatsOptions: {
            ttf: {
                copyright: null,
                ts: null,
                version: null
            }
        }, glyphTransformFn: null, 
        /*
         * Maybe allow setup from CLI
         * This is usually less than file read maximums while staying performance
         */
        maxConcurrency: 100, metadata: null, metadataProvider: null, normalize: false, prependUnicode: false, round: 10e12, sort: true, startUnicode: 0xea01, template: null, templateCacheString: null, templateClassName: null, templateFontName: null, templateFontPath: "./", verbose: false }, initialOptions);
};

var buildConfig = function (options) { return __awaiter(void 0, void 0, void 0, function () {
    var searchPath, configPath, configExplorer, config;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0:
                searchPath = process.cwd();
                configPath = null;
                if (options.configFile) {
                    searchPath = null;
                    configPath = path__default['default'].resolve(process.cwd(), options.configFile);
                }
                configExplorer = cosmiconfig__default['default']("webfont");
                return [4 /*yield*/, configExplorer.search(searchPath)];
            case 1:
                config = _a.sent();
                if (!configPath) return [3 /*break*/, 3];
                return [4 /*yield*/, configExplorer.load(configPath)];
            case 2:
                config = _a.sent();
                _a.label = 3;
            case 3:
                if (!config) {
                    return [2 /*return*/, {}];
                }
                return [2 /*return*/, config];
        }
    });
}); };
var toSvg = function (glyphsData, options) {
    var result = "";
    return new Promise(function (resolve, reject) {
        var log = function () {
            Function.prototype();
        };
        if (options.verbose) {
            // eslint-disable-next-line no-console
            log = console.log.bind(console);
        }
        var fontStream = new SVGIcons2SVGFontStream__default['default']({
            ascent: options.ascent,
            centerHorizontally: options.centerHorizontally,
            descent: options.descent,
            fixedWidth: options.fixedWidth,
            fontHeight: options.fontHeight,
            fontId: options.fontId,
            fontName: options.fontName,
            fontStyle: options.fontStyle,
            fontWeight: options.fontWeight,
            log: log,
            metadata: options.metadata,
            normalize: options.normalize,
            round: options.round
        }).
            on("finish", function () { return resolve(result); }).
            on("data", function (data) {
            result += data;
        }).
            on("error", function (error) { return reject(error); });
        glyphsData.forEach(function (glyphData) {
            var glyphStream = new stream.Readable();
            glyphStream.push(glyphData.contents);
            glyphStream.push(null);
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore
            glyphStream.metadata = glyphData.metadata;
            fontStream.write(glyphStream);
        });
        fontStream.end();
    });
};
var toTtf = function (buffer, options) { return Buffer.from(svg2ttf__default['default'](buffer, options).buffer); };
var toEot = function (buffer) { return Buffer.from(ttf2eot__default['default'](buffer).buffer); };
var toWoff = function (buffer, options) { return Buffer.from(ttf2woff__default['default'](buffer, options).buffer); };
var toWoff2 = function (buffer) { return wawoff2__default['default'].compress(buffer); };
var webfont = function (initialOptions) { return __awaiter(void 0, void 0, void 0, function () {
    var options, config, foundFiles, filteredFiles, glyphsData, transformedGlyphs, ttfOptions, svg, ttf, result, _a, builtInTemplates, templateFilePath, builtInPath, resolvedTemplateFilePath, hashOption, nunjucksOptions;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                options = getOptions(initialOptions);
                return [4 /*yield*/, buildConfig({
                        configFile: options.configFile
                    })];
            case 1:
                config = _b.sent();
                if (Object.keys(config).length > 0) {
                    options = deepmerge__default['default'](options, config.config, {
                        arrayMerge: function (_destinationArray, sourceArray) { return sourceArray; }
                    });
                    options.filePath = config.filepath;
                }
                return [4 /*yield*/, globby__default['default']([].concat(options.files))];
            case 2:
                foundFiles = _b.sent();
                filteredFiles = foundFiles.filter(function (foundFile) { return path__default['default'].extname(foundFile) === ".svg"; });
                if (filteredFiles.length === 0) {
                    throw new Error("Files glob patterns specified did not match any files");
                }
                return [4 /*yield*/, getGlyphsData(filteredFiles, options)];
            case 3:
                glyphsData = _b.sent();
                if (!(options.glyphTransformFn && typeof options.glyphTransformFn === "function")) return [3 /*break*/, 5];
                transformedGlyphs = glyphsData.map(function (glyphData) { return __awaiter(void 0, void 0, void 0, function () {
                    var metadata;
                    return __generator(this, function (_a) {
                        switch (_a.label) {
                            case 0: return [4 /*yield*/, options.glyphTransformFn(glyphData.metadata)];
                            case 1:
                                metadata = _a.sent();
                                return [2 /*return*/, __assign(__assign({}, glyphData), { metadata: metadata })];
                        }
                    });
                }); });
                return [4 /*yield*/, Promise.all(transformedGlyphs)];
            case 4:
                glyphsData = _b.sent();
                _b.label = 5;
            case 5:
                ttfOptions = {};
                if (options.formatsOptions && options.formatsOptions.ttf) {
                    ttfOptions = options.formatsOptions.ttf;
                }
                return [4 /*yield*/, toSvg(glyphsData, options)];
            case 6:
                svg = _b.sent();
                ttf = toTtf(svg, ttfOptions);
                result = {
                    glyphsData: glyphsData,
                    hash: crypto__default['default'].createHash("md5").update(svg).
                        digest("hex"),
                    svg: svg,
                    ttf: ttf
                };
                if (options.formats.includes("eot")) {
                    result.eot = toEot(ttf);
                }
                if (options.formats.includes("woff")) {
                    result.woff = toWoff(ttf, { metadata: options.metadata });
                }
                if (!options.formats.includes("woff2")) return [3 /*break*/, 8];
                _a = result;
                return [4 /*yield*/, toWoff2(ttf)];
            case 7:
                _a.woff2 = _b.sent();
                _b.label = 8;
            case 8:
                if (options.template) {
                    builtInTemplates = getBuiltInTemplates();
                    templateFilePath = void 0;
                    if (Object.keys(builtInTemplates).includes(options.template)) {
                        result.usedBuildInTemplate = true;
                        builtInPath = path__default['default'].resolve(__dirname, "../..");
                        nunjucks__default['default'].configure(builtInPath);
                        templateFilePath = getTemplateFilePath(options.template);
                    }
                    else {
                        resolvedTemplateFilePath = path__default['default'].resolve(options.template);
                        nunjucks__default['default'].configure(path__default['default'].dirname(resolvedTemplateFilePath));
                        templateFilePath = path__default['default'].resolve(resolvedTemplateFilePath);
                    }
                    hashOption = {};
                    if (options.addHashInFontUrl) {
                        hashOption = { hash: result.hash };
                    }
                    nunjucksOptions = deepmerge__default['default'].all([
                        {
                            glyphs: result.glyphsData.map(function (glyph) { return glyph.metadata; })
                        },
                        options,
                        {
                            cacheString: options.templateCacheString || Date.now(),
                            className: options.templateClassName || options.fontName,
                            fontName: options.templateFontName || options.fontName,
                            fontPath: options.templateFontPath.replace(/\/?$/u, "/")
                        },
                        hashOption,
                        {
                            fonts: Object.fromEntries(new Map(options.formats.map(function (format) { return [
                                format, function () {
                                    if (format === "woff2") {
                                        return Buffer.from(result.woff2).toString("base64");
                                    }
                                    return result[format].toString("base64");
                                },
                            ]; })))
                        },
                    ]);
                    result.template = nunjucks__default['default'].render(templateFilePath, nunjucksOptions);
                }
                if (!options.formats.includes("svg")) {
                    delete result.svg;
                }
                if (!options.formats.includes("ttf")) {
                    delete result.ttf;
                }
                result.config = options;
                return [2 /*return*/, result];
        }
    });
}); };

var optionsBase = {};
if (typeof meowCLI.flags.config === "string") {
    /*
     * Should check these possibilities:
     *   a. name of a node_module
     *   b. absolute path
     *   c. relative path relative to `process.cwd()`.
     * If none of the above work, we'll try a relative path starting
     * in `process.cwd()`.
     */
    optionsBase.configFile =
        resolveFrom__default['default'](process.cwd(), meowCLI.flags.config) ||
            path__namespace.join(process.cwd(), meowCLI.flags.config);
}
if (meowCLI.flags.fontName) {
    optionsBase.fontName = meowCLI.flags.fontName;
}
if (meowCLI.flags.formats) {
    optionsBase.formats = meowCLI.flags.formats;
}
if (meowCLI.flags.dest) {
    optionsBase.dest = meowCLI.flags.dest;
}
if (meowCLI.flags.destCreate) {
    optionsBase.destCreate = meowCLI.flags.destCreate;
}
if (meowCLI.flags.template) {
    optionsBase.template = meowCLI.flags.template;
}
if (meowCLI.flags.templateClassName) {
    optionsBase.templateClassName = meowCLI.flags.templateClassName;
}
if (meowCLI.flags.templateFontPath) {
    optionsBase.templateFontPath = meowCLI.flags.templateFontPath;
}
if (meowCLI.flags.templateFontName) {
    optionsBase.templateFontName = meowCLI.flags.templateFontName;
}
if (meowCLI.flags.templateCacheString) {
    optionsBase.templateCacheString = meowCLI.flags.templateCacheString;
}
if (meowCLI.flags.destTemplate) {
    optionsBase.destTemplate = meowCLI.flags.destTemplate;
}
if (meowCLI.flags.verbose) {
    optionsBase.verbose = meowCLI.flags.verbose;
}
if (meowCLI.flags.fontId) {
    optionsBase.fontId = meowCLI.flags.fontId;
}
if (meowCLI.flags.fontStyle) {
    optionsBase.fontStyle = meowCLI.flags.fontStyle;
}
if (meowCLI.flags.fontWeight) {
    optionsBase.fontWeight = meowCLI.flags.fontWeight;
}
if (meowCLI.flags.fixedWidth) {
    optionsBase.fixedWidth = meowCLI.flags.fixedWidth;
}
if (meowCLI.flags.centerHorizontally) {
    optionsBase.centerHorizontally = meowCLI.flags.centerHorizontally;
}
if (meowCLI.flags.normalize) {
    optionsBase.normalize = meowCLI.flags.normalize;
}
if (meowCLI.flags.fontHeight) {
    optionsBase.fontHeight = meowCLI.flags.fontHeight;
}
if (meowCLI.flags.round) {
    optionsBase.round = meowCLI.flags.round;
}
if (meowCLI.flags.descent) {
    optionsBase.descent = meowCLI.flags.descent;
}
if (meowCLI.flags.ascent) {
    optionsBase.ascent = meowCLI.flags.ascent;
}
if (meowCLI.flags.startUnicode) {
    optionsBase.startUnicode = meowCLI.flags.startUnicode;
}
if (meowCLI.flags.prependUnicode) {
    optionsBase.prependUnicode = meowCLI.flags.prependUnicode;
}
if (meowCLI.flags.metadata) {
    optionsBase.metadata = meowCLI.flags.metadata;
}
if (meowCLI.flags.sort === false) {
    optionsBase.sort = meowCLI.flags.sort;
}
if (meowCLI.flags.addHashInFontUrl) {
    optionsBase.addHashInFontUrl = meowCLI.flags.addHashInFontUrl;
}
if (meowCLI.flags.help || meowCLI.flags.h) {
    meowCLI.showHelp();
}
if (meowCLI.flags.version || meowCLI.flags.v) {
    meowCLI.showVersion();
}
Promise.resolve().
    then(function () {
    var options = __assign(__assign({}, optionsBase), { files: meowCLI.input });
    if (options.files.length === 0) {
        meowCLI.showHelp();
    }
    return webfont(options).then(function (result) {
        result.config = __assign({ dest: options.dest, destTemplate: options.destTemplate }, result.config);
        return result;
    });
}).
    then(function (result) {
    var _a = result.config, fontName = _a.fontName, dest = _a.dest, destCreate = _a.destCreate;
    var destTemplate = null;
    if (result.template) {
        (destTemplate = result.config.destTemplate);
        if (!destTemplate) {
            destTemplate = dest;
        }
        if (result.usedBuildInTemplate) {
            destTemplate = path__namespace.join(destTemplate, result.config.fontName + "." + result.config.template);
        }
        else {
            destTemplate = path__namespace.join(destTemplate, path__namespace.basename(result.config.template).replace(".njk", ""));
        }
        delete result.hash;
    }
    return Promise.resolve().
        then(function () { return new Promise(function (resolve, reject) {
        fs__namespace.access(dest, fs__namespace.constants.F_OK, function (err) { return reject(err); });
    }); })["catch"](function (error) {
        if (error && destCreate) {
            return new Promise(function (resolve) {
                fs__namespace.mkdir(dest, { recursive: true }, function () { return resolve(destCreate); });
            });
        }
        return error;
    })["finally"](function () { return Promise.all(Object.keys(result).map(function (type) {
        if (type === "config" || type === "usedBuildInTemplate" || type === "glyphsData") {
            return null;
        }
        var content = result[type];
        // eslint-disable-next-line init-declarations
        var file;
        if (type === "template") {
            file = path__namespace.resolve(destTemplate);
        }
        else {
            file = path__namespace.resolve(path__namespace.join(dest, fontName + "." + type));
        }
        return fs__namespace.writeFile(file, content, function () {
            Function.prototype();
        });
    })); }).
        then(function () { return Promise.resolve(result); });
})["catch"](function (error) {
    // eslint-disable-next-line no-console
    console.log(error.stack);
    var exitCode = 1;
    if (typeof error.code === "number") {
        exitCode = error.code;
    }
    process.exit(exitCode);
});
