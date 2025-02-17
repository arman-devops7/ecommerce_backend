import jwt from 'jsonwebtoken';
import fs from 'fs';

const privateKEY = fs.readFileSync('./private.key', 'utf8');
const publicKEY = fs.readFileSync('./public.key', 'utf8');
const profile_signOptions = {
  issuer: `LEO`,
  subject: `Profile`,
  audience: `TIMBRE`,
  expiresIn: '9999h',
  algorithm: 'RS256', // RSASSA [ "RS256", "RS384", "RS512" ]
};
export const JWT_signProfile = (profile, profileType) => {
  profile.profileType = profileType;
  console.log(`profile??`, profile);
  const token = jwt.sign(profile, privateKEY, profile_signOptions);
  console.log(`token??`, token);
  return { token, expiresIn: profile_signOptions.expiresIn };
};

export const JWT_verifyProfile = (token) => {
  try {
    const claim = jwt.verify(token, publicKEY, profile_signOptions);
    return claim;
  } catch (err) {
    console.log(`JWT_verifyProfile ERROR`, err.name);
    return;
  }
};
