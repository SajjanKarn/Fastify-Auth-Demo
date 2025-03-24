import fastify, { FastifyInstance } from "fastify";
import fastifyMongodb, { ObjectId } from "@fastify/mongodb";
import fastifyJwt from "@fastify/jwt";
import dotenv from "dotenv";

import userRoute from "./routes/auth/auth";

// extend the FastifyInstance interface
declare module "fastify" {
  interface FastifyInstance {
    authenticate: (
      request: FastifyRequest,
      reply: FastifyReply
    ) => Promise<void>;
  }
}

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

//
server.decorate("authenticate", async function (request, reply) {
  try {
    const result = (await request.jwtVerify()) as {
      _id: ObjectId;
      iat: number;
    };
    const UserCollection = server.mongo.db?.collection("users");
    const user = await UserCollection?.findOne({
      _id: new ObjectId(result._id),
    });

    if (!user) {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    request.user = { ...user, password: undefined };
  } catch (err) {
    reply.send(err);
  }
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
