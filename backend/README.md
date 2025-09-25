# ProjectBuddy Backend API

A comprehensive backend API for ProjectBuddy - a collaborative project management and team formation platform built with Node.js, Express, TypeScript, and Prisma.

## 🚀 Features

### Core Functionality
- **User Management**: Registration, authentication, profiles, and user connections
- **Project Management**: Create, manage, and collaborate on projects with team members
- **Team Formation**: Build teams, invite members, and manage team roles
- **Social Features**: Posts, comments, reactions, mentions, and following system
- **Real-time Communication**: Socket.IO for live messaging and notifications
- **File Upload**: Cloudinary integration for media uploads
- **Analytics**: Comprehensive tracking and analytics for users, projects, and posts
- **AI Recommendations**: Smart recommendations for users, projects, and content

### Technical Features
- **RESTful API**: Well-structured REST endpoints with comprehensive documentation
- **Real-time Updates**: WebSocket support via Socket.IO
- **Authentication**: JWT-based authentication with refresh tokens
- **Data Validation**: Joi schema validation for all endpoints
- **Rate Limiting**: Express rate limiting for API protection
- **Error Handling**: Centralized error handling and logging
- **API Documentation**: Auto-generated Swagger documentation
- **Database**: PostgreSQL with Prisma ORM

## 🛠️ Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Language**: TypeScript
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: JWT (jsonwebtoken)
- **File Upload**: Cloudinary
- **Real-time**: Socket.IO
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Documentation**: Swagger/OpenAPI
- **Development**: tsx (TypeScript execution)

## 📁 Project Structure

```
backend/
├── prisma/
│   ├── schema.prisma           # Database schema
│   ├── seed.ts                 # Database seeding
│   └── migrations/             # Database migrations
├── src/
│   ├── app.ts                  # Main application entry point
│   ├── config/
│   │   ├── index.ts            # Configuration management
│   │   ├── database.ts         # Prisma client setup
│   │   └── cloudinary.ts       # Cloudinary configuration
│   ├── controllers/            # Request handlers
│   │   ├── AuthController.ts
│   │   ├── UserController.ts
│   │   ├── ProjectController.ts
│   │   ├── TeamController.ts
│   │   ├── PostController.ts
│   │   └── ConnectionController.ts
│   ├── services/               # Business logic layer
│   │   ├── AuthService.ts
│   │   ├── UserService.ts
│   │   ├── ProjectService.ts
│   │   ├── TeamService.ts
│   │   ├── PostService.ts
│   │   └── ConnectionService.ts
│   ├── repositories/           # Data access layer
│   │   ├── UserRepository.ts
│   │   ├── ProjectRepository.ts
│   │   ├── ConnectionRepository.ts
│   │   ├── NotificationRepository.ts
│   │   └── AIRecommendationRepository.ts
│   ├── routes/                 # API route definitions
│   │   ├── auth.ts
│   │   ├── users.ts
│   │   ├── projects.ts
│   │   ├── teams.ts
│   │   ├── posts.ts
│   │   └── connections.ts
│   ├── middlewares/            # Custom middleware
│   │   ├── auth.ts            # Authentication middleware
│   │   ├── error.ts           # Error handling
│   │   ├── validation.ts      # Request validation
│   │   └── upload.ts          # File upload handling
│   ├── utils/
│   │   ├── auth.ts            # Auth utilities
│   │   ├── helpers.ts         # General helpers
│   │   └── validation.ts      # Joi schemas
│   └── types/
│       └── index.ts           # Type definitions
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL 12+
- npm or yarn
- Cloudinary account (for file uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd ProjectBuddy/backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the backend directory:
   ```env
   # Server Configuration
   PORT=4000
   NODE_ENV=development
   
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/projectbuddy"
   
   # JWT Secrets
   JWT_SECRET=your-super-secret-jwt-key-here
   JWT_REFRESH_SECRET=your-super-secret-refresh-key-here
   JWT_EXPIRES_IN=1h
   JWT_REFRESH_EXPIRES_IN=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your-cloud-name
   CLOUDINARY_API_KEY=your-api-key
   CLOUDINARY_API_SECRET=your-api-secret
   
   # CORS Configuration
   CORS_ORIGIN=http://localhost:3000
   
   # Rate Limiting
   RATE_LIMIT_WINDOW_MS=900000
   RATE_LIMIT_MAX_REQUESTS=100
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npm run db:generate
   
   # Run database migrations
   npm run db:migrate
   
   # Seed the database with sample data
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   The server will start on `http://localhost:4000`

### Production Build

```bash
# Build the TypeScript code
npm run build

# Start the production server
npm start
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/me` - Get current user
- `POST /api/auth/logout` - User logout

