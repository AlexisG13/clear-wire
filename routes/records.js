"use strict";
const contract = require("../artifacts/contracts/lighting.sol/Lighting.json");
const ethers = require("ethers");
const S = require("fluent-json-schema");

module.exports = async function (fastify, opts) {
  const { ethersProvider } = fastify;

  fastify.post("/records/:companyId", async (req, res) => {
    const { consumed, produced } = req.body;
    const {companyId} = req.params;
    const signer = await ethersProvider.getSigner();
    const lighting = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contract.abi,
      signer
    );
    const timestamp = Math.floor(Date.now()/1000);
    const transaction = await lighting.addRecord(companyId, timestamp, { consumed, produced, date: timestamp });
    const record = await lighting.electricalRecords(companyId, timestamp);
    return parseRecord(record);
  });

  fastify.post(
    "/records/:companyId/:dateId",
    async (req, res) => {
      console.log(req.body.value);
      return "congrats";
    }
  );

  fastify.get("/records/:companyId/top", async (req, res) => {
    const signer = await ethersProvider.getSigner();
    const lighting = new ethers.Contract(
      "0x5FbDB2315678afecb367f032d93F642f64180aa3",
      contract.abi,
      signer
    );
    const records = await lighting.getLast10Records(2);
    const parsedRecords = records.map(record => parseRecord(record));
    return { parsedRecords };
  })


};

function parseRecord(record) {
  return {
    produced: record.produced.toNumber(),
    consumed: record.consumed.toNumber(),
    date: new Date(record.date.toNumber() * 1000)
  }
}