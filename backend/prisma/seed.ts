import { PrismaClient, UserType, ConnectionStatus, TeamType, PostType, ReactionType, NotificationType } from '@prisma/client';
import * as bcrypt from 'bcryptjs';
import { v2 as cloudinary } from 'cloudinary';
import * as path from 'path';
import * as fs from 'fs';
import config from '../src/config';

const prisma = new PrismaClient();

// Configure Cloudinary
cloudinary.config({
  cloud_name: config.cloudinary.cloudName,
  api_key: config.cloudinary.apiKey,
  api_secret: config.cloudinary.apiSecret,
});

// Helper function to upload image to Cloudinary
const uploadToCloudinary = async (localPath: string, folder: string): Promise<string> => {
  try {
    const absolutePath = path.resolve(localPath);
    
    if (!fs.existsSync(absolutePath)) {
      console.warn(`⚠️  File not found: ${absolutePath}, using placeholder`);
      return `https://ui-avatars.com/api/?name=${folder}&background=random`;
    }

    const result = await cloudinary.uploader.upload(absolutePath, {
      folder: `project-buddy/${folder}`,
      transformation: [
        { width: 800, height: 800, crop: 'limit' },
        { quality: 'auto', fetch_format: 'auto' }
      ]
    });

    console.log(`✅ Uploaded ${path.basename(localPath)} to Cloudinary`);
    return result.secure_url;
  } catch (error) {
    console.error(`❌ Error uploading ${localPath}:`, error);
    return `https://ui-avatars.com/api/?name=${folder}&background=random`;
  }
};

// Helper functions
const getRandomItems = <T>(array: T[], count: number): T[] => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

// Extract hashtags from content
const extractHashtags = (content: string): string[] => {
  const hashtagRegex = /#[\w]+/g;
  const matches = content.match(hashtagRegex);
  if (!matches) return [];
  // Remove # symbol and return unique hashtags
  return [...new Set(matches.map(tag => tag.substring(1)))];
};

// Generate random hashtags based on content type
const generateHashtags = (content: string): string[] => {
  const techTags = ['JavaScript', 'TypeScript', 'React', 'Node', 'Python', 'AI', 'ML', 'WebDev', 'DevOps', 'Cloud'];
  const generalTags = ['Tech', 'Coding', 'Programming', 'Software', 'Development', 'Innovation', 'TeamWork', 'Collaboration'];
  
  const extracted = extractHashtags(content);
  if (extracted.length > 0) return extracted;
  
  // Generate 2-3 random tags if no hashtags in content
  const numTags = Math.floor(Math.random() * 2) + 2;
  const allTags = [...techTags, ...generalTags];
  return getRandomItems(allTags, numTags);
};


// Data arrays
const bangladeshiUniversities = [
  'Bangladesh University of Engineering and Technology (BUET)',
  'University of Dhaka (DU)',
  'North South University (NSU)',
  'BRAC University',
  'Independent University, Bangladesh (IUB)',
  'East West University (EWU)',
  'Ahsanullah University of Science and Technology (AUST)',
  'Daffodil International University (DIU)',
  'American International University-Bangladesh (AIUB)',
  'United International University (UIU)',
  'University of Chittagong (CU)',
  'Chittagong University of Engineering & Technology (CUET)',
  'Khulna University of Engineering & Technology (KUET)',
  'Rajshahi University of Engineering & Technology (RUET)',
  'Islamic University of Technology (IUT)'
];

const bangladeshiCities = [
  'Dhaka', 'Chittagong', 'Sylhet', 'Rajshahi', 'Khulna', 'Barisal', 'Rangpur', 'Mymensingh'
];

const skills = [
  'JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'Next.js', 'Vue.js', 'Angular',
  'Django', 'Flask', 'FastAPI', 'Express', 'NestJS', 'GraphQL', 'REST API',
  'MongoDB', 'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'Azure', 'GCP',
  'Machine Learning', 'Deep Learning', 'TensorFlow', 'PyTorch', 'Data Science',
  'Flutter', 'React Native', 'Kotlin', 'Swift', 'Android', 'iOS',
  'Blockchain', 'Solidity', 'Ethereum', 'Web3', 'Smart Contracts',
  'Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Network Security',
  'Unity', 'Unreal Engine', 'Game Development', '3D Modeling',
  'UI/UX Design', 'Figma', 'Adobe XD', 'Sketch', 'Photoshop', 'Illustrator',
  'Git', 'CI/CD', 'DevOps', 'Linux', 'Bash', 'Testing', 'Agile', 'Scrum'
];

const profileImages = [
  '../demo_img/profile/1fd2f552fd263b8ba40a80f5c9097ee1.webp',
  '../demo_img/profile/cut-up-33.webp',
  '../demo_img/profile/image-2019-02-17_212949.webp',
  '../demo_img/profile/person-indian-origin-having-fun_23-2150285283.webp',
  '../demo_img/profile/photo-1522556189639-b150ed9c4330.webp',
  '../demo_img/profile/premium_photo-1669703777437-27602d656c27.webp',
  '../demo_img/profile/premium_photo-1688891564708-9b2247085923.webp',
  '../demo_img/profile/summer-selfie.webp'
];

