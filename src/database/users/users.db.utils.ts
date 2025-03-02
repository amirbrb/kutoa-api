import {DateTime} from 'luxon';
import crypto from 'crypto';

export function generateToken() {
  return crypto.randomBytes(64).toString('hex');
}

export function generateTokenExpiry() {
  return DateTime.now().plus({years: 1}).toJSDate();
}
