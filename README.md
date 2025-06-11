# Take Home Project

A full-stack web application built with Next.js 15, TypeScript, and Supabase.

## Tech Stack

- **Next.js 15**
- **TypeScript**
- **Tailwind CSS**
- **Supabase** (with built-in Auth)
- **Zod**

## Setup

1. Create `.env.local`:

```env
# Required for client-side (browser) access
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_KEY=your_supabase_key

# Optional: Server-only variables (more secure for production)
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_key
```

2. Install dependencies:

```bash
npm install
```

3. Start development server:

```bash
npm run dev
```

4. Open http://localhost:3000

## Environment Variables for Production

For production deployment on Vercel, you can use either approach:

**Option 1: Public variables only (simpler)**

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_KEY`

**Option 2: Mixed approach (more secure)**

- `NEXT_PUBLIC_SUPABASE_URL` (required for client)
- `NEXT_PUBLIC_SUPABASE_KEY` (required for client)
- `SUPABASE_URL` (server-side fallback)
- `SUPABASE_KEY` (server-side fallback)