const bannerImages = [
  '../demo_img/banner/360_F_65947842_Q429oMgnuUoySIdWATs4XUXkGzfprRj7.webp',
  '../demo_img/banner/big-tech-media.webp',
  '../demo_img/banner/business-colleagues-discussing-project-in-office.webp',
  '../demo_img/banner/business-people-at-a-conference-event.webp',
  '../demo_img/banner/close-up-of-co-workers-standing-at-desk-with-laptop-and-talking.webp',
  '../demo_img/banner/diverse-colleagues-working-together-on-digital-tablet.webp',
  '../demo_img/banner/dsc05880-enhanced-nr-copy.webp',
  '../demo_img/banner/education-study-books-high-school-university-16383080.webp',
  '../demo_img/banner/EM-BLOG-2019-tech-conferences-957689842.webp',
  '../demo_img/banner/good-health-best-wealth-card-stethoscope-red-heart-wood-table-medical-concept-72050180.webp',
  '../demo_img/banner/health-care-billing-statement.webp',
  '../demo_img/banner/health-png-diverse-hands-wellness-remix-transparent-background_53876-992471.webp',
  '../demo_img/banner/heart-doctor-concept.webp',
  '../demo_img/banner/hospital-colleagues-checking-medical-records-database.webp',
  '../demo_img/banner/illustration-healthy-lifestyle_53876-28533.webp',
  '../demo_img/banner/image.webp',
  '../demo_img/banner/pexels-photo-301920.webp',
  '../demo_img/banner/prescription-good-health-diet-exercise-flat-lay-overhead-prescription-good-health-overhead-stethoscope-healthy-145613048.webp',
  '../demo_img/banner/prescription-good-health-overhead-stethoscope-healthy-fresh-food-exercise-equipment-prescription-good-health-diet-145612862.webp',
  '../demo_img/banner/seminar-coding-talking.webp',
  '../demo_img/banner/showing-smartphone-during-conference.webp',
  '../demo_img/banner/special-education-phrase-chalkboard-next-to-three-books-apple-63191907.webp',
  '../demo_img/banner/stethoscope-word-health_1134-455.webp'
];

