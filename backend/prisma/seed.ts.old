import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// load environment variables from .env file
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Clear existing data in development (be careful with this in production!)
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data...');
    await prisma.aIRecommendation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.achievement.deleteMany();
    await prisma.milestone.deleteMany();
    await prisma.projectMember.deleteMany();
    await prisma.post.deleteMany();
    await prisma.project.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.team.deleteMany();
    await prisma.connection.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.user.deleteMany();
    console.log('✅ Cleared existing data');
  }

  // Hash a default password
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create sample users with more diverse profiles
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'john.doe@example.com',
        username: 'johndoe',
        firstName: 'John',
        lastName: 'Doe',
        bio: 'Full-stack developer passionate about building amazing products with modern technologies.',
        location: 'San Francisco, CA',
        website: 'https://johndoe.dev',
        github: 'https://github.com/johndoe',
        linkedin: 'https://linkedin.com/in/johndoe',
        company: 'TechCorp',
        position: 'Senior Software Engineer',
        userType: 'PROFESSIONAL',
        preferredRole: 'FULLSTACK_DEVELOPER',
        experienceLevel: 'ADVANCED',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS'],
        interests: ['Web Development', 'Open Source', 'Machine Learning'],
        languages: ['English', 'Spanish'],
        timezone: 'America/Los_Angeles',
        passwordHash: hashedPassword,
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'jane.smith@example.com',
        username: 'janesmith',
        firstName: 'Jane',
        lastName: 'Smith',
        bio: 'UI/UX designer with a love for creating intuitive and accessible user experiences.',
        location: 'New York, NY',
        website: 'https://janesmith.design',
        github: 'https://github.com/janesmith',
        linkedin: 'https://linkedin.com/in/janesmith',
        portfolio: 'https://portfolio.janesmith.design',
        company: 'Design Studio Inc',
        position: 'Lead UX Designer',
        userType: 'PROFESSIONAL',
        preferredRole: 'UI_UX_DESIGNER',
        experienceLevel: 'EXPERT',
        skills: ['Figma', 'Adobe Creative Suite', 'User Research', 'Prototyping', 'Design Systems'],
        interests: ['User Experience', 'Accessibility', 'Design Systems'],
        languages: ['English', 'French'],
        timezone: 'America/New_York',
        passwordHash: hashedPassword,
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'mike.johnson@example.com',
        username: 'mikejohnson',
        firstName: 'Mike',
        lastName: 'Johnson',
        bio: 'Product manager focused on user-centered design and agile methodologies. Love building products that solve real problems.',
        location: 'Austin, TX',
        linkedin: 'https://linkedin.com/in/mikejohnson',
        company: 'StartupXYZ',
        position: 'Senior Product Manager',
        userType: 'PROFESSIONAL',
        preferredRole: 'PRODUCT_MANAGER',
        experienceLevel: 'ADVANCED',
        skills: ['Product Strategy', 'Agile', 'Data Analysis', 'User Research', 'Roadmapping'],
        interests: ['Product Management', 'Startups', 'Data Science'],
        languages: ['English'],
        timezone: 'America/Chicago',
        passwordHash: hashedPassword,
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'sarah.wilson@example.com',
        username: 'sarahwilson',
        firstName: 'Sarah',
        lastName: 'Wilson',
        bio: 'Computer Science student passionate about AI and machine learning. Always looking for exciting projects to contribute to!',
        location: 'Boston, MA',
        github: 'https://github.com/sarahwilson',
        linkedin: 'https://linkedin.com/in/sarahwilson',
        userType: 'UNDERGRADUATE',
        preferredRole: 'DATA_SCIENTIST',
        experienceLevel: 'INTERMEDIATE',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'Jupyter'],
        interests: ['Artificial Intelligence', 'Data Science', 'Research'],
        languages: ['English', 'Mandarin'],
        timezone: 'America/New_York',
        passwordHash: hashedPassword,
        isVerified: true,
      },
    }),
    prisma.user.create({
      data: {
        email: 'alex.chen@example.com',
        username: 'alexchen',
        firstName: 'Alex',
        lastName: 'Chen',
        bio: 'Mobile developer specializing in React Native and Flutter. Building the future of mobile experiences.',
        location: 'Seattle, WA',
        github: 'https://github.com/alexchen',
        linkedin: 'https://linkedin.com/in/alexchen',
        userType: 'FREELANCER',
        preferredRole: 'MOBILE_DEVELOPER',
        experienceLevel: 'INTERMEDIATE',
        skills: ['React Native', 'Flutter', 'Swift', 'Kotlin', 'Firebase'],
        interests: ['Mobile Development', 'Cross-platform', 'App Store Optimization'],
        languages: ['English', 'Chinese'],
        timezone: 'America/Los_Angeles',
        passwordHash: hashedPassword,
        isVerified: true,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create follow relationships
  await Promise.all([
    prisma.follow.create({
      data: {
        followerId: users[0].id,
        followingId: users[1].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[1].id,
        followingId: users[2].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[3].id,
        followingId: users[0].id,
      },
    }),
    prisma.follow.create({
      data: {
        followerId: users[4].id,
        followingId: users[1].id,
      },
    }),
  ]);

  console.log('✅ Created follow relationships');

  // Create connections between users
  await Promise.all([
    prisma.connection.create({
      data: {
        senderId: users[0].id,
        receiverId: users[1].id,
        status: 'ACCEPTED',
        message: 'Hey Jane! I saw your design work and would love to connect. Maybe we can collaborate on some projects!',
      },
    }),
    prisma.connection.create({
      data: {
        senderId: users[1].id,
        receiverId: users[2].id,
        status: 'PENDING',
        message: 'Hi Mike! I would love to connect and discuss product design strategies.',
      },
    }),
    prisma.connection.create({
      data: {
        senderId: users[3].id,
        receiverId: users[0].id,
        status: 'ACCEPTED',
        message: 'Hi John! Fellow developer here, would love to connect and share knowledge!',
      },
    }),
    prisma.connection.create({
      data: {
        senderId: users[4].id,
        receiverId: users[1].id,
        status: 'PENDING',
        message: 'Hello Jane! Mobile developer here, interested in your UI/UX perspective for mobile apps.',
      },
    }),
  ]);

  console.log('✅ Created sample connections');

  // Create sample teams
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'InnovateTech',
        description: 'A team focused on building innovative web applications using cutting-edge technologies.',
        shortDescription: 'Web innovation team',
        type: 'PROJECT_BASED',
        visibility: 'PUBLIC',
        skills: ['React', 'Node.js', 'TypeScript', 'AWS'],
        tags: ['web-dev', 'innovation', 'startup'],
        location: 'San Francisco, CA',
        isRecruiting: true,
        maxMembers: 10,
        ownerId: users[0].id,
      },
    }),
    prisma.team.create({
      data: {
        name: 'Design Collective',
        description: 'A creative team of designers and developers working on user-centered products.',
        shortDescription: 'Creative design team',
        type: 'SKILL_BASED',
        visibility: 'PUBLIC',
        skills: ['Design', 'Figma', 'User Research', 'Prototyping'],
        tags: ['design', 'ux', 'creative'],
        location: 'New York, NY',
        isRecruiting: true,
        maxMembers: 8,
        ownerId: users[1].id,
      },
    }),
  ]);

  console.log(`✅ Created ${teams.length} teams`);

  // Add team members
  await Promise.all([
    prisma.teamMember.create({
      data: {
        teamId: teams[0].id,
        userId: users[0].id,
        role: 'OWNER',
        title: 'Team Lead & Full-stack Developer',
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[0].id,
        userId: users[3].id,
        role: 'MEMBER',
        title: 'Data Scientist',
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[1].id,
        userId: users[1].id,
        role: 'OWNER',
        title: 'Lead Designer',
      },
    }),
    prisma.teamMember.create({
      data: {
        teamId: teams[1].id,
        userId: users[4].id,
        role: 'MEMBER',
        title: 'Mobile UI Designer',
      },
    }),
  ]);

  console.log('✅ Added team members');

  // Create sample projects
  const projects = await Promise.all([
    prisma.project.create({
      data: {
        title: 'E-commerce Platform',
        description: 'Building a modern, scalable e-commerce platform with React and Node.js. Features include user authentication, product catalog, shopping cart, payment integration, and admin dashboard.',
        shortDescription: 'Modern e-commerce platform with React and Node.js',
        category: 'WEB_DEVELOPMENT',
        status: 'ACTIVE',
        isPublic: true,
        isRecruiting: true,
        maxMembers: 6,
        currentMembers: 3,
        requiredSkills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'Stripe API'],
        tags: ['React', 'Node.js', 'E-commerce', 'TypeScript', 'Full-stack'],
        ownerId: users[0].id,
        teamId: teams[0].id,
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-06-30'),
        estimatedDuration: '6 months',
        repositoryUrl: 'https://github.com/innovatetech/ecommerce-platform',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Mobile Banking App',
        description: 'Secure mobile banking application with biometric authentication, real-time transactions, and comprehensive financial management tools.',
        shortDescription: 'Secure mobile banking with biometric auth',
        category: 'MOBILE_DEVELOPMENT',
        status: 'RECRUITING',
        isPublic: true,
        isRecruiting: true,
        maxMembers: 8,
        currentMembers: 2,
        requiredSkills: ['React Native', 'Node.js', 'Security', 'Biometric Auth', 'Banking APIs'],
        tags: ['Mobile', 'Banking', 'Security', 'React Native', 'Fintech'],
        ownerId: users[1].id,
        startDate: new Date('2024-02-01'),
        endDate: new Date('2024-08-31'),
        estimatedDuration: '7 months',
      },
    }),
    prisma.project.create({
      data: {
        title: 'AI-Powered Analytics Dashboard',
        description: 'Business intelligence dashboard with machine learning insights, predictive analytics, and real-time data visualization for enterprise clients.',
        shortDescription: 'ML-powered business intelligence dashboard',
        category: 'AI_ML',
        status: 'ACTIVE',
        isPublic: false,
        isRecruiting: false,
        maxMembers: 5,
        currentMembers: 4,
        requiredSkills: ['Python', 'Machine Learning', 'React', 'D3.js', 'TensorFlow'],
        tags: ['AI', 'Analytics', 'Dashboard', 'Python', 'Machine Learning'],
        ownerId: users[2].id,
        startDate: new Date('2024-01-15'),
        endDate: new Date('2024-07-15'),
        estimatedDuration: '6 months',
        repositoryUrl: 'https://github.com/startupxyz/ai-analytics',
      },
    }),
    prisma.project.create({
      data: {
        title: 'Open Source Learning Platform',
        description: 'An open-source educational platform for coding tutorials, interactive exercises, and peer-to-peer learning.',
        shortDescription: 'Open-source coding education platform',
        category: 'EDUCATIONAL',
        status: 'PLANNING',
        isPublic: true,
        isRecruiting: true,
        maxMembers: 12,
        currentMembers: 1,
        requiredSkills: ['React', 'Node.js', 'Education', 'Community Building'],
        tags: ['Education', 'Open Source', 'React', 'Community'],
        ownerId: users[3].id,
        startDate: new Date('2024-03-01'),
        endDate: new Date('2024-12-31'),
        estimatedDuration: '10 months',
      },
    }),
  ]);

  console.log(`✅ Created ${projects.length} projects`);

  // Add project members
  await Promise.all([
    // E-commerce Platform members
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[0].id,
        role: 'OWNER',
        title: 'Project Lead & Backend Developer',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[1].id,
        role: 'DEVELOPER',
        title: 'Frontend Developer & UI Designer',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[0].id,
        userId: users[4].id,
        role: 'DEVELOPER',
        title: 'Mobile Developer',
      },
    }),
    // Mobile Banking App members
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[1].id,
        role: 'OWNER',
        title: 'Project Lead & UX Designer',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[1].id,
        userId: users[4].id,
        role: 'DEVELOPER',
        title: 'Senior Mobile Developer',
      },
    }),
    // AI Analytics Dashboard members
    prisma.projectMember.create({
      data: {
        projectId: projects[2].id,
        userId: users[2].id,
        role: 'OWNER',
        title: 'Product Manager & Data Lead',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[2].id,
        userId: users[3].id,
        role: 'DEVELOPER',
        title: 'ML Engineer',
      },
    }),
    prisma.projectMember.create({
      data: {
        projectId: projects[2].id,
        userId: users[0].id,
        role: 'DEVELOPER',
        title: 'Frontend Developer',
      },
    }),
    // Learning Platform members
    prisma.projectMember.create({
      data: {
        projectId: projects[3].id,
        userId: users[3].id,
        role: 'OWNER',
        title: 'Project Founder & Developer',
      },
    }),
  ]);

  console.log('✅ Added project members');

  // Create project goals
  await Promise.all([
    prisma.projectGoal.create({
      data: {
        title: 'Complete User Authentication',
        description: 'Implement secure user registration, login, and password reset functionality',
        projectId: projects[0].id,
        isCompleted: true,
        priority: 3,
        completedAt: new Date('2024-02-10'),
      },
    }),
    prisma.projectGoal.create({
      data: {
        title: 'Build Product Catalog',
        description: 'Create comprehensive product listing with search and filtering capabilities',
        projectId: projects[0].id,
        isCompleted: false,
        priority: 3,
      },
    }),
    prisma.projectGoal.create({
      data: {
        title: 'Market Research Analysis',
        description: 'Complete competitive analysis and target audience research',
        projectId: projects[1].id,
        isCompleted: true,
        priority: 2,
        completedAt: new Date('2024-02-25'),
      },
    }),
  ]);

  console.log('✅ Created project goals');

  // Create milestones
  const milestones = await Promise.all([
    prisma.milestone.create({
      data: {
        title: 'User Authentication System',
        description: 'Implement secure user authentication with JWT and password hashing',
        status: 'COMPLETED',
        projectId: projects[0].id,
        dueDate: new Date('2024-02-15'),
        completedAt: new Date('2024-02-10'),
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Product Catalog & Search',
        description: 'Build product listing, detailed views, and advanced search functionality',
        status: 'IN_PROGRESS',
        projectId: projects[0].id,
        dueDate: new Date('2024-04-30'),
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Payment Integration',
        description: 'Integrate Stripe payment processing with order management',
        status: 'PENDING',
        projectId: projects[0].id,
        dueDate: new Date('2024-05-30'),
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Market Research & Analysis',
        description: 'Conduct comprehensive market research and competitor analysis',
        status: 'COMPLETED',
        projectId: projects[1].id,
        dueDate: new Date('2024-02-28'),
        completedAt: new Date('2024-02-25'),
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'UI/UX Design System',
        description: 'Create comprehensive design system and user interface mockups',
        status: 'IN_PROGRESS',
        projectId: projects[1].id,
        dueDate: new Date('2024-04-15'),
      },
    }),
    prisma.milestone.create({
      data: {
        title: 'Data Pipeline Setup',
        description: 'Establish data ingestion and processing pipeline for analytics',
        status: 'COMPLETED',
        projectId: projects[2].id,
        dueDate: new Date('2024-02-20'),
        completedAt: new Date('2024-02-18'),
      },
    }),
  ]);

  console.log(`✅ Created ${milestones.length} milestones`);

  // Create achievements
  await Promise.all([
    prisma.achievement.create({
      data: {
        title: 'Security Champion',
        description: 'Successfully implemented secure authentication system with industry best practices',
        milestoneId: milestones[0].id,
        isShared: true,
      },
    }),
    prisma.achievement.create({
      data: {
        title: 'Research Excellence',
        description: 'Completed comprehensive market research ahead of schedule with actionable insights',
        milestoneId: milestones[3].id,
        isShared: true,
      },
    }),
    prisma.achievement.create({
      data: {
        title: 'Data Engineering Success',
        description: 'Built robust data pipeline handling 1M+ records with 99.9% uptime',
        milestoneId: milestones[5].id,
        isShared: true,
      },
    }),
  ]);

  console.log('✅ Created achievements');

  // Create project roles
  await Promise.all([
    prisma.projectRole.create({
      data: {
        title: 'Frontend Developer',
        description: 'Experienced React developer to build responsive user interfaces',
        projectId: projects[0].id,
        requiredSkills: ['React', 'TypeScript', 'CSS', 'JavaScript'],
        experienceLevel: 'INTERMEDIATE',
        isOpen: true,
        maxPositions: 2,
        filledPositions: 1,
      },
    }),
    prisma.projectRole.create({
      data: {
        title: 'Backend Developer',
        description: 'Node.js developer to build scalable APIs and database architecture',
        projectId: projects[0].id,
        requiredSkills: ['Node.js', 'PostgreSQL', 'Express', 'TypeScript'],
        experienceLevel: 'INTERMEDIATE',
        isOpen: true,
        maxPositions: 1,
        filledPositions: 0,
      },
    }),
    prisma.projectRole.create({
      data: {
        title: 'Mobile Security Expert',
        description: 'Security specialist for implementing biometric authentication',
        projectId: projects[1].id,
        requiredSkills: ['Mobile Security', 'Biometric Auth', 'Encryption', 'Banking'],
        experienceLevel: 'ADVANCED',
        isOpen: true,
        maxPositions: 1,
        filledPositions: 0,
      },
    }),
  ]);

  console.log('✅ Created project roles');

  // Create sample posts with diverse content
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content: '🚀 Excited to announce the completion of our authentication system! Implemented JWT tokens, password hashing, and 2FA. Security first approach paying off! #WebDev #Security',
        type: 'ACHIEVEMENT',
        authorId: users[0].id,
        projectId: projects[0].id,
        hashtags: ['WebDev', 'Security', 'Achievement'],
        tags: ['authentication', 'security', 'milestone'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'Just finished an amazing brainstorming session for our mobile banking app. The team is incredibly talented! 💡 We have some innovative ideas for biometric authentication that will revolutionize mobile banking security. #Fintech #Innovation',
        type: 'PROJECT_UPDATE',
        authorId: users[1].id,
        projectId: projects[1].id,
        hashtags: ['Fintech', 'Innovation', 'TeamWork'],
        tags: ['banking', 'mobile', 'brainstorming'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'Anyone have experience with machine learning model deployment in production? 🤖 Looking for best practices, especially around model versioning and A/B testing. Working on an analytics dashboard that needs to serve real-time predictions. #MachineLearning #MLOps',
        type: 'QUESTION',
        authorId: users[2].id,
        hashtags: ['MachineLearning', 'MLOps', 'Help'],
        tags: ['ml', 'deployment', 'question'],
      },
    }),
    prisma.post.create({
      data: {
        content: '📚 Starting work on an open-source learning platform! The goal is to make coding education more accessible and interactive. Looking for contributors who are passionate about education and open source. DM me if interested! #OpenSource #Education',
        type: 'PROJECT_ANNOUNCEMENT',
        authorId: users[3].id,
        projectId: projects[3].id,
        hashtags: ['OpenSource', 'Education', 'Collaboration'],
        tags: ['education', 'open-source', 'contributors'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'Mobile development tip: Always test biometric authentication on multiple devices! 📱 Just spent hours debugging an issue that only occurred on specific Android models. Testing is key! #MobileDev #Testing',
        type: 'SKILL_SHARE',
        authorId: users[4].id,
        hashtags: ['MobileDev', 'Testing', 'Tips'],
        tags: ['mobile', 'testing', 'tips'],
      },
    }),
    prisma.post.create({
      data: {
        content: '🎉 Milestone completed! Our data pipeline is now processing over 1 million records daily with 99.9% uptime. The power of good architecture and monitoring! #DataEngineering #Success',
        type: 'MILESTONE_COMPLETED',
        authorId: users[2].id,
        projectId: projects[2].id,
        hashtags: ['DataEngineering', 'Success', 'Milestone'],
        tags: ['data', 'pipeline', 'milestone'],
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} sample posts`);

  // Create comments on posts
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'Congrats John! 🎉 Security is so important in e-commerce. Did you implement rate limiting as well?',
        authorId: users[1].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Thanks Jane! Yes, we implemented rate limiting with Redis. Also added CAPTCHA for suspicious activities.',
        authorId: users[0].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Sounds exciting! Biometric auth in banking is the future. Are you considering voice recognition too?',
        authorId: users[4].id,
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Check out MLflow for model versioning and Kubeflow for deployment pipelines. Great tools!',
        authorId: users[3].id,
        postId: posts[2].id,
      },
    }),
  ]);

  console.log('✅ Created post comments');

  // Create reactions on posts
  await Promise.all([
    prisma.reaction.create({
      data: {
        type: 'LIKE',
        userId: users[1].id,
        postId: posts[0].id,
      },
    }),
    prisma.reaction.create({
      data: {
        type: 'CELEBRATE',
        userId: users[2].id,
        postId: posts[0].id,
      },
    }),
    prisma.reaction.create({
      data: {
        type: 'INSIGHTFUL',
        userId: users[0].id,
        postId: posts[2].id,
      },
    }),
    prisma.reaction.create({
      data: {
        type: 'SUPPORT',
        userId: users[2].id,
        postId: posts[3].id,
      },
    }),
    prisma.reaction.create({
      data: {
        type: 'AMAZING',
        userId: users[1].id,
        postId: posts[5].id,
      },
    }),
  ]);

  console.log('✅ Created post reactions');

  // Create bookmarks
  await Promise.all([
    prisma.bookmark.create({
      data: {
        userId: users[1].id,
        postId: posts[2].id, // ML deployment question
      },
    }),
    prisma.bookmark.create({
      data: {
        userId: users[0].id,
        projectId: projects[3].id, // Learning platform
      },
    }),
    prisma.bookmark.create({
      data: {
        userId: users[4].id,
        postId: posts[4].id, // Mobile dev tip
      },
    }),
  ]);

  console.log('✅ Created bookmarks');

  // Create sample conversations
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        title: 'E-commerce Project Discussion',
        isGroup: false,
        type: 'DIRECT_MESSAGE',
        createdBy: users[0].id,
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'Design Team Chat',
        isGroup: true,
        type: 'GROUP_CHAT',
        createdBy: users[1].id,
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'InnovateTech Team',
        isGroup: true,
        type: 'TEAM_CHAT',
        teamId: teams[0].id,
        createdBy: users[0].id,
      },
    }),
  ]);

  console.log(`✅ Created ${conversations.length} conversations`);

  // Add conversation participants
  await Promise.all([
    // Direct message conversation
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[0].id,
        userId: users[0].id,
        role: 'admin',
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[0].id,
        userId: users[1].id,
        role: 'member',
      },
    }),
    // Group chat participants
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[1].id,
        userId: users[1].id,
        role: 'admin',
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[1].id,
        userId: users[4].id,
        role: 'member',
      },
    }),
    // Team chat participants
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[2].id,
        userId: users[0].id,
        role: 'admin',
      },
    }),
    prisma.conversationParticipant.create({
      data: {
        conversationId: conversations[2].id,
        userId: users[3].id,
        role: 'member',
      },
    }),
  ]);

  console.log('✅ Added conversation participants');

  // Create sample messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Hey Jane, I wanted to discuss the UI designs for the e-commerce platform. Do you have time for a quick call?',
        senderId: users[0].id,
        receiverId: users[1].id,
        conversationId: conversations[0].id,
        type: 'TEXT',
      },
    }),
    prisma.message.create({
      data: {
        content: 'Absolutely! I have some mockups ready. When would be a good time to review them? I can share them now if you\'d like.',
        senderId: users[1].id,
        receiverId: users[0].id,
        conversationId: conversations[0].id,
        type: 'TEXT',
      },
    }),
    prisma.message.create({
      data: {
        content: 'Perfect! How about 3 PM today? We can go through the user flow and discuss any changes needed.',
        senderId: users[0].id,
        receiverId: users[1].id,
        conversationId: conversations[0].id,
        type: 'TEXT',
      },
    }),
    prisma.message.create({
      data: {
        content: 'Welcome to the Design Team chat! 🎨 Feel free to share ideas, resources, and collaborate here.',
        senderId: users[1].id,
        conversationId: conversations[1].id,
        type: 'TEXT',
      },
    }),
    prisma.message.create({
      data: {
        content: 'Thanks! Excited to be part of the team. I\'ve been working on some mobile UI patterns that might be useful.',
        senderId: users[4].id,
        conversationId: conversations[1].id,
        type: 'TEXT',
      },
    }),
  ]);

  console.log('✅ Created sample messages');

  // Create diverse notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        type: 'CONNECTION_REQUEST',
        title: 'New Connection Request',
        message: 'Alex Chen sent you a connection request',
        userId: users[1].id,
        data: { senderId: users[4].id },
        priority: 'normal',
        category: 'social',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'PROJECT_INVITATION',
        title: 'Project Invitation',
        message: 'You have been invited to join the E-commerce Platform project',
        userId: users[3].id,
        data: { projectId: projects[0].id, invitedBy: users[0].id },
        priority: 'high',
        category: 'project',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'POST_REACTION',
        title: 'Someone liked your post',
        message: 'Jane Smith liked your post about authentication system',
        userId: users[0].id,
        data: { postId: posts[0].id, reactorId: users[1].id },
        priority: 'low',
        category: 'social',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'PROJECT_MILESTONE_COMPLETED',
        title: 'Milestone Completed',
        message: 'User Authentication System milestone has been completed!',
        userId: users[1].id,
        data: { milestoneId: milestones[0].id, projectId: projects[0].id },
        priority: 'high',
        category: 'project',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'TEAM_INVITATION',
        title: 'Team Invitation',
        message: 'You have been invited to join InnovateTech team',
        userId: users[2].id,
        data: { teamId: teams[0].id, invitedBy: users[0].id },
        priority: 'normal',
        category: 'social',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'COMMENT_REPLY',
        title: 'Reply to your comment',
        message: 'John Doe replied to your comment on authentication post',
        userId: users[1].id,
        data: { commentId: 'comment-id', postId: posts[0].id },
        priority: 'normal',
        category: 'social',
      },
    }),
  ]);

  console.log('✅ Created diverse notifications');

  // Create AI recommendations
  await Promise.all([
    prisma.aIRecommendation.create({
      data: {
        type: 'USER',
        userId: users[0].id,
        targetId: users[3].id,
        score: 0.92,
        reason: 'Similar skills in full-stack development and shared interest in education technology',
        metadata: {
          commonSkills: ['React', 'Node.js'],
          interestMatch: 0.85,
          experienceLevel: 'compatible'
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    prisma.aIRecommendation.create({
      data: {
        type: 'PROJECT',
        userId: users[1].id,
        targetId: projects[2].id,
        score: 0.78,
        reason: 'Your UI/UX skills would be valuable for this analytics dashboard project',
        metadata: {
          skillsNeeded: ['UI Design', 'Data Visualization'],
          roleMatch: 'designer',
          urgency: 'medium'
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
    prisma.aIRecommendation.create({
      data: {
        type: 'TEAM',
        userId: users[4].id,
        targetId: teams[1].id,
        score: 0.85,
        reason: 'Design Collective team matches your mobile UI interests',
        metadata: {
          teamType: 'skill-based',
          relevantProjects: 2,
          cultureFit: 0.90
        },
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    }),
  ]);

  console.log('✅ Created AI recommendations');

  // Create hashtags
  await Promise.all([
    prisma.hashtag.create({
      data: {
        name: 'WebDev',
        description: 'Web development related content',
        usageCount: 15,
        trending: true,
      },
    }),
    prisma.hashtag.create({
      data: {
        name: 'MachineLearning',
        description: 'Machine learning and AI content',
        usageCount: 12,
        trending: true,
      },
    }),
    prisma.hashtag.create({
      data: {
        name: 'OpenSource',
        description: 'Open source projects and contributions',
        usageCount: 8,
        trending: false,
      },
    }),
  ]);

  console.log('✅ Created hashtags');

  console.log('🎉 Database seeding completed successfully!');
  console.log('\n📊 Seeding Summary:');
  console.log(`   👥 Users: ${users.length}`);
  console.log(`   🤝 Teams: ${teams.length}`);
  console.log(`   🚀 Projects: ${projects.length}`);
  console.log(`   🎯 Milestones: ${milestones.length}`);
  console.log(`   📝 Posts: ${posts.length}`);
  console.log(`   💬 Conversations: ${conversations.length}`);
  console.log('\n📧 Sample user credentials (password: "password123"):');
  console.log('   - john.doe@example.com (Full-stack Developer)');
  console.log('   - jane.smith@example.com (UI/UX Designer)');
  console.log('   - mike.johnson@example.com (Product Manager)');
  console.log('   - sarah.wilson@example.com (CS Student)');
  console.log('   - alex.chen@example.com (Mobile Developer)');
  console.log('\n🔧 Database is ready for development and testing!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });