import Fastify from 'fastify';
import cors from '@fastify/cors';
import chalk from 'chalk';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import { appRouter } from './router.js';

const PORT = process.env.PORT ? parseInt(process.env.PORT) : 4000;
const HOST = process.env.HOST || '0.0.0.0';

const server = Fastify({
  logger: true,
  maxParamLength: 5000,
});

// Register CORS
await server.register(cors, {
  origin: true, // Allow all origins for now
  credentials: true,
});

// Register tRPC
await server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext: () => ({}),
  },
});

// Start server
const start = async () => {
  try {
    await server.listen({ port: PORT, host: HOST });
    console.log(chalk.cyan('\n  Backend server running:\n'));
    console.log(`  ${chalk.bold('➜  Local:')} http://${HOST}:${PORT}/`);
    console.log(`  ${chalk.bold('➜  tRPC:')} http://${HOST}:${PORT}/trpc\n`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
