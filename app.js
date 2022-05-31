"use strict";

const fastify = require("fastify")({
  logger: {
    prettyPrint: {
      translateTime: "HH:MM:ss Z",
      ignore: "pid,hostname",
    },
  },
});
const path = require("path");
const AutoLoad = require("fastify-autoload");

// Place here your custom code!
// Do not touch the following lines

// This loads all plugins defined in plugins
// those should be support plugins that are reused
// through your application
fastify.register(AutoLoad, {
  dir: path.join(__dirname, "plugins"),
});

// This loads all plugins defined in routes
// define your routes in one of these
fastify.register(AutoLoad, {
  dir: path.join(__dirname, "routes"),
});

fastify.register(require("point-of-view"), {
  engine: {
    ejs: require("ejs"),
  },
});

fastify.listen(3000, function (err, address) {
  if (err) {
    fastify.log.error(err);
    process.exit(1);
  }
  // Server is now listening on ${address}
});
