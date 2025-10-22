# 🚀 ProjectBuddy

A modern social platform for students and professionals to connect, collaborate, and manage projects together. Built with React, TypeScript, Node.js, and PostgreSQL.

## ✨ Features

- **User Profiles** - Customizable profiles with skills, interests, and university info
- **Social Networking** - Send/accept connection requests, build your network
- **Teams & Projects** - Create teams, manage members with role-based permissions
- **Smart Recommendations** - Get team suggestions based on skills, interests, and university
- **Posts & Discussions** - Share updates, react, comment with mentions and hashtags
- **Real-time Messaging** - Direct messages and team chat with auto-refresh
- **Notifications** - Stay updated on connections, posts, and team activities
- **Dark Mode** - Full dark theme support throughout the app
- **Search** - Find people and teams by name, skills, or interests

## 🛠️ Tech Stack

**Frontend:**
- React 19 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- React Query (data fetching)
- Zustand (state management)
- React Router v7

**Backend:**
- Node.js + Express
- TypeScript
- Prisma ORM
- PostgreSQL
- JWT Authentication
- Cloudinary (image uploads)

## 📋 Prerequisites

- Node.js >= 18.0.0
- PostgreSQL database
- Cloudinary account (for image uploads)

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone <repository-url>
cd ProjectBuddy
```

### 2. Set up PostgreSQL Database

Using Docker:
```bash
docker run --name projectbuddy-db \
  -e POSTGRES_USER=admin \
  -e POSTGRES_PASSWORD=your_password \
  -e POSTGRES_DB=projectbuddy \
  -p 5432:5432 -d postgres
```

Or use your existing PostgreSQL installation.

### 3. Configure Backend

Create `backend/.env`:
```env
# Database
DATABASE_URL="postgresql://admin:your_password@localhost:5432/projectbuddy"

# JWT
JWT_SECRET=your_jwt_secret_key_here
JWT_REFRESH_SECRET=your_refresh_secret_key_here

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Server
PORT=5000
NODE_ENV=development
```

### 4. Configure Frontend

Create `frontend/.env`:
```env
VITE_API_URL=http://localhost:5000/api
```

### 5. Install Dependencies

```bash
# Install root dependencies
npm install

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 6. Set up Database

```bash
cd backend

# Generate Prisma Client
npm run db:generate

# Run migrations
npm run db:migrate

# Seed database with sample data (optional)
npm run db:seed
```

### 7. Start Development Servers

From the root directory:
```bash
npm run dev
```

This starts both frontend (http://localhost:5173) and backend (http://localhost:5000).

Or run them separately:
```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## 📁 Project Structure

```
ProjectBuddy/
├── backend/                 # Node.js + Express API
│   ├── prisma/             # Database schema & migrations
│   ├── src/
│   │   ├── controllers/    # Request handlers
│   │   ├── services/       # Business logic
│   │   ├── repositories/   # Database queries
│   │   ├── middlewares/    # Auth, validation, etc.
│   │   ├── routes/         # API routes
│   │   └── config/         # Configuration files
│   └── package.json
├── frontend/               # React + TypeScript app
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   ├── lib/            # API services & utilities
│   │   ├── store/          # Zustand state management
│   │   └── types/          # TypeScript types
│   └── package.json
└── package.json            # Root package (runs both)
```

## 🔑 Default Accounts (After Seeding)

The seed script creates sample users. Check `backend/prisma/seed.ts` for credentials.

## 📝 Available Scripts

### Root
- `npm run dev` - Start both frontend and backend

### Backend
- `npm run dev` - Start backend in watch mode
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run db:generate` - Generate Prisma Client
- `npm run db:migrate` - Run database migrations
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio

### Frontend
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🐛 Troubleshooting

**Database connection fails:**
- Ensure PostgreSQL is running
- Verify DATABASE_URL in backend/.env
- Check database credentials

**Images not uploading:**
- Verify Cloudinary credentials in backend/.env
- Ensure all three Cloudinary env variables are set

**Frontend can't reach API:**
- Check VITE_API_URL in frontend/.env
- Ensure backend is running on correct port

## 👨‍💻 Author

Md. Nayeem
