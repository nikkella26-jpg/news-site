import { Article } from "@/lib/generated/prisma";

// src/data/articles.ts
export const articles: (Article & {
  category: { name: string };
})[] = [
  {
    id: "1",
    category: { name: "sports" },
    title: "What's your bet on Super Sunday?",
    slug: "whats-your-bet-on-super-sunday",
    image:
      "https://www.rollingstone.com/wp-content/uploads/2025/02/eagles-super-bowl-recap.jpg?w=1581&h=1054&crop=1",
    content:
      "This year one kickass Super Sunday show. Let's get ready to rumble!",
    published: true,
    isEditorsChoice: false,
    authorId: "author-1",
    categoryId: "cat-sports",
    createdAt: new Date("January 24, 2026"),
    updatedAt: new Date("January 24, 2026"),
  },
  {
    id: "2",
    category: { name: "world" },
    title: "Greenlands future at stake! What's the deal Steale?",
    slug: "greenlands-future-at-stake-whats-the-deal-steale",
    image:
      "https://www.fmn.dk/globalassets/fmn/billeder/artikel/-arktis-1146-2020-artikel.jpg",
    content:
      "Is there going to be an invasion of Greenland or is it just talk?",
    published: true,
    isEditorsChoice: false,
    authorId: "author-2",
    categoryId: "cat-world",
    createdAt: new Date("January 20, 2026"),
    updatedAt: new Date("January 20, 2026"),
  },
  {
    id: "3",
    category: { name: "sports" },
    title: "World's fastest Hot Dog eater! Joey ate it!",
    slug: "worlds-fastest-hot-dog-eater-joey-ate-it",
    image:
      "https://people.com/thmb/qH4EgO6rYa_l0qdaQhNsCId7Nic=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():focal(999x0:1001x2):format(webp)/joey-chestnut-hot-dogs-2-a674c1f6ef634721b7382de34737df25.jpg",
    content: `Till ya puke!`,
    published: true,
    isEditorsChoice: false,
    authorId: "author-3",
    categoryId: "cat-sports",
    createdAt: new Date("January 19, 2026"),
    updatedAt: new Date("January 19, 2026"),
  },
  {
    id: "4",
    category: { name: "world" },
    title: "Eight dead in avalanche in Austria",
    slug: "eight-dead-in-avalanche-in-austria",
    image:
      "https://i.guim.co.uk/img/media/b1ccff2c540bb7db3b6eb4bf8e679a29388b87a3/0_0_2040_1360/master/2040.jpg?width=620&dpr=2&s=none&crop=none",
    // Use backticks here to allow pressing Enter for a new line
    content: `Eight people were tragically killed in an avalanche in the Austrian Alps. 

Emergency services were deployed to the Tyrol region following heavy snowfall.`,
    published: true,
    isEditorsChoice: false,
    authorId: "author-2",
    categoryId: "cat-world",
    createdAt: new Date("January 20, 2026"),
    updatedAt: new Date("January 20, 2026"),
  },
  {
    id: "5",
    category: { name: "politics" },
    title: "Is Europe ready for war and what is Brussels plan?",
    slug: "is-europe-ready-for-war-and-what-is-brussels-plan",
    image:
      "https://images.euronews.com/articles/stories/09/59/08/59/1366x768_cmsv2_a1a68f06-5be7-518b-be9e-b7328fb4aa4e-9590859.jpg",
    content: "Get ready for the ennemy, nasty chude invaders!",
    published: true,
    isEditorsChoice: true,
    authorId: "author-4",
    categoryId: "cat-politics",
    createdAt: new Date("January 20, 2026"),
    updatedAt: new Date("January 20, 2026"),
  },
  {
    id: "6",
    category: { name: "tech" },
    title: "The Rise of FPV Drones in Wars",
    slug: "the-rise-of-fpv-drones-in-wars",
    image:
      "https://img.glavnoe.in.ua/uploads/2025/01/29124107/472389076_949811590665253_8114851392640592500_n-1.webp",
    content:
      "Europé is behind Ukraine all the way! Drones find application in a variety of military operations, including electronic warfare, explosive ordnance disposal, training and logistics support. However, they are most frequently employed in intelligence, surveillance, target acquisition, and reconnaissance (ISTAR) missions",
    published: true,
    isEditorsChoice: false,
    authorId: "author-5",
    categoryId: "cat-tech",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "7",
    category: { name: "sports" },
    title: "Golf: American Express 2026 leader",
    slug: "golf-american-express-2026-leader",
    image:
      "https://www.gannett-cdn.com/authoring/authoring-images/2026/01/25/SGLF/88343372007-getty-images-2258016052.jpg?crop=7554,4249,x0,y0&width=2560",
    content:
      "As the tournament progresses the South Korean Si Woo Kim is in the lead.",
    published: true,
    isEditorsChoice: false,
    authorId: "author-1",
    categoryId: "cat-sports",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "8",
    category: { name: "world" },
    title: "Karachi shopping mall fire.",
    slug: "karachi-shopping-mall-fire",
    image:
      "https://www.reuters.com/resizer/v2/GJOOOCOEXBJHLFLWRY73HC76UU.jpg?auth=cb60190e1b50fc100d567262b8c84a8dee41b43b425994e6668527fdce1c25ad&width=1200&quality=80",
    content:
      "A massive fire broke out at the Gul Plaza Shopping Mall in Karachi and demolished it completely. it is need for restauration.",
    published: true,
    isEditorsChoice: false,
    authorId: "author-2",
    categoryId: "cat-world",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "9",
    category: { name: "world" },
    title:
      "Zelenskyy says trilateral talks ended constructively and more are possible next week",
    slug: "zelenskyy-says-trilateral-talks-ended-constructively-and-more-are-possible-next-week",
    image:
      "https://prodgs-17455.kxcdn.com/photos/469d2aab-7f3a-4e00-a440-427b21bdb8df/large.avif",
    content:
      "Ukrainian President Volodymyr Zelenskyy says talks with Russian and American representatives have concluded with constructive discussions on ending the war.",
    published: true,
    isEditorsChoice: false,
    authorId: "author-2",
    categoryId: "cat-world",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "10",
    category: { name: "politics" },
    title:
      "More than 2,000 people reported killed at Iran protests as Trump says 'help is on its way",
    slug: "more-than-2000-people-reported-killed-at-iran-protests-as-trump-says-help-is-on-its-way",
    image:
      "https://ichef.bbci.co.uk/news/1024/cpsprodpb/06b3/live/3a325730-f10a-11f0-a422-4ba8a094a8fa.jpg.webp",
    content:
      "More than 2,000 people have been killed during the violent crackdown by security forces on protests in Iran",
    published: true,
    isEditorsChoice: false,
    authorId: "author-4",
    categoryId: "cat-politics",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "11",
    category: { name: "sports" },
    title:
      "Home hero Manuel Feller wins men's slalom Alpine Skiing World Cup in Kitzbühel",
    slug: "home-hero-manuel-feller-wins-mens-slalom-alpine-skiing-world-cup-in-kitzbuhel",
    image:
      "https://img.olympics.com/images/image/private/t_s_16_9_g_auto/t_s_w2440/f_auto/primary/nfzpzpo88qpxjtlw63t1",
    content:
      "The Austrian veteran faced a nervous wait after taking the lead on his second run before celebrating his first win of the season with the home fans.",
    published: true,
    isEditorsChoice: true,
    authorId: "author-1",
    categoryId: "cat-sports",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "12",
    category: { name: "politics" },
    title: "Danish PM in Greenland for 'show of support' after Trump threats",
    slug: "danish-pm-in-greenland-for-show-of-support-after-trump-threats",
    image:
      "https://ichef.bbci.co.uk/news/1024/cpsprodpb/f167/live/d4eadac0-f887-11f0-b5f7-49f0357294ff.jpg.webp",
    content:
      "Frederiksen (left) said there was now a diplomatic, political track to pursue after a difficult week.",
    published: true,
    isEditorsChoice: false,
    authorId: "author-4",
    categoryId: "cat-politics",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "13",
    category: { name: "tech" },
    title: "CRRC China unveils its 600 km/h high-speed maglev train",
    slug: "crrc-china-unveils-its-600-km-h-high-speed-maglev-train",
    image: "https://www.railwaypro.com/wp/wp-content/uploads/2025/07/CRRC4.jpg",
    content:
      "At the 12th UIC World Congress on High-Speed Rail, held in Beijing from 8–11 July 2025, CRRC showcased the maglev alongside 21 others rail vehicles including the newly developed CR450 prototype EMU",
    published: true,
    isEditorsChoice: false,
    authorId: "author-5",
    categoryId: "cat-tech",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
  {
    id: "14",
    category: { name: "tech" },
    title:
      "i.MX RT700 Crossover MCU with Arm® Cortex®-M33, NPU, DSP and GPU Cores",
    slug: "imx-rt700-crossover-mcu-with-arm-cortex-m33-npu-dsp-and-gpu-cores",
    image:
      "https://tse4.mm.bing.net/th/id/OIP.8IXQBHe331cy9ZJ2Ya7zKwHaEG?rs=1&pid=ImgDetMain&o=7&rm=3",
    content:
      "The i.MX RT700 features up to five computing cores designed to power smart AI-enabled edge devices such as wearables, consumer medical, smart home and HMI devices.",
    published: true,
    isEditorsChoice: false,
    authorId: "author-5",
    categoryId: "cat-tech",
    createdAt: new Date("January 25, 2026"),
    updatedAt: new Date("January 25, 2026"),
  },
];
