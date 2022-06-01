"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lighting_json_1 = __importDefault(require("../contracts/Lighting.json"));
const ethers_1 = require("ethers");
async function default_1(fastify, opts) {
    const { ethersProvider, prisma } = fastify;
    fastify.post('/records/:companyId', async (req, res) => {
        const { consumed, produced } = req.body;
        const { companyId } = req.params;
        const signer = ethersProvider.getSigner();
        const lighting = new ethers_1.ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', Lighting_json_1.default.abi, signer);
        await prisma.registro.create({
            data: {
                consumido: consumed,
                producido: produced,
                entidad: {
                    connectOrCreate: {
                        where: { id: Number(companyId) },
                        create: { nombre: `Entidad ${companyId}` },
                    },
                },
            },
        });
        const timestamp = Math.floor(Date.now() / 1000);
        await lighting.addRecord(companyId, timestamp, {
            consumed,
            produced,
            date: timestamp,
        });
        const record = await lighting.electricalRecords(companyId, timestamp);
        return parseRecord(record);
    });
    fastify.get('/records/:companyId/top', async (req, res) => {
        const { companyId } = req.params;
        const signer = await ethersProvider.getSigner();
        const lighting = new ethers_1.ethers.Contract('0x5FbDB2315678afecb367f032d93F642f64180aa3', Lighting_json_1.default.abi, signer);
        const records = await lighting.getLast10Records(Number(companyId));
        const parsedRecords = records.map((record) => parseRecord(record));
        return res.view('src/views/index.ejs', { parsedRecords: parsedRecords });
    });
    fastify.get('/entities', async (req, res) => {
        const entities = await prisma.entidad.findMany();
    });
}
exports.default = default_1;
function parseRecord(record) {
    return {
        produced: record.produced.toNumber(),
        consumed: record.consumed.toNumber(),
        date: new Date(record.date.toNumber() * 1000),
    };
}
