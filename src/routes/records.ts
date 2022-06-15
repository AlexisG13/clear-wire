import contract from '../contracts/Lighting.json';
import { ethers } from 'ethers';
import { PrismaClient, Registro } from '@prisma/client';

export default async function (fastify, opts) {
  const { ethersProvider, prisma, config } = <
    { ethersProvider: ethers.providers.JsonRpcProvider; prisma: PrismaClient; config: any }
  >fastify;

  fastify.post('/records/:companyId', async (req, res) => {
    const { consumed, produced } = req.body;
    const { companyId } = req.params;
    const signer = config.LOCAL ? 
      ethersProvider.getSigner()
    : new ethers.Wallet('4aa27bb6b80767abff98a77125142334099959f893af2f94f7ce2e00473fa2e1', ethersProvider);
    const lighting = new ethers.Contract(
      config.CONTRACT_ADDRESS,
      contract.abi,
      signer
    );
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

  fastify.get('/records/:companyId/top', async (req, res) => {
    const { companyId } = req.params;
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
      include: {
        entidad: true
      }
    });
    return res.view('src/views/index.ejs', { parsedRecords: latestRecords.map(record => parseRecord(record)) });
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
    return res.view('src/views/index.ejs', { parsedRecords: latestRecords.map(record => parseRecord(record)) });
  });

  fastify.get('/entities', async(req, res) => {
    const entities = await prisma.entidad.findMany();
  })
}

function parseRecord(record: Registro) {
  console.log('estoy parseandooo')
  return {
    ...record,
    createdAt: record.createdAt.toLocaleString('en-GB', { hour12: true })
  };
}