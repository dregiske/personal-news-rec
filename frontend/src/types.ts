export interface Article {
  id: number;
  title: string;
  url: string;
  source?: string;
  content?: string;
  published_at?: string;
}

export interface User {
  id: number;
  email: string;
}

export interface UserStats {
  is_personalized: boolean;
}

export type InteractionType = 'like' | 'dislike' | 'view';

export interface LoginResponse {
  access_token: string;
  user: User;
}