// User profiles data
const usersData = [
  {
    username: 'rafiul_ahmed',
    firstName: 'Rafiul',
    lastName: 'Ahmed',
    email: 'rafiul@example.com',
    bio: 'Full-stack developer from Dhaka, passionate about building scalable web applications. Love to explore new technologies.',
    userType: UserType.UNDERGRADUATE,
    university: bangladeshiUniversities[0],
    city: bangladeshiCities[0],
    skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'MongoDB', 'Docker'],
    interests: ['Web Development', 'Cloud Computing', 'Open Source']
  },
  {
    username: 'tasnim_khan',
    firstName: 'Tasnim',
    lastName: 'Khan',
    email: 'tasnim@example.com',
    bio: 'আমি একজন AI researcher। Machine Learning এবং Deep Learning নিয়ে কাজ করি। BUET থেকে পড়াশোনা করছি।',
    userType: UserType.GRADUATE,
    university: bangladeshiUniversities[0],
    city: bangladeshiCities[0],
    skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning', 'Data Science'],
    interests: ['Artificial Intelligence', 'Research', 'Data Science']
  },
  {
    username: 'sabbir_hossain',
    firstName: 'Sabbir',
    lastName: 'Hossain',
    email: 'sabbir@example.com',
    bio: 'Mobile app developer specializing in Flutter and React Native. Building cross-platform apps for startups.',
    userType: UserType.PROFESSIONAL,
    university: bangladeshiUniversities[2],
    city: bangladeshiCities[0],
    skills: ['Flutter', 'React Native', 'Dart', 'JavaScript', 'Firebase', 'Android', 'iOS'],
    interests: ['Mobile Development', 'UI/UX', 'Startups']
  },
  {
    username: 'nusrat_jahan',
    firstName: 'Nusrat',
    lastName: 'Jahan',
    email: 'nusrat@example.com',
    bio: 'UI/UX ডিজাইনার এবং ফ্রন্টএন্ড ডেভেলপার। সুন্দর এবং user-friendly ইন্টারফেস তৈরি করতে ভালোবাসি।',
    userType: UserType.FREELANCER,
    university: bangladeshiUniversities[3],
    city: bangladeshiCities[0],
    skills: ['Figma', 'Adobe XD', 'React', 'Vue.js', 'CSS', 'Tailwind CSS', 'UI/UX Design'],
    interests: ['Design', 'Frontend', 'User Experience']
  },
  {
    username: 'mehedi_hasan',
    firstName: 'Mehedi',
    lastName: 'Hasan',
    email: 'mehedi@example.com',
    bio: 'Backend engineer with expertise in Node.js and Python. Building microservices and APIs.',
    userType: UserType.PROFESSIONAL,
    university: bangladeshiUniversities[1],
    city: bangladeshiCities[1],
    skills: ['Node.js', 'Python', 'Express', 'Django', 'PostgreSQL', 'MongoDB', 'Redis', 'Docker'],
    interests: ['Backend Development', 'Microservices', 'Databases']
  },
  {
    username: 'farhana_islam',
    firstName: 'Farhana',
    lastName: 'Islam',
    email: 'farhana@example.com',
    bio: 'Cybersecurity enthusiast। Ethical hacking এবং penetration testing নিয়ে কাজ করি। শিক্ষার্থীদের সাইবার সিকিউরিটি শেখাই।',
    userType: UserType.GRADUATE,
    university: bangladeshiUniversities[11],
    city: bangladeshiCities[1],
    skills: ['Cybersecurity', 'Penetration Testing', 'Ethical Hacking', 'Network Security', 'Linux', 'Python'],
    interests: ['Security', 'Networking', 'Teaching']
  },
  {
    username: 'tanvir_rahman',
    firstName: 'Tanvir',
    lastName: 'Rahman',
    email: 'tanvir@example.com',
    bio: 'Blockchain developer working on decentralized applications. Smart contract development with Solidity.',
    userType: UserType.STARTUP_FOUNDER,
    university: bangladeshiUniversities[4],
    city: bangladeshiCities[0],
    skills: ['Blockchain', 'Solidity', 'Ethereum', 'Web3', 'Smart Contracts', 'JavaScript', 'React'],
    interests: ['Blockchain', 'DeFi', 'Cryptocurrency']
  },
  {
    username: 'lamia_akter',
    firstName: 'Lamia',
    lastName: 'Akter',
    email: 'lamia@example.com',
    bio: 'Data scientist এবং ML engineer। বড় ডেটাসেট নিয়ে কাজ করি এবং predictive models তৈরি করি।',
    userType: UserType.PROFESSIONAL,
    university: bangladeshiUniversities[2],
    city: bangladeshiCities[2],
    skills: ['Python', 'Data Science', 'Machine Learning', 'Pandas', 'NumPy', 'Scikit-learn', 'SQL'],
    interests: ['Data Analysis', 'Statistics', 'Visualization']
  },
  {
    username: 'ashraful_alam',
    firstName: 'Ashraful',
    lastName: 'Alam',
    email: 'ashraful@example.com',
    bio: 'DevOps engineer automating deployments and managing cloud infrastructure. AWS and Kubernetes expert.',
    userType: UserType.PROFESSIONAL,
    university: bangladeshiUniversities[6],
    city: bangladeshiCities[0],
    skills: ['DevOps', 'Docker', 'Kubernetes', 'AWS', 'CI/CD', 'Linux', 'Terraform', 'Git'],
    interests: ['Cloud Computing', 'Automation', 'Infrastructure']
  },
  {
    username: 'shahriar_kabir',
    firstName: 'Shahriar',
    lastName: 'Kabir',
    email: 'shahriar@example.com',
    bio: 'Game developer making indie games। Unity এবং Unreal Engine দিয়ে 2D এবং 3D গেম বানাই।',
    userType: UserType.UNDERGRADUATE,
    university: bangladeshiUniversities[7],
    city: bangladeshiCities[0],
    skills: ['Unity', 'C#', 'Unreal Engine', 'Game Development', '3D Modeling', 'Blender'],
    interests: ['Gaming', '3D Graphics', 'Animation']
  },
  {
    username: 'nabila_tahsin',
    firstName: 'Nabila',
    lastName: 'Tahsin',
    email: 'nabila@example.com',
    bio: 'Full-stack developer and tech blogger. Love sharing knowledge through writing and teaching.',
    userType: UserType.FREELANCER,
    university: bangladeshiUniversities[5],
    city: bangladeshiCities[0],
    skills: ['JavaScript', 'React', 'Next.js', 'Node.js', 'MongoDB', 'GraphQL', 'TypeScript'],
    interests: ['Web Development', 'Blogging', 'Teaching']
  },
  {
    username: 'imran_hossain',
    firstName: 'Imran',
    lastName: 'Hossain',
    email: 'imran@example.com',
    bio: 'Android developer building native apps। Kotlin এবং Java দিয়ে performance-optimized অ্যাপ তৈরি করি।',
    userType: UserType.PROFESSIONAL,
    university: bangladeshiUniversities[8],
    city: bangladeshiCities[3],
    skills: ['Kotlin', 'Java', 'Android', 'Android Studio', 'Firebase', 'REST API'],
    interests: ['Mobile Apps', 'Android', 'Performance']
  },
  {
    username: 'sumaiya_rahman',
    firstName: 'Sumaiya',
    lastName: 'Rahman',
    email: 'sumaiya@example.com',
    bio: 'Cloud architect designing scalable solutions on AWS and Azure. Certified solutions architect.',
    userType: UserType.PROFESSIONAL,
    university: bangladeshiUniversities[9],
    city: bangladeshiCities[0],
    skills: ['AWS', 'Azure', 'Cloud Architecture', 'Serverless', 'Lambda', 'Microservices', 'Docker'],
    interests: ['Cloud', 'Architecture', 'Scalability']
  },
  {
    username: 'rakib_uddin',
    firstName: 'Rakib',
    lastName: 'Uddin',
    email: 'rakib@example.com',
    bio: 'FinTech developer। Payment systems এবং financial applications নিয়ে কাজ করি। Security এবং compliance খুবই গুরুত্বপূর্ণ।',
    userType: UserType.STARTUP_FOUNDER,
    university: bangladeshiUniversities[10],
    city: bangladeshiCities[1],
    skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Redis', 'Security', 'Payment Gateways', 'REST API'],
    interests: ['FinTech', 'Security', 'Startups']
  },
  {
    username: 'bristy_ahmed',
    firstName: 'Bristy',
    lastName: 'Ahmed',
    email: 'bristy@example.com',
    bio: 'IoT developer working on smart devices. Building connected systems with Arduino and Raspberry Pi.',
    userType: UserType.UNDERGRADUATE,
    university: bangladeshiUniversities[12],
    city: bangladeshiCities[4],
    skills: ['IoT', 'Arduino', 'Raspberry Pi', 'Python', 'C++', 'MQTT', 'Sensors'],
    interests: ['IoT', 'Embedded Systems', 'Automation']
  }
];

