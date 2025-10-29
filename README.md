# Socially

A modern, full-stack social media platform built with Next.js, TypeScript, Prisma, and Tailwind CSS. Socially lets users create posts, follow profiles, receive notifications, and more—all with a beautiful, responsive UI.

## Features

- 📝 **Create & Delete Posts**
- 👤 **User Profiles** (with username-based routing)
- 👥 **Follow/Unfollow Users**
- 🔔 **Real-time Notifications**
- 📷 **Image Uploads**
- 🌗 **Light/Dark Mode Toggle**
- 📱 **Responsive Design** (Desktop & Mobile Navbars)
- ⚡ **Fast & Modern UI** (Shadcn UI, Skeletons, Dialogs)
- 🔒 **Authentication** (Clerk)
- 🗄️ **Database** (Prisma + PostgreSQL)

## 🎬 Live Demo & Video

- **Live Website:** https://socially-topaz.vercel.app/
- **Video Demo:** https://www.youtube.com/watch?v=XmoHYmE_kZs

## Tech Stack

- Nextjs (App Router)
- TypeScript
- Prisma ORM
- PostgreSQL
- Tailwind CSS
- Clerk
- UploadThing(for file uploads)
- Shadcn UI (UI components)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/PranjalMantri/Socially.git
   cd Socially
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure environment variables:**
   - Copy `.env.example` to `.env` and fill in your secrets.
   ```bash
   cp .env.example .env
   ```
4. **Set up the database:**
   - Make sure your `DATABASE_URL` is correct in `.env`.
   - Run Prisma migrations:
   ```bash
   npx prisma migrate dev
   ```
5. **Start the development server:**
   ```bash
   npm run dev
   ```
6. **Visit** [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── prisma/                # Prisma schema
├── public/                # Static assets
├── src/
│   ├── actions/           # Server actions (posts, profiles, notifications)
│   ├── app/               # Next.js app router pages & layouts
│   ├── components/        # UI components (Navbar, PostCard, etc.)
│   ├── generated/prisma/  # Generated Prisma client
│   ├── lib/               # Utility libraries (prisma, uploadthing)
│   └── middleware.ts      # Middleware
├── .env.example           # Example environment variables
├── package.json           # Project metadata & scripts
└── README.md              # Project documentation
```
