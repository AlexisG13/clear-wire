"use strict";
exports.__esModule = true;
// const fastify = require("fastify")({
//   logger: {
//     prettyPrint: {
//       translateTime: "HH:MM:ss Z",
//       ignore: "pid,hostname",
//     },
//   },
// });
var fastify_1 = require("fastify");
var path_1 = require("path");
var fastify_autoload_1 = require("fastify-autoload");
var env_config_1 = require("./env.config");
// Place here your custom code!
// Do not touch the following lines
var server = (0, fastify_1["default"])({
    logger: {
        prettyPrint: {
            translateTime: 'HH:MM:ss Z',
            ignore: 'pid,hostname'
        }
    }
});
// This loads all plugins defined in plugins
// those should be support plugins that are reused
// through your application
server.register(env_config_1["default"]);
server.register(fastify_autoload_1["default"], {
    dir: path_1["default"].join(__dirname, 'plugins')
});
// This loads all plugins defined in routes
// define your routes in one of these
server.register(fastify_autoload_1["default"], {
    dir: path_1["default"].join(__dirname, 'routes')
});
server.register(require('point-of-view'), {
    engine: {
        ejs: require('ejs')
    }
});
server.listen(3000, function (err, address) {
    if (err) {
        server.log.error(err);
        process.exit(1);
    }
    // Server is now listening on ${address}
});
