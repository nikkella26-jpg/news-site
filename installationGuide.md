# Installation Guide

you need a .env file with this in it

DATABASE_URL="postgres://postgres: "your password" @localhost:5432/project2"
BETTER_AUTH_SECRET="your secretkey"
BETTER_AUTH_URL=<http://localhost:3000>

```bash
npm install
npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
npx prisma migrate deploy
npx prisma studio
npm run dev

npx install better-auth -- all

#update check if you must!

npm i --save-dev prisma@latest
npm i @prisma/client@latest
npm install better-auth@latest
npm install @prisma/adapter-pg@latest

```
