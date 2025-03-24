const registerSchema = {
  body: {
    type: "object",
    required: ["name", "email", "password", "contact"],
    properties: {
      name: { type: "string", minLength: 3, maxLength: 255 },
      email: { type: "string", format: "email" },
      password: { type: "string", minLength: 6, maxLength: 255 },
      contact: {
        type: "number",
        minimum: 1000000000,
        maximum: 9999999999,
      },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        token: { type: "string" },
      },
    },
  },
};

export { registerSchema };
