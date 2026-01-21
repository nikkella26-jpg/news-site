```bash
npm install
```

you need a .env file with this in it

DATABASE_URL="postgres://postgres: "your password" @localhost:5432/project2"
BETTER_AUTH_SECRET="your secretkey"
BETTER_AUTH_URL=http://localhost:3000

```bash

npx prisma migrate reset
npx prisma migrate dev
npx prisma generate
npx prisma migrate deploy
npx prisma studio
npm run dev

```
