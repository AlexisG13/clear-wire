const fastify = require("fastify")();
const fastifyEnv = require("fastify-env");
const fp = require("fastify-plugin");

const schema = {
  type: "object",
  required: ["PORT", "ETHEREUM_NETWORK_URL"],
  properties: {
    PORT: {
      type: "string",
      default: 3000,
    },
    ETHEREUM_NETWORK_URL: {
      type: "string",
    },
  },
};

const options = {
  confKey: "config",
  schema: schema,
  dotenv: true,
};

module.exports = fp((fastify, opts, done) => {
  fastify.register(fastifyEnv, options).ready((err) => {
    if (err) console(err);
  });
  done();
});
