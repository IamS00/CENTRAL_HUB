# Central Hub Platform

A centralized resource management platform built with Next.js 14, TypeScript, Tailwind CSS, and MySQL.

## 🚀 Tech Stack

- **Frontend**: Next.js 14 (App Router), React, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes (Node.js)
- **Database**: MySQL with Prisma ORM
- **Authentication**: NextAuth.js (to be implemented)
- **File Storage**: Local filesystem (migratable to S3)

## 📁 Project Structure

```
central-hub/
├── prisma/
│   └── schema.prisma         # Database schema
├── src/
│   ├── app/
│   │   ├── (public)/         # Public layout (sidebar + navbar)
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx      # Main dashboard
│   │   │   └── resources/    # Resources pages
│   │   ├── admin/            # Admin area (protected)
│   │   │   ├── content/
│   │   │   └── categories/
│   │   └── api/              # API routes
│   │       ├── auth/
│   │       ├── resources/
│   │       └── upload/
│   ├── components/
│   │   ├── layout/           # Sidebar, Navbar
│   │   ├── filters/          # Filter system
│   │   └── admin/            # Admin components
│   ├── lib/
│   │   ├── prisma.ts         # Prisma client
│   │   ├── auth.ts           # Auth utilities
│   │   └── rbac.ts           # Role-based access control
│   └── middleware.ts         # Route protection
└── public/uploads/           # File storage
```

## 🛠️ Setup Instructions

### Prerequisites

- Node.js 18+ and npm
- MySQL database
- Google OAuth credentials (for authentication)

### Installation

1. **Install Node.js** (if not already installed):
   - Download from [nodejs.org](https://nodejs.org/)
   - Verify installation: `node --version` and `npm --version`

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Setup environment variables**:
   ```bash
   cp .env.example .env
   ```
   
   Edit `.env` and configure:
   - `DATABASE_URL`: Your MySQL connection string
   - `NEXTAUTH_SECRET`: Generate with `openssl rand -base64 32`
   - `GOOGLE_CLIENT_ID` & `GOOGLE_CLIENT_SECRET`: From Google Cloud Console
   - `ADMIN_EMAILS`: Comma-separated admin email addresses

4. **Setup database**:
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run development server**:
   ```bash
   npm run dev
   ```

   Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Schema

The platform uses the following main models:

- **User**: Authentication and role management
- **Category**: Hierarchical category system (Need, Domain, Product Type)
- **Resource**: PDF, video, links, and external redirects

## 🎨 Features

### Current Implementation (Phase 1)

- ✅ Next.js 14 project structure
- ✅ TypeScript configuration
- ✅ Tailwind CSS styling
- ✅ Prisma schema setup
- ✅ Persistent layout (Sidebar + Navbar)
- ✅ Dashboard with category cards
- ✅ Resources page layout
- ✅ Responsive design

### Upcoming Features

- 🔄 Google OAuth authentication
- 🔄 Admin panel for content management
- 🔄 File upload system (PDF/Video)
- 🔄 Advanced filtering system
- 🔄 PDF and Video viewers
- 🔄 Multilingual support (RO/EN)
- 🔄 SEO optimization

## 📝 Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Prisma Commands

- `npx prisma generate` - Generate Prisma Client
- `npx prisma db push` - Push schema to database
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma migrate dev` - Create and apply migrations

## 🎯 Design System

### Colors

- **Primary**: `#0066FF` (Blue)
- **Background**: `#FFFFFF` (White), `#F5F7FA` (Light Gray)
- **Text**: Dark gray, Black

### Components

- Responsive grid layouts
- Hover effects on interactive elements
- Consistent spacing and typography
- Modern card-based UI

## 🔐 Security

- Input validation and sanitization
- CSRF protection (NextAuth)
- File upload validation
- Admin route protection
- Environment variable management

## 📦 Deployment

### CyberFolks Hosting

1. Setup MySQL database on server
2. Configure environment variables
3. Run database migrations
4. Build the application: `npm run build`
5. Start the application: `npm start`

### Pre-deployment Checklist

- [ ] Environment variables configured
- [ ] Database migrations applied
- [ ] Upload directory permissions set
- [ ] Google OAuth configured
- [ ] Admin emails whitelisted

## 🤝 Contributing

This is a private project. For questions or issues, contact the development team.

## 📄 License

Proprietary - All rights reserved
