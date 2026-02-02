# Central Hub - Setup Guide

## Step-by-Step Installation

### 1. Install Node.js

Before you can run this project, you need Node.js installed on your system.

1. Download Node.js from [https://nodejs.org/](https://nodejs.org/)
2. Choose the LTS (Long Term Support) version
3. Run the installer and follow the installation wizard
4. Verify installation by opening a new terminal and running:
   ```bash
   node --version
   npm --version
   ```

### 2. Install Dependencies

Once Node.js is installed, navigate to the project directory and run:

```bash
cd CENTRAL_HUB
npm install
```

This will install all required packages listed in `package.json`.

### 3. Database Setup

#### Install MySQL

1. Download MySQL from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
2. Install MySQL Server
3. Remember your root password during installation

#### Create Database

```sql
CREATE DATABASE central_hub CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

### 4. Environment Configuration

1. Copy the example environment file:
   ```bash
   copy .env.example .env
   ```

2. Edit `.env` file with your configuration:

   ```env
   # Database connection
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/central_hub"
   
   # NextAuth configuration
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="generate-a-random-secret-here"
   
   # Google OAuth (get from Google Cloud Console)
   GOOGLE_CLIENT_ID="your-client-id.apps.googleusercontent.com"
   GOOGLE_CLIENT_SECRET="your-client-secret"
   
   # Admin emails (comma-separated)
   ADMIN_EMAILS="your-email@example.com,admin@example.com"
   ```

#### Generate NEXTAUTH_SECRET

Windows PowerShell:
```powershell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

Or use an online generator: [https://generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

### 5. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable "Google+ API"
4. Go to "Credentials" → "Create Credentials" → "OAuth client ID"
5. Configure OAuth consent screen
6. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
7. Copy Client ID and Client Secret to `.env`

### 6. Initialize Database

Run Prisma commands to set up your database:

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database (for development)
npx prisma db push

# Or create a migration (for production)
npx prisma migrate dev --name init
```

### 7. Run Development Server

Start the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 8. Verify Installation

You should see:
- ✅ Homepage with dashboard
- ✅ Sidebar with navigation
- ✅ Navbar with search and user menu
- ✅ Working navigation between pages

## Common Issues

### "npx is not recognized"

**Solution**: Restart your terminal after installing Node.js, or add Node.js to your PATH manually.

### Database Connection Error

**Solution**: 
1. Verify MySQL is running
2. Check DATABASE_URL in `.env`
3. Ensure database exists: `CREATE DATABASE central_hub;`

### Port 3000 Already in Use

**Solution**: 
- Stop the process using port 3000
- Or change the port: `npm run dev -- -p 3001`

### Prisma Client Not Generated

**Solution**: Run `npx prisma generate` before starting the dev server

## Development Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run linter
npm run lint

# Open Prisma Studio (database GUI)
npx prisma studio
```

## Project Structure Overview

```
CENTRAL_HUB/
├── prisma/
│   └── schema.prisma         # Database schema
├── public/
│   └── uploads/              # File uploads storage
├── src/
│   ├── app/
│   │   ├── (public)/         # Public pages
│   │   ├── admin/            # Admin pages
│   │   └── api/              # API routes
│   ├── components/           # React components
│   │   ├── layout/           # Sidebar, Navbar
│   │   ├── filters/          # Filter components
│   │   └── admin/            # Admin components
│   └── lib/                  # Utilities
│       ├── prisma.ts         # Database client
│       ├── auth.ts           # Authentication
│       └── rbac.ts           # Role-based access
├── .env                      # Environment variables
├── package.json              # Dependencies
└── README.md                 # Documentation
```

## Next Steps

After successful installation:

1. **Explore the UI**: Navigate through dashboard, resources, categories
2. **Setup Admin Access**: Add your email to `ADMIN_EMAILS` in `.env`
3. **Test Database**: Open Prisma Studio with `npx prisma studio`
4. **Customize**: Modify components in `src/components/`
5. **Add Content**: Use admin panel (to be implemented in Phase 2)

## Need Help?

- Check the main `README.md` for detailed documentation
- Review the plan document for feature roadmap
- Contact the development team for support

## Production Deployment

For production deployment to CyberFolks hosting, see the deployment section in the main README.md file.
