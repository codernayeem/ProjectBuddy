import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import config from '../config';
import { JwtTokenPayload } from '../types';

export const hashPassword = async (password: string): Promise<string> => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

export const comparePassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

export const generateAccessToken = (payload: Omit<JwtTokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload as any, config.jwt.secret, {
    expiresIn: config.jwt.expiresIn,
  } as any);
};

export const generateRefreshToken = (payload: Omit<JwtTokenPayload, 'iat' | 'exp'>): string => {
  return jwt.sign(payload as any, config.jwt.refreshSecret, {
    expiresIn: config.jwt.refreshExpiresIn,
  } as any);
};

export const verifyAccessToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, config.jwt.secret) as JwtTokenPayload;
};

export const verifyRefreshToken = (token: string): JwtTokenPayload => {
  return jwt.verify(token, config.jwt.refreshSecret) as JwtTokenPayload;
};

export const extractTokenFromHeader = (authHeader: string | undefined): string | null => {
  if (!authHeader) return null;
  
  const parts = authHeader.split(' ');
  if (parts.length !== 2 || parts[0] !== 'Bearer') return null;
  
  return parts[1] || null;
};