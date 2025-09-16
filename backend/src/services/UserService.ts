import { User } from '@prisma/client';
import { UserRepository } from '../repositories/UserRepository';
import { hashPassword, comparePassword, generateAccessToken, generateRefreshToken } from '../utils/auth';
import { generateUsername } from '../utils/helpers';
import { PaginationParams, SearchParams } from '../types';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async register(userData: {
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    password: string;
    bio?: string;
    userType?: string;
    preferredRole?: string;
    experienceLevel?: string;
    skills?: string[];
    interests?: string[];
    location?: string;
    linkedin?: string;
    github?: string;
    portfolio?: string;
  }): Promise<{ user: Omit<User, 'passwordHash' | 'refreshToken'>; tokens: { accessToken: string; refreshToken: string } }> {
    // Check if email already exists
    const existingEmail = await this.userRepository.findByEmail(userData.email);
    if (existingEmail) {
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const existingUsername = await this.userRepository.findByUsername(userData.username);
    if (existingUsername) {
      throw new Error('Username already taken');
    }

    // Hash password
    const passwordHash = await hashPassword(userData.password);

    // Create user
    const user = await this.userRepository.create({
      email: userData.email,
      username: userData.username,
      firstName: userData.firstName,
      lastName: userData.lastName,
      bio: userData.bio,
      userType: userData.userType as any,
      preferredRole: userData.preferredRole as any,
      experienceLevel: userData.experienceLevel as any,
      skills: userData.skills || [],
      interests: userData.interests || [],
      location: userData.location,
      linkedin: userData.linkedin,
      github: userData.github,
      portfolio: userData.portfolio,
      passwordHash,
    });

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token
    await this.userRepository.updateRefreshToken(user.id, refreshToken);

    // Remove sensitive data
    const { passwordHash: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: userWithoutSensitiveData,
      tokens: { accessToken, refreshToken },
    };
  }

  async login(email: string, password: string): Promise<{ user: Omit<User, 'passwordHash' | 'refreshToken'>; tokens: { accessToken: string; refreshToken: string } }> {
    // Find user by email
    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    // Check password
    const isValidPassword = await comparePassword(password, user.passwordHash);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    // Generate tokens
    const tokenPayload = {
      id: user.id,
      email: user.email,
      username: user.username,
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Save refresh token and update last login
    await Promise.all([
      this.userRepository.updateRefreshToken(user.id, refreshToken),
      this.userRepository.updateLastLogin(user.id),
    ]);

    // Remove sensitive data
    const { passwordHash: _, refreshToken: __, ...userWithoutSensitiveData } = user;

    return {
      user: userWithoutSensitiveData,
      tokens: { accessToken, refreshToken },
    };
  }

  async logout(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async getUserById(id: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'> | null> {
    const user = await this.userRepository.findById(id);
    if (!user) return null;

    const { passwordHash: _, refreshToken: __, ...userWithoutSensitiveData } = user;
    return userWithoutSensitiveData;
  }

  async updateUser(
    id: string,
    updateData: {
      firstName?: string;
      lastName?: string;
      bio?: string;
      username?: string;
    }
  ): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    // Check if username is being updated and is available
    if (updateData.username) {
      const isAvailable = await this.userRepository.isUsernameAvailable(updateData.username, id);
      if (!isAvailable) {
        throw new Error('Username already taken');
      }
    }

    const updatedUser = await this.userRepository.update(id, updateData);
    const { passwordHash: _, refreshToken: __, ...userWithoutSensitiveData } = updatedUser;
    
    return userWithoutSensitiveData;
  }

  async updateAvatar(id: string, avatarUrl: string): Promise<Omit<User, 'passwordHash' | 'refreshToken'>> {
    const updatedUser = await this.userRepository.update(id, { avatar: avatarUrl });
    const { passwordHash: _, refreshToken: __, ...userWithoutSensitiveData } = updatedUser;
    
    return userWithoutSensitiveData;
  }

  async searchUsers(
    params: SearchParams & PaginationParams
  ): Promise<{ users: any[]; total: number }> {
    const result = await this.userRepository.search(params);
    
    return {
      users: result.users.map(user => {
        const { passwordHash: _, refreshToken: __, ...userWithoutSensitiveData } = user as any;
        return userWithoutSensitiveData;
      }),
      total: result.total,
    };
  }

  async deleteUser(id: string): Promise<void> {
    await this.userRepository.delete(id);
  }

  async checkEmailAvailability(email: string, excludeUserId?: string): Promise<boolean> {
    return this.userRepository.isEmailAvailable(email, excludeUserId);
  }

  async checkUsernameAvailability(username: string, excludeUserId?: string): Promise<boolean> {
    return this.userRepository.isUsernameAvailable(username, excludeUserId);
  }
}