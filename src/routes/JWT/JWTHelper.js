import jwt from 'jsonwebtoken';
import fs from 'fs';

// Load keys once during module initialization
const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');

const profileSignOptions = {
  issuer: 'arman',
  subject: 'Profile',
  audience: 'TIMBRE',
  expiresIn: '9999h',
  algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
};

// Sign JWT
export const JWT_signProfile = (profile, profileType) => {
  try {
    const payload = { ...profile, profileType };
    const token = jwt.sign(payload, privateKEY, profileSignOptions);
    return { token, expiresIn: profileSignOptions.expiresIn };
  } catch (error) {
    console.error('Error signing JWT:', error.message);
    throw new Error('Failed to generate token');
  }
};

// Verify JWT
export const JWT_verifyProfile = (token) => {
  try {
    return jwt.verify(token, publicKEY, profileSignOptions);
  } catch (error) {
    console.error('JWT verification failed:', error.message);
    return null;
  }
};
