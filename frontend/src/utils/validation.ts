import { USERNAME_CONSECUTIVE_SPECIAL, USERNAME_VALID } from '../constants';

export function sanitizeUsername(raw: string): string {
  return raw.toLowerCase().replace(/[^a-z0-9_-]/g, '');
}

export function validateUsername(value: string): string | null {
  if (value.length === 0) return null; // optional field — blank is fine
  if (value.length < 3) return 'Username must be at least 3 characters';
  if (value.length > 32) return 'Username must be 32 characters or fewer';
  if (USERNAME_CONSECUTIVE_SPECIAL.test(value)) return 'No consecutive underscores or hyphens';
  if (!USERNAME_VALID.test(value)) return 'Must start and end with a letter or number';
  return null;
}
