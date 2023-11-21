'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var path$1 = require('path');
var stream = require('stream');
var SVGIcons2SVGFontStream = require('svgicons2svgfont');
var cosmiconfig = require('cosmiconfig');
var crypto = require('crypto');
var deepmerge = require('deepmerge');
var require$$1 = require('fs');
var pLimit = require('p-limit');
var xml2js = require('xml2js');
var globby = require('globby');
var nunjucks = require('nunjucks');
var svg2ttf = require('svg2ttf');
var ttf2eot = require('ttf2eot');
var ttf2woff = require('ttf2woff');
var wawoff2 = require('wawoff2');

function _interopDefaultLegacy (e) { return e && typeof e === 'object' && 'default' in e ? e : { 'default': e }; }

var path__default = /*#__PURE__*/_interopDefaultLegacy(path$1);
var SVGIcons2SVGFontStream__default = /*#__PURE__*/_interopDefaultLegacy(SVGIcons2SVGFontStream);
var cosmiconfig__default = /*#__PURE__*/_interopDefaultLegacy(cosmiconfig);
var crypto__default = /*#__PURE__*/_interopDefaultLegacy(crypto);
var deepmerge__default = /*#__PURE__*/_interopDefaultLegacy(deepmerge);
var require$$1__default = /*#__PURE__*/_interopDefaultLegacy(require$$1);
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
const fs = require$$1__default['default'];

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
        var glyph = require$$1.createReadStream(srcPath);
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

exports['default'] = webfont;
exports.webfont = webfont;
