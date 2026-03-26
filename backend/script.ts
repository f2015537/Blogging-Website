import { prisma } from "./lib/prisma";
import { Category } from "./generated/prisma/enums";

async function main() {
  // Optional cleanup so re-running seed gives predictable results
  await prisma.tag.deleteMany();
  await prisma.blog.deleteMany();
  await prisma.user.deleteMany();

  const user1 = await prisma.user.create({
    data: {
      email: "alice@example.com",
      passwordHash: "hashed_password_alice",
      name: "Alice",
      blogs: {
        create: [
          {
            title: "Getting Started with Prisma",
            body: "Prisma makes working with databases much easier in TypeScript applications.",
            tags: {
              create: [
                { category: Category.Technology },
                { category: Category.Programming },
              ],
            },
          },
          {
            title: "How to Stay Productive as a Developer",
            body: "Productivity comes from consistency, focus, and reducing context switching.",
            tags: {
              create: [{ category: Category.Productivity }],
            },
            published: true,
          },
        ],
      },
    },
  });

  const user2 = await prisma.user.create({
    data: {
      email: "bob@example.com",
      passwordHash: "hashed_password_bob",
      blogs: {
        create: [
          {
            title: "Why Startups Move Fast",
            body: "Startups often optimize for speed, iteration, and customer feedback loops.",
            tags: {
              create: [
                { category: Category.Startups },
                { category: Category.Technology },
              ],
            },
          },
          {
            title: "Top 5 Programming Habits",
            body: "Writing clear code, testing often, and learning continuously are key habits.",
            tags: {
              create: [{ category: Category.Programming }],
            },
          },
        ],
      },
    },
  });

  console.log("Seeded users:");
  console.log(user1.email);
  console.log(user2.email);

  const blogs = await prisma.blog.findMany({
    include: {
      author: true,
      tags: true,
    },
  });

  console.log(`Seeded ${blogs.length} blogs`);
}

main()
  .catch((e) => {
    console.error("Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
