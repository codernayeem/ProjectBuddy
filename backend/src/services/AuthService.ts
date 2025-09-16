import { UserRepository } from '../repositories/UserRepository';
import { generateAccessToken, generateRefreshToken, verifyRefreshToken } from '../utils/auth';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async refreshTokens(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    try {
      // Verify refresh token
      const decoded = verifyRefreshToken(refreshToken);
      
      // Find user and check if refresh token matches
      const user = await this.userRepository.findById(decoded.id);
      if (!user || user.refreshToken !== refreshToken) {
        throw new Error('Invalid refresh token');
      }

      // Generate new tokens
      const tokenPayload = {
        id: user.id,
        email: user.email,
        username: user.username,
      };

      const newAccessToken = generateAccessToken(tokenPayload);
      const newRefreshToken = generateRefreshToken(tokenPayload);

      // Update refresh token in database
      await this.userRepository.updateRefreshToken(user.id, newRefreshToken);

      return {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      throw new Error('Invalid or expired refresh token');
    }
  }

  async revokeRefreshToken(userId: string): Promise<void> {
    await this.userRepository.updateRefreshToken(userId, null);
  }

  async revokeAllRefreshTokens(userId: string): Promise<void> {
    // In this simple implementation, we only store one refresh token per user
    await this.userRepository.updateRefreshToken(userId, null);
  }
}