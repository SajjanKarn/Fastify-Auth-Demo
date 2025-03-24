import { FastifyInstance } from "fastify";
import Post from "../../models/Post";
import mongoose, { ObjectId } from "mongoose";
import {
  createPostSchema,
  deletePostSchema,
  getUserPostsSchema,
} from "./_schema/postSchema";

type CreatePostBody = {
  title: string;
  content: string;
  isNSFW: boolean;
};

export async function postRoutes(server: FastifyInstance) {
  // get all posts
  server.get("/", async (request, reply) => {
    const posts = await Post.find().populate("postedBy", "_id name email");
    return posts;
  });

  // create a post
  server.post<{ Body: CreatePostBody }>(
    "/",
    {
      preHandler: [server.authenticate],
      schema: createPostSchema,
    },
    async (request, reply) => {
      const { title, content, isNSFW } = request.body;

      const post = new Post({
        title,
        content,
        isNSFW,
        // @ts-ignore
        postedBy: request.user._id,
      });

      const result = await post.save();

      return result;
    }
  );

  // get a post
  server.get<{ Params: { postId: string } }>(
    "/:postId",
    {
      schema: {
        response: createPostSchema.response,
      },
    },
    async (request, reply) => {
      if (!mongoose.isValidObjectId(request.params.postId)) {
        return reply.status(400).send({ message: "Invalid post ID" });
      }

      const { postId } = request.params;
      const post = await Post.findById(postId).populate(
        "postedBy",
        "_id name email"
      );
      return post;
    }
  );

  // delete a post
  server.delete<{ Params: { postId: string } }>(
    "/:postId",
    {
      preHandler: [server.authenticate],
      schema: deletePostSchema,
    },
    async (request, reply) => {
      if (!mongoose.isValidObjectId(request.params.postId)) {
        return reply.status(400).send({ message: "Invalid post ID" });
      }

      const { postId } = request.params;
      const post = await Post.findById(postId);

      if (!post) {
        return reply.status(404).send({ message: "Post not found" });
      }

      // @ts-ignore
      if (post.postedBy?.toString() !== request.user?._id.toString()) {
        return reply.status(403).send({ message: "Unauthorized" });
      }

      const deletedPost = await Post.deleteOne({ _id: postId });
      return { message: "Post deleted" };
    }
  );

  // update a post
  server.put<{ Params: { postId: string }; Body: CreatePostBody }>(
    "/:postId",
    {
      preHandler: [server.authenticate],
      schema: createPostSchema,
    },
    async (request, reply) => {
      if (!mongoose.isValidObjectId(request.params.postId)) {
        return reply.status(400).send({ message: "Invalid post ID" });
      }

      const { postId } = request.params;
      const post = await Post.findById(postId);

      if (!post) {
        return reply.status(404).send({ message: "Post not found" });
      }

      // @ts-ignore
      if (post.postedBy?.toString() !== request.user?._id.toString()) {
        return reply.status(403).send({ message: "Unauthorized" });
      }

      const { title, content, isNSFW } = request.body;

      const updatedPost = await Post.findByIdAndUpdate(
        postId,
        { title, content, isNSFW },
        { new: true }
      );

      return updatedPost;
    }
  );

  server.get(
    "/me",
    {
      preHandler: [server.authenticate],
      schema: {
        response: getUserPostsSchema,
      },
    },
    async (request) => {
      // @ts-ignore
      const userId = request.user._id;

      const posts = await Post.find({ postedBy: userId }).populate(
        "postedBy",
        "_id name email"
      );
      return posts;
    }
  );
}
