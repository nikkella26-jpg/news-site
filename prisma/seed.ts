import { prisma } from "../lib/prisma";
import slugify from "slugify";

const articles = [
  // --- SPORTS ---
  {
    category: "sports",
    title: "What's your bet on Super Sunday?",
    date: "2026-01-24",
    image: "https://www.rollingstone.com/wp-content/uploads/2025/02/eagles-super-bowl-recap.jpg?w=1581&h=1054&crop=1",
    content: "This year one kickass Super Sunday show. Let's get ready to rumble!",
  },
  {
    category: "sports",
    title: "World's fastest Hot Dog eater! Joey ate it!",
    date: "2026-01-19",
    image: "https://people.com/thmb/qH4EgO6rYa_l0qdaQhNsCId7Nic=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2):format(webp)/joey-chestnut-hot-dogs-2-a674c1f6ef634721b7382de34737df25.jpg",
    content: "Joey Chestnut breaks records once again. Till ya puke!",
  },
  {
    category: "sports",
    title: "Formula 1 2026: New Engines, New Rivals",
    date: "2026-02-10",
    image: "https://www.actualidadmotor.com/wp-content/uploads/2024/04/motor-f1-2026.jpg",
    content: "The grid is heating up with the new regulations. Red Bull vs Ferrari 2.0.",
  },

  // --- WORLD ---
  {
    category: "world",
    title: "Greenlands future at stake! What's the deal Steale?",
    date: "2026-01-20",
    image: "https://www.fmn.dk/globalassets/fmn/billeder/artikel/-arktis-1146-2020-artikel.jpg",
    content: "Is there going to be an invasion of Greenland or is it just talk?",
  },
  {
    category: "world",
    title: "Eight dead in avalanche in Austria",
    date: "2026-01-20",
    image: "https://i.guim.co.uk/img/media/b1ccff2c540bb7db3b6eb4bf8e679a29388b87a3/0_0_2040_1360/master/2040.jpg?width=620&dpr=2&s=none&crop=none",
    content: "Eight people were tragically killed in an avalanche in the Austrian Alps. Emergency services were deployed to the Tyrol region.",
  },
  {
    category: "world",
    title: "Global Summit on Climate Action in Tokyo",
    date: "2026-02-05",
    image: "https://cnsd.gov.hk/wp-content/uploads/2023/06/1536917284-0.jpg",
    content: "World leaders gather to discuss the final push for net-zero by 2040.",
  },

  // --- POLITICS ---
  {
    category: "politics",
    title: "Is Europe ready for war and what is Brussels plan?",
    date: "2026-01-20",
    image: "https://images.euronews.com/articles/stories/09/59/08/59/1366x768_cmsv2_a1a68f06-5be7-518b-be9e-b7328fb4aa4e-9590859.jpg",
    content: "Get ready for the enemy, nasty chude invaders! Brussels is rethinking defense strategies.",
    editorPick: true,
  },
  {
    category: "politics",
    title: "New Election Polls: Major Shift in the Heartland",
    date: "2026-02-01",
    image: "https://heartland.org/wp-content/uploads/2025/09/WebstiteFeature2025Poll.png",
    content: "Voters are moving away from traditional party lines in record numbers.",
  },

  // --- TECH ---
  {
    category: "tech",
    title: "AI takes over the Newsroom",
    date: "2026-02-14",
    image: "https://img.freepik.com/premium-photo/digital-human-interface_21085-93295.jpg",
    content: "Can algorithms write better stories than humans? We investigate the rise of AI journalism.",
  },
  {
    category: "tech",
    title: "The Return of the Flip Phone?",
    date: "2026-02-12",
    image: "https://telforcegroup.com/wp-content/uploads/2023/08/telforce-flipphone.png",
    content: "Minimalism is back. Why Gen Z is ditching smartphones for 'dumb' phones.",
  }
];

async function main() {
  console.log("🌱 Seeding database...");

  // Ensure we have a user to assign as author
  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin User",
      role: "admin",
    },
  });
  const AUTHOR_ID = admin.id;

  for (const a of articles) {
    const slug = slugify(a.title, { lower: true, strict: true });

    // 1. Hantera Kategori
    let category = null;
    if (a.category) {
      category = await prisma.category.upsert({
        where: { name: a.category.toLowerCase() },
        update: {},
        create: { name: a.category.toLowerCase() },
      });
    }

    // 2. Hantera Artikel (Upsert gör att du kan köra seed flera gånger utan krasch)
    await prisma.article.upsert({
      where: { slug: slug },
      update: {
        title: a.title,
        content: a.content,
        image: a.image,
        isEditorsChoice: a.editorPick ?? false,
        categoryId: category ? category.id : null,
      },
      create: {
        title: a.title,
        slug,
        content: a.content,
        image: a.image,
        published: true,
        isEditorsChoice: a.editorPick ?? false,
        createdAt: new Date(a.date),
        author: {
          connect: { id: AUTHOR_ID },
        },
        category: category ? { connect: { id: category.id } } : undefined,
      },
    });
  }

  console.log("✅ Seeding done! Articles created with proper slugs.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});