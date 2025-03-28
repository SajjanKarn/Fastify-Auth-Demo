import fastify, { FastifyInstance } from "fastify";
import fastifyJwt from "@fastify/jwt";
import fastifySwagger from "@fastify/swagger";
import fastifySwaggerUi from "@fastify/swagger-ui";
import fastifyRateLimit from "@fastify/rate-limit";
import fastifyHelmet from "@fastify/helmet";
import fastifyCompress from "@fastify/compress";
import dotenv from "dotenv";

import userRoute from "./routes/auth/auth";
import { connectDB } from "./db/connection";
import { ObjectId } from "mongoose";
import User from "./models/User";
import { postRoutes } from "./routes/post/post";

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

// connect db
connectDB();

// plugins
server.register(fastifyJwt, {
  secret: process.env.JWT_SECRET as string,
});

server.register(fastifyRateLimit, {
  max: 25, // limit each IP to 25 requests per windowMs
  timeWindow: "1 minute",
});

server.register(fastifyHelmet, {
  contentSecurityPolicy: false,
});

server.register(fastifyCompress, {
  global: false,
});

server.register(fastifySwagger, {
  swagger: {
    info: {
      title: "Auth DEMO FASTIFY API",
      description:
        "This is a simple API made with Fastify which includes authentication and authorization, jwt, swagger, @fastify/jwt, @fastify/swagger, @fastify/swagger-ui, @fastify/rate-limit, @fastify/helmet, @fastify/compress",
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
    const user = await User.findOne({ _id: result._id });
    if (!user) {
      return reply.code(401).send({
        message: "Unauthorized",
      });
    }

    request.user = user;
  } catch (err) {
    reply.send(err);
  }
});

// routes
server.register(userRoute, { prefix: "/api/auth" });
server.register(postRoutes, { prefix: "/api/post" });

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
