import fastify, { FastifyInstance } from "fastify";
import dotenv from "dotenv";

import userRoute from "./routes/auth";

const server: FastifyInstance = fastify({ logger: true });

// routes
server.register(userRoute, { prefix: "/api/auth" });

// dotenv configuration
dotenv.config();

server.get("/", async (request, reply) => {
  return {
    message: `server is up and running.`,
  };
});

const PORT = process.env.PORT || 3000;
const start = async () => {
  try {
    await server.listen({ port: PORT as number });
    server.log.info(`Server listening on ${server.server.address()}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

start();
