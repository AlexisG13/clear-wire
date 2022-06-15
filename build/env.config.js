"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fastify_env_1 = __importDefault(require("fastify-env"));
const fastify_plugin_1 = __importDefault(require("fastify-plugin"));
const schema = {
    type: "object",
    required: ["PORT", "ETHEREUM_NETWORK_URL", "CONTRACT_ADDRESS", "LOCAL"],
    properties: {
        PORT: {
            type: "string",
            default: 3000,
        },
        ETHEREUM_NETWORK_URL: {
            type: "string",
        },
        CONTRACT_ADDRESS: {
            type: "string",
        },
        LOCAL: {
            type: "boolean",
        }
    },
};
const options = {
    confKey: "config",
    schema: schema,
    dotenv: true,
};
exports.default = (0, fastify_plugin_1.default)(async (fastify, opts) => {
    console.log('loading env');
    fastify.register(fastify_env_1.default, options).ready((err) => {
        if (err)
            console.log(err);
    });
});