// Post content templates
const postContents = [
  'Just deployed my new portfolio website built with Next.js and Tailwind CSS! 🚀 Check it out and let me know what you think!',
  'নতুন একটা প্রজেক্ট শুরু করলাম - একটা e-commerce platform যেখানে local businesses তাদের পণ্য বিক্রি করতে পারবে। কেউ collaborate করতে চাও?',
  'Excited to share that I completed the AWS Solutions Architect certification! 🎉 It was challenging but worth every minute.',
  'Machine Learning model training করছি lung cancer detection এর জন্য। Accuracy 94% পর্যন্ত পৌঁছেছে! 📊',
  'Looking for beta testers for my new mobile app - a task manager specifically designed for students. DM if interested!',
  'আমার প্রথম open source contribution merge হয়েছে React codebase এ! 🎊 Small step but feels amazing!',
  'Just finished a 48-hour hackathon. Our team built a chatbot for mental health support using GPT-4. Won 2nd place! 💪',
  'Blockchain technology নিয়ে workshop conduct করব next week NSU তে। Anyone interested can register from the link in comments.',
  'Debugging a performance issue in my Node.js API. Any tips on optimizing database queries? PostgreSQL is taking too long.',
  'UI/UX designers! What is your favorite prototyping tool? I have been using Figma but curious about alternatives.',
  'Successfully migrated our entire infrastructure to Kubernetes. Deployment time reduced from 30 mins to 2 mins! ⚡',
  'Cybersecurity awareness is so important! Just created a series of tutorials on basic web security. Link in bio.',
  'Game development progress update: Character animations are done, working on enemy AI now. Unity is so powerful! 🎮',
  'Data visualization নিয়ে কাজ করছি Python দিয়ে। D3.js এর alternative হিসেবে Plotly অসাধারণ!',
  'First day at my new job as a Software Engineer! Excited and nervous at the same time. Any advice for freshers?',
  'Docker container optimization করে image size 80% কমিয়ে ফেললাম! Multi-stage builds really work.',
  'Teaching a free programming workshop for underprivileged students this weekend. Education should be accessible to all! 💙'
];

