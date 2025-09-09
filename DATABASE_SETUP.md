# 🗄️ Database Setup - Neon PostgreSQL

This project uses [Neon](https://neon.tech) as the PostgreSQL database for production deployment.

## 🚀 Quick Setup

1. **Run the setup guide:**
   ```bash
   npm run setup:neon
   ```

2. **Follow the displayed instructions to:**
   - Create a free Neon account
   - Get your database connection URLs
   - Configure environment variables in Vercel
   - Deploy your database schema

## 🔧 Development vs Production

- **Local Development**: Uses SQLite (`file:./dev.db`)
- **Production (Vercel)**: Uses Neon PostgreSQL

## 📝 Environment Variables

### Local (.env)
```env
DATABASE_URL="file:./dev.db"
NODE_ENV="development"
```

### Production (Vercel)
```env
DATABASE_URL="postgresql://username:password@host/database?sslmode=require"
DIRECT_URL="postgresql://username:password@host/database?sslmode=require"
```

## 🛠️ Commands

- `npm run setup:neon` - Show setup guide
- `npm run db:push` - Push schema to database
- `npm run db:studio` - Open Prisma Studio
- `npm run db:generate` - Generate Prisma client

## 🌟 Features Enabled

Once Neon is set up, your farm management app will have:
- ✅ Persistent data storage
- ✅ Real-time field operations tracking
- ✅ Customer and order management
- ✅ Inventory tracking
- ✅ Equipment management
- ✅ Analytics and reporting
