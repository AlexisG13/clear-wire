import fastifyEnv from "fastify-env";
import fp from "fastify-plugin";

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

export default fp(async (fastify, opts) => {
  console.log('loading env');
  fastify.register(fastifyEnv, options).ready((err) => {
    if (err) console.log(err);
  });
});
