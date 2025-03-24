import fastify, { FastifyInstance } from "fastify";
import fastifyMongodb, { ObjectId } from "@fastify/mongodb";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
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

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: "API Documentation",
      description: "API documentation for your application",
      version: "1.0.0",
    },
    securityDefinitions: {
      bearerAuth: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description:
          'JWT Authorization header using the Bearer scheme. Example: "Authorization: Bearer {token}"',
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
    host: "localhost:" + (process.env.PORT || 3000),
    schemes: ["http", "https"],
    consumes: ["application/json"],
    produces: ["application/json"],
  },
});

server.register(fastifySwaggerUi, {
  routePrefix: "/documentation",
  uiConfig: {
    docExpansion: "list",
    deepLinking: false,
  },
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

server.ready().then(() => {
  server.swagger();
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
