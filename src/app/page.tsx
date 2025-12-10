'use client';

import { ArrowRight, Camera, Package, TrendingUp, Users, Shield, Zap } from 'lucide-react';
import Link from 'next/link';
import { ThemeToggle } from '@/components/custom/theme-toggle';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] dark:from-[#0A192F] dark:via-[#112240] dark:to-[#0A192F] text-white">
      {/* Header */}
      <header className="container mx-auto px-4 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Camera className="w-8 h-8 text-[#00D8A9]" />
          <span className="text-2xl font-bold">FotoStock</span>
        </div>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link 
            href="/login"
            className="px-4 py-2 text-sm hover:text-[#00D8A9] transition-colors"
          >
            Entrar
          </Link>
          <Link 
            href="/login"
            className="px-6 py-2 bg-[#00D8A9] text-[#0A192F] rounded-lg font-semibold hover:bg-[#00F5C3] transition-all hover:scale-105"
          >
            Começar Grátis
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
          Controle de Estoque com
          <span className="text-[#00D8A9]"> Fotos Profissionais</span>
        </h1>
        <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
          Tire fotos, remova fundos automaticamente e crie um catálogo online profissional para sua loja
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            href="/login"
            className="px-8 py-4 bg-[#00D8A9] text-[#0A192F] rounded-lg font-bold text-lg hover:bg-[#00F5C3] transition-all hover:scale-105 flex items-center justify-center gap-2"
          >
            Começar Grátis Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
          <button className="px-8 py-4 border-2 border-[#00D8A9] text-[#00D8A9] rounded-lg font-bold text-lg hover:bg-[#00D8A9] hover:text-[#0A192F] transition-all">
            Ver Demonstração
          </button>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Recursos Principais
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={<Camera className="w-10 h-10 text-[#00D8A9]" />}
            title="Fotos Profissionais"
            description="Tire fotos e remova o fundo automaticamente. Adicione fundos elegantes pré-salvos."
          />
          <FeatureCard
            icon={<Package className="w-10 h-10 text-[#00D8A9]" />}
            title="Controle de Estoque"
            description="Gerencie produtos, prateleiras, códigos de barras e notas fiscais em um só lugar."
          />
          <FeatureCard
            icon={<TrendingUp className="w-10 h-10 text-[#00D8A9]" />}
            title="Catálogo Público"
            description="Cada loja tem seu link único. Clientes veem preços, promoções e estoque disponível."
          />
          <FeatureCard
            icon={<Users className="w-10 h-10 text-[#00D8A9]" />}
            title="Equipe Completa"
            description="Crie logins para funcionários, gerentes e controle comissões com ranking de vendas."
          />
          <FeatureCard
            icon={<Shield className="w-10 h-10 text-[#00D8A9]" />}
            title="Segurança Total"
            description="Rastreie quem vendeu, quando e evite furtos com controle de notas fiscais."
          />
          <FeatureCard
            icon={<Zap className="w-10 h-10 text-[#00D8A9]" />}
            title="Notificações Inteligentes"
            description="Saiba quais produtos vendem mais e quais estão parados no estoque."
          />
        </div>
      </section>

      {/* Pricing Section */}
      <section className="container mx-auto px-4 py-20">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
          Planos para Todos os Tamanhos
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          <PricingCard
            name="Grátis"
            price="R$ 0"
            period="/mês"
            features={['50 produtos', 'Catálogo público', 'Vendas básicas', 'Remoção de fundo']}
            highlighted={false}
          />
          <PricingCard
            name="Simples"
            price="R$ 29"
            period="/mês"
            features={['500 produtos', 'Catálogo público', 'Vendas completas', 'Estatísticas', 'Ranking de vendas']}
            highlighted={false}
          />
          <PricingCard
            name="Pro"
            price="R$ 59"
            period="/mês"
            features={['Produtos ilimitados', 'Tudo do Simples', 'Notificações', 'Múltiplos usuários', 'Suporte prioritário']}
            highlighted={true}
          />
          <PricingCard
            name="Anual"
            price="R$ 590"
            period="/ano"
            features={['Tudo do Pro', '2 meses grátis', 'Economia de R$ 118', 'Suporte VIP']}
            highlighted={false}
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20 text-center">
        <div className="bg-gradient-to-r from-[#00D8A9] to-[#00F5C3] rounded-2xl p-12">
          <h2 className="text-3xl md:text-4xl font-bold text-[#0A192F] mb-4">
            Pronto para Transformar sua Loja?
          </h2>
          <p className="text-lg text-[#0A192F] mb-8 opacity-90">
            Comece grátis agora e veja como é fácil gerenciar seu estoque
          </p>
          <Link 
            href="/login"
            className="inline-flex items-center gap-2 px-8 py-4 bg-[#0A192F] text-white rounded-lg font-bold text-lg hover:bg-[#112240] transition-all hover:scale-105"
          >
            Começar Agora
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 border-t border-gray-700 text-center text-gray-400">
        <p>© 2024 FotoStock. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6 hover:bg-white/10 transition-all hover:scale-105 border border-white/10">
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-300">{description}</p>
    </div>
  );
}

function PricingCard({ 
  name, 
  price, 
  period, 
  features, 
  highlighted 
}: { 
  name: string; 
  price: string; 
  period: string; 
  features: string[]; 
  highlighted: boolean;
}) {
  return (
    <div className={`rounded-xl p-8 ${
      highlighted 
        ? 'bg-gradient-to-br from-[#00D8A9] to-[#00F5C3] text-[#0A192F] scale-105 shadow-2xl' 
        : 'bg-white/5 backdrop-blur-sm border border-white/10'
    }`}>
      {highlighted && (
        <div className="text-xs font-bold uppercase mb-2 text-[#0A192F]">Mais Popular</div>
      )}
      <h3 className="text-2xl font-bold mb-2">{name}</h3>
      <div className="mb-6">
        <span className="text-4xl font-bold">{price}</span>
        <span className={highlighted ? 'text-[#0A192F] opacity-70' : 'text-gray-400'}>{period}</span>
      </div>
      <ul className="space-y-3 mb-8">
        {features.map((feature, i) => (
          <li key={i} className="flex items-start gap-2">
            <span className={highlighted ? 'text-[#0A192F]' : 'text-[#00D8A9]'}>✓</span>
            <span className={highlighted ? 'text-[#0A192F]' : 'text-gray-300'}>{feature}</span>
          </li>
        ))}
      </ul>
      <Link 
        href="/login"
        className={`block w-full py-3 rounded-lg font-bold text-center transition-all ${
          highlighted
            ? 'bg-[#0A192F] text-white hover:bg-[#112240]'
            : 'bg-[#00D8A9] text-[#0A192F] hover:bg-[#00F5C3]'
        }`}
      >
        Começar Agora
      </Link>
    </div>
  );
}
