"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const fastify = require("fastify")({
//   logger: {
//     prettyPrint: {
//       translateTime: "HH:MM:ss Z",
//       ignore: "pid,hostname",
//     },
//   },
// });
const fastify_1 = __importDefault(require("fastify"));
const path_1 = __importDefault(require("path"));
const fastify_autoload_1 = __importDefault(require("fastify-autoload"));
const env_config_1 = __importDefault(require("./env.config"));
// Place here your custom code!
// Do not touch the following lines
const server = (0, fastify_1.default)({
    logger: {
        prettyPrint: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname',
        },
    },
});
// This loads all plugins defined in plugins
// those should be support plugins that are reused
// through your application
server.register(env_config_1.default);
server.register(fastify_autoload_1.default, {
    dir: path_1.default.join(__dirname, 'plugins'),
});
// This loads all plugins defined in routes
// define your routes in one of these
server.register(fastify_autoload_1.default, {
    dir: path_1.default.join(__dirname, 'routes'),
});
server.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs'),
    },
});
server.listen(3000, function (err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
