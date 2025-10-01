// Tipos para a plataforma de treinamentos

export interface User {
  id: string;
  email: string;
  name: string;
  avatar_url?: string;
  account_type: 'basic' | 'premium' | 'full';
  created_at: string;
  updated_at: string;
}

export interface Course {
  id: string;
  title: string;
  description: string;
  thumbnail_url?: string;
  instructor_id: string;
  instructor: User;
  price: number;
  duration: number; // em minutos
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  tags: string[];
  is_published: boolean;
  created_at: string;
  updated_at: string;
  total_views: number;
  rating: number;
  total_ratings: number;
}

export interface Video {
  id: string;
  course_id: string;
  title: string;
  description: string;
  video_url: string;
  thumbnail_url?: string;
  duration: number; // em segundos
  order_index: number;
  is_free: boolean;
  views: number;
  created_at: string;
  updated_at: string;
}

export interface UserProgress {
  id: string;
  user_id: string;
  course_id: string;
  video_id: string;
  progress_percentage: number;
  completed: boolean;
  last_watched_at: string;
}

export interface Payment {
  id: string;
  user_id: string;
  course_id: string;
  amount: number;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
  payment_method: string;
  created_at: string;
}

export interface SocialIntegration {
  id: string;
  user_id: string;
  platform: 'instagram' | 'tiktok' | 'youtube' | 'whatsapp';
  platform_user_id: string;
  access_token: string;
  refresh_token?: string;
  is_active: boolean;
  created_at: string;
}

export interface NetworkConnection {
  id: string;
  follower_id: string;
  following_id: string;
  status: 'pending' | 'accepted' | 'blocked';
  created_at: string;
}

export interface Analytics {
  id: string;
  user_id?: string;
  course_id?: string;
  video_id?: string;
  event_type: 'view' | 'like' | 'share' | 'purchase' | 'completion';
  metadata: Record<string, any>;
  created_at: string;
}

export interface AIInsight {
  id: string;
  type: 'performance' | 'recommendation' | 'trend' | 'optimization';
  title: string;
  description: string;
  data: Record<string, any>;
  priority: 'low' | 'medium' | 'high';
  created_at: string;
}

export interface AccountFeatures {
  basic: {
    max_courses: 3;
    max_videos_per_course: 10;
    analytics: false;
    social_integration: false;
    ai_insights: false;
    networking: false;
    custom_branding: false;
  };
  premium: {
    max_courses: 25;
    max_videos_per_course: 100;
    analytics: true;
    social_integration: true;
    ai_insights: false;
    networking: true;
    custom_branding: false;
  };
  full: {
    max_courses: -1; // ilimitado
    max_videos_per_course: -1; // ilimitado
    analytics: true;
    social_integration: true;
    ai_insights: true;
    networking: true;
    custom_branding: true;
  };
}

export interface DashboardStats {
  total_courses: number;
  total_videos: number;
  total_views: number;
  total_students: number;
  total_revenue: number;
  monthly_revenue: number;
  completion_rate: number;
  avg_rating: number;
}