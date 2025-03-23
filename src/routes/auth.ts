import fastify, { FastifyInstance } from "fastify";

type Register = {
  name: string;
  email: string;
  password: string;
  contact: number;
};

export default async function userRoute(server: FastifyInstance) {
  server.post<{ Body: Register }>(
    "/register",
    {
      schema: {
        body: {
          type: "object",
          required: ["name", "email", "password", "contact"],
          properties: {
            name: { type: "string" },
            email: { type: "string" },
            password: { type: "string" },
            contact: { type: "number" },
          },
        },
      },
    },
    async (request, reply) => {
      const { name, email, password, contact } = request.body;
      return {
        name,
        email,
        password,
        contact,
      };
    }
  );
}
