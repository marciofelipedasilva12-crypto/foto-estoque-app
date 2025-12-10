'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check, ArrowRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { PLANS, type Plan } from '@/lib/types';

export default function PlansPage() {
  const router = useRouter();
  const [selectedPlan, setSelectedPlan] = useState<Plan>('free');
  const [loading, setLoading] = useState(false);
  const [storeId, setStoreId] = useState<string | null>(null);

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      router.push('/login');
      return;
    }

    // Buscar store_id do usuário
    const { data: profile } = await supabase
      .from('profiles')
      .select('store_id')
      .eq('id', user.id)
      .single();

    if (profile?.store_id) {
      setStoreId(profile.store_id);
    }
  };

  const handleSelectPlan = async () => {
    if (!storeId) return;

    setLoading(true);
    try {
      const planDetails = PLANS[selectedPlan];
      
      // Atualizar plano da loja
      const { error } = await supabase
        .from('stores')
        .update({
          plan: selectedPlan,
          plan_limit: planDetails.limit
        })
        .eq('id', storeId);

      if (error) throw error;

      // Redirecionar para dashboard
      router.push('/dashboard');
    } catch (error) {
      console.error('Erro ao selecionar plano:', error);
      alert('Erro ao selecionar plano. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] text-white py-12 px-4">
      <div className="container mx-auto max-w-6xl">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Escolha seu Plano</h1>
          <p className="text-xl text-gray-300">Comece grátis e faça upgrade quando precisar</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {(Object.keys(PLANS) as Plan[]).map((planKey) => {
            const plan = PLANS[planKey];
            const isSelected = selectedPlan === planKey;
            const isPopular = planKey === 'pro';

            return (
              <div
                key={planKey}
                onClick={() => setSelectedPlan(planKey)}
                className={`rounded-xl p-6 cursor-pointer transition-all ${
                  isSelected
                    ? 'bg-gradient-to-br from-[#00D8A9] to-[#00F5C3] text-[#0A192F] scale-105 shadow-2xl'
                    : 'bg-white/5 backdrop-blur-sm border border-white/10 hover:bg-white/10'
                }`}
              >
                {isPopular && !isSelected && (
                  <div className="text-xs font-bold uppercase mb-2 text-[#00D8A9]">Mais Popular</div>
                )}
                {isSelected && (
                  <div className="text-xs font-bold uppercase mb-2 text-[#0A192F]">Selecionado</div>
                )}
                
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-4xl font-bold">R$ {plan.price}</span>
                  <span className={isSelected ? 'text-[#0A192F] opacity-70' : 'text-gray-400'}>
                    {planKey === 'annual' ? '/ano' : '/mês'}
                  </span>
                </div>

                <ul className="space-y-2 mb-6">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Check className={`w-4 h-4 flex-shrink-0 ${isSelected ? 'text-[#0A192F]' : 'text-[#00D8A9]'}`} />
                      <span className={isSelected ? 'text-[#0A192F]' : 'text-gray-300'}>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className={`w-full py-2 rounded-lg font-bold text-center ${
                  isSelected
                    ? 'bg-[#0A192F] text-white'
                    : 'bg-[#00D8A9]/20 text-[#00D8A9]'
                }`}>
                  {isSelected ? '✓ Selecionado' : 'Selecionar'}
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button
            onClick={handleSelectPlan}
            disabled={loading}
            className="px-8 py-4 bg-[#00D8A9] text-[#0A192F] rounded-lg font-bold text-lg hover:bg-[#00F5C3] transition-all hover:scale-105 inline-flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processando...' : 'Continuar'}
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-8 text-center text-gray-400 text-sm">
          <p>Você pode alterar seu plano a qualquer momento no dashboard</p>
        </div>
      </div>
    </div>
  );
}
