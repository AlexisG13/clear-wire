import fp from "fastify-plugin";
import { ethers } from 'ethers';

export default fp(async function (fastify, opts) {
  const { config } = <any>fastify;
  const url = config.ETHEREUM_NETWORK_URL;
  const ethersProvider = new ethers.providers.JsonRpcProvider(url);

  fastify.decorate("ethersProvider", ethersProvider);
});
