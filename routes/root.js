"use strict";

module.exports = async function (fastify, opts) {
  const { ethersProvider } = fastify;

  fastify.get("/", async function (request, reply) {
    const blockNumber = await ethers.getBlockNumber();
    console.log(`Current block number is ${blockNumber}`);
    return { root: true };
  });

  fastify.get("/test/:companyId", (req, res) => {
    console.log(req.params.companyId);
    return 'hi there';
  })

};
