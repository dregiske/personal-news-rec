export interface Article {
  id: string;
  title: string;
  url: string;
  source?: string;
  content?: string;
  published_at?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface UserStats {
  is_personalized: boolean;
}

export type InteractionType = 'like' | 'dislike';

export interface LoginResponse {
  access_token: string;
  user: User;
}
