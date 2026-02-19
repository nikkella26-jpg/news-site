import { PrismaClient } from './lib/generated/prisma/index.js';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

async function test() {
    const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
    const adapter = new PrismaPg(pool);
    const prisma = new PrismaClient({ adapter });

    try {
        const articles = await prisma.article.findMany({
            select: { id: true, slug: true, title: true }
        });
        console.log('--- DATABASE DATA ---');
        articles.forEach(a => {
            console.log(`ID: ${a.id}`);
            console.log(`TITLE: "${a.title}"`);
            console.log(`SLUG: "${a.slug}" (Length: ${a.slug.length})`);
            console.log('---');
        });
        console.log('-----------------------');
    } catch (e) {
        console.error('Error fetching slugs:', e);
    } finally {
        await prisma.$disconnect();
        await pool.end();
    }
}

test();
