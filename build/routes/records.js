"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Lighting_json_1 = __importDefault(require("../contracts/Lighting.json"));
const ethers_1 = require("ethers");
async function default_1(fastify, opts) {
    const { ethersProvider, prisma, config } = fastify;
    fastify.post('/records/:companyId', async (req, res) => {
        const { consumed, produced } = req.body;
        const { companyId } = req.params;
        const signer = config.LOCAL ?
            ethersProvider.getSigner()
            : new ethers_1.ethers.Wallet('4aa27bb6b80767abff98a77125142334099959f893af2f94f7ce2e00473fa2e1', ethersProvider);
        const lighting = new ethers_1.ethers.Contract(config.CONTRACT_ADDRESS, Lighting_json_1.default.abi, signer);
        const timestamp = Math.floor(Date.now() / 1000);
        const tx = await lighting.addRecord(companyId, timestamp, {
            consumed,
            produced,
            date: timestamp,
        });
        const record = await prisma.registro.create({
            data: {
                consumido: consumed,
                producido: produced,
                transactionHash: tx.hash,
                entidad: {
                    connectOrCreate: {
                        where: { id: Number(companyId) },
                        create: { nombre: `Entidad ${companyId}` },
                    },
                },
            },
        });
        return parseRecord(record);
    });
    fastify.get('/records/:companyId/top/:skip', async (req, res) => {
        const { companyId, skip } = req.params;
        //   const address = config.CONTRACT_ADDRESS;
        //   const signer = config.LOCAL ? 
        //   ethersProvider.getSigner()
        // : new ethers.Wallet('4aa27bb6b80767abff98a77125142334099959f893af2f94f7ce2e00473fa2e1', ethersProvider);
        //   const lighting = new ethers.Contract(
        //     address,
        //     contract.abi,
        //     signer
        //   );
        //   const records = await lighting.getEntityLast10Records(Number(companyId));
        //   const parsedRecords = records.map((record) => parseRecord(record));
        //   const latestBlock = await ethersProvider.getBlock("latest")
        //   console.log(latestBlock);
        const latestRecords = await prisma.registro.findMany({
            where: {
                entidadId: Number(companyId)
            },
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
            skip: 10 * (Number(skip) - 1),
            include: {
                entidad: true
            }
        });
        const entidad = await prisma.entidad.findUnique({
            where: {
                id: Number(companyId)
            },
            include: {
                Registro: {
                    orderBy: {
                        createdAt: 'desc'
                    },
                    take: 10,
                    skip: 10 * (skip - 1),
                }
            }
        });
        const totalRecords = await prisma.registro.count({
            where: {
                entidadId: Number(companyId)
            }
        });
        return res.view('src/views/entity_records.ejs', { entidad, pages: Math.ceil(totalRecords / 10), current: Number(skip) });
    });
    fastify.get('/records', async (req, res) => {
        const latestRecords = await prisma.registro.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            take: 10,
            include: {
                entidad: true,
            }
        });
        return res.view('src/views/generalTransaction.ejs', { parsedRecords: latestRecords.map(record => parseRecord(record)) });
    });
    fastify.get('/entities', async (req, res) => {
        const entities = await prisma.entidad.findMany();
    });
}
exports.default = default_1;
function parseRecord(record) {
    console.log('estoy parseandooo');
    return Object.assign(Object.assign({}, record), { createdAt: record.createdAt.toLocaleString('en-GB', { hour12: true }) });
}
