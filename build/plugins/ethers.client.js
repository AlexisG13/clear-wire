"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const ethers_1 = require("ethers");
exports.default = (0, fastify_plugin_1.default)(async function (fastify, opts) {
    const { config } = fastify;
    const url = config.ETHEREUM_NETWORK_URL;
    const ethersProvider = new ethers_1.ethers.providers.JsonRpcProvider(url);
    fastify.decorate("ethersProvider", ethersProvider);
});
