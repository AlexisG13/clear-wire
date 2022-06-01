// const fastify = require("fastify")({
//   logger: {
//     prettyPrint: {
//       translateTime: "HH:MM:ss Z",
//       ignore: "pid,hostname",
//     },
//   },
// });
import fastify from 'fastify';
import path from 'path';
import AutoLoad from 'fastify-autoload';
import config from './env.config'

// Place here your custom code!
// Do not touch the following lines

const server = fastify({
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
server.register(config);

server.register(AutoLoad, {
  dir: path.join(__dirname, 'plugins'),
});

// This loads all plugins defined in routes
// define your routes in one of these
server.register(AutoLoad, {
  dir: path.join(__dirname, 'routes'),
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
