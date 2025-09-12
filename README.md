This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Firebase Setup

This project includes the Firebase Web SDK and a client initializer at `src/lib/firebase.ts`.

1. Copy environment template and fill with your Firebase web app config (from Firebase Console → Project settings → General → Your apps):

   ```bash
   cp env.example .env.local
   ```

2. Set the following variables in `.env.local`:

   - `NEXT_PUBLIC_FIREBASE_API_KEY`
   - `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
   - `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
   - `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
   - `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
   - `NEXT_PUBLIC_FIREBASE_APP_ID`

3. Use Firebase services in client components (App Router):

   ```tsx
   'use client'
   import { auth, db, storage } from '@/lib/firebase'
   import { onAuthStateChanged } from 'firebase/auth'
   import { useEffect, useState } from 'react'

   export default function FirebaseClientExample() {
     const [uid, setUid] = useState<string | null>(null)
     useEffect(() => onAuthStateChanged(auth, (u) => setUid(u?.uid ?? null)), [])
     return <pre>UID: {uid ?? 'signed out'}</pre>
   }
   ```

Notes:

- The file `src/lib/firebase.ts` initializes the client SDK and exports `auth`, `db`, and `storage`.
- Only import Firebase client SDK in client components (`'use client'`). For server-side admin features you would use the Firebase Admin SDK (not included here).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
