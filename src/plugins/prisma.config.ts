import fp from "fastify-plugin";
import { PrismaClient } from '@prisma/client';

export default fp(async function (fastify, opts) {
  const prisma = new PrismaClient();
  fastify.decorate("prisma", prisma);
});