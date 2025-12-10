'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Users, Store, Package, TrendingUp, LogOut, Settings } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function AdminPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalStores: 0,
    totalUsers: 0,
    totalProducts: 0,
    totalSales: 0
  });

  useEffect(() => {
    checkAdmin();
    loadStats();
  }, []);

  const checkAdmin = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      router.push('/dashboard');
      return;
    }

    setLoading(false);
  };

  const loadStats = async () => {
    try {
      // Contar lojas
      const { count: storesCount } = await supabase
        .from('stores')
        .select('*', { count: 'exact', head: true });

      // Contar usuários
      const { count: usersCount } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true });

      // Contar produtos
      const { count: productsCount } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });

      // Contar vendas
      const { count: salesCount } = await supabase
        .from('sales')
        .select('*', { count: 'exact', head: true });

      setStats({
        totalStores: storesCount || 0,
        totalUsers: usersCount || 0,
        totalProducts: productsCount || 0,
        totalSales: salesCount || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] flex items-center justify-center">
        <div className="text-white text-xl">Carregando...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-white">
      {/* Header */}
      <header className="border-b border-white/10 bg-white/5 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Shield className="w-8 h-8 text-[#00D8A9]" />
            <div>
              <h1 className="text-xl font-bold">FotoStock Admin</h1>
              <p className="text-sm text-gray-400">Painel Administrativo</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold mb-2">Bem-vindo, Administrador</h2>
          <p className="text-gray-400">Gerencie todo o sistema FotoStock</p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <AdminStatCard
            icon={<Store className="w-8 h-8 text-[#00D8A9]" />}
            title="Lojas"
            value={stats.totalStores}
            subtitle="cadastradas"
          />
          <AdminStatCard
            icon={<Users className="w-8 h-8 text-blue-400" />}
            title="Usuários"
            value={stats.totalUsers}
            subtitle="ativos"
          />
          <AdminStatCard
            icon={<Package className="w-8 h-8 text-purple-400" />}
            title="Produtos"
            value={stats.totalProducts}
            subtitle="no sistema"
          />
          <AdminStatCard
            icon={<TrendingUp className="w-8 h-8 text-green-400" />}
            title="Vendas"
            value={stats.totalSales}
            subtitle="registradas"
          />
        </div>

        {/* Admin Actions */}
        <div className="grid md:grid-cols-3 gap-6">
          <AdminActionCard
            icon={<Users className="w-6 h-6" />}
            title="Gerenciar Usuários"
            description="Visualizar, editar e excluir usuários"
            onClick={() => router.push('/admin/users')}
          />
          <AdminActionCard
            icon={<Store className="w-6 h-6" />}
            title="Gerenciar Lojas"
            description="Visualizar e gerenciar todas as lojas"
            onClick={() => router.push('/admin/stores')}
          />
          <AdminActionCard
            icon={<Settings className="w-6 h-6" />}
            title="Configurações"
            description="Configurações globais do sistema"
            onClick={() => router.push('/admin/settings')}
          />
        </div>

        {/* Admin Info */}
        <div className="mt-8 bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-xl p-6">
          <h3 className="text-lg font-bold mb-2">Acesso Administrativo</h3>
          <p className="text-gray-300 mb-4">
            Você tem acesso total ao sistema. Use com responsabilidade.
          </p>
          <ul className="space-y-2 text-sm text-gray-300">
            <li>✓ Gerenciar todos os usuários e lojas</li>
            <li>✓ Alterar planos sem cobrança</li>
            <li>✓ Acessar estatísticas globais</li>
            <li>✓ Configurar sistema</li>
          </ul>
        </div>
      </main>
    </div>
  );
}

function AdminStatCard({ icon, title, value, subtitle }: { icon: React.ReactNode; title: string; value: number; subtitle: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10">
      <div className="flex items-center justify-between mb-4">
        <div>{icon}</div>
      </div>
      <h3 className="text-sm text-gray-400 mb-1">{title}</h3>
      <p className="text-3xl font-bold mb-1">{value}</p>
      <p className="text-xs text-gray-400">{subtitle}</p>
    </div>
  );
}

function AdminActionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 text-left"
    >
      <div className="w-12 h-12 bg-purple-500/20 rounded-lg flex items-center justify-center mb-4 text-purple-400">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}