### Users
- `GET /api/users` - Get all users (with filters)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user profile
- `DELETE /api/users/:id` - Delete user account
- `POST /api/users/:id/follow` - Follow/unfollow user
- `GET /api/users/:id/followers` - Get user followers
- `GET /api/users/:id/following` - Get users being followed

### Projects
- `GET /api/projects` - Get all projects (with filters)
- `POST /api/projects` - Create new project
- `GET /api/projects/:id` - Get project by ID
- `PUT /api/projects/:id` - Update project
- `DELETE /api/projects/:id` - Delete project
- `POST /api/projects/:id/join` - Join project
- `POST /api/projects/:id/leave` - Leave project
- `GET /api/projects/:id/members` - Get project members
- `POST /api/projects/:id/goals` - Create project goal
- `GET /api/projects/:id/milestones` - Get project milestones

### Teams
- `GET /api/teams` - Get all teams
- `POST /api/teams` - Create new team
- `GET /api/teams/:id` - Get team by ID
- `PUT /api/teams/:id` - Update team
- `DELETE /api/teams/:id` - Delete team
- `POST /api/teams/:id/join` - Join team
- `POST /api/teams/:id/invite` - Invite user to team
- `GET /api/teams/:id/members` - Get team members

### Posts
- `GET /api/posts` - Get posts feed
- `POST /api/posts` - Create new post
- `GET /api/posts/:id` - Get post by ID
- `PUT /api/posts/:id` - Update post
- `DELETE /api/posts/:id` - Delete post
- `POST /api/posts/:id/react` - React to post
- `POST /api/posts/:id/comment` - Comment on post
- `POST /api/posts/:id/share` - Share post

### Connections
- `GET /api/connections` - Get user connections
- `POST /api/connections/request` - Send connection request
- `PUT /api/connections/:id/accept` - Accept connection
- `PUT /api/connections/:id/decline` - Decline connection
- `DELETE /api/connections/:id` - Remove connection

## 🗄️ Database Schema

The application uses a comprehensive PostgreSQL schema with the following main entities:

### Core Models
- **User**: User profiles with skills, experience, and preferences
- **Project**: Collaborative projects with goals and milestones
- **Team**: User teams for project collaboration
- **Post**: Social posts with reactions and comments
- **Connection**: User-to-user connections and networking

### Supporting Models
- **ProjectMember**: Project membership and roles
- **TeamMember**: Team membership and roles
- **Message**: Direct and group messaging
- **Notification**: Real-time notifications
- **Analytics**: Usage analytics and metrics

## 🔒 Authentication & Security

- **JWT Authentication**: Stateless authentication with access and refresh tokens
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Express rate limiting to prevent abuse
- **CORS Protection**: Configurable CORS settings
- **Security Headers**: Helmet.js for security headers
- **Input Validation**: Joi schema validation for all inputs

## 📊 Real-time Features

Socket.IO implementation for real-time features:
- Live messaging and chat
- Real-time notifications
- Project collaboration updates
- Live user presence
- Real-time analytics updates

## 🛠️ Development Scripts

```bash
# Development
npm run dev              # Start development server with hot reload

# Database
npm run db:generate      # Generate Prisma client
npm run db:push          # Push schema changes to database
npm run db:migrate       # Run database migrations
npm run db:deploy        # Deploy migrations to production
npm run db:studio        # Open Prisma Studio
npm run db:seed          # Seed database with sample data

# Build & Production
npm run build            # Build TypeScript to JavaScript
npm start                # Start production server
```

## 📝 API Documentation

### Swagger/OpenAPI
Visit `/api-docs` when the server is running to access the interactive API documentation.

### Health Check
Visit `/health` to check server status and uptime.

## 🔧 Configuration

The application configuration is managed through environment variables:

- **Server**: Port, environment, CORS settings
- **Database**: PostgreSQL connection string
- **Authentication**: JWT secrets and expiration times
- **File Upload**: Cloudinary credentials
- **Rate Limiting**: Window size and request limits

## 🧪 Testing

The application includes comprehensive seed data for development and testing:

### Sample Users
- john.doe@example.com (Full-stack Developer)
- jane.smith@example.com (UI/UX Designer)  
- mike.johnson@example.com (Product Manager)
- sarah.wilson@example.com (CS Student)
- alex.chen@example.com (Mobile Developer)

All sample users have the password: `password123`

## 🚀 Deployment

### Environment Variables for Production
Ensure all production environment variables are set:
- Use strong, unique JWT secrets
- Configure production database URL
- Set appropriate CORS origins
- Configure Cloudinary for production

### Database Migration
```bash
npm run db:deploy  # Deploy migrations to production
```

## 📄 License

This project is licensed under the MIT License.

---

Built with ❤️ using Node.js, Express, TypeScript, and Prisma