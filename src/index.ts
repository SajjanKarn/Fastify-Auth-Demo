import fastify, { FastifyInstance } from "fastify";
import fastifyMongodb from "@fastify/mongodb";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";

import userRoute from "./routes/auth";

// dotenv configuration
dotenv.config();

const server: FastifyInstance = fastify({ logger: true });

// plugins
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
});

server.register(fastifyMongodb, {
  url: process.env.MONGODB_URI as string,
  forceClose: true,
});

// routes
server.register(userRoute, { prefix: "/api/auth" });

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
