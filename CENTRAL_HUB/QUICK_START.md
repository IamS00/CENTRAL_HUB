# Quick Start Guide

## Immediate Next Steps

### Step 1: Install Node.js ⚠️ REQUIRED

**You must install Node.js before proceeding!**

1. Visit [https://nodejs.org/](https://nodejs.org/)
2. Download the **LTS version** (recommended)
3. Run the installer
4. Restart your terminal/command prompt
5. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### Step 2: Install Project Dependencies

Once Node.js is installed, open a terminal in the `CENTRAL_HUB` directory and run:

```bash
npm install
```

This will install all required packages (~5-10 minutes depending on internet speed).

### Step 3: Quick Development Start (Without Database)

You can start the development server immediately to see the UI:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

**Note**: Some features won't work without database setup, but you can see the UI and navigation.

### Step 4: Full Setup (With Database)

For full functionality, you need to setup MySQL:

1. **Install MySQL**
   - Download from [https://dev.mysql.com/downloads/mysql/](https://dev.mysql.com/downloads/mysql/)
   - Install and remember your root password

2. **Create Database**
   ```sql
   CREATE DATABASE central_hub;
   ```

3. **Configure Environment**
   ```bash
   copy .env.example .env
   ```
   
   Edit `.env` and set:
   ```env
   DATABASE_URL="mysql://root:YOUR_PASSWORD@localhost:3306/central_hub"
   ```

4. **Initialize Database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## What You Can Do Now

### Without Database Setup:
- ✅ View the UI and layout
- ✅ Navigate between pages
- ✅ See the sidebar and navbar
- ✅ Explore the dashboard design
- ✅ Check responsive design
- ❌ No data will be displayed
- ❌ Admin features won't work

### With Database Setup:
- ✅ Full functionality
- ✅ Add resources
- ✅ Create categories
- ✅ Store data
- ✅ Test all features

## Common Commands

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Check for errors
npm run lint

# Open database GUI (after database setup)
npx prisma studio
```

## Project Structure at a Glance

```
CENTRAL_HUB/
├── src/
│   ├── app/
│   │   ├── (public)/      # Main pages (dashboard, resources)
│   │   ├── admin/         # Admin panel
│   │   └── api/           # API endpoints
│   ├── components/        # Reusable UI components
│   └── lib/               # Utilities
├── prisma/
│   └── schema.prisma      # Database schema
├── public/
│   └── uploads/           # File storage
└── [config files]
```

## Need Help?

1. **Installation Issues**: Check `SETUP_GUIDE.md`
2. **Project Overview**: Read `README.md`
3. **Complete Summary**: See `PROJECT_SUMMARY.md`

## Development Workflow

1. Make changes to files
2. Save (Next.js auto-reloads)
3. Check browser for updates
4. Test functionality
5. Commit changes

## Tips

- Use VS Code or Cursor for best development experience
- Install ESLint extension for code quality
- Use Prisma Studio to visualize database
- Keep `npm run dev` running while developing
- Check browser console for errors

## What's Already Built

✅ Complete project structure
✅ Next.js 14 with TypeScript
✅ Tailwind CSS styling
✅ Sidebar navigation
✅ Navbar with search
✅ Dashboard layout
✅ Admin panel structure
✅ Database schema
✅ API route structure

## What's Next (Future Phases)

- Authentication with Google OAuth
- File upload system
- Advanced filtering
- PDF and video viewers
- Multilingual support (RO/EN)
- SEO optimization

---

**Start here**: Install Node.js → Run `npm install` → Run `npm run dev` → Open browser!
