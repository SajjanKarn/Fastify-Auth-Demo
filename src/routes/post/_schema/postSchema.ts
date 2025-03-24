const createPostSchema = {
  body: {
    type: "object",
    required: ["title", "content", "isNSFW"],
    properties: {
      title: { type: "string", minLength: 5, maxLength: 100 },
      content: { type: "string", minLength: 5, maxLength: 1000 },
      isNSFW: { type: "boolean", default: false },
    },
  },

  response: {
    200: {
      type: "object",
      properties: {
        _id: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
        isNSFW: { type: "boolean" },
        postedBy: { type: "string" },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
        __v: { type: "number" },
      },
    },
  },
};

const deletePostSchema = {
  response: {
    200: {
      type: "object",
      properties: {
        message: { type: "string" },
      },
    },
  },
};

const getUserPostsSchema = {
  200: {
    type: "array",
    items: {
      type: "object",
      properties: {
        _id: { type: "string" },
        title: { type: "string" },
        content: { type: "string" },
        isNSFW: { type: "boolean" },
        postedBy: {
          type: "object",
          properties: {
            _id: { type: "string" },
            name: { type: "string" },
            email: { type: "string" },
          },
        },
        createdAt: { type: "string" },
        updatedAt: { type: "string" },
      },
    },
  },
};

export { createPostSchema, deletePostSchema, getUserPostsSchema };
