import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { BlogSchema, IdSchema } from "@divyam97/medium-common";
import { prisma } from "../../lib/prisma";

const router = Router();

router.get("/bulk", async (req, res) => {
  try {
    const posts = await prisma.blog.findMany({
      include: {
        author: {
          select: { email: true },
        },
        tags: {
          select: {
            category: true,
          },
        },
      },
    });
    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/me", authMiddleware, async (req, res) => {
  try {
    const userId = res.locals.userId;

    const posts = await prisma.blog.findMany({
      where: {
        authorId: userId,
      },
      include: {
        tags: {
          select: {
            category: true,
          },
        },
      },
    });

    return res.status(200).json({ posts });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.get("/:id", async (req, res) => {
  const result = IdSchema.safeParse(req.params);

  if (!result.success) {
    return res.status(400).json({ error: "Invalid post id" });
  }

  const id = result.data.id; // already a number ✅
  try {
    const post = await prisma.blog.findUnique({
      where: { id },
      include: {
        author: {
          select: { email: true },
        },
        tags: {
          select: {
            category: true,
          },
        },
      },
    });

    if (!post) {
      return res.status(404).json({
        error: "Post not found",
      });
    }

    return res.status(200).json({ post });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/", authMiddleware, async (req, res) => {
  const result = BlogSchema.safeParse(req.body);
  if (!result.success) {
    return res.status(400).json({
      error: "Invalid title, body, or tags format",
    });
  }
  const userId = res.locals.userId;
  try {
    const createdPost = await prisma.blog.create({
      data: {
        title: result.data.title,
        body: result.data.body,
        authorId: userId,
        published: result.data.published,
        tags: {
          createMany: {
            data: result.data.tags.map((tag) => ({
              category: tag,
            })),
          },
        },
      },
      include: {
        tags: true,
      },
    });
    return res.status(201).json({
      message: "Post created successfully",
      createdPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.put("/:id", authMiddleware, async (req, res) => {
  const idResult = IdSchema.safeParse(req.params);
  if (!idResult.success) {
    return res.status(400).json({
      error: "Invalid title, body, or tags format",
    });
  }
  const blogResult = BlogSchema.safeParse(req.body);
  if (!blogResult.success) {
    return res.status(400).json({
      error: "Invalid title or body format",
    });
  }
  const userId = res.locals.userId;
  const id = idResult.data.id;
  try {
    const existingPost = await prisma.blog.findUnique({
      where: { id },
    });

    if (!existingPost) {
      return res.status(404).json({
        error: "Blog not found",
      });
    }

    if (existingPost.authorId !== userId) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    const updatedPost = await prisma.blog.update({
      where: { id },
      data: {
        title: blogResult.data.title,
        body: blogResult.data.body,
        published: blogResult.data.published,
        tags: {
          deleteMany: {},
          createMany: {
            data: blogResult.data.tags.map((tag) => ({
              category: tag,
            })),
          },
        },
      },
      include: {
        author: {
          select: { email: true },
        },
        tags: {
          select: { category: true },
        },
      },
    });

    return res.status(200).json({
      message: "Post updated successfully",
      post: updatedPost,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

export default router;
