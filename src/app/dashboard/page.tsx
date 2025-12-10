'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Camera, Package, TrendingUp, Users, LogOut, Settings, Plus, ShoppingCart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Profile, Store } from '@/lib/types';

export default function DashboardPage() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [store, setStore] = useState<Store | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      // Verificar localStorage primeiro (fallback)
      const userData = localStorage.getItem('fotostock_user');
      if (userData) {
        const user = JSON.parse(userData);
        setProfile({
          id: user.userId || 'local',
          email: user.email,
          full_name: user.fullName || user.email,
          role: user.role || 'owner',
          store_id: user.storeId || null,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        });
        
        if (user.storeName) {
          setStore({
            id: user.storeId || 'local',
            owner_id: user.userId || 'local',
            store_name: user.storeName,
            store_slug: user.storeName.toLowerCase().replace(/\s+/g, '-'),
            plan: 'free',
            plan_limit: 50,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          });
        }
        
        setLoading(false);
        return;
      }

      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/login');
        return;
      }

      // Buscar perfil
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);

        // Buscar loja
        if (profileData.store_id) {
          const { data: storeData } = await supabase
            .from('stores')
            .select('*')
            .eq('id', profileData.store_id)
            .single();

          if (storeData) {
            setStore(storeData);
          }
        }
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    localStorage.removeItem('fotostock_user');
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
            <Camera className="w-8 h-8 text-[#00D8A9]" />
            <div>
              <h1 className="text-xl font-bold">FotoStock</h1>
              {store && <p className="text-sm text-gray-400">{store.store_name}</p>}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm font-medium">{profile?.full_name}</p>
              <p className="text-xs text-gray-400 capitalize">{profile?.role}</p>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <StatCard
            icon={<Package className="w-8 h-8 text-[#00D8A9]" />}
            title="Produtos"
            value="3"
            subtitle="em estoque"
          />
          <StatCard
            icon={<ShoppingCart className="w-8 h-8 text-blue-400" />}
            title="Vendas Hoje"
            value="0"
            subtitle="R$ 0,00"
          />
          <StatCard
            icon={<TrendingUp className="w-8 h-8 text-green-400" />}
            title="Vendas Mês"
            value="0"
            subtitle="R$ 0,00"
          />
          <StatCard
            icon={<Users className="w-8 h-8 text-purple-400" />}
            title="Equipe"
            value="1"
            subtitle="usuário ativo"
          />
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Ações Rápidas</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ActionCard
              icon={<Plus className="w-6 h-6" />}
              title="Adicionar Produto"
              description="Tire uma foto e adicione ao estoque"
              onClick={() => router.push('/products/add')}
            />
            <ActionCard
              icon={<Package className="w-6 h-6" />}
              title="Ver Produtos"
              description="Visualize e gerencie seu estoque"
              onClick={() => router.push('/products')}
            />
            <ActionCard
              icon={<ShoppingCart className="w-6 h-6" />}
              title="Registrar Venda"
              description="Marque um produto como vendido"
              onClick={() => router.push('/sales/new')}
            />
          </div>
        </div>

        {/* Plan Info */}
        {store && (
          <div className="bg-gradient-to-r from-[#00D8A9]/20 to-[#00F5C3]/20 border border-[#00D8A9]/30 rounded-xl p-6">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold mb-1">Plano Atual: {store.plan.toUpperCase()}</h3>
                <p className="text-gray-300">
                  Limite: {store.plan_limit === -1 ? 'Ilimitado' : `${store.plan_limit} produtos`}
                </p>
              </div>
              <button
                onClick={() => router.push('/plans')}
                className="px-6 py-3 bg-[#00D8A9] text-[#0A192F] rounded-lg font-bold hover:bg-[#00F5C3] transition-all"
              >
                Fazer Upgrade
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

function StatCard({ icon, title, value, subtitle }: { icon: React.ReactNode; title: string; value: string; subtitle: string }) {
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

function ActionCard({ icon, title, description, onClick }: { icon: React.ReactNode; title: string; description: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:bg-white/10 transition-all hover:scale-105 text-left"
    >
      <div className="w-12 h-12 bg-[#00D8A9]/20 rounded-lg flex items-center justify-center mb-4 text-[#00D8A9]">
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-sm text-gray-400">{description}</p>
    </button>
  );
}
