export const TOPICS = [
  'Technology',
  'Politics',
  'Business',
  'Health',
  'Sports',
  'Entertainment',
  'Science',
  'World',
] as const;

export type Topic = typeof TOPICS[number];
