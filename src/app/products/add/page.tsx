'use client';

import { useState, useRef } from 'react';
import { Camera, Upload, X, ArrowLeft, Save, Loader2, Barcode, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function AddProductPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const invoiceInputRef = useRef<HTMLInputElement>(null);
  
  const [loading, setLoading] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [invoicePreview, setInvoicePreview] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    promotional_price: '',
    stock_quantity: '',
    shelf_location: '',
    barcode: '',
    category: '',
    background_style: 'neutral'
  });

  const backgrounds = [
    { id: 'neutral', name: 'Neutro', preview: 'bg-gray-100' },
    { id: 'white', name: 'Branco Puro', preview: 'bg-white' },
    { id: 'wood', name: 'Madeira', preview: 'bg-amber-100' },
    { id: 'marble', name: 'Mármore', preview: 'bg-slate-100' },
    { id: 'fabric', name: 'Tecido', preview: 'bg-blue-50' },
  ];

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInvoiceUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setInvoicePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Aqui será integrado com Supabase
      // Por enquanto, apenas simula o salvamento
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Produto a ser salvo:', {
        ...formData,
        image: imagePreview,
        invoice: invoicePreview
      });

      router.push('/products');
    } catch (error) {
      console.error('Erro ao salvar produto:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0A192F]">
      {/* Header */}
      <header className="bg-white dark:bg-[#112240] border-b border-gray-200 dark:border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/products" className="flex items-center gap-2 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors">
              <ArrowLeft className="w-5 h-5" />
              Voltar para Produtos
            </Link>
            <div className="flex items-center gap-2">
              <Camera className="w-8 h-8 text-[#00D8A9]" />
              <span className="text-2xl font-bold text-gray-900 dark:text-white">FotoStock</span>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="bg-white dark:bg-[#112240] rounded-xl p-8 border border-gray-200 dark:border-white/10">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Adicionar Novo Produto</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Upload de Imagem */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Foto do Produto *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Preview da Imagem */}
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square bg-gray-100 dark:bg-[#0A192F] rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 flex items-center justify-center cursor-pointer hover:border-[#00D8A9] transition-colors overflow-hidden"
                >
                  {imagePreview ? (
                    <div className="relative w-full h-full">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setImagePreview(null);
                        }}
                        className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="text-center">
                      <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Clique para tirar foto ou fazer upload
                      </p>
                    </div>
                  )}
                </div>

                {/* Seletor de Fundo */}
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Estilo de Fundo
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {backgrounds.map(bg => (
                      <button
                        key={bg.id}
                        type="button"
                        onClick={() => setFormData({ ...formData, background_style: bg.id })}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          formData.background_style === bg.id
                            ? 'border-[#00D8A9] bg-[#00D8A9]/10'
                            : 'border-gray-200 dark:border-white/10 hover:border-[#00D8A9]/50'
                        }`}
                      >
                        <div className={`w-full h-16 rounded-lg mb-2 ${bg.preview}`} />
                        <p className="text-xs font-medium text-gray-900 dark:text-white">{bg.name}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>

            {/* Upload de Nota Fiscal */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Nota Fiscal (Opcional)
              </label>
              <div
                onClick={() => invoiceInputRef.current?.click()}
                className="p-6 bg-gray-50 dark:bg-[#0A192F] rounded-xl border-2 border-dashed border-gray-300 dark:border-white/20 cursor-pointer hover:border-[#00D8A9] transition-colors"
              >
                {invoicePreview ? (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Upload className="w-8 h-8 text-[#00D8A9]" />
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">Nota fiscal anexada</p>
                        <p className="text-xs text-gray-600 dark:text-gray-400">Clique para alterar</p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInvoicePreview(null);
                      }}
                      className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </div>
                ) : (
                  <div className="text-center">
                    <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Clique para fazer upload da nota fiscal (PDF ou imagem)
                    </p>
                  </div>
                )}
              </div>
              <input
                ref={invoiceInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleInvoiceUpload}
                className="hidden"
              />
            </div>

            {/* Informações Básicas */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Nome do Produto *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="Ex: Camiseta Básica Branca"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Descrição
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors resize-none"
                  placeholder="Descreva o produto..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preço *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="0.00"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Preço Promocional
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.promotional_price}
                  onChange={(e) => setFormData({ ...formData, promotional_price: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Quantidade em Estoque *
                </label>
                <input
                  type="number"
                  value={formData.stock_quantity}
                  onChange={(e) => setFormData({ ...formData, stock_quantity: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="0"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Localização (Prateleira)
                </label>
                <input
                  type="text"
                  value={formData.shelf_location}
                  onChange={(e) => setFormData({ ...formData, shelf_location: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="Ex: A1, B3, C2"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Categoria
                </label>
                <input
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                  placeholder="Ex: Camisetas, Calças"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Código de Barras
                </label>
                <div className="relative">
                  <Barcode className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    value={formData.barcode}
                    onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-[#0A192F] border border-gray-200 dark:border-white/10 rounded-lg text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:border-[#00D8A9] transition-colors"
                    placeholder="Opcional"
                  />
                </div>
              </div>
            </div>

            {/* Botões de Ação */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-white/10">
              <button
                type="button"
                onClick={() => router.back()}
                className="flex-1 px-6 py-3 bg-gray-100 dark:bg-[#0A192F] text-gray-700 dark:text-gray-300 rounded-lg font-semibold hover:bg-gray-200 dark:hover:bg-[#0A192F]/80 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-6 py-3 bg-[#00D8A9] text-[#0A192F] rounded-lg font-semibold hover:bg-[#00F5C3] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Salvando...
                  </>
                ) : (
                  <>
                    <Save className="w-5 h-5" />
                    Salvar Produto
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
