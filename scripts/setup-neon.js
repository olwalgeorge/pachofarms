#!/usr/bin/env node

/**
 * Neon Database Setup Guide for Pacho Farms
 * 
 * Follow these steps to set up your Neon PostgreSQL database:
 */

console.log(`
🌱 PACHO FARMS - NEON DATABASE SETUP GUIDE
==========================================

📋 STEP 1: Create Neon Account
1. Go to https://neon.tech
2. Sign up for a free account (no credit card required)
3. Create a new project named "pachofarms"

📋 STEP 2: Get Database URLs
1. In your Neon dashboard, go to "Connection Details"
2. Copy the "Database URL" (starts with postgresql://)
3. Copy the "Direct URL" (also starts with postgresql://)

📋 STEP 3: Update Environment Variables
Local Development (.env file):
- Keep: DATABASE_URL="file:./dev.db" (for local SQLite)

Vercel Production:
1. Go to your Vercel dashboard
2. Select your pachofarms project
3. Go to Settings → Environment Variables
4. Add these variables:
   
   Name: DATABASE_URL
   Value: [Your Neon Database URL]
   
   Name: DIRECT_URL  
   Value: [Your Neon Direct URL]

📋 STEP 4: Deploy Database Schema
Run these commands after setting up URLs:

For Production:
npm run db:push

📋 STEP 5: Redeploy to Vercel
vercel --prod

✅ Your farm management app will then have full database functionality!

🔗 Helpful Links:
- Neon Dashboard: https://console.neon.tech
- Vercel Dashboard: https://vercel.com/dashboard
- Your App: https://pachofarms-opkkguudh-georges-projects-81ad07f1.vercel.app

📞 Need Help?
- Neon Docs: https://neon.tech/docs
- Prisma + Neon: https://neon.tech/docs/guides/prisma
`);
