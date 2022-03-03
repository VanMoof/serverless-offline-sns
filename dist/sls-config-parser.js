"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
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
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadServerlessConfig = void 0;
var Serverless = require("serverless");
var path = require("path");
var fs = require("fs");
var ConfigServerless = /** @class */ (function (_super) {
    __extends(ConfigServerless, _super);
    function ConfigServerless() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    ConfigServerless.prototype.getConfig = function (servicePath) {
        return __awaiter(this, void 0, void 0, function () {
            var _this = this;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        this.processedInput = this.cli.processInput();
                        this.config.servicePath = servicePath;
                        this.pluginManager.setCliOptions(this.processedInput.options);
                        this.pluginManager.setCliCommands(this.processedInput.commands);
                        return [4 /*yield*/, this.service.load(this.processedInput)];
                    case 1:
                        _a.sent();
                        this.pluginManager.validateCommand(this.processedInput.commands);
                        return [2 /*return*/, this.variables
                                .populateService()
                                .then(function () {
                                _this.service.mergeResourceArrays();
                                _this.service.setFunctionNames(_this.processedInput.options);
                                _this.service.validate();
                            })];
                }
            });
        });
    };
    return ConfigServerless;
}(Serverless));
var normalizeResources = function (config) {
    if (!config.resources) {
        return config.resources;
    }
    if (!config.resources.Resources) {
        return {};
    }
    if (!Array.isArray(config.resources.Resources)) {
        return config.resources;
    }
    var newResources = config.resources.Resources.reduce(function (sum, _a) {
        var Resources = _a.Resources, _b = _a.Outputs, Outputs = _b === void 0 ? {} : _b;
        return (__assign(__assign(__assign({}, sum), Resources), { Outputs: __assign(__assign({}, (sum.Outputs || {})), Outputs) }));
    }, {});
    return {
        Resources: newResources,
    };
};
function loadServerlessConfig(cwd, debug) {
    if (cwd === void 0) { cwd = process.cwd(); }
    return __awaiter(this, void 0, void 0, function () {
        var stat, serverless, config, _a, custom, output;
        return __generator(this, function (_b) {
            switch (_b.label) {
                case 0:
                    console.log("debug loadServerlessConfig", cwd);
                    stat = fs.statSync(cwd);
                    if (!stat.isDirectory()) {
                        cwd = path.dirname(cwd);
                    }
                    serverless = new ConfigServerless();
                    return [4 /*yield*/, serverless.getConfig(cwd)];
                case 1:
                    _b.sent();
                    config = serverless.service;
                    _a = config.custom, custom = _a === void 0 ? {} : _a;
                    output = __assign(__assign({}, config), { custom: __assign({}, custom), resources: normalizeResources(config) });
                    console.log("output");
                    return [2 /*return*/, output];
            }
        });
    });
}
exports.loadServerlessConfig = loadServerlessConfig;
