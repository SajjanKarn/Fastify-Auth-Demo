const loginSchema = {
  body: {
    type: "object",
    required: ["email", "password"],
    properties: {
      email: { type: "string" },
      password: { type: "string" },
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
        token: { type: "string" },
      },
    },
  },
};

export { loginSchema };