// Comment templates
const commentTexts = [
  'Awesome work! 🔥',
  'খুব ভালো হয়েছে! Keep it up!',
  'Can you share the GitHub repo?',
  'This is exactly what I needed!',
  'Great job! When will this be available?',
  'আমিও এই নিয়ে কাজ করছি। Collaborate করতে পারি?',
  'Impressive! How long did it take?',
  'Love the design! Very clean.',
  'Thanks for sharing this!',
  'Congratulations! 🎉',
  'এটা আমার জন্য খুবই helpful।',
  'Would love to know more about this.',
  'Amazing work as always!',
  'Count me in!',
  'This is brilliant!',
  'দারুণ initiative!',
  'Very informative, thanks!',
  'Looking forward to this!',
  'Great explanation!',
  'This helped me a lot!'
];

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data
  console.log('🗑️  Clearing existing data...');
  await prisma.$transaction([
    prisma.notification.deleteMany(),
    prisma.message.deleteMany(),
    prisma.conversationParticipant.deleteMany(),
    prisma.conversation.deleteMany(),
    prisma.commentReaction.deleteMany(),
    prisma.comment.deleteMany(),
    prisma.reaction.deleteMany(),
    prisma.bookmark.deleteMany(),
    prisma.share.deleteMany(),
    prisma.mention.deleteMany(),
    prisma.post.deleteMany(),
    prisma.teamMilestone.deleteMany(),
    prisma.teamProject.deleteMany(),
    prisma.teamFollow.deleteMany(),
    prisma.teamMember.deleteMany(),
    prisma.teamAchievement.deleteMany(),
    prisma.team.deleteMany(),
    prisma.follow.deleteMany(),
    prisma.connection.deleteMany(),
    prisma.userUniversity.deleteMany(),
    prisma.user.deleteMany(),
  ]);

  // Hash password
  const hashedPassword = await bcrypt.hash('password123', 12);

  // Upload images to Cloudinary
  console.log('📤 Uploading images to Cloudinary...');
  const uploadedProfileImages: string[] = [];
  const uploadedBannerImages: string[] = [];

  for (const img of profileImages) {
    const url = await uploadToCloudinary(img, 'profiles');
    uploadedProfileImages.push(url);
  }

  for (const img of bannerImages) {
    const url = await uploadToCloudinary(img, 'banners');
    uploadedBannerImages.push(url);
  }

  console.log(`✅ Uploaded ${uploadedProfileImages.length} profile images and ${uploadedBannerImages.length} banner images`);

  // Create users
  console.log('👤 Creating users...');
  const users = [];
  for (const userData of usersData) {
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        passwordHash: hashedPassword,
        bio: userData.bio,
        avatar: getRandomItem(uploadedProfileImages),
        banner: getRandomItem(uploadedBannerImages),
        city: userData.city,
        country: 'Bangladesh',
        userType: userData.userType,
        skills: userData.skills,
        interests: userData.interests,
        isActive: true,
      },
    });

    // Add university
    await prisma.userUniversity.create({
      data: {
        userId: user.id,
        universityName: userData.university,
        status: 'CURRENT',
        startYear: 2019,
      },
    });

    users.push(user);
  }
  console.log(`✅ Created ${users.length} users`);

  // Create connections
  console.log('🤝 Creating connections...');
  let connectionCount = 0;
  for (let i = 0; i < users.length; i++) {
    const numConnections = Math.floor(Math.random() * 5) + 3; // 3-7 connections
    const potentialConnections = users.filter((_, index) => index !== i);
    const selectedConnections = getRandomItems(potentialConnections, Math.min(numConnections, potentialConnections.length));

    for (const connection of selectedConnections) {
      // Check if connection already exists
      const existing = await prisma.connection.findFirst({
        where: {
          OR: [
            { senderId: users[i].id, receiverId: connection.id },
            { senderId: connection.id, receiverId: users[i].id },
          ],
        },
      });

      if (!existing) {
          await prisma.connection.create({
          data: {
            senderId: users[i].id,
            receiverId: connection.id,
            status: Math.random() > 0.3 ? ConnectionStatus.ACCEPTED : ConnectionStatus.PENDING,
            message: 'I would like to connect with you!',
          },
        });
        connectionCount++;
      }
    }
  }
  console.log(`✅ Created ${connectionCount} connections`);

  // Create teams
  console.log('👥 Creating teams...');
  const teamsData = [
    {
      name: 'AI Research Lab Bangladesh',
      description: 'আমরা একটি research team যারা Machine Learning এবং Artificial Intelligence নিয়ে কাজ করি। আমাদের focus: computer vision, NLP, এবং deep learning applications।',
      shortDescription: 'AI এবং ML research এবং development',
      type: TeamType.SKILL_BASED,
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Machine Learning', 'Deep Learning'],
      tags: ['AI', 'Research', 'ML', 'Deep Learning'],
      ownerIndex: 1, // Tasnim
      memberIndices: [0, 7, 14]
    },
    {
      name: 'Bangladesh Web Developers',
      description: 'Modern web technologies নিয়ে কাজ করা developers এর community। React, Next.js, Node.js - সব নিয়ে discuss করি এবং projects build করি together।',
      shortDescription: 'Full-stack web development community',
      type: TeamType.OPEN_SOURCE,
      skills: ['React', 'Next.js', 'Node.js', 'TypeScript', 'MongoDB'],
      tags: ['Web', 'React', 'Fullstack', 'JavaScript'],
      ownerIndex: 0, // Rafiul
      memberIndices: [3, 10, 4]
    },
    {
      name: 'FinTech Bangladesh',
      description: 'Building the future of financial technology in Bangladesh. Digital payments, mobile banking, blockchain-based solutions.',
      shortDescription: 'Financial technology innovation',
      type: TeamType.STARTUP,
      skills: ['Node.js', 'TypeScript', 'PostgreSQL', 'Blockchain', 'Security'],
      tags: ['FinTech', 'Payments', 'Blockchain', 'Startup'],
      ownerIndex: 13, // Rakib
      memberIndices: [6, 12, 8]
    },
    {
      name: 'Mobile App Masters',
      description: 'Cross-platform এবং native mobile app development। Flutter, React Native, Android, iOS - সব platform এর developers এখানে।',
      shortDescription: 'Mobile development hub',
      type: TeamType.SKILL_BASED,
      skills: ['Flutter', 'React Native', 'Android', 'iOS', 'Firebase'],
      tags: ['Mobile', 'Flutter', 'Android', 'iOS'],
      ownerIndex: 2, // Sabbir
      memberIndices: [11, 9, 3]
    },
    {
      name: 'Cybersecurity BD',
      description: 'Ethical hacking, penetration testing, and security awareness. Protecting systems and teaching security best practices.',
      shortDescription: 'Cybersecurity and ethical hacking',
      type: TeamType.STUDY_GROUP,
      skills: ['Cybersecurity', 'Penetration Testing', 'Network Security', 'Python'],
      tags: ['Security', 'Hacking', 'Network', 'Training'],
      ownerIndex: 5, // Farhana
      memberIndices: [8, 12, 13]
    },
    {
      name: 'Game Dev Bangladesh',
      description: 'Indie game developers এর team। Unity এবং Unreal Engine দিয়ে games বানাচ্ছি। 2D থেকে 3D, সব ধরনের games।',
      shortDescription: 'Game development collective',
      type: TeamType.HACKATHON,
      skills: ['Unity', 'Unreal Engine', 'C#', 'Game Development', '3D Modeling'],
      tags: ['Gaming', 'Unity', 'GameDev', 'Indie'],
      ownerIndex: 9, // Shahriar
      memberIndices: [14, 7, 2]
    },
    {
      name: 'Data Science Dhaka',
      description: 'Data analysis, visualization, and machine learning applications. Working on real-world datasets and building predictive models.',
      shortDescription: 'Data science and analytics',
      type: TeamType.SKILL_BASED,
      skills: ['Python', 'Data Science', 'Pandas', 'Scikit-learn', 'SQL'],
      tags: ['Data', 'Analytics', 'ML', 'Visualization'],
      ownerIndex: 7, // Lamia
      memberIndices: [1, 12, 4]
    },
    {
      name: 'Blockchain Bangladesh',
      description: 'Decentralized applications, smart contracts, DeFi projects। Web3 revolution এ Bangladesh কে নিয়ে যাচ্ছি।',
      shortDescription: 'Blockchain and Web3 development',
      type: TeamType.STARTUP,
      skills: ['Blockchain', 'Solidity', 'Web3', 'Smart Contracts', 'React'],
      tags: ['Blockchain', 'Web3', 'DeFi', 'Crypto'],
      ownerIndex: 6, // Tanvir
      memberIndices: [13, 0, 10]
    }
  ];

  const teams = [];
  for (const teamData of teamsData) {
    const team = await prisma.team.create({
      data: {
        name: teamData.name,
        description: teamData.description,
        shortDescription: teamData.shortDescription,
        visibility: 'PUBLIC',
        type: teamData.type,
        avatar: getRandomItem(uploadedProfileImages),
        banner: getRandomItem(uploadedBannerImages),
        skills: teamData.skills,
        tags: teamData.tags,
        country: 'Bangladesh',
        city: 'Dhaka',
        isRecruiting: true,
        allowJoinRequests: true,
        ownerId: users[teamData.ownerIndex].id,
      },
    });

    // Create custom roles based on team type
    const roleNames = 
      teamData.type === TeamType.SKILL_BASED || teamData.type === TeamType.OPEN_SOURCE
        ? ['Frontend Developer', 'Backend Developer', 'UI/UX Designer', 'Tester']
        : teamData.type === TeamType.STARTUP
        ? ['CTO', 'Lead Developer', 'Product Manager', 'Developer']
        : teamData.type === TeamType.HACKATHON
        ? ['Team Lead', 'Developer', 'Designer', 'Presenter']
        : ['Coordinator', 'Member', 'Contributor'];

    const customRoles = [];
    for (const roleName of roleNames) {
      const role = await prisma.teamCustomRole.create({
        data: {
          teamId: team.id,
          name: roleName,
          description: `${roleName} role for ${team.name}`,
          color: getRandomItem(['#3B82F6', '#8B5CF6', '#10B981', '#F59E0B', '#EF4444']),
          isAdmin: roleName.includes('Lead') || roleName.includes('CTO') || roleName.includes('Manager'),
        },
      });
      customRoles.push(role);
    }

    // Add owner as admin
    const ownerMember = await prisma.teamMember.create({
      data: {
        teamId: team.id,
        userId: users[teamData.ownerIndex].id,
        status: 'ADMIN',
        title: 'Founder',
      },
    });

    // Assign the first admin role to owner
    const adminRole = customRoles.find(r => r.isAdmin) || customRoles[0];
    await prisma.teamMemberCustomRole.create({
      data: {
        teamMemberId: ownerMember.id,
        customRoleId: adminRole.id,
      },
    });

    // Add other members with roles
    for (let i = 0; i < teamData.memberIndices.length; i++) {
      const memberIndex = teamData.memberIndices[i];
      const isModerator = Math.random() > 0.7;
      
      const member = await prisma.teamMember.create({
        data: {
          teamId: team.id,
          userId: users[memberIndex].id,
          status: isModerator ? 'MODERATOR' : 'MEMBER',
        },
      });

      // Assign a random custom role to this member
      const assignedRole = customRoles[i % customRoles.length];
      await prisma.teamMemberCustomRole.create({
        data: {
          teamMemberId: member.id,
          customRoleId: assignedRole.id,
        },
      });
    }

    teams.push(team);
  }
  console.log(`✅ Created ${teams.length} teams with custom roles`);

  // Create team projects
  console.log('📁 Creating team projects...');
  let projectCount = 0;
  for (const team of teams) {
    const numProjects = Math.floor(Math.random() * 2) + 1; // 1-2 projects per team
    for (let i = 0; i < numProjects; i++) {
      const project = await prisma.teamProject.create({
        data: {
          teamId: team.id,
          title: `${team.name.split(' ')[0]} Project ${i + 1}`,
          description: `An exciting project by ${team.name}`,
          status: getRandomItem(['PLANNING', 'ACTIVE', 'COMPLETED']),
          startDate: new Date(2024, 0, 1),
          createdBy: team.ownerId,
        },
      });

      // Add milestones
      await prisma.teamMilestone.createMany({
        data: [
          {
            projectId: project.id,
            teamId: team.id,
            title: 'Planning and Design',
            description: 'Initial planning and design phase',
            status: 'COMPLETED',
            dueDate: new Date(2024, 1, 1),
            createdBy: team.ownerId,
          },
          {
            projectId: project.id,
            teamId: team.id,
            title: 'Development',
            description: 'Core development phase',
            status: 'IN_PROGRESS',
            dueDate: new Date(2024, 6, 1),
            createdBy: team.ownerId,
          },
        ],
      });

      projectCount++;
    }
  }
  console.log(`✅ Created ${projectCount} projects`);

  // Create posts
  console.log('📝 Creating posts...');
  const posts = [];
  
  // User posts
  for (const user of users) {
    const numPosts = Math.floor(Math.random() * 3) + 1; // 1-3 posts per user
    for (let i = 0; i < numPosts; i++) {
      const content = getRandomItem(postContents);
      const post = await prisma.post.create({
        data: {
          authorId: user.id,
          content: content,
          type: PostType.GENERAL,
          visibility: 'public',
          hashtags: generateHashtags(content),
        },
      });
      posts.push(post);
    }
  }

  // Team posts
  for (const team of teams) {
    const members = await prisma.teamMember.findMany({
      where: { teamId: team.id },
    });
    
    const numPosts = Math.floor(Math.random() * 2) + 1; // 1-2 posts per team
    for (let i = 0; i < numPosts; i++) {
      const randomMember = getRandomItem(members);
      const content = `Update from ${team.name}: ` + getRandomItem(postContents);
      const post = await prisma.post.create({
        data: {
          authorId: randomMember.userId,
          teamId: team.id,
          content: content,
          type: PostType.GENERAL,
          visibility: 'public',
          hashtags: generateHashtags(content),
        },
      });
      posts.push(post);
    }
  }
  console.log(`✅ Created ${posts.length} posts`);

  // Create reactions
  console.log('❤️ Creating reactions...');
  let reactionCount = 0;
  for (const post of posts) {
    const numReactions = Math.floor(Math.random() * 8) + 2; // 2-9 reactions per post
    const reactors = getRandomItems(users, Math.min(numReactions, users.length));
    
    for (const reactor of reactors) {
      await prisma.reaction.create({
        data: {
          userId: reactor.id,
          postId: post.id,
          type: getRandomItem([ReactionType.LIKE, ReactionType.LOVE, ReactionType.CELEBRATE, ReactionType.INSIGHTFUL]),
        },
      });
      reactionCount++;
    }
  }
  console.log(`✅ Created ${reactionCount} reactions`);

  // Create comments
  console.log('💬 Creating comments...');
  let commentCount = 0;
  for (const post of posts) {
    const numComments = Math.floor(Math.random() * 5) + 1; // 1-5 comments per post
    const commenters = getRandomItems(users, Math.min(numComments, users.length));
    
    for (const commenter of commenters) {
      const comment = await prisma.comment.create({
        data: {
          authorId: commenter.id,
          postId: post.id,
          content: getRandomItem(commentTexts),
        },
      });
      
      // Some comments have replies
      if (Math.random() > 0.6) {
        const replyAuthors = getRandomItems(users.filter(u => u.id !== commenter.id), Math.min(2, users.length - 1));
        for (const replyAuthor of replyAuthors) {
          await prisma.comment.create({
            data: {
              authorId: replyAuthor.id,
              postId: post.id,
              parentId: comment.id,
              content: getRandomItem(commentTexts),
            },
          });
          commentCount++;
        }
      }
      
      commentCount++;
    }
  }
  console.log(`✅ Created ${commentCount} comments`);

  // Create comment reactions
  console.log('👍 Creating comment reactions...');
  const allComments = await prisma.comment.findMany();
  let commentReactionCount = 0;
  for (const comment of allComments) {
    if (Math.random() > 0.5) { // 50% of comments get reactions
      const numReactions = Math.floor(Math.random() * 3) + 1; // 1-3 reactions
      const reactors = getRandomItems(users, Math.min(numReactions, users.length));
      
      for (const reactor of reactors) {
        await prisma.commentReaction.create({
          data: {
            userId: reactor.id,
            commentId: comment.id,
            type: getRandomItem([ReactionType.LIKE, ReactionType.LOVE, ReactionType.INSIGHTFUL]),
          },
        });
        commentReactionCount++;
      }
    }
  }
  console.log(`✅ Created ${commentReactionCount} comment reactions`);

  // Update all post counts (likes, comments, shares)
  console.log('🔄 Updating post counts...');
  for (const post of posts) {
    const [likesCount, commentsCount, sharesCount] = await Promise.all([
      prisma.reaction.count({ where: { postId: post.id } }),
      prisma.comment.count({ where: { postId: post.id } }),
      prisma.share.count({ where: { postId: post.id } }),
    ]);

    await prisma.post.update({
      where: { id: post.id },
      data: {
        likesCount,
        commentsCount,
        sharesCount,
      },
    });
  }

  // Update all comment counts (likes, replies)
  console.log('🔄 Updating comment counts...');
  for (const comment of allComments) {
    const [likesCount, repliesCount] = await Promise.all([
      prisma.commentReaction.count({ where: { commentId: comment.id } }),
      prisma.comment.count({ where: { parentId: comment.id } }),
    ]);

    await prisma.comment.update({
      where: { id: comment.id },
      data: {
        likesCount,
        repliesCount,
      },
    });
  }
  console.log(`✅ Updated all counts`);

  // Create conversations and messages
  console.log('💬 Creating conversations...');
  let conversationCount = 0;
  let messageCount = 0;
  
  for (let i = 0; i < 10; i++) {
    const [user1, user2] = getRandomItems(users, 2);
    
    const conversation = await prisma.conversation.create({
      data: {
        type: 'DIRECT_MESSAGE',
        createdBy: user1.id,
        isGroup: false,
        lastMessageAt: new Date(),
      },
    });

    // Add participants
    await prisma.conversationParticipant.createMany({
      data: [
        { conversationId: conversation.id, userId: user1.id, isActive: true },
        { conversationId: conversation.id, userId: user2.id, isActive: true },
      ],
    });

    // Add messages
    const numMessages = Math.floor(Math.random() * 6) + 3; // 3-8 messages
    for (let j = 0; j < numMessages; j++) {
      const sender = j % 2 === 0 ? user1 : user2;
      const receiver = j % 2 === 0 ? user2 : user1;
      
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: sender.id,
          receiverId: receiver.id,
          content: getRandomItem(commentTexts),
          type: 'TEXT',
          readBy: [sender.id],
        },
      });
      messageCount++;
    }
    
    conversationCount++;
  }
  console.log(`✅ Created ${conversationCount} conversations with ${messageCount} messages`);

  // Create notifications
  console.log('🔔 Creating notifications...');
  let notificationCount = 0;
  for (const user of users.slice(0, 5)) { // First 5 users get notifications
    await prisma.notification.createMany({
      data: [
        {
          userId: user.id,
          type: NotificationType.CONNECTION_REQUEST,
          title: 'New connection request',
          message: `${users[0].firstName} ${users[0].lastName} wants to connect with you`,
          isRead: false,
        },
        {
          userId: user.id,
          type: NotificationType.POST_REACTION,
          title: 'Someone reacted to your post',
          message: `${users[1].firstName} ${users[1].lastName} reacted to your post`,
          isRead: Math.random() > 0.5,
        },
      ],
    });
    notificationCount += 2;
  }
  console.log(`✅ Created ${notificationCount} notifications`);

  console.log('\n✨ Seeding completed successfully!\n');
  console.log('📊 Summary:');
  console.log(`  Users: ${users.length}`);
  console.log(`  Connections: ${connectionCount}`);
  console.log(`  Teams: ${teams.length}`);
  console.log(`  Projects: ${projectCount}`);
  console.log(`  Posts: ${posts.length}`);
  console.log(`  Reactions: ${reactionCount}`);
  console.log(`  Comments: ${commentCount}`);
  console.log(`  Comment Reactions: ${commentReactionCount}`);
  console.log(`  Conversations: ${conversationCount}`);
  console.log(`  Messages: ${messageCount}`);
  console.log(`  Notifications: ${notificationCount}`);
  console.log('\n🔑 Login credentials:');
  console.log('  Email: rafiul@example.com (or any user email)');
  console.log('  Password: password123\n');
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
