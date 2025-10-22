import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database with Bangladesh-specific data...');

  // Clear existing data in development
  if (process.env.NODE_ENV === 'development') {
    console.log('🧹 Clearing existing data...');
    await prisma.aIRecommendation.deleteMany();
    await prisma.notification.deleteMany();
    await prisma.messageReaction.deleteMany();
    await prisma.message.deleteMany();
    await prisma.conversationParticipant.deleteMany();
    await prisma.conversation.deleteMany();
    await prisma.mention.deleteMany();
    await prisma.bookmark.deleteMany();
    await prisma.share.deleteMany();
    await prisma.commentReaction.deleteMany();
    await prisma.reaction.deleteMany();
    await prisma.comment.deleteMany();
    await prisma.post.deleteMany();
    await prisma.teamAchievement.deleteMany();
    await prisma.teamMilestone.deleteMany();
    await prisma.teamProject.deleteMany();
    await prisma.teamJoinRequest.deleteMany();
    await prisma.teamInvitation.deleteMany();
    await prisma.teamMemberCustomRole.deleteMany();
    await prisma.teamCustomRole.deleteMany();
    await prisma.teamMember.deleteMany();
    await prisma.teamFollow.deleteMany();
    await prisma.team.deleteMany();
    await prisma.follow.deleteMany();
    await prisma.connection.deleteMany();
    await prisma.user.deleteMany();
  }

  // Hash default password
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Create diverse users with Bangladesh-specific profiles
  const users = await Promise.all([
    // Professional from Dhaka - Tech Lead
    prisma.user.create({
      data: {
        email: 'rafiul.islam@brainstation23.com',
        username: 'rafiul_dev',
        firstName: 'Rafiul',
        lastName: 'Islam',
        bio: 'Senior Software Engineer at Brain Station 23. Passionate about building scalable web applications using React and Node.js. Love mentoring junior developers.',
        country: 'Bangladesh',
        city: 'Dhaka',
        address: 'Gulshan, Dhaka-1212',
        website: 'https://rafiul.dev',
        linkedin: 'https://linkedin.com/in/rafiulislam',
        github: 'https://github.com/rafiulislam',
        company: 'Brain Station 23',
        position: 'Senior Software Engineer',
        userType: 'PROFESSIONAL',
        skills: ['React', 'Node.js', 'TypeScript', 'PostgreSQL', 'AWS', 'Docker'],
        interests: ['Web Development', 'Mentoring', 'Open Source'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),
    
    // Student from Chittagong - AI enthusiast
    prisma.user.create({
      data: {
        email: 'fatema.ahmed@cu.ac.bd',
        username: 'fatema_ai',
        firstName: 'Fatema',
        lastName: 'Ahmed',
        bio: 'Computer Science student at University of Chittagong. Passionate about Machine Learning and AI. Active in programming contests and hackathons.',
        country: 'Bangladesh',
        city: 'Chittagong',
        address: 'Hathazari, Chittagong',
        github: 'https://github.com/fatemaahmed',
        linkedin: 'https://linkedin.com/in/fatemaahmed',
        userType: 'UNDERGRADUATE',
        skills: ['Python', 'Machine Learning', 'TensorFlow', 'Pandas', 'Java', 'C++'],
        interests: ['AI Research', 'Data Science', 'Competitive Programming'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),

    // Freelancer from Sylhet - Mobile Developer
    prisma.user.create({
      data: {
        email: 'nazmul.hassan@gmail.com',
        username: 'nazmul_mobile',
        firstName: 'Nazmul',
        lastName: 'Hassan',
        bio: 'Full-stack mobile developer specializing in React Native and Flutter. Building innovative apps for local and international clients from Sylhet.',
        country: 'Bangladesh',
        city: 'Sylhet',
        website: 'https://nazmulhassan.dev',
        github: 'https://github.com/nazmulhassan',
        linkedin: 'https://linkedin.com/in/nazmulhassan',
        portfolio: 'https://portfolio.nazmulhassan.dev',
        userType: 'FREELANCER',
        skills: ['React Native', 'Flutter', 'Node.js', 'Firebase', 'Swift', 'Kotlin'],
        interests: ['Mobile Development', 'Startup Ideas', 'Tech Innovation'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),

    // Startup Founder from Dhaka - Fintech
    prisma.user.create({
      data: {
        email: 'sadia.Rahman@nexuspay.bd',
        username: 'sadia_founder',
        firstName: 'Sadia',
        lastName: 'Rahman',
        bio: 'Founder & CEO of NexusPay - a digital payment solution for Bangladesh. Former software engineer turned entrepreneur, building the future of fintech.',
        country: 'Bangladesh',
        city: 'Dhaka',
        address: 'Banani, Dhaka-1213',
        website: 'https://nexuspay.bd',
        linkedin: 'https://linkedin.com/in/sadiarahman',
        company: 'NexusPay',
        position: 'Founder & CEO',
        userType: 'STARTUP_FOUNDER',
        skills: ['Product Management', 'Fintech', 'Business Development', 'React', 'Payment Systems'],
        interests: ['Entrepreneurship', 'Fintech Innovation', 'Digital Bangladesh'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),

    // UI/UX Designer from Rajshahi
    prisma.user.create({
      data: {
        email: 'asif.mahmud@designstudio.bd',
        username: 'asif_designer',
        firstName: 'Asif',
        lastName: 'Mahmud',
        bio: 'Senior UI/UX Designer with 5+ years experience. Specialized in mobile app design and user research. Love creating intuitive experiences for Bangladeshi users.',
        country: 'Bangladesh',
        city: 'Rajshahi',
        website: 'https://asifmahmud.design',
        linkedin: 'https://linkedin.com/in/asifmahmud',
        portfolio: 'https://behance.net/asifmahmud',
        company: 'Design Studio BD',
        position: 'Senior UI/UX Designer',
        userType: 'PROFESSIONAL',
        skills: ['Figma', 'Adobe XD', 'User Research', 'Prototyping', 'Design Systems'],
        interests: ['User Experience', 'Design Thinking', 'Mobile Design'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),

    // Data Scientist from Khulna
    prisma.user.create({
      data: {
        email: 'tasnia.sultana@dataworks.bd',
        username: 'tasnia_data',
        firstName: 'Tasnia',
        lastName: 'Sultana',
        bio: 'Data Scientist passionate about using data to solve real-world problems in Bangladesh. Working on ML models for agriculture and healthcare sectors.',
        country: 'Bangladesh',
        city: 'Khulna',
        github: 'https://github.com/tasniasultana',
        linkedin: 'https://linkedin.com/in/tasniasultana',
        company: 'DataWorks BD',
        position: 'Data Scientist',
        userType: 'PROFESSIONAL',
        skills: ['Python', 'R', 'Machine Learning', 'Deep Learning', 'SQL', 'Tableau'],
        interests: ['Data Science', 'AI for Good', 'Healthcare Analytics'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),

    // Graduate Student from Dhaka University
    prisma.user.create({
      data: {
        email: 'mehedi.hasan@du.ac.bd',
        username: 'mehedi_blockchain',
        firstName: 'Mehedi',
        lastName: 'Hasan',
        bio: 'Masters student in Computer Science at Dhaka University. Researching blockchain technology and its applications in supply chain management.',
        country: 'Bangladesh',
        city: 'Dhaka',
        address: 'Dhanmondi, Dhaka-1205',
        github: 'https://github.com/mehedihasan',
        userType: 'GRADUATE',
        skills: ['Blockchain', 'Solidity', 'Ethereum', 'Smart Contracts', 'Python', 'JavaScript'],
        interests: ['Blockchain Research', 'Cryptocurrency', 'Decentralized Systems'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),

    // Entrepreneur from Comilla
    prisma.user.create({
      data: {
        email: 'ruhul.amin@agritech.bd',
        username: 'ruhul_agritech',
        firstName: 'Ruhul',
        lastName: 'Amin',
        bio: 'Agricultural Technology entrepreneur building IoT solutions for farmers in Bangladesh. Combining technology with traditional farming practices.',
        country: 'Bangladesh',
        city: 'Comilla',
        website: 'https://agritech.bd',
        linkedin: 'https://linkedin.com/in/ruhulamin',
        company: 'AgriTech BD',
        position: 'Founder',
        userType: 'ENTREPRENEUR',
        skills: ['IoT', 'Arduino', 'Raspberry Pi', 'Agriculture Tech', 'Business Development'],
        interests: ['Smart Farming', 'IoT Innovation', 'Rural Development'],
        timezone: 'Asia/Dhaka',
        passwordHash: hashedPassword,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users`);

  // Create follow relationships
  await Promise.all([
    prisma.follow.create({
      data: { followerId: users[0].id, followingId: users[1].id },
    }),
    prisma.follow.create({
      data: { followerId: users[1].id, followingId: users[3].id },
    }),
    prisma.follow.create({
      data: { followerId: users[2].id, followingId: users[0].id },
    }),
    prisma.follow.create({
      data: { followerId: users[3].id, followingId: users[4].id },
    }),
    prisma.follow.create({
      data: { followerId: users[4].id, followingId: users[5].id },
    }),
    prisma.follow.create({
      data: { followerId: users[6].id, followingId: users[7].id },
    }),
  ]);

  console.log('✅ Created follow relationships');

  // Create connections
  await Promise.all([
    prisma.connection.create({
      data: {
        senderId: users[0].id,
        receiverId: users[1].id,
        status: 'ACCEPTED',
        message: 'Hi Fatema! I saw your AI projects on GitHub. Would love to connect and discuss ML opportunities in Bangladesh.',
      },
    }),
    prisma.connection.create({
      data: {
        senderId: users[2].id,
        receiverId: users[3].id,
        status: 'PENDING',
        message: 'Hello Sadia! Mobile developer here. Interested in collaborating on fintech mobile solutions.',
      },
    }),
    prisma.connection.create({
      data: {
        senderId: users[4].id,
        receiverId: users[0].id,
        status: 'ACCEPTED',
        message: 'Assalamu Alaikum Rafiul bhai! Fellow designer looking to connect with developers for collaboration.',
      },
    }),
    prisma.connection.create({
      data: {
        senderId: users[5].id,
        receiverId: users[6].id,
        status: 'ACCEPTED',
        message: 'Hi Mehedi! Data scientist interested in blockchain applications for data security. Let\'s connect!',
      },
    }),
  ]);

  console.log('✅ Created connections');

  // Create teams with Bangladesh context
  const teams = await Promise.all([
    prisma.team.create({
      data: {
        name: 'TechBD Innovators',
        description: 'A passionate team of Bangladeshi developers working on innovative solutions for local challenges. We focus on fintech, edtech, and healthtech applications.',
        shortDescription: 'Bangladesh tech innovation team',
        type: 'STARTUP',
        visibility: 'PUBLIC',
        skills: ['React', 'Node.js', 'Mobile Development', 'AI/ML', 'Blockchain'],
        tags: ['fintech', 'edtech', 'bangladesh', 'innovation'],
        country: 'Bangladesh',
        city: 'Dhaka',
        isRecruiting: true,
        maxMembers: 12,
        ownerId: users[3].id, // Sadia (Startup Founder)
        social: {
          facebook: 'https://facebook.com/techbdinnovators',
          linkedin: 'https://linkedin.com/company/techbdinnovators'
        }
      },
    }),

    prisma.team.create({
      data: {
        name: 'Digital Bangladesh Builders',
        description: 'Contributing to Digital Bangladesh vision through open source projects and community initiatives. Building solutions for education, agriculture, and governance.',
        shortDescription: 'Open source community for Digital Bangladesh',
        type: 'OPEN_SOURCE',
        visibility: 'PUBLIC',
        skills: ['Python', 'JavaScript', 'Mobile Apps', 'IoT', 'Data Science'],
        tags: ['open-source', 'digital-bangladesh', 'community'],
        country: 'Bangladesh',
        city: 'Dhaka',
        isRecruiting: true,
        maxMembers: 25,
        ownerId: users[0].id, // Rafiul
      },
    }),

    prisma.team.create({
      data: {
        name: 'Bangladesh AI Research',
        description: 'Research team focused on AI/ML applications in Bangladesh context. Working on projects for agriculture, healthcare, and education sectors.',
        shortDescription: 'AI research for Bangladesh',
        type: 'STUDY_GROUP',
        visibility: 'PUBLIC',
        skills: ['Machine Learning', 'Deep Learning', 'Python', 'Research', 'Data Analysis'],
        tags: ['ai', 'research', 'bangladesh', 'agriculture', 'healthcare'],
        country: 'Bangladesh',
        city: 'Chittagong',
        isRecruiting: true,
        maxMembers: 8,
        ownerId: users[1].id, // Fatema
      },
    }),

    prisma.team.create({
      data: {
        name: 'Mobile First BD',
        description: 'Mobile-first development team creating apps specifically for Bangladeshi users. Focus on local payment integration, Bengali language support, and offline capabilities.',
        shortDescription: 'Mobile apps for Bangladesh',
        type: 'SKILL_BASED',
        visibility: 'PUBLIC',
        skills: ['React Native', 'Flutter', 'Mobile UI/UX', 'Payment Integration'],
        tags: ['mobile', 'bangladesh', 'local-payment', 'bengali'],
        country: 'Bangladesh',
        city: 'Sylhet',
        isRecruiting: true,
        maxMembers: 6,
        ownerId: users[2].id, // Nazmul
      },
    }),
  ]);

  console.log(`✅ Created ${teams.length} teams`);

  // Add team members
  await Promise.all([
    // TechBD Innovators team
    prisma.teamMember.create({
      data: { teamId: teams[0].id, userId: users[3].id, status: 'ADMIN', title: 'Team Lead & Product Manager' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[0].id, userId: users[0].id, status: 'MEMBER', title: 'Senior Developer' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[0].id, userId: users[4].id, status: 'MEMBER', title: 'UI/UX Designer' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[0].id, userId: users[5].id, status: 'MEMBER', title: 'Data Scientist' }
    }),

    // Digital Bangladesh Builders
    prisma.teamMember.create({
      data: { teamId: teams[1].id, userId: users[0].id, status: 'ADMIN', title: 'Community Lead' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[1].id, userId: users[6].id, status: 'MEMBER', title: 'Blockchain Developer' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[1].id, userId: users[7].id, status: 'MEMBER', title: 'IoT Specialist' }
    }),

    // Bangladesh AI Research
    prisma.teamMember.create({
      data: { teamId: teams[2].id, userId: users[1].id, status: 'ADMIN', title: 'Research Lead' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[2].id, userId: users[5].id, status: 'MEMBER', title: 'ML Engineer' }
    }),

    // Mobile First BD
    prisma.teamMember.create({
      data: { teamId: teams[3].id, userId: users[2].id, status: 'ADMIN', title: 'Mobile Lead' }
    }),
    prisma.teamMember.create({
      data: { teamId: teams[3].id, userId: users[4].id, status: 'MEMBER', title: 'Mobile Designer' }
    }),
  ]);


  console.log('✅ Added team members');

  // Create team projects with Bangladesh context
  const projects = await Promise.all([
    prisma.teamProject.create({
      data: {
        title: 'বিকাশ Payment Gateway',
        description: 'Comprehensive payment gateway solution integrating with popular Bangladeshi mobile banking services like bKash, Rocket, and Nagad. Features include merchant dashboard, transaction analytics, and fraud detection.',
        shortDescription: 'Mobile banking payment gateway for Bangladesh',
        category: 'WEB_DEVELOPMENT',
        status: 'ACTIVE',
        requiredSkills: ['Node.js', 'React', 'Payment APIs', 'Security', 'Bengali'],
        tags: ['fintech', 'mobile-banking', 'bkash', 'payment', 'bangladesh'],
        teamId: teams[0].id,
        createdBy: users[3].id,
        startDate: new Date('2024-08-01'),
        endDate: new Date('2025-02-28'),
        estimatedDuration: '6 months',
        repositoryUrl: 'https://github.com/techbd/bikash-gateway',
      },
    }),

    prisma.teamProject.create({
      data: {
        title: 'কৃষি AI - Smart Farming Assistant',
        description: 'AI-powered mobile app helping Bangladeshi farmers with crop disease detection, weather prediction, and market price information. Uses computer vision and machine learning.',
        shortDescription: 'AI farming assistant for Bangladesh',
        category: 'AI_ML',
        status: 'ACTIVE',
        requiredSkills: ['Python', 'TensorFlow', 'Computer Vision', 'Mobile App', 'Bengali'],
        tags: ['agriculture', 'ai', 'farming', 'bangladesh', 'computer-vision'],
        teamId: teams[2].id,
        createdBy: users[1].id,
        startDate: new Date('2024-09-01'),
        endDate: new Date('2025-03-31'),
        estimatedDuration: '7 months',
        repositoryUrl: 'https://github.com/bdai/krishi-ai',
      },
    }),

    prisma.teamProject.create({
      data: {
        title: 'ShikhonBD - Online Learning Platform',
        description: 'Comprehensive e-learning platform for Bangladeshi students with support for Bengali content, offline video downloads, and affordable pricing. Mobile-first approach.',
        shortDescription: 'E-learning platform for Bangladesh',
        category: 'EDUCATIONAL',
        status: 'PLANNING',
        requiredSkills: ['React Native', 'Node.js', 'Video Streaming', 'Bengali', 'Payment'],
        tags: ['education', 'mobile', 'bengali', 'video', 'learning'],
        teamId: teams[3].id,
        createdBy: users[2].id,
        startDate: new Date('2024-11-01'),
        endDate: new Date('2025-08-31'),
        estimatedDuration: '10 months',
      },
    }),

    prisma.teamProject.create({
      data: {
        title: 'Government Service Portal',
        description: 'Digital portal for accessing government services online. Features include birth certificate, passport application, tax filing, and utility bill payments.',
        shortDescription: 'Digital government services portal',
        category: 'WEB_DEVELOPMENT',
        status: 'ACTIVE',
        requiredSkills: ['React', 'Node.js', 'Government APIs', 'Security', 'Bengali'],
        tags: ['government', 'digital-bangladesh', 'services', 'portal'],
        teamId: teams[1].id,
        createdBy: users[0].id,
        startDate: new Date('2024-07-01'),
        endDate: new Date('2025-06-30'),
        estimatedDuration: '12 months',
        repositoryUrl: 'https://github.com/digitalbd/gov-portal',
      },
    }),
  ]);

  console.log(`✅ Created ${projects.length} projects`);

  // Create milestones
  const milestones = await Promise.all([
    prisma.teamMilestone.create({
      data: {
        title: 'bKash API Integration',
        description: 'Complete integration with bKash payment API and test transactions',
        status: 'COMPLETED',
        teamId: teams[0].id,
        projectId: projects[0].id,
        createdBy: users[3].id,
        dueDate: new Date('2024-09-15'),
        completedAt: new Date('2024-09-10'),
      },
    }),
    prisma.teamMilestone.create({
      data: {
        title: 'Crop Disease Detection Model',
        description: 'Train and deploy computer vision model for detecting rice and wheat diseases',
        status: 'IN_PROGRESS',
        teamId: teams[2].id,
        projectId: projects[1].id,
        createdBy: users[1].id,
        dueDate: new Date('2024-12-30'),
      },
    }),
    prisma.teamMilestone.create({
      data: {
        title: 'Mobile App MVP',
        description: 'Launch minimum viable product for ShikhonBD mobile app',
        status: 'PENDING',
        teamId: teams[3].id,
        projectId: projects[2].id,
        createdBy: users[2].id,
        dueDate: new Date('2025-01-31'),
      },
    }),
  ]);

  console.log(`✅ Created ${milestones.length} milestones`);

  // Create achievements
  await Promise.all([
    prisma.teamAchievement.create({
      data: {
        title: 'Payment Gateway Launch',
        description: 'Successfully launched payment gateway with 1000+ merchant registrations',
        teamId: teams[0].id,
        milestoneId: milestones[0].id,
        isShared: true,
        createdBy: users[3].id,
      },
    }),
    prisma.teamAchievement.create({
      data: {
        title: 'AI Model Accuracy',
        description: 'Achieved 95% accuracy in crop disease detection model',
        teamId: teams[2].id,
        isShared: true,
        createdBy: users[1].id,
      },
    }),
  ]);

  console.log('✅ Created achievements');

  // Create diverse posts with Bangladesh context
  const posts = await Promise.all([
    prisma.post.create({
      data: {
        content: '🚀 আলহামদুলিল্লাহ! আমাদের বিকাশ পেমেন্ট গেটওয়ে সফলভাবে লঞ্চ হয়েছে! এক হাজারেরও বেশি মার্চেন্ট নিবন্ধন করেছেন। বাংলাদেশের ডিজিটাল পেমেন্ট ইকোসিস্টেমে আমাদের অবদান রাখতে পেরে গর্বিত। #ফিনটেক #বাংলাদেশ #পেমেন্ট',
        type: 'ACHIEVEMENT',
        authorId: users[3].id,
        hashtags: ['ফিনটেক', 'বাংলাদেশ', 'পেমেন্ট'],
        tags: ['fintech', 'launch', 'milestone'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'Machine Learning দিয়ে কৃষকদের সাহায্য করার জন্য একটি প্রজেক্টে কাজ করছি। এআই ব্যবহার করে ধানের রোগ শনাক্ত করার মডেল তৈরি করেছি। এখন পর্যন্ত ৯৫% সঠিকতা পেয়েছি! বাংলাদেশের কৃষিতে প্রযুক্তির ব্যবহার বাড়ানোর স্বপ্ন দেখছি। #কৃষি #এআই #বাংলাদেশ',
        type: 'PROJECT_UPDATE',
        authorId: users[1].id,
        hashtags: ['কৃষি', 'এআই', 'বাংলাদেশ'],
        tags: ['agriculture', 'ai', 'research'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'React Native দিয়ে বাংলাদেশি ইউজারদের জন্য অ্যাপ বানানোর সময় কিছু টিপস:\n\n1. বাংলা ফন্ট সাপোর্ট নিশ্চিত করুন\n2. অফলাইন ফিচার যোগ করুন (ইন্টারনেট সমস্যার জন্য)\n3. ছোট APK সাইজ রাখুন (ডেটা সীমাবদ্ধতার জন্য)\n4. স্থানীয় পেমেন্ট গেটওয়ে ইন্টিগ্রেট করুন\n\n#মোবাইল #রিয়েক্টনেটিভ #বাংলাদেশ #টিপস',
        type: 'SKILL_SHARE',
        authorId: users[2].id,
        hashtags: ['মোবাইল', 'রিয়েক্টনেটিভ', 'বাংলাদেশ', 'টিপস'],
        tags: ['mobile', 'react-native', 'tips'],
      },
    }),
    prisma.post.create({
      data: {
        content: '🎉 Digital Bangladesh vision এর অংশ হিসেবে Government Service Portal এর প্রথম ভার্সন রিলিজ হয়েছে! এখন অনলাইনে জন্ম নিবন্ধন, পাসপোর্ট আবেদন, এবং ট্যাক্স ফাইলিং করা যাবে। Open source হিসেবে GitHub এ কোড শেয়ার করেছি। #ডিজিটালবাংলাদেশ #ওপেনসোর্স #সরকারিসেবা',
        type: 'PROJECT_SHOWCASE',
        authorId: users[0].id,
        hashtags: ['ডিজিটালবাংলাদেশ', 'ওপেনসোর্স', 'সরকারিসেবা'],
        tags: ['government', 'digital-bangladesh', 'open-source'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'UI/UX Design এর ক্ষেত্রে বাংলাদেশি ইউজারদের জন্য কিছু বিশেষ বিবেচনা:\n\n• সাংস্কৃতিক কালার প্যালেট ব্যবহার\n• বাংলা টাইপোগ্রাফি অপটিমাইজেশন\n• লোকাল কনটেন্ট এবং আইকন\n• মোবাইল-ফার্স্ট অ্যাপ্রোচ\n\nDesign is not just about looks, it\'s about understanding your users! #ইউআইইউএক্স #ডিজাইন #বাংলাদেশ',
        type: 'SKILL_SHARE',
        authorId: users[4].id,
        hashtags: ['ইউআইইউএক্স', 'ডিজাইন', 'বাংলাদেশ'],
        tags: ['ui-ux', 'design', 'localization'],
      },
    }),
    prisma.post.create({
      data: {
        content: 'Blockchain technology দিয়ে বাংলাদেশের সাপ্লাই চেইন ম্যানেজমেন্ট উন্নত করার গবেষণা চালিয়ে যাচ্ছি। বিশেষ করে কৃষি পণ্যের স্বচ্ছতা এবং ট্রেসেবিলিটি নিশ্চিত করতে smart contracts ব্যবহার করার পরিকল্পনা। কেউ collaborate করতে আগ্রহী? #ব্লকচেইন #গবেষণা #সাপ্লাইচেইন',
        type: 'QUESTION',
        authorId: users[6].id,
        hashtags: ['ব্লকচেইন', 'গবেষণা', 'সাপ্লাইচেইন'],
        tags: ['blockchain', 'research', 'supply-chain'],
      },
    }),
  ]);

  console.log(`✅ Created ${posts.length} posts`);

  // Create comments
  await Promise.all([
    prisma.comment.create({
      data: {
        content: 'মাশাআল্লাহ ভাইয়া! দারুণ কাজ হয়েছে। আমাদের দেশের ডিজিটাল পেমেন্ট সিস্টেম আরো এগিয়ে যাবে এভাবে।',
        authorId: users[0].id,
        postId: posts[0].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Excellent work on the AI model! Would love to see this implemented in rural areas. Can we discuss collaboration?',
        authorId: users[5].id,
        postId: posts[1].id,
      },
    }),
    prisma.comment.create({
      data: {
        content: 'Very helpful tips! Bengali font support is indeed crucial. Have you tried any specific libraries for this?',
        authorId: users[4].id,
        postId: posts[2].id,
      },
    }),
  ]);

  console.log('✅ Created comments');

  // Create reactions
  await Promise.all([
    prisma.reaction.create({
      data: { type: 'CELEBRATE', userId: users[0].id, postId: posts[0].id },
    }),
    prisma.reaction.create({
      data: { type: 'LOVE', userId: users[1].id, postId: posts[0].id },
    }),
    prisma.reaction.create({
      data: { type: 'INSIGHTFUL', userId: users[3].id, postId: posts[1].id },
    }),
    prisma.reaction.create({
      data: { type: 'SUPPORT', userId: users[2].id, postId: posts[3].id },
    }),
    prisma.reaction.create({
      data: { type: 'AMAZING', userId: users[7].id, postId: posts[5].id },
    }),
  ]);

  console.log('✅ Created reactions');

  // Create conversations
  const conversations = await Promise.all([
    prisma.conversation.create({
      data: {
        title: 'Payment Gateway Discussion',
        isGroup: false,
        type: 'DIRECT_MESSAGE',
        createdBy: users[3].id,
      },
    }),
    prisma.conversation.create({
      data: {
        title: 'TechBD Team Chat',
        isGroup: true,
        type: 'TEAM_CHAT',
        teamId: teams[0].id,
        createdBy: users[3].id,
      },
    }),
  ]);

  // Add conversation participants
  await Promise.all([
    prisma.conversationParticipant.create({
      data: { conversationId: conversations[0].id, userId: users[3].id, role: 'admin' },
    }),
    prisma.conversationParticipant.create({
      data: { conversationId: conversations[0].id, userId: users[0].id, role: 'member' },
    }),
    prisma.conversationParticipant.create({
      data: { conversationId: conversations[1].id, userId: users[3].id, role: 'admin' },
    }),
    prisma.conversationParticipant.create({
      data: { conversationId: conversations[1].id, userId: users[0].id, role: 'member' },
    }),
    prisma.conversationParticipant.create({
      data: { conversationId: conversations[1].id, userId: users[4].id, role: 'member' },
    }),
  ]);

  console.log('✅ Created conversations');

  // Create messages
  await Promise.all([
    prisma.message.create({
      data: {
        content: 'Sadia apu, payment gateway এর security features নিয়ে discuss করতে চাই। API encryption কেমন implement করেছেন?',
        senderId: users[0].id,
        receiverId: users[3].id,
        conversationId: conversations[0].id,
        type: 'TEXT',
      },
    }),
    prisma.message.create({
      data: {
        content: 'Welcome to TechBD team chat! এখানে আমরা project updates, ideas share করবো। সবাই active থাকবেন please 😊',
        senderId: users[3].id,
        conversationId: conversations[1].id,
        type: 'TEXT',
      },
    }),
  ]);

  console.log('✅ Created messages');

  // Create notifications
  await Promise.all([
    prisma.notification.create({
      data: {
        type: 'CONNECTION_REQUEST',
        title: 'নতুন কানেকশন অনুরোধ',
        message: 'নাজমুল হাসান আপনাকে কানেকশন অনুরোধ পাঠিয়েছেন',
        userId: users[3].id,
        data: { senderId: users[2].id },
        priority: 'normal',
        category: 'social',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'TEAM_MILESTONE_COMPLETED',
        title: 'মাইলস্টোন সম্পন্ন',
        message: 'bKash API Integration মাইলস্টোন সম্পন্ন হয়েছে!',
        userId: users[0].id,
        data: { milestoneId: milestones[0].id, teamId: teams[0].id },
        priority: 'high',
        category: 'team',
      },
    }),
    prisma.notification.create({
      data: {
        type: 'POST_REACTION',
        title: 'পোস্টে রিয়েকশন',
        message: 'রফিউল ইসলাম আপনার পোস্টে celebrate রিয়েকশন দিয়েছেন',
        userId: users[3].id,
        data: { postId: posts[0].id, reactorId: users[0].id },
        priority: 'low',
        category: 'social',
      },
    }),
  ]);

  console.log('✅ Created notifications');

  // Create AI recommendations
  await Promise.all([
    prisma.aIRecommendation.create({
      data: {
        type: 'USER',
        userId: users[0].id,
        targetId: users[7].id,
        score: 0.85,
        reason: 'Both interested in IoT and agricultural technology',
        metadata: { commonInterests: ['IoT', 'Agriculture'], location: 'Bangladesh' },
      },
    }),
    prisma.aIRecommendation.create({
      data: {
        type: 'TEAM',
        userId: users[6].id,
        targetId: teams[1].id,
        score: 0.92,
        reason: 'Strong match for blockchain expertise in open source team',
        metadata: { skillMatch: ['Blockchain', 'Open Source'] },
      },
    }),
  ]);

  console.log('✅ Created AI recommendations');

  console.log('🎉 Seeding completed successfully!');
  console.log('📊 Summary:');
  console.log(`   • ${users.length} users created`);
  console.log(`   • ${teams.length} teams created`);
  console.log(`   • ${projects.length} projects created`);
  console.log(`   • ${posts.length} posts created`);
  console.log('   • Multiple connections, follows, and interactions created');
  console.log('   • All data is Bangladesh-specific with Bengali content');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });