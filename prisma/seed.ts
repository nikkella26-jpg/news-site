import prisma from '../lib/prisma.js';
import { Role } from '../lib/generated/prisma/index.js';

async function main() {
  console.log('Seeding database...');
  
  // Cleanup existing data to avoid conflicts if re-running
  await prisma.$transaction([
    prisma.article.deleteMany({}),
    prisma.subscription.deleteMany({}),
    prisma.subscriptionType.deleteMany({}),
    prisma.category.deleteMany({}),
  ]);
  // Keeping users for now or handle them via upsert
  
  console.log('Data cleaned up.');

  // 1. Categories
  const categories = [
    'Local',
    'Sweden',
    'World',
    'Weather',
    'Economy',
    'Sports',
  ];

  await Promise.all(
    categories.map((name) =>
      prisma.category.upsert({
        where: { name },
        update: {},
        create: { name },
      })
    )
  );
  console.log('Categories seeded.');

  // 2. Subscription Types
  const subTypes = [
    { name: 'Free', description: 'Basic access to news', price: 0 },
    { name: 'Premium', description: 'Full access to all articles', price: 99 },
    { name: 'Family', description: 'Access for the whole family', price: 149 },
  ];

  for (const st of subTypes) {
    await prisma.subscriptionType.create({
      data: st,
    });
  }
  console.log('SubscriptionTypes seeded.');

  // 3. Users
  const password = 'password123'; // In a real app, hash this!

  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      name: 'Admin User',
      email: 'admin@example.com',
      password,
      role: Role.ADMIN,
    },
  });

  const editor = await prisma.user.upsert({
    where: { email: 'editor@example.com' },
    update: {},
    create: {
      name: 'Editor User',
      email: 'editor@example.com',
      password,
      role: Role.EDITOR,
    },
  });

  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      name: 'Normal User',
      email: 'user@example.com',
      password,
      role: Role.USER,
    },
  });
  console.log('Users seeded.');

  // 4. Articles
  const swedenCategory = await prisma.category.findUnique({ where: { name: 'Sweden' } });
  const techCategory = await prisma.category.findUnique({ where: { name: 'Economy' } });

  if (swedenCategory) {
    await prisma.article.create({
      data: {
        headline: 'Big News in Sweden',
        summary: 'Something important happened.',
        content: 'Detailed content about the event in Sweden...',
        categoryId: swedenCategory.id,
        editorChoice: true,
        image: '/placeholder.jpg'
      },
    });
  }

  if (techCategory) {
    await prisma.article.create({
      data: {
        headline: 'Market hits record high',
        summary: 'Economy is booming.',
        content: 'Detailed analysis of the stock market...',
        categoryId: techCategory.id,
        views: 100,
        image: '/placeholder.jpg'
      },
    });
  }
  console.log('Articles seeded.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
