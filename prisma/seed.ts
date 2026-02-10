import prisma from "../lib/prisma";
import { Role } from "../lib/generated/prisma";

async function main() {
  console.log("Seeding database...");

  // Cleanup existing data to avoid conflicts if re-running
  await prisma.$transaction([
    prisma.article.deleteMany({}),
    prisma.subscription.deleteMany({}),
    prisma.subscriptionType.deleteMany({}),
    prisma.category.deleteMany({}),
  ]);

  console.log("Data cleaned up.");

  // 1. Categories
  const categories = [
    "Local",
    "Sweden",
    "World",
    "Weather",
    "Economy",
    "Sports",
  ];

  await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      }),
    ),
  );
  console.log("Categories seeded.");

  // 2. Subscription Types
  const subTypes = [
    { name: "Free", description: "Basic access to news", price: 0 },
    { name: "Premium", description: "Full access to all articles", price: 99 },
    { name: "Family", description: "Access for the whole family", price: 149 },
  ];

  await Promise.all(
    subTypes.map((st) =>
      prisma.subscriptionType.upsert({
        where: { id: st.name }, // Assuming name is used as the unique identifier/ID in this schema
        update: {},
        create: st,
      }),
    ),
  );
  console.log("SubscriptionTypes seeded.");

  // 3. Users
  const password = "password123";

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@example.com",
      password,
      role: Role.ADMIN,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: "editor@example.com" },
    update: {},
    create: {
      name: "Editor User",
      email: "editor@example.com",
      password,
      role: Role.EDITOR,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: "user@example.com" },
    update: {},
    create: {
      name: "Normal User",
      email: "user@example.com",
      password,
      role: Role.USER,
    },
  });
  console.log("Users seeded.");

  // 4. Articles
  const swedenCategory = await prisma.category.findUnique({
    where: { name: "Sweden" },
  });
  const economyCategory = await prisma.category.findUnique({
    where: { name: "Economy" },
  });

  if (swedenCategory && admin) {
    await prisma.article.create({
      data: {
        title: "Big News in Sweden",
        slug: "big-news-in-sweden",
        content: "Detailed content about the event in Sweden...",
        categoryId: swedenCategory.id,
        isEditorsChoice: true,
        image: "/placeholder.jpg",
        authorId: admin.id,
        published: true,
      },
    });
  }

  if (economyCategory && admin) {
    await prisma.article.create({
      data: {
        title: "Market hits record high",
        slug: "market-hits-record-high",
        content: "Detailed analysis of the stock market...",
        categoryId: economyCategory.id,
        image: "/placeholder.jpg",
        authorId: admin.id,
        published: true,
      },
    });
  }
  console.log("Articles seeded.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
