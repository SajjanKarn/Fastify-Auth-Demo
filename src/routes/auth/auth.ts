import { FastifyInstance } from "fastify";
import bcrypt from "bcrypt";

import { registerSchema } from "./_schema/registerSchema";
import { loginSchema } from "./_schema/loginSchema";

type Register = {
  name: string;
  email: string;
  password: string;
  contact: number;
};

type Login = {
  email: string;
  password: string;
};

export default async function userRoute(server: FastifyInstance) {
  server.post<{ Body: Register }>(
    "/register",
    {
      schema: registerSchema,
    },
    async (request, reply) => {
      const { name, email, password, contact } = request.body;

      const UserCollection = server.mongo.db?.collection("users");

      const isUserExist = await UserCollection?.findOne({ email });
      if (isUserExist) {
        return reply.code(400).send({
          message: "User already exist",
        });
      }

      try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const result = await UserCollection?.insertOne({
          name,
          email,
          password: hashedPassword,
          contact,
        });

        const token = server.jwt.sign({
          _id: result?.insertedId,
        });

        return {
          token,
        };
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          message: "Internal Server Error",
        });
      }
    }
  );

  server.post<{ Body: Login }>(
    "/login",
    {
      schema: loginSchema,
    },
    async (request, reply) => {
      const { email, password } = request.body;

      const UserCollection = server.mongo.db?.collection("users");
      try {
        const user = await UserCollection?.findOne({ email });

        if (!user) {
          return reply.code(400).send({
            message: "User not found",
          });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
          return reply.code(400).send({
            message: "Invalid email or password",
          });
        }

        const token = server.jwt.sign({
          _id: user._id,
        });

        return {
          ...user,
          token,
        };
      } catch (error) {
        console.log(error);
        return reply.code(500).send({
          message: "Internal Server Error",
        });
      }
    }
  );

  server.get(
    "/protected",
    {
      onRequest: [server.authenticate],
      schema: {
        request: {
          headers: {
            type: "object",
            properties: {
              authorization: { type: "string" },
            },
            required: ["authorization"],
          },
        },
        response: {
          200: {
            type: "object",
            properties: {
              _id: { type: "string" },
              name: { type: "string" },
              email: { type: "string" },
              contact: { type: "number" },
            },
          },
          401: {
            description: "Unauthorized - Invalid or missing token",
            type: "object",
            properties: {
              message: { type: "string" },
              error: { type: "string" },
            },
          },
        },
      },
    },
    async (request, reply) => {
      return request.user;
    }
  );
}
