'use client';

import { useState, useEffect } from 'react';
import { Camera, Plus, Search, Filter, Grid, List, Package, TrendingUp, AlertTriangle } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  promotional_price?: number;
  stock_quantity: number;
  shelf_location?: string;
  image_url?: string;
  category?: string;
  created_at: string;
}

export default function ProductsPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Verificar autenticação
    const userData = localStorage.getItem('fotostock_user');
    if (!userData) {
      router.push('/login');
      return;
    }
    setUser(JSON.parse(userData));

    // Carregar produtos (mock data por enquanto)
    loadProducts();
  }, [router]);

  const loadProducts = () => {
    // Mock data - será substituído por dados reais do Supabase
    const mockProducts: Product[] = [
      {
        id: '1',
        name: 'Camiseta Básica Branca',
        description: 'Camiseta 100% algodão',
        price: 49.90,
        promotional_price: 39.90,
        stock_quantity: 15,
        shelf_location: 'A1',
        category: 'Camisetas',
        created_at: new Date().toISOString()
      },
      {
        id: '2',
        name: 'Calça Jeans Skinny',
        description: 'Calça jeans azul escuro',
        price: 129.90,
        stock_quantity: 8,
        shelf_location: 'B3',
        category: 'Calças',
        created_at: new Date().toISOString()
      },
      {
        id: '3',
        name: 'Vestido Floral',
        description: 'Vestido estampado',
        price: 89.90,
        stock_quantity: 3,
        shelf_location: 'C2',
        category: 'Vestidos',
        created_at: new Date().toISOString()
      }
    ];
    setProducts(mockProducts);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || product.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];

  const getStockStatus = (quantity: number) => {
    if (quantity === 0) return { text: 'Sem estoque', color: 'text-red-500', bg: 'bg-red-500/20' };
    if (quantity <= 5) return { text: 'Estoque baixo', color: 'text-yellow-500', bg: 'bg-yellow-500/20' };
    return { text: 'Em estoque', color: 'text-green-500', bg: 'bg-green-500/20' };
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F]">
      {/* Header */}
      <header className="bg-white dark:bg-[#112240] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/dashboard" className="flex items-center gap-2">
              <Camera className="w-8 h-8 text-[#00D8A9]" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">FotoStock</span>
            </Link>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {user?.fullName || user?.email}
              </span>
              <Link
                href="/products/add"
                className="flex items-center gap-2 px-4 py-2 bg-[#00D8A9] text-[#0A192F] rounded-lg font-semibold hover:bg-[#00F5C3] transition-all"
              >
                <Plus className="w-5 h-5" />
                Adicionar Produto
              </Link>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Estatísticas Rápidas */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white dark:bg-[#112240] rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Total de Produtos</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">{products.length}</p>
              </div>
              <Package className="w-12 h-12 text-[#00D8A9]" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#112240] rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Itens em Estoque</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {products.reduce((sum, p) => sum + p.stock_quantity, 0)}
                </p>
              </div>
              <TrendingUp className="w-12 h-12 text-green-500" />
            </div>
          </div>

          <div className="bg-white dark:bg-[#112240] rounded-xl p-6 border border-gray-200 dark:border-white/10">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 dark:text-gray-400">Estoque Baixo</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                  {products.filter(p => p.stock_quantity <= 5 && p.stock_quantity > 0).length}
                </p>
              </div>
              <AlertTriangle className="w-12 h-12 text-yellow-500" />
            </div>
          </div>
        </div>

        {/* Filtros e Busca */}
        <div className="bg-white dark:bg-[#112240] rounded-xl p-6 border border-gray-200 dark:border-white/10 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Busca */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Buscar produtos..."
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
              />
            </div>

            {/* Filtro de Categoria */}
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <select
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
                className="pl-10 pr-8 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white focus:outline-none focus:border-[#00D8A9] transition-colors appearance-none cursor-pointer"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'Todas Categorias' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Toggle de Visualização */}
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 rounded-lg border transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#00D8A9] text-[#0A192F] border-[#00D8A9]'
                    : 'bg-gray-50 dark:bg-[#0A192F] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'
                }`}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 rounded-lg border transition-colors ${
                  viewMode === 'list'
                    ? 'bg-[#00D8A9] text-[#0A192F] border-[#00D8A9]'
                    : 'bg-gray-50 dark:bg-[#0A192F] text-gray-600 dark:text-gray-400 border-gray-200 dark:border-white/10'
                }`}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Lista de Produtos */}
        {filteredProducts.length === 0 ? (
          <div className="bg-white dark:bg-[#112240] rounded-xl p-12 border border-gray-200 dark:border-white/10 text-center">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              Nenhum produto encontrado
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {searchTerm ? 'Tente buscar com outros termos' : 'Comece adicionando seu primeiro produto'}
            </p>
            <Link
              href="/products/add"
              className="inline-flex items-center gap-2 px-6 py-3 bg-[#00D8A9] text-[#0A192F] rounded-lg font-semibold hover:bg-[#00F5C3] transition-all"
            >
              <Plus className="w-5 h-5" />
              Adicionar Produto
            </Link>
          </div>
        ) : (
          <div className={viewMode === 'grid' ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6' : 'space-y-4'}>
            {filteredProducts.map(product => {
              const stockStatus = getStockStatus(product.stock_quantity);
              
              return viewMode === 'grid' ? (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#112240] rounded-xl overflow-hidden border border-gray-200 dark:border-white/10 hover:shadow-xl transition-all cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  {/* Imagem do Produto */}
                  <div className="aspect-square bg-gray-100 dark:bg-[#0A192F] flex items-center justify-center">
                    {product.image_url ? (
                      <img src={product.image_url} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Camera className="w-16 h-16 text-gray-400" />
                    )}
                  </div>

                  {/* Informações */}
                  <div className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{product.name}</h3>
                      {product.shelf_location && (
                        <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-[#0A192F] text-gray-600 dark:text-gray-400 rounded">
                          {product.shelf_location}
                        </span>
                      )}
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    {/* Preço */}
                    <div className="flex items-center gap-2 mb-3">
                      {product.promotional_price ? (
                        <>
                          <span className="text-lg font-bold text-[#00D8A9]">
                            R$ {product.promotional_price.toFixed(2)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            R$ {product.price.toFixed(2)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-900 dark:text-white">
                          R$ {product.price.toFixed(2)}
                        </span>
                      )}
                    </div>

                    {/* Status do Estoque */}
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg ${stockStatus.bg}`}>
                      <div className={`w-2 h-2 rounded-full ${stockStatus.color.replace('text-', 'bg-')}`} />
                      <span className={`text-sm font-medium ${stockStatus.color}`}>
                        {stockStatus.text} ({product.stock_quantity} un.)
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div
                  key={product.id}
                  className="bg-white dark:bg-[#112240] rounded-xl p-4 border border-gray-200 dark:border-white/10 hover:shadow-lg transition-all cursor-pointer"
                  onClick={() => router.push(`/products/${product.id}`)}
                >
                  <div className="flex gap-4">
                    {/* Imagem */}
                    <div className="w-24 h-24 bg-gray-100 dark:bg-[#0A192F] rounded-lg flex items-center justify-center flex-shrink-0">
                      {product.image_url ? (
                        <img src={product.image_url} alt={product.name} className="w-full h-full object-cover rounded-lg" />
                      ) : (
                        <Camera className="w-8 h-8 text-gray-400" />
                      )}
                    </div>

                    {/* Informações */}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{product.name}</h3>
                          <p className="text-sm text-gray-600 dark:text-gray-400">{product.description}</p>
                        </div>
                        {product.shelf_location && (
                          <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-[#0A192F] text-gray-600 dark:text-gray-400 rounded">
                            {product.shelf_location}
                          </span>
                        )}
                      </div>

                      <div className="flex items-center justify-between mt-3">
                        {/* Preço */}
                        <div className="flex items-center gap-2">
                          {product.promotional_price ? (
                            <>
                              <span className="text-lg font-bold text-[#00D8A9]">
                                R$ {product.promotional_price.toFixed(2)}
                              </span>
                              <span className="text-sm text-gray-500 line-through">
                                R$ {product.price.toFixed(2)}
                              </span>
                            </>
                          ) : (
                            <span className="text-lg font-bold text-gray-900 dark:text-white">
                              R$ {product.price.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* Status */}
                        <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${stockStatus.bg}`}>
                          <div className={`w-2 h-2 rounded-full ${stockStatus.color.replace('text-', 'bg-')}`} />
                          <span className={`text-sm font-medium ${stockStatus.color}`}>
                            {product.stock_quantity} un.
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
