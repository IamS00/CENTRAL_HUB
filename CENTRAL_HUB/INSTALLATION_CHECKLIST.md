# Installation Checklist

Use this checklist to track your setup progress.

## Prerequisites

- [ ] **Install Node.js**
  - [ ] Downloaded from nodejs.org
  - [ ] Installed successfully
  - [ ] Verified with `node --version`
  - [ ] Verified with `npm --version`

## Basic Setup

- [ ] **Install Dependencies**
  - [ ] Navigated to CENTRAL_HUB directory
  - [ ] Ran `npm install`
  - [ ] Installation completed without errors
  - [ ] node_modules folder created

- [ ] **Test Development Server**
  - [ ] Ran `npm run dev`
  - [ ] Server started on port 3000
  - [ ] Opened http://localhost:3000 in browser
  - [ ] Saw the dashboard homepage

## Database Setup (Optional but Recommended)

- [ ] **Install MySQL**
  - [ ] Downloaded MySQL installer
  - [ ] Installed MySQL Server
  - [ ] Remembered root password
  - [ ] MySQL service is running

- [ ] **Create Database**
  - [ ] Opened MySQL command line or GUI tool
  - [ ] Created `central_hub` database
  - [ ] Verified database exists

- [ ] **Configure Environment**
  - [ ] Copied `.env.example` to `.env`
  - [ ] Set DATABASE_URL with correct credentials
  - [ ] Generated NEXTAUTH_SECRET
  - [ ] Saved `.env` file

- [ ] **Initialize Database Schema**
  - [ ] Ran `npx prisma generate`
  - [ ] Ran `npx prisma db push`
  - [ ] No errors during migration
  - [ ] Tables created in database

- [ ] **Test Database Connection**
  - [ ] Ran `npx prisma studio`
  - [ ] Prisma Studio opened in browser
  - [ ] Saw User, Category, Resource tables

## Verification

- [ ] **UI Elements Working**
  - [ ] Sidebar visible and collapsible
  - [ ] Navbar displayed correctly
  - [ ] Navigation between pages works
  - [ ] Dashboard shows category cards
  - [ ] Resources page loads
  - [ ] Categories page loads
  - [ ] Favorites page loads
  - [ ] Admin pages accessible

- [ ] **Responsive Design**
  - [ ] Tested on desktop browser
  - [ ] Tested on mobile/responsive view
  - [ ] Sidebar collapses on mobile
  - [ ] All pages responsive

## Optional Advanced Setup

- [ ] **Google OAuth (Future Phase)**
  - [ ] Created Google Cloud project
  - [ ] Enabled Google+ API
  - [ ] Created OAuth credentials
  - [ ] Set GOOGLE_CLIENT_ID in .env
  - [ ] Set GOOGLE_CLIENT_SECRET in .env

- [ ] **Admin Access**
  - [ ] Added email(s) to ADMIN_EMAILS in .env
  - [ ] Restarted development server

- [ ] **Git Repository**
  - [ ] Initialized git repository
  - [ ] Made initial commit
  - [ ] Set up remote repository (if needed)

## Troubleshooting

If you encounter issues, check off what you've tried:

- [ ] Restarted terminal after installing Node.js
- [ ] Verified Node.js is in PATH
- [ ] Deleted node_modules and ran `npm install` again
- [ ] Checked MySQL is running
- [ ] Verified database credentials in .env
- [ ] Checked for port conflicts (3000)
- [ ] Reviewed error messages in terminal
- [ ] Checked browser console for errors
- [ ] Consulted SETUP_GUIDE.md
- [ ] Reviewed README.md

## Next Steps After Setup

- [ ] Read through README.md
- [ ] Familiarize with project structure
- [ ] Review Prisma schema
- [ ] Explore components directory
- [ ] Check admin panel pages
- [ ] Plan feature implementation
- [ ] Start Phase 2 development

## Notes

Space for your notes, issues encountered, or solutions found:

```
[Your notes here]






```

---

**Status**: 
- [ ] Setup Not Started
- [ ] Setup In Progress
- [ ] Setup Complete - Ready to Develop!

**Date Completed**: _______________
