"use client";

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { User, Course, DashboardStats } from '@/lib/types';
import { 
  Play, 
  Users, 
  BookOpen, 
  TrendingUp, 
  DollarSign, 
  Eye, 
  Star,
  Plus,
  Settings,
  BarChart3,
  Network,
  Brain,
  Instagram,
  Youtube,
  MessageCircle,
  Video,
  Upload,
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { motion } from 'framer-motion';

export default function TrainingPlatform() {
  const [user, setUser] = useState<User | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [stats, setStats] = useState<DashboardStats>({
    total_courses: 0,
    total_videos: 0,
    total_views: 0,
    total_students: 0,
    total_revenue: 0,
    monthly_revenue: 0,
    completion_rate: 0,
    avg_rating: 0
  });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkUser();
    loadDashboardData();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();
      
      if (profile) {
        setUser(profile);
      }
    }
    setIsLoading(false);
  };

  const loadDashboardData = async () => {
    // Simular dados para demonstração
    setCourses([
      {
        id: '1',
        title: 'Curso de React Avançado',
        description: 'Aprenda React do zero ao avançado com projetos práticos',
        thumbnail_url: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=400&h=300&fit=crop',
        instructor_id: '1',
        instructor: { id: '1', name: 'João Silva', email: 'joao@email.com', account_type: 'full', created_at: '', updated_at: '' },
        price: 199.90,
        duration: 1200,
        level: 'advanced',
        category: 'Programação',
        tags: ['React', 'JavaScript', 'Frontend'],
        is_published: true,
        created_at: '2024-01-01',
        updated_at: '2024-01-01',
        total_views: 1250,
        rating: 4.8,
        total_ratings: 89
      },
      {
        id: '2',
        title: 'Marketing Digital Completo',
        description: 'Estratégias completas de marketing digital para 2024',
        thumbnail_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop',
        instructor_id: '1',
        instructor: { id: '1', name: 'Maria Santos', email: 'maria@email.com', account_type: 'premium', created_at: '', updated_at: '' },
        price: 299.90,
        duration: 1800,
        level: 'intermediate',
        category: 'Marketing',
        tags: ['Marketing', 'Digital', 'Redes Sociais'],
        is_published: true,
        created_at: '2024-01-15',
        updated_at: '2024-01-15',
        total_views: 890,
        rating: 4.6,
        total_ratings: 67
      }
    ]);

    setStats({
      total_courses: 12,
      total_videos: 156,
      total_views: 25430,
      total_students: 1250,
      total_revenue: 45890.50,
      monthly_revenue: 8750.30,
      completion_rate: 78.5,
      avg_rating: 4.7
    });
  };

  const getAccountBadgeColor = (accountType: string) => {
    switch (accountType) {
      case 'basic': return 'bg-gray-500';
      case 'premium': return 'bg-blue-500';
      case 'full': return 'bg-gradient-to-r from-purple-500 to-pink-500';
      default: return 'bg-gray-500';
    }
  };

  const getAccountFeatures = (accountType: string) => {
    switch (accountType) {
      case 'basic':
        return ['3 cursos', '10 vídeos por curso', 'Suporte básico'];
      case 'premium':
        return ['25 cursos', '100 vídeos por curso', 'Analytics', 'Redes sociais', 'Networking'];
      case 'full':
        return ['Cursos ilimitados', 'Vídeos ilimitados', 'IA avançada', 'Marca personalizada', 'Suporte prioritário'];
      default:
        return [];
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <header className="bg-black/20 backdrop-blur-sm border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <Play className="w-4 h-4 text-white" />
                </div>
                <h1 className="text-xl font-bold text-white">EduPlatform</h1>
              </div>
              {user && (
                <Badge className={`${getAccountBadgeColor(user.account_type)} text-white border-0`}>
                  {user.account_type.toUpperCase()}
                </Badge>
              )}
            </div>
            
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm" className="text-white hover:bg-white/10">
                <Shield className="w-4 h-4 mr-2" />
                Segurança
              </Button>
              {user ? (
                <div className="flex items-center space-x-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={user.avatar_url} />
                    <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <span className="text-white text-sm">{user.name}</span>
                </div>
              ) : (
                <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                  Entrar
                </Button>
              )}
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6 bg-black/20 backdrop-blur-sm border border-white/10">
            <TabsTrigger value="dashboard" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <BarChart3 className="w-4 h-4 mr-2" />
              Dashboard
            </TabsTrigger>
            <TabsTrigger value="courses" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <BookOpen className="w-4 h-4 mr-2" />
              Cursos
            </TabsTrigger>
            <TabsTrigger value="videos" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Video className="w-4 h-4 mr-2" />
              Vídeos
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Network className="w-4 h-4 mr-2" />
              Rede
            </TabsTrigger>
            <TabsTrigger value="ai" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Brain className="w-4 h-4 mr-2" />
              IA
            </TabsTrigger>
            <TabsTrigger value="admin" className="data-[state=active]:bg-purple-500 data-[state=active]:text-white">
              <Settings className="w-4 h-4 mr-2" />
              Admin
            </TabsTrigger>
          </TabsList>

          {/* Dashboard */}
          <TabsContent value="dashboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Cursos</CardTitle>
                    <BookOpen className="h-4 w-4 text-purple-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total_courses}</div>
                    <p className="text-xs text-gray-400">+2 este mês</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Total de Visualizações</CardTitle>
                    <Eye className="h-4 w-4 text-blue-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total_views.toLocaleString()}</div>
                    <p className="text-xs text-gray-400">+12% este mês</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Estudantes</CardTitle>
                    <Users className="h-4 w-4 text-green-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{stats.total_students.toLocaleString()}</div>
                    <p className="text-xs text-gray-400">+8% este mês</p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                  <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Receita Mensal</CardTitle>
                    <DollarSign className="h-4 w-4 text-yellow-400" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">R$ {stats.monthly_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</div>
                    <p className="text-xs text-gray-400">+15% este mês</p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Gráficos e métricas */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Performance dos Cursos</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {courses.map((course) => (
                      <div key={course.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <img 
                            src={course.thumbnail_url} 
                            alt={course.title}
                            className="w-12 h-8 object-cover rounded"
                          />
                          <div>
                            <p className="font-medium text-sm">{course.title}</p>
                            <p className="text-xs text-gray-400">{course.total_views} visualizações</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{course.rating}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Integrações Sociais</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Instagram className="w-5 h-5 text-pink-400" />
                        <span>Instagram</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Youtube className="w-5 h-5 text-red-400" />
                        <span>YouTube</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <MessageCircle className="w-5 h-5 text-green-400" />
                        <span>WhatsApp</span>
                      </div>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Video className="w-5 h-5 text-black bg-white rounded p-1" />
                        <span>TikTok</span>
                      </div>
                      <Switch />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Cursos */}
          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Meus Cursos</h2>
              <Dialog>
                <DialogTrigger asChild>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Plus className="w-4 h-4 mr-2" />
                    Novo Curso
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-slate-900 border-white/10 text-white">
                  <DialogHeader>
                    <DialogTitle>Criar Novo Curso</DialogTitle>
                    <DialogDescription>
                      Preencha as informações do seu novo curso
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Título do Curso</Label>
                      <Input id="title" placeholder="Ex: Curso de React Avançado" className="bg-white/10 border-white/20" />
                    </div>
                    <div>
                      <Label htmlFor="description">Descrição</Label>
                      <Textarea id="description" placeholder="Descreva seu curso..." className="bg-white/10 border-white/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="price">Preço (R$)</Label>
                        <Input id="price" type="number" placeholder="199.90" className="bg-white/10 border-white/20" />
                      </div>
                      <div>
                        <Label htmlFor="level">Nível</Label>
                        <Select>
                          <SelectTrigger className="bg-white/10 border-white/20">
                            <SelectValue placeholder="Selecione o nível" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="beginner">Iniciante</SelectItem>
                            <SelectItem value="intermediate">Intermediário</SelectItem>
                            <SelectItem value="advanced">Avançado</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                      Criar Curso
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {courses.map((course) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white overflow-hidden">
                    <div className="relative">
                      <img 
                        src={course.thumbnail_url} 
                        alt={course.title}
                        className="w-full h-48 object-cover"
                      />
                      <div className="absolute top-2 right-2">
                        <Badge className={`${course.is_published ? 'bg-green-500' : 'bg-yellow-500'} text-white`}>
                          {course.is_published ? 'Publicado' : 'Rascunho'}
                        </Badge>
                      </div>
                    </div>
                    <CardContent className="p-4">
                      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-2xl font-bold text-green-400">
                          R$ {course.price.toFixed(2)}
                        </span>
                        <div className="flex items-center space-x-1">
                          <Star className="w-4 h-4 text-yellow-400 fill-current" />
                          <span className="text-sm">{course.rating}</span>
                          <span className="text-xs text-gray-400">({course.total_ratings})</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm text-gray-400 mb-3">
                        <span>{course.total_views} visualizações</span>
                        <span>{Math.floor(course.duration / 60)}h {course.duration % 60}min</span>
                      </div>
                      <div className="flex flex-wrap gap-1 mb-3">
                        {course.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button className="w-full bg-purple-500 hover:bg-purple-600">
                        Gerenciar Curso
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Vídeos */}
          <TabsContent value="videos" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-white">Biblioteca de Vídeos</h2>
              <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                <Upload className="w-4 h-4 mr-2" />
                Upload Vídeo
              </Button>
            </div>

            <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Video className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Nenhum vídeo encontrado</h3>
                  <p className="text-gray-400 mb-4">Comece fazendo upload do seu primeiro vídeo</p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    <Upload className="w-4 h-4 mr-2" />
                    Fazer Upload
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Rede */}
          <TabsContent value="network" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Rede de Contatos</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Conectar com Instrutores</CardTitle>
                  <CardDescription className="text-gray-400">
                    Encontre e conecte-se com outros instrutores
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <Input 
                      placeholder="Buscar instrutores..." 
                      className="bg-white/10 border-white/20"
                    />
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <Avatar>
                              <AvatarFallback>U{i}</AvatarFallback>
                            </Avatar>
                            <div>
                              <p className="font-medium">Usuário {i}</p>
                              <p className="text-sm text-gray-400">Instrutor de Marketing</p>
                            </div>
                          </div>
                          <Button size="sm" variant="outline" className="border-white/20 text-white hover:bg-white/10">
                            Conectar
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Minhas Conexões</CardTitle>
                  <CardDescription className="text-gray-400">
                    Gerencie suas conexões ativas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Network className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-gray-400">Nenhuma conexão ainda</p>
                    <p className="text-sm text-gray-500">Comece conectando com outros instrutores</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* IA */}
          <TabsContent value="ai" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Insights de Inteligência Artificial</h2>
            
            {user?.account_type === 'basic' ? (
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardContent className="p-8 text-center">
                  <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">Recursos de IA Indisponíveis</h3>
                  <p className="text-gray-400 mb-4">
                    Atualize para Premium ou Full para acessar insights avançados de IA
                  </p>
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                    Fazer Upgrade
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Recomendações de Conteúdo</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-500/20 rounded-lg border border-blue-500/30">
                        <h4 className="font-semibold text-blue-300 mb-2">Tendência Identificada</h4>
                        <p className="text-sm">Cursos de IA estão em alta. Considere criar conteúdo sobre Machine Learning.</p>
                      </div>
                      <div className="p-4 bg-green-500/20 rounded-lg border border-green-500/30">
                        <h4 className="font-semibold text-green-300 mb-2">Otimização Sugerida</h4>
                        <p className="text-sm">Seus vídeos de 10-15 minutos têm melhor engajamento. Mantenha esse formato.</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                  <CardHeader>
                    <CardTitle>Análise de Performance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Taxa de Conclusão</span>
                          <span>78.5%</span>
                        </div>
                        <Progress value={78.5} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Engajamento</span>
                          <span>85.2%</span>
                        </div>
                        <Progress value={85.2} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between text-sm mb-2">
                          <span>Satisfação</span>
                          <span>92.1%</span>
                        </div>
                        <Progress value={92.1} className="h-2" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>

          {/* Admin */}
          <TabsContent value="admin" className="space-y-6">
            <h2 className="text-2xl font-bold text-white">Painel Administrativo</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Tipo de Conta</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="text-center">
                      <Badge className={`${getAccountBadgeColor(user?.account_type || 'basic')} text-white text-lg px-4 py-2`}>
                        {user?.account_type?.toUpperCase() || 'BASIC'}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      {getAccountFeatures(user?.account_type || 'basic').map((feature, index) => (
                        <div key={index} className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                    {user?.account_type !== 'full' && (
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600">
                        Fazer Upgrade
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Segurança</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Autenticação 2FA</span>
                      <Switch />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Backup Automático</span>
                      <Switch defaultChecked />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm">Criptografia Avançada</span>
                      <Switch defaultChecked />
                    </div>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <Shield className="w-4 h-4 mr-2" />
                      Configurar Segurança
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-black/20 backdrop-blur-sm border-white/10 text-white">
                <CardHeader>
                  <CardTitle>Financeiro</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <p className="text-sm text-gray-400">Receita Total</p>
                      <p className="text-2xl font-bold text-green-400">
                        R$ {stats.total_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-400">Este Mês</p>
                      <p className="text-xl font-semibold">
                        R$ {stats.monthly_revenue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                      </p>
                    </div>
                    <Button variant="outline" className="w-full border-white/20 text-white hover:bg-white/10">
                      <DollarSign className="w-4 h-4 mr-2" />
                      Ver Relatórios
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}