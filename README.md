# OrderAuto - Simple Authentication Setup

A clean Next.js app with basic Supabase authentication - no roles, no complexity, just simple email/password auth with email confirmation.

## 🎯 What's Included

- ✅ **Supabase Authentication**: Email/password + magic link signin
- ✅ **Email Confirmation**: Users must verify email before signing in
- ✅ **Protected Routes**: Dashboard requires authentication
- ✅ **Clean UI**: Modern design with Shadcn UI components
- ✅ **Basic Profile**: Auto-created on signup

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Supabase

1. Create project at [supabase.com](https://supabase.com)
2. Copy your credentials to `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://yourproject.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run Database Schema

1. Go to **Supabase Dashboard** → **SQL Editor**
2. Copy contents of `supabase/schema.sql`
3. Paste and click **Run**

This creates:

- `profiles` table (auto-populated on signup)
- Basic RLS policies (users can only see their own profile)
- Trigger to create profile when user signs up

### 4. Start Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
order-automation/
├── src/
│   ├── app/
│   │   ├── (auth)/          # Auth pages
│   │   │   ├── signin/      # Sign in page
│   │   │   ├── signup/      # Sign up page
│   │   │   └── callback/    # Auth callback
│   │   ├── dashboard/       # Protected dashboard
│   │   └── page.tsx         # Landing page
│   ├── components/
│   │   └── ui/              # Shadcn UI components
│   └── lib/
│       ├── supabase/
│       │   ├── client.ts    # Browser client
│       │   ├── server.ts    # Server client
│       │   └── middleware.ts # Auth middleware
│       └── auth-context.tsx # Auth state management
├── supabase/
│   └── schema.sql           # Database schema
└── .env.local               # Environment variables
```

## 🔑 Authentication Flow

### Signup

1. User visits `/signup`
2. Enters email and password
3. Supabase sends verification email
4. User clicks link in email
5. Profile auto-created via database trigger
6. User can now sign in

### Signin

1. User visits `/signin`
2. **Option A**: Email + password → Redirected to `/dashboard`
3. **Option B**: Magic link → Email sent → Click link → Redirected to `/dashboard`

### Protected Routes

- Middleware checks if user is authenticated
- Unauthenticated users → Redirected to `/signin`
- Authenticated users on `/signin` or `/signup` → Redirected to `/dashboard`

## 🗄️ Database Schema

### profiles Table

```sql
id          uuid          (references auth.users)
email       text          (unique)
full_name   text
created_at  timestamp
updated_at  timestamp
```

### RLS Policies

- Users can SELECT their own profile
- Users can UPDATE their own profile
- No cross-user access

## 🛠️ Available Pages

| Route | Description | Protected |
|-------|-------------|-----------|
| `/` | Landing page | ❌ |
| `/signin` | Sign in page | ❌ |
| `/signup` | Sign up page | ❌ |
| `/dashboard` | User dashboard | ✅ |
| `/callback` | Auth callback handler | ❌ |

## 📝 Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon/public key |

Get these from **Supabase Dashboard** → **Settings** → **API**.

## 🎨 Customization

### Update Landing Page

Edit `src/app/page.tsx` to customize your landing page.

### Add More Protected Pages

1. Create page in `src/app/your-page/page.tsx`
2. Middleware automatically protects it
3. Use `useAuth()` hook to access user data:

```tsx
'use client';
import { useAuth } from '@/lib/auth-context';

export default function YourPage() {
  const { user, logout } = useAuth();
  
  return <div>Hello {user?.email}!</div>;
}
```

### Customize Dashboard

Edit `src/app/dashboard/page.tsx` to build your app's main interface.

## 🔧 Development Tips

### Check Auth State

```tsx
const { user, loading } = useAuth();

if (loading) return <div>Loading...</div>;
if (!user) return <div>Not signed in</div>;
return <div>Welcome {user.email}</div>;
```

### Logout

```tsx
const { logout } = useAuth();

<Button onClick={logout}>Sign Out</Button>
```

### Access Supabase Client

```tsx
import { createClient } from '@/lib/supabase/client';

const supabase = createClient();
await supabase.from('profiles').select('*');
```

## 🚨 Email Confirmation

Supabase requires email confirmation by default:

- Users must click the link in their email before signing in
- Attempting to sign in before confirmation shows error message
- Resend verification: Supabase Dashboard → Authentication → Users → Resend

### Disable Email Confirmation (Development Only)

1. Supabase Dashboard → **Authentication** → **Settings**
2. **Email Auth** → Turn OFF "Enable email confirmations"
3. Users can sign in immediately after signup

> ⚠️ **Production**: Keep email confirmation ON for security

## 📚 Next Steps

1. **Run the schema** in Supabase SQL Editor
2. **Test signup/signin** flow
3. **Build your features** on the `/dashboard` page
4. **Add more pages** as needed

## 🔗 Tech Stack

- [Next.js 15](https://nextjs.org/) - React framework
- [Supabase](https://supabase.com/) - Backend & Auth
- [Tailwind CSS v4](https://tailwindcss.com/) - Styling
- [Shadcn UI](https://ui.shadcn.com/) - Components
- [TypeScript](https://www.typescriptlang.org/) - Type safety

---

**That's it!** You now have a clean, production-ready authentication system. Start building! 🚀
