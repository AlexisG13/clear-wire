"use strict";

const fp = require("fastify-plugin");
const ethers = require("ethers");

module.exports = fp(async function (fastify, opts, done) {
  const { config } = fastify;
  const url = config.ETHEREUM_NETWORK_URL;
  const ethersProvider = new ethers.providers.JsonRpcProvider(url);

  fastify.decorate("ethersProvider", ethersProvider);

  done();
});
