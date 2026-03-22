export interface Article {
  id: number;
  title: string;
  url: string;
  description?: string | null;
  content?: string | null;
  author?: string | null;
  image_url?: string | null;
  source?: string | null;
  published_at?: string | null;
  topics?: string | null;
  view_count?: number;
}

export interface User {
  id: number;
  email: string;
  username?: string | null;
  is_active: boolean;
  is_verified: boolean;
  avatar_url?: string | null;
  preferred_topics?: string | null;
  language: string;
  created_at: string;
  last_login_at?: string | null;
}

export interface SavedArticle {
  id: number;
  user_id: number;
  article_id: number;
  article: Article;
  saved_at: string;
}

export interface UserStats {
  is_personalized: boolean;
}

export type InteractionType = 'like' | 'dislike' | 'view';

export interface LoginResponse {
  access_token: string;
  user: User;
}
