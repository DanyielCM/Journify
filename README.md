## The idea behind the Journify app

Putting your thoughts down on “paper” is one of the simplest ways for people to clear their minds and track their progress over time, without needing complicated tools. Many people want to be more consistent with personal reflection, but they get stuck either because they lack time or because they don’t know where to start. That’s where the idea for the Journify app came from, built around guided questions that reduce the effort of writing “from scratch” and make the process easier to stick with.

The app combines a classic journal with simple, clear features: daily questions, day-by-day saved answers, and for users who want more, advanced options such as choosing personalized questions, tracking emotional state, and following goals. The Free/Paid/Premium model reflects different levels of use, from a simple experience to a fully guided one, with statistics and long-term organization.

## Getting Started

Clone repo
```bash
git clone <URL_REPO_GITHUB>
cd <NUME_PROIECT> 
```

Install the dependencies
```bash
npm install 
```

Configure the environment variables — create the .env.local file and fill in:
```bash
DATABASE_URL=... (PostgreSQL) 
SESSION_SECRET=... (long, random row) 
```

Configure Prisma 
```bash
npx prisma generate 
npx prisma migrate dev 
```

Seed for initial data (e.g., moods)
```bash
node src/data/src/seed.js 
```

Start the app
```bash
npm run dev 
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

