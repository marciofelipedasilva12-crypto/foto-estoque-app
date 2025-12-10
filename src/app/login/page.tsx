'use client';

import { useState } from 'react';
import { Camera, Mail, Lock, ArrowRight, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [fullName, setFullName] = useState('');
  const [storeName, setStoreName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Verificar se é admin de teste (sem necessidade de banco)
      if (email === 'admin@fotostock.com' && password === 'admin123') {
        // Salvar no localStorage para simular sessão
        localStorage.setItem('fotostock_user', JSON.stringify({
          email: 'admin@fotostock.com',
          role: 'admin',
          fullName: 'Administrador',
          storeId: 'admin'
        }));
        router.push('/admin');
        return;
      }

      if (isSignUp) {
        // Cadastro
        const { data: authData, error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              store_name: storeName,
            },
            emailRedirectTo: `${window.location.origin}/dashboard`
          }
        });

        if (signUpError) throw signUpError;

        if (authData.user) {
          // Criar loja e perfil
          try {
            const storeSlug = storeName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
            
            const { data: storeData, error: storeError } = await supabase
              .from('stores')
              .insert({
                owner_id: authData.user.id,
                store_name: storeName,
                store_slug: storeSlug,
                plan: 'free',
                plan_limit: 50
              })
              .select()
              .single();

            if (storeError) {
              console.error('Erro ao criar loja:', storeError);
              // Continuar mesmo com erro - tabelas podem não existir ainda
            }

            if (storeData) {
              const { error: profileError } = await supabase
                .from('profiles')
                .insert({
                  id: authData.user.id,
                  email: email,
                  full_name: fullName,
                  role: 'owner',
                  store_id: storeData.id
                });

              if (profileError) {
                console.error('Erro ao criar perfil:', profileError);
              }
            }
          } catch (dbError) {
            console.error('Erro de banco:', dbError);
            // Continuar - usuário foi criado no auth
          }

          // Salvar dados localmente como fallback
          localStorage.setItem('fotostock_user', JSON.stringify({
            email,
            fullName,
            storeName,
            role: 'owner',
            userId: authData.user.id
          }));

          // Redirecionar para seleção de plano
          router.push('/plans');
        }
      } else {
        // Login
        const { data, error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (signInError) throw signInError;

        if (data.user) {
          try {
            // Buscar perfil do usuário
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('role, store_id, full_name')
              .eq('id', data.user.id)
              .single();

            if (profileError) {
              console.error('Erro ao buscar perfil:', profileError);
              // Usar dados do auth como fallback
              localStorage.setItem('fotostock_user', JSON.stringify({
                email: data.user.email,
                fullName: data.user.user_metadata?.full_name || 'Usuário',
                role: 'owner',
                userId: data.user.id
              }));
              router.push('/dashboard');
              return;
            }

            // Salvar dados do perfil
            localStorage.setItem('fotostock_user', JSON.stringify({
              email: data.user.email,
              fullName: profile.full_name,
              role: profile.role,
              storeId: profile.store_id,
              userId: data.user.id
            }));

            if (profile?.role === 'admin') {
              router.push('/admin');
            } else {
              router.push('/dashboard');
            }
          } catch (dbError) {
            console.error('Erro ao acessar banco:', dbError);
            // Fallback para dashboard
            localStorage.setItem('fotostock_user', JSON.stringify({
              email: data.user.email,
              fullName: data.user.user_metadata?.full_name || 'Usuário',
              role: 'owner',
              userId: data.user.id
            }));
            router.push('/dashboard');
          }
        }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Erro ao processar solicitação';
      setError(errorMessage);
      console.error('Erro completo:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0A192F] via-[#112240] to-[#0A192F] dark:from-[#0A192F] dark:via-[#112240] dark:to-[#0A192F] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <Link href="/" className="flex items-center justify-center gap-2 mb-8">
          <Camera className="w-10 h-10 text-[#00D8A9]" />
          <span className="text-3xl font-bold text-white">FotoStock</span>
        </Link>

        {/* Card de Login */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
          <h2 className="text-2xl font-bold text-white mb-6 text-center">
            {isSignUp ? 'Criar Conta' : 'Entrar'}
          </h2>

          {error && (
            <div className="mb-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg flex items-center gap-2 text-red-200">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {isSignUp && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                    placeholder="Seu nome"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Nome da Loja
                  </label>
                  <input
                    type="text"
                    value={storeName}
                    onChange={(e) => setStoreName(e.target.value)}
                    className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                    placeholder="Nome da sua loja"
                    required
                  />
                </div>
              </>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="seu@email.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-[#00D8A9] text-[#0A192F] rounded-lg font-bold hover:bg-[#00F5C3] transition-all hover:scale-105 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {loading ? 'Processando...' : (isSignUp ? 'Criar Conta' : 'Entrar')}
              {!loading && <ArrowRight className="w-5 h-5" />}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError('');
              }}
              className="text-[#00D8A9] hover:text-[#00F5C3] transition-colors"
            >
              {isSignUp ? 'Já tem uma conta? Entrar' : 'Não tem conta? Criar agora'}
            </button>
          </div>

          {!isSignUp && (
            <div className="mt-4 p-3 bg-blue-500/20 border border-blue-500/50 rounded-lg">
              <p className="text-xs text-blue-200 text-center">
                <strong>Admin de Teste:</strong> admin@fotostock.com / admin123
              </p>
            </div>
          )}
        </div>

        <div className="mt-6 text-center">
          <Link href="/" className="text-gray-400 hover:text-white transition-colors">
            ← Voltar para página inicial
          </Link>
        </div>
      </div>
    </div>
  );
}
