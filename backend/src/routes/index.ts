import { Router } from "express";
import blogRouter from "./blogRoutes";
import { SignUpSchema, SignInSchema } from "../types";
import bcrypt from "bcrypt";
import { prisma } from "../../lib/prisma";
import { Prisma } from "../../generated/prisma/client";
import { env } from "../config/env";
import jwt from "jsonwebtoken";

const router = Router();

const { SALT_ROUNDS, JWT_SECRET } = env;

router.post("/signup", async (req, res) => {
  const result = SignUpSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid email or password format",
    });
  }

  try {
    const passwordHash = await bcrypt.hash(result.data.password, SALT_ROUNDS);

    const createdUser = await prisma.user.create({
      data: {
        email: result.data.email,
        name: result.data.name,
        passwordHash,
      },
    });

    return res.status(201).json({
      message: "Signup successful",
      token: jwt.sign({ id: createdUser.id }, JWT_SECRET),
    });
  } catch (err) {
    if (
      err instanceof Prisma.PrismaClientKnownRequestError &&
      err.code === "P2002"
    ) {
      return res.status(409).json({
        error: "Email already in use",
      });
    }

    console.error(err);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.post("/signin", async (req, res) => {
  const result = SignInSchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({
      error: "Invalid email or password format",
    });
  }

  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email: result.data.email,
      },
    });

    if (!existingUser) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }

    const match = await bcrypt.compare(
      result.data.password,
      existingUser.passwordHash,
    );
    if (!match) {
      return res.status(401).json({
        error: "Invalid credentials",
      });
    }
    return res.json({
      message: "Signin successful",
      token: jwt.sign({ id: existingUser.id }, JWT_SECRET),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Internal server error",
    });
  }
});

router.use("/blog", blogRouter);

export default router;
