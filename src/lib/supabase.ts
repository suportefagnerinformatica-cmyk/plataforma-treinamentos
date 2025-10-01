import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
});

// Função para criar as tabelas do banco de dados
export const createTables = async () => {
  const queries = [
    // Tabela de usuários (estende auth.users)
    `
    CREATE TABLE IF NOT EXISTS public.profiles (
      id UUID REFERENCES auth.users(id) PRIMARY KEY,
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar_url TEXT,
      account_type TEXT CHECK (account_type IN ('basic', 'premium', 'full')) DEFAULT 'basic',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `,
    
    // Tabela de cursos
    `
    CREATE TABLE IF NOT EXISTS public.courses (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      title TEXT NOT NULL,
      description TEXT,
      thumbnail_url TEXT,
      instructor_id UUID REFERENCES public.profiles(id) NOT NULL,
      price DECIMAL(10,2) DEFAULT 0,
      duration INTEGER DEFAULT 0,
      level TEXT CHECK (level IN ('beginner', 'intermediate', 'advanced')) DEFAULT 'beginner',
      category TEXT NOT NULL,
      tags TEXT[] DEFAULT '{}',
      is_published BOOLEAN DEFAULT false,
      total_views INTEGER DEFAULT 0,
      rating DECIMAL(3,2) DEFAULT 0,
      total_ratings INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `,
    
    // Tabela de vídeos
    `
    CREATE TABLE IF NOT EXISTS public.videos (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
      title TEXT NOT NULL,
      description TEXT,
      video_url TEXT NOT NULL,
      thumbnail_url TEXT,
      duration INTEGER DEFAULT 0,
      order_index INTEGER DEFAULT 0,
      is_free BOOLEAN DEFAULT false,
      views INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `,
    
    // Tabela de progresso do usuário
    `
    CREATE TABLE IF NOT EXISTS public.user_progress (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) NOT NULL,
      course_id UUID REFERENCES public.courses(id) ON DELETE CASCADE,
      video_id UUID REFERENCES public.videos(id) ON DELETE CASCADE,
      progress_percentage INTEGER DEFAULT 0,
      completed BOOLEAN DEFAULT false,
      last_watched_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, video_id)
    );
    `,
    
    // Tabela de pagamentos
    `
    CREATE TABLE IF NOT EXISTS public.payments (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) NOT NULL,
      course_id UUID REFERENCES public.courses(id),
      amount DECIMAL(10,2) NOT NULL,
      status TEXT CHECK (status IN ('pending', 'completed', 'failed', 'refunded')) DEFAULT 'pending',
      payment_method TEXT NOT NULL,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `,
    
    // Tabela de integrações sociais
    `
    CREATE TABLE IF NOT EXISTS public.social_integrations (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id) NOT NULL,
      platform TEXT CHECK (platform IN ('instagram', 'tiktok', 'youtube', 'whatsapp')) NOT NULL,
      platform_user_id TEXT NOT NULL,
      access_token TEXT NOT NULL,
      refresh_token TEXT,
      is_active BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(user_id, platform)
    );
    `,
    
    // Tabela de conexões de rede
    `
    CREATE TABLE IF NOT EXISTS public.network_connections (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      follower_id UUID REFERENCES public.profiles(id) NOT NULL,
      following_id UUID REFERENCES public.profiles(id) NOT NULL,
      status TEXT CHECK (status IN ('pending', 'accepted', 'blocked')) DEFAULT 'pending',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      UNIQUE(follower_id, following_id)
    );
    `,
    
    // Tabela de analytics
    `
    CREATE TABLE IF NOT EXISTS public.analytics (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id UUID REFERENCES public.profiles(id),
      course_id UUID REFERENCES public.courses(id),
      video_id UUID REFERENCES public.videos(id),
      event_type TEXT CHECK (event_type IN ('view', 'like', 'share', 'purchase', 'completion')) NOT NULL,
      metadata JSONB DEFAULT '{}',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `,
    
    // Tabela de insights de IA
    `
    CREATE TABLE IF NOT EXISTS public.ai_insights (
      id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
      type TEXT CHECK (type IN ('performance', 'recommendation', 'trend', 'optimization')) NOT NULL,
      title TEXT NOT NULL,
      description TEXT,
      data JSONB DEFAULT '{}',
      priority TEXT CHECK (priority IN ('low', 'medium', 'high')) DEFAULT 'medium',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
    );
    `
  ];

  for (const query of queries) {
    const { error } = await supabase.rpc('exec_sql', { sql: query });
    if (error) {
      console.error('Erro ao criar tabela:', error);
    }
  }
};

// Políticas de segurança RLS (Row Level Security)
export const setupRLS = async () => {
  const policies = [
    // Habilitar RLS em todas as tabelas
    'ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.videos ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.social_integrations ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.network_connections ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.analytics ENABLE ROW LEVEL SECURITY;',
    'ALTER TABLE public.ai_insights ENABLE ROW LEVEL SECURITY;',
    
    // Políticas para profiles
    `CREATE POLICY "Usuários podem ver perfis públicos" ON public.profiles FOR SELECT USING (true);`,
    `CREATE POLICY "Usuários podem atualizar próprio perfil" ON public.profiles FOR UPDATE USING (auth.uid() = id);`,
    
    // Políticas para cursos
    `CREATE POLICY "Todos podem ver cursos publicados" ON public.courses FOR SELECT USING (is_published = true OR instructor_id = auth.uid());`,
    `CREATE POLICY "Instrutores podem gerenciar próprios cursos" ON public.courses FOR ALL USING (instructor_id = auth.uid());`,
    
    // Políticas para vídeos
    `CREATE POLICY "Usuários podem ver vídeos de cursos publicados" ON public.videos FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.courses WHERE courses.id = videos.course_id AND (courses.is_published = true OR courses.instructor_id = auth.uid()))
    );`,
    
    // Políticas para progresso
    `CREATE POLICY "Usuários podem ver próprio progresso" ON public.user_progress FOR ALL USING (user_id = auth.uid());`,
    
    // Políticas para pagamentos
    `CREATE POLICY "Usuários podem ver próprios pagamentos" ON public.payments FOR SELECT USING (user_id = auth.uid());`,
    
    // Políticas para integrações sociais
    `CREATE POLICY "Usuários podem gerenciar próprias integrações" ON public.social_integrations FOR ALL USING (user_id = auth.uid());`,
    
    // Políticas para conexões de rede
    `CREATE POLICY "Usuários podem ver próprias conexões" ON public.network_connections FOR ALL USING (follower_id = auth.uid() OR following_id = auth.uid());`,
    
    // Políticas para analytics
    `CREATE POLICY "Instrutores podem ver analytics dos próprios cursos" ON public.analytics FOR SELECT USING (
      user_id = auth.uid() OR 
      EXISTS (SELECT 1 FROM public.courses WHERE courses.id = analytics.course_id AND courses.instructor_id = auth.uid())
    );`,
    
    // Políticas para insights de IA
    `CREATE POLICY "Usuários premium/full podem ver insights" ON public.ai_insights FOR SELECT USING (
      EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.account_type IN ('premium', 'full'))
    );`
  ];

  for (const policy of policies) {
    const { error } = await supabase.rpc('exec_sql', { sql: policy });
    if (error && !error.message.includes('already exists')) {
      console.error('Erro ao criar política:', error);
    }
  }
};